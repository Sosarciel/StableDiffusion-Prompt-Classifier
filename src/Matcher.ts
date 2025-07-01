import fs from 'fs';
import { PATTERNS_PATH } from './Utils';
import path from 'pathe';
import { memoize, SLogger, throwError, UtilFunc } from '@zwa73/utils';
import { PatternTable } from './PatternUtils';


/**获取所有类别 */
export const getPatternsCategory = memoize(async ()=>{
    const fileNames = await fs.promises.readdir(PATTERNS_PATH);
    return fileNames.filter(name=>path.parse(name).ext=='.js').map(name=>path.parse(name).name);
});

export type PatternObject = {
    name:string,
    patterns:PatternTable,
    includes:string[],
};


/**获取类别对应的正则表达式
 * @param category 类别
 * @returns 正则表达式
 */
export const getPatternMap = memoize(async ()=>{
    const fileNames = await fs.promises.readdir(PATTERNS_PATH);
    const filePaths = fileNames.filter(name=>path.parse(name).ext=='.js').map(name=>path.join(PATTERNS_PATH,name));
    return filePaths.map((filePath)=>{
        const name = path.parse(filePath).name;
        const data = require(filePath);
        const patterns = data.patterns as PatternObject['patterns'];
        const includes = data.includes as string[];
        return {name,patterns,includes};
    }).reduce((acc,cur)=>{
        return {...acc, [cur.name]:cur };
    },{} as Record<string,PatternObject>);
});



/**测试target是否符合patterm */
function autotest(pattern:PatternTable,target:string){
    if(pattern.text.includes(target)) return true;
    if(pattern.regex.some(re=>re.test(target))) return true;
    return false;
}

/**分类提示词
 * @param prompts 提示词
 * @returns 分类后的提示词
 */
export async function classificationPrompt(...prompts:string[]){
    const pmap = await getPatternMap();
    return prompts.reduce((acc,cur)=>{
        const hasMatch:PatternObject[] = [];
        Object.entries(pmap).forEach(([k,v])=>{
            if(autotest(v.patterns,cur)){
                acc[k] = acc[k]??[];
                acc[k].push(cur);

                if(hasMatch.length==0)
                    hasMatch.push(v);
                //如果是包含关系
                else if(hasMatch.length >= 1 && v.includes!=null && !v.includes.includes(hasMatch[0].name))
                    hasMatch[0] = v;
                //如果不是被包含关系
                else if(hasMatch.length >= 1 && hasMatch[0].includes!=null && !hasMatch[0].includes.includes(v.name))
                    hasMatch.push(v);
                if(hasMatch.length>1){
                    if(v.includes!=null)
                    SLogger.info(`匹配到多类别的提示词 prompt:${cur} category:`, hasMatch);
                }
            }
        })
        if(hasMatch.length==0){
            acc.missed = acc.missed??[];
            acc.missed.push(cur);
        }
        return acc;
    },{}as Record<string,string[]>)
}

/**获取测试函数
 * @param category 类别
 * @returns 测试函数
 */
export async function getTestFunc(...category:string[]) {
    const pmap = await getPatternMap();
    //去除类别
    const nmap = category.map(s=>{
        const rs = pmap[s];
        if(rs==undefined) throwError(`未找到类别:${s}`);
        return rs;
    });
    //移除已被包含的部分
    const filterincs = nmap.map(v=>{
        if(v.includes==null) return [];
        return v.includes;
    }).flat();
    const fullPatterns = nmap
        .filter(v=>!filterincs.includes(v.name))
        .map(v=>v.patterns).flat();
    return (s:string)=>fullPatterns.some(r=>autotest(r,s));
}


/**提取选项 */
export type ExtractPromptOpt = {
    /**排除类别 */
    exclude?:string[];
    /**保留类别 */
    reserve?:string[];
    /**最小重复n次才会被提取 */
    minrep?:number;
}

/**提取结果 */
export type ExtractPromptResult = {
    /**排除内容 */
    exclude:string[];
    /**保留内容 */
    reserve:string[];
}

/**提示词出现次数表 */
export type PromptCountMap = Record<string,number>;

/**从字符串数组获取提示词次数表 */
export const getPromptCountMap = (input:string[])=>input.reduce((acc,k)=>{
        acc[k.trim()]=1;
        return acc;
    },{} as PromptCountMap);

/**提取prompt  
 * 将 不符合保留条件 或 符合排除条件 的分为 exclude  
 * 剩余分为 reserve  
 * 即保留与排除重叠时, 排除重叠部分  
 * @param input - 提示词输入
 * @param opt   - 选项
 */
export const extractPrompt = async (input:PromptCountMap,opt?:ExtractPromptOpt):Promise<ExtractPromptResult>=>{
    const {exclude,reserve,minrep} = opt??{};
    const excludeFunc = exclude!=undefined&&exclude?.length>0 ? await getTestFunc(...exclude) : ()=>false;
    const reserveFunc = reserve!=undefined&&reserve?.length>0 ? await getTestFunc(...reserve) : ()=>true;

    const excludeList:string[] = [];
    const reserveList:string[] = [];
    Object.entries(input).forEach(([k,v])=>{
        if(v<(minrep??0)) return excludeList.push(k);
        if(excludeFunc(k) || !reserveFunc(k)) return excludeList.push(k);
        reserveList.push(k);
    });

    return {
        exclude:Array.from(new Set(excludeList)),
        reserve:Array.from(new Set(reserveList)),
    };
}
