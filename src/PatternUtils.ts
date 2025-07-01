


export type PatternTable = {
    regex: RegExp[],
    text : string[],
    any  : (string|RegExp)[],
}

/**格式化匹配符 */
export function format(patterns:(string|RegExp)[]) {
    const out = {
        regex: [] as RegExp[],
        text: [] as string[],
        any: patterns,
    };
    patterns.forEach(pattern => {
        if (typeof pattern === 'string')
            out.text.push(pattern);
        else
            out.regex.push(pattern);
    });
    return out;
}

/**描述匹配符 */
export function desc(str:string){
    return 
}