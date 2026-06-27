import { Command } from 'commander';
import fs from 'fs';
import { executePromptFormatting } from './FormatPrompt';

type StyleCsvRow = { name: string, prompt: string, negative_prompt: string };
function exTrim(str:string, charsToRemove:string) {
    // 构造正则表达式，匹配头尾的空白字符和指定符号
    const regex = new RegExp(`^[${charsToRemove}\\s]+|[${charsToRemove}\\s]+$`, 'g');
    return str.replace(regex, '');
}
const parseStylesTxt = (txt:string)=>{
    const regex = /(.+):\n([\s\S]+?)(\n\n|$)/g;
    const negRegex = /^([\s\S]+?)(?:(?:\nneg:([\s\S]+))|$)/
    const matchList = txt.replace(/\r\n/g,'\n').matchAll(regex);
    const resultList:StyleCsvRow[]=[];
    for (const match of matchList) {
        const negMatch = match[2].match(negRegex)!;
        resultList.push({
            name:match[1],
            prompt:exTrim(negMatch[1],','),
            negative_prompt:exTrim((negMatch[2]??''),',')
        });
    }
    if (resultList.length === 0) throw `无法解析${txt}`;
    return resultList;
}

export const CmdFormatStyleFile = (program: Command) => program
    .command("Format-Style-File")
    .alias("formatstylefile")
    .description("直接提供 style 文件路径，读取并格式化其中的正向提示词后写回")
    .argument("<format>", "格式规则文件路径")
    .argument("<file>", "需要格式化的 style 文本文件路径")
    .action(async (format: string, file: string) => {
        // 1. 读取规则文件
        const formatText = await fs.promises.readFile(format, 'utf-8');

        // 2. 读取并解析目标的 style 文本文件
        const styleTxt = await fs.promises.readFile(file, 'utf-8');
        const styleList = parseStylesTxt(styleTxt);

        const updatedStyleBlocks: string[] = [];

        // 3. 遍历处理每一个 style 块
        for (const style of styleList) {
            // 对当前 style 块的正向 prompt 进行预清洗，转为数组
            const input = style.prompt
                .replace(/[\r\n]/g, '')
                .replace(/_/g, ' ')
                .replace(/\\(\(|\))/g, '$1');

            // 调用核心复用工具
            const { matchedLines, remainder } = await executePromptFormatting(input, formatText);

            // 将匹配到的行以及剩余项平铺，重新组合回单行正向 prompt 字符串
            const allParts = [
                ...matchedLines.map(line => line.join(', ')),
                remainder.join(', ')
            ].filter(Boolean);

            const newPromptStr = allParts
                .map((line, index) => index === allParts.length - 1 ? line : `${line},`)
                .join('\n')
                .replace(/(\(|\))/g, '\\$1');

            // 4. 重新组装当前 style 文本块 (保持 neg 部分完全不动)
            let styleBlock = `${style.name}:\n${newPromptStr}\n`;
            if (style.negative_prompt)
                styleBlock += `neg:\n${style.negative_prompt}\n`;
            updatedStyleBlocks.push(styleBlock);
        }

        // 5. 写回原文件
        const finalTxt = updatedStyleBlocks.join('\n');
        //console.log(finalTxt)
        await fs.promises.writeFile(file, `${finalTxt.trim()}\n`, 'utf-8');

        console.log(`>> 成功格式化并写回文件: ${file}`);
    });