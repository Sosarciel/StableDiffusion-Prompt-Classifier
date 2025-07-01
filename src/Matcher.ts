import fs from 'fs';
import { PATTERNS_PATH } from './Utils';
import path from 'pathe';
import { memoize, SLogger, throwError } from '@zwa73/utils';
import { PatternTable } from './PatternUtils';


/**获取所有类别 */
export const getPatternsCategory = memoize(async ()=>{
    const fileNames = await fs.promises.readdir(PATTERNS_PATH);
    return fileNames.filter(name=>path.parse(name).ext=='.js').map(name=>path.parse(name).name);
});


class PatternObject {
    name    :string;
    patterns:PatternTable={};
    includes:string[]=[];
    inited = false;

    constructor(public filePath:string){
        this.name = path.parse(filePath).name;
    }
    init(){
        if(this.inited) return;
        const data = require(this.filePath);
        this.patterns = data.patterns as PatternTable;
        this.includes = data.includes as string[];
        this.inited = true;
    }
    /**测试target是否符合patterm */
    autotest(target:string){
        this.init();
        if(this.patterns.text?.includes(target)) return true;
        if(this.patterns.regex?.some(re=>re.test(target))) return true;
        return false;
    }
}

/**获取类别对应的正则表达式
 * @param category 类别
 * @returns 正则表达式
 */
export const getPatternMap = memoize(async ()=>{
    const fileNames = await fs.promises.readdir(PATTERNS_PATH);
    const filePaths = fileNames.filter(name=>path.parse(name).ext=='.js').map(name=>path.join(PATTERNS_PATH,name));
    return filePaths
        .map( filePath => new PatternObject(filePath))
        .reduce((acc,cur)=>{
            return {...acc, [cur.name]:cur };
        },{} as Record<string,PatternObject>);
});



/**分类提示词
 * @param prompts 提示词
 * @returns 分类后的提示词
 */
export async function classificationPrompt(...prompts:string[]){
    const pmap = await getPatternMap();
    return prompts.reduce((table,cur)=>{
        const matchList:PatternObject[] = [];
        Object.entries(pmap).forEach(([category,pobj])=>{
            if(!pobj.autotest(cur)) return;
            table[category] = table[category]??[];
            table[category].push(cur);

            //第一次匹配无条件加入
            if(matchList.length==0)
                matchList.push(pobj);

            //如果新项目对原项呈包含关系 则替换原项
            else if(matchList.length >= 1 && pobj.includes!=null && !pobj.includes.includes(matchList[0].name))
                matchList[0] = pobj;

            //如果新项目对原项不呈包含关系 则再次加入
            else if(matchList.length >= 1 && matchList[0].includes!=null && !matchList[0].includes.includes(pobj.name))
                matchList.push(pobj);

            if(matchList.length>1 && pobj.includes!=null)
                SLogger.info(`匹配到多类别的提示词 prompt:${cur} category:`, matchList);
        })
        if(matchList.length==0){
            table.missed = table.missed??[];
            table.missed.push(cur);
        }
        return table;
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
        .filter(v=>!filterincs.includes(v.name));

    return (s:string)=>fullPatterns.some(r=>r.autotest(s));
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
