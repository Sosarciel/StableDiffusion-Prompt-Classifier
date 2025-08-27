

/**任何pattern可用的成员 */
export type PatternToken = string|RegExp|PatternTable;

/**格式化的pattern文件 */
export type PatternTable = {
    regex?: RegExp[];
    text ?: string[];
    table?: PatternTable[];
}

const escapeRegExp = (str: string) => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**格式化匹配符 */
export function format(patterns:PatternToken[]):PatternTable {
    const out:PatternTable = {
        regex: [],
        text : [],
        table: []
    };

    const acc = (pattern:PatternToken)=>{
        if (typeof pattern === 'string')
            out.text?.push(pattern);
        else if (pattern instanceof RegExp)
            out.regex?.push(pattern);
        else {
            // 递归处理子 table
            if (pattern.text)
                out.text!.push(...pattern.text);
            if (pattern.regex)
                out.regex!.push(...pattern.regex);
            if (pattern.table)
                pattern.table.forEach(sub => acc(sub));
        }
    }

    patterns.forEach(acc);
    return out;
}

/**描述匹配符  
 * /^.+ item$/,"item"
 */
export function desc(str:string):PatternTable{
    return {
        text :[str],
        regex:[new RegExp(`^.+ ${escapeRegExp(str)}$`)]
    }
}
/**描述匹配符 单数/复数  
 * /^.+ items?$/,"item","items"
 */
export function descPlural(str:string):PatternTable{
    return {
        text :[str,`${str}s`],
        regex:[new RegExp(`^.+ ${escapeRegExp(str)}s?$`)]
    }
}

const color = [
    "orange","blonde","pink","purple","blue","red","grey","black","white","green", "brown","yellow","aqua",
    "light blue","light purple",
    "multicolored","gradient","light brown",
    "dark blue"
] as const;
/**颜色描述  
 * /^(color) item$/
 */
export function colorDesc(str:string):PatternTable{
    return {
        text :[...color.map(c => `${c} ${str}`)],
    }
}

const length = [
    "short","long","very long","medium","absurdly long",
] as const;
/**长度描述  
 * /^(length) item$/,"item"
 */
export function lengthDesc(str:string):PatternTable{
    return {
        text :[...length.map(c => `${c} ${str}`)],
    }
}


const size = [
    "small","medium","large","huge",
] as const;
/**大小描述  
 * /^(size) item$/
 */
export function sizeDesc(str:string):PatternTable{
    return {
        text :[...size.map(c => `${c} ${str}`)],
    }
}