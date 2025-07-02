


export type PatternToken = string|RegExp|PatternTable;

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

/**描述匹配符 */
export function desc(str:string):PatternTable{
    return {
        text :[str],
        regex:[new RegExp(`^.+ ${escapeRegExp(str)}$`)]
    }
}
/*描述匹配符 单数/复数 * */
export function descPlural(str:string):PatternTable{
    return {
        text :[str,`${str}s`],
        regex:[new RegExp(`^.+ ${escapeRegExp(str)}s?$`)]
    }
}