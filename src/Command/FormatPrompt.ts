import { Command } from 'commander';
import fs from 'fs';


import { extractPrompt } from '../Matcher';
import { match, pipe } from '@zwa73/utils';


const regexMatch = async (pattern: string, list: string[]) => {
    const regex = new RegExp(pattern.slice(2));
    return list.filter(v => regex.test(v));
};

const categoryMatch = async (pattern: string, list: string[]) => {
    const category = pattern.slice(2);
    return (await extractPrompt(list, { include: [category] })).reserve;
};

const stringMatch = async (pattern: string, list: string[]) => {
    return list.filter(v => v.includes(pattern));
};

/**核心格式化工具
 * @param inputRawText 原始的正向提示词文本 (string)
 * @param formatText 原始的规则文件文本 (string)
 */
export const executePromptFormatting = async (inputRawText: string, formatText: string) => {
    // 将原始文本在内部统一清洗并转换为数组
    const inputArr = inputRawText.split(',')
        .map(v => v.trim()).filter(Boolean);

    const other = new Set(inputArr);
    const matchedLines: string[][] = [];

    // 解析规则文本
    const formatLines = formatText
        .replace(/\r\n/g, '\n')
        .split(/\n/)
        .map(line => line.trim())
        .filter(Boolean);

    // 执行匹配循环
    for (const line of formatLines) {
        const outarr = Array.from(other);
        const matched = await pipe(line,
            //分割并去除空格
            line => line.split(','),
            tokens => tokens.map(t => t.trim()),

            // 处理每一行
            tokens => Promise.all(tokens.map(token => match(token.slice(0, 2), {
                'r:': () => regexMatch(token, outarr),
                'c:': () => categoryMatch(token, outarr),
            }, () => stringMatch(token, outarr)))),

            //展开并去重
            li => li.flat(),
            li => Array.from(new Set(li)),
        );

        if (matched.length > 0)
            matchedLines.push(matched);
        matched.forEach(v => other.delete(v));
    }

    return {
        matchedLines,                // 匹配到的分组：string[][]
        remainder: Array.from(other) // 剩余未匹配：string[]
    };
};

export const CmdFormatPrompt = (program: Command) => program
    .command("Format-Prompt")
    .alias("formatprompt")
    .description("匹配并排除style")
    .argument("<format>", `
格式文件, 以行分割, 每行可以有多个匹配符
r:string 为正则
c:string 为类别
其他为精准匹配
未被匹配的将会输出在末尾
`.trim())
    .argument("<input>", "输入prompt", str => str.replace(/[\r\n]/g, '').replace(/_/g, ' ').replace(/\\(\(|\))/g, '$1'))
    .action(async (format: string, input: string) => {
        const formatText = await fs.promises.readFile(format, 'utf-8');

        // 调用工具函数
        const { matchedLines, remainder } = await executePromptFormatting(input, formatText);

        for (const matched of matchedLines) {
            console.log(`${matched.join(', ')},`.trim());
        }
        console.log(remainder.join(', ').trim());
    });