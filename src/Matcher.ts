import { pipe, SLogger, throwError } from '@zwa73/utils';
import { getPatternCategoryMap, PatternObject } from './PatternObject';


/**分类提示词
 * @param prompts 提示词
 * @returns 分类后的提示词
 */
export async function classificationPrompt(...prompts:string[]){
    const pmap = await Promise.all(Object.entries(await getPatternCategoryMap())
        .map(([name,data])=>PatternObject.create(name)));

    return prompts.reduce((table,cur)=>{
        const matchList:PatternObject[] = [];
        Object.entries(pmap).forEach(([idx,pobj])=>{
            if(!pobj.autotest(cur)) return;

            //第一次匹配无条件加入
            if(matchList.length==0){
                matchList.push(pobj);
            }

            //如果新项目对原项呈包含关系 则替换原项
            else if(matchList.length >= 1 && !pobj.include(matchList[0])){
                matchList[0] = pobj;
                //console.log(1,matchList);
            }

            //如果新项目对原项不呈包含关系 则再次加入
            else if(matchList.length >= 1 && !matchList[0].include(pobj)){
                matchList.push(pobj);
                //console.log(2,matchList);
            }

            if(matchList.length>1)
                SLogger.info(`匹配到多类别的提示词 prompt:${cur} category:`, matchList.map(m=>m.name));
        })
        if(matchList.length==0){
            table.missed = table.missed??[];
            table.missed.push(cur);
        }else{
            matchList.map(pobj=>{
                const category = pobj.name;
                table[category] = table[category]??[];
                table[category].push(cur);
            })
        }
        return table;
    },{}as Record<string,string[]>)
}

/**获取测试函数
 * @param category 类别
 * @returns 测试函数
 */
export async function getTestFunc(...category:string[]) {
    //去除类别
    const nmap = await Promise.all(category.map(async s=>{
        const rs = await PatternObject.create(s);
        if(rs==undefined) throwError(`未找到类别:${s}`);
        return rs;
    }));

    //移除已被包含的部分
    const filterincs = nmap.map(v=>v.subcategory()).flat();

    const fullPatterns = nmap.filter(v=>!filterincs.includes(v.name));

    return (s:string)=>fullPatterns.some(r=>r.autotest(s));
}


/**提取选项 */
export type ExtractPromptOpt = {
    /**包含类别 与exclude冲突时排除 默认全部 */
    include?:string[];
    /**排除类别 默认无 */
    exclude?:string[];
    /**保留的类别 与exclude冲突时保留 默认无 */
    reserve?:string[];
    /**最小重复n次才会被提取 */
    minrep?:number;
}


/**提取结果 */
export class ExtractPromptResult {
    /**排除内容 */
    exclude:string[];
    /**保留内容 */
    reserve:string[];
    constructor(data:{
        exclude:string[];
        reserve:string[];
    }){
        this.exclude = data.exclude;
        this.reserve = data.reserve;
    }

    async extractPrompt(opt?:ExtractPromptOpt) {
        const result = await extractPrompt(this.reserve,opt);
        result.exclude.push(...this.exclude);
        return result;
    }
}

/**提示词出现次数表 */
export type PromptCountMap = Record<string,number>;

/**从字符串数组获取提示词次数表 */
export const getPromptCountMap = (input:string[])=>input.reduce((acc,k)=>{
        acc[k.trim()]??=0;
        acc[k.trim()]++;
        return acc;
    },{} as PromptCountMap);

/**提取prompt  
 * 将 不符合保留条件 或 符合排除条件 的分为 exclude  
 * 剩余分为 reserve  
 * 先 reserve 再 exclude 再 must
 * 即保留与排除重叠时, 排除重叠部分  
 * @param input - 提示词输入
 * @param opt   - 选项
 */
export const extractPrompt = async (input:PromptCountMap|string[],opt?:ExtractPromptOpt):Promise<ExtractPromptResult>=>{
    const {exclude,reserve,include,minrep} = opt??{};

    const reserveFunc = reserve!=undefined&&reserve?.length>0 ? await getTestFunc(...reserve) : ()=>false;
    const excludeFunc = exclude!=undefined&&exclude?.length>0 ? await getTestFunc(...exclude) : ()=>false;
    const includeFunc = include!=undefined&&include?.length>0 ? await getTestFunc(...include) : ()=>true;

    const excludeList:string[] = [];
    const reserveList:string[] = [];
    const entrys = Object.entries(Array.isArray(input) ? getPromptCountMap(input): input);
    for(const [k,v] of entrys){
        if(v<(minrep??0)){
            excludeList.push(k);
            continue;
        }

        if((excludeFunc(k) && !reserveFunc(k)) || !includeFunc(k)) {
            excludeList.push(k);
            continue;
        }

        reserveList.push(k);
    };

    return new ExtractPromptResult({
        exclude:Array.from(new Set(excludeList)),
        reserve:Array.from(new Set(reserveList)),
    });
}



//(async ()=>{
//    //const cate = await getPatternsCategory("clothing");
//    //console.log(`clothing category:`,cate);
//
//    //console.log(`categorys:`,await getPatternsCategory());
//    //const pmap = await getPatternObjectMap();
//    //console.log(`pattern object map:`,Object.keys(pmap));
//
//    console.log(await extractPrompt({
//        "1girls":1,
//        "gotou hitori":1,
//    },{exclude:["figure"]}));
//
//})();