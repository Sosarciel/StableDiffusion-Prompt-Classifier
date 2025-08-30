import { Command } from 'commander';
import { extractPrompt } from '../Matcher';
import { match, pipe } from '@zwa73/utils';
import fs from 'fs';


const regexMatch = async (pattern:string,list:string[])=>{
    const regex = new RegExp(pattern.slice(2));
    return list.filter(v=>regex.test(v));
}

const categoryMatch = async (pattern:string,list:string[])=>{
    const category = pattern.slice(2);
    return (await extractPrompt(list,{include:[category]})).reserve;
}

const stringMatch = async (pattern:string,list:string[])=>{
    return list.filter(v=>v.includes(pattern));
}

export const CmdFormatPrompt = (program: Command) => program
    .command("Format-Prompt")
    .alias("formatprompt")
    .description("匹配并排除style")
    .argument("<format>",`
格式文件, 以行分割, 每行可以有多个匹配符
r:string 为正则
c:string 为类别
其他为精准匹配
未被匹配的将会输出在末尾
`.trim())
    .argument("<input>", "输入prompt",str=>str.replace(/[\r\n]/g,'').replace(/_/g,' ').replace(/\\(\(|\))/g,'$1').split(',').map(v=>v.trim()))
.action(async (format: string, input: string[]) => {
    const other = new Set([...input]);
    const formatText = await fs.promises.readFile(format,'utf-8');
    // 按行分割格式，每行是一个匹配组
    const lines = formatText
        .replace(/\r\n/g,'\n')
        .split(/\n/)
        .map(line => line.trim())
        .filter(Boolean);
    for (const line of lines) {
        const matched = await pipe(line,
            line=>line.split(','),
            tokens=>tokens.map(t=>t.trim()),
            tokens=>Promise.all(tokens.map(token=>match(token.slice(0,2),{
                'r:':()=>regexMatch(token,input),
                'c:':()=>categoryMatch(token,input),
            },()=>stringMatch(token,input)))),
            li=>li.flat(),
            li=>new Set(li),
        );
        console.log(`${Array.from(matched).join(', ')},`.trim());
        matched.forEach(v => other.delete(v));
    }

    // 输出剩余未匹配项
    console.log(Array.from(other).join(', ').trim());
});

