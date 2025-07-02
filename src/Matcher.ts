import fs from 'fs';
import { PATTERNS_PATH } from './Utils';
import path from 'pathe';
import { memoize, pipe, SLogger, throwError, UtilFT } from '@zwa73/utils';
import { format, PatternTable, PatternToken } from './PatternUtils';



let categoryMap:Record<string,string> = null as any;
/**获取类别路径映射表 */
export const getPatternsCategoryMap = async ()=>{
    if(categoryMap!=null) return categoryMap;
    categoryMap = await pipe(
        UtilFT.fileSearchGlob(PATTERNS_PATH,'**/*.js'),
        fileNames => Promise.all(fileNames.map(async filepath=>{
            const parsed = path.parse(filepath);
            if(parsed.name=='index') return [path.parse(parsed.dir).name, filepath] as const;
            return [parsed.name,filepath] as const;
        })),
        entrys=>entrys.reduce((acc,cur)=>{
            const [name,filepath] = cur;
            acc[name] = filepath;
            return acc;
        },{} as Record<string,string>)
    );
    return categoryMap;
};

/**获取所有子类别 */
export const getPatternsCategory = memoize(async (pat?:string)=>{
    const categoryMap = await getPatternsCategoryMap();
    if(pat==null) return Object
        .entries(categoryMap)
        .map(([k,v])=>({name:k,path:v}));

    return Object.entries(categoryMap)
        .filter(([k,v])=>{
            const rel = path.relative(PATTERNS_PATH,v);
            return rel.includes(path.join(pat,path.sep)) &&
                !rel.includes(path.join(pat,'index.js'));
        })
        .map(([k,v])=>({name:k,path:v}));
});


let patternObjectMap:Record<string,PatternObject> = null as any;
/**获取类别对应的匹配符对象
 * @param category 类别
 * @returns 类别: 匹配符对象
 */
export const getPatternObjectMap = async ()=>{
    if(patternObjectMap!=null) return patternObjectMap;
    patternObjectMap = await pipe(
        getPatternsCategory(),
        categories=> Promise.all(categories.map(async category=>PatternObject.create(category.name))),
        patternObj=> patternObj.reduce((acc,cur)=>{
            acc[cur.name] = cur;
            return acc;
        },{} as Record<string,PatternObject>)
    );
    return patternObjectMap;
};


class PatternObject {
    private patterns:PatternTable={};
    private _subcategory:string[]=[];
    inited = false;

    private constructor(public name:string, public filePath:string){}
    static async create(category:string){
        const map = await getPatternsCategoryMap();
        const instance = new PatternObject(category,map[category]);
        return instance;
    }
    async init(){
        if(this.inited) return;
        const data = require(this.filePath);
        const tokens = [...data.patterns] as PatternToken[];

        const cateMap = await getPatternsCategoryMap();
        this._subcategory = (await getPatternsCategory(this.name)).map(v=>v.name);

        for(const subcate of this._subcategory){
            const subdata = require(cateMap[subcate]);
            tokens.push(...subdata.patterns);
        }

        //console.log(tokens)
        this.patterns = format(tokens);

        this.inited = true;
    }

    /**包含某个类别 */
    include(target:PatternObject|string){
        if(typeof target=='string')
            return this._subcategory.includes(target);

        return this._subcategory.includes(target.name);
    }

    async subcategory(){
        await this.init();
        return this._subcategory;
    }

    /**测试target是否符合patterm */
    async autotest(target:string){
        await this.init();
        if(this.patterns.text?.includes(target)) return true;
        if(this.patterns.regex?.some(re=>re.test(target))) return true;
        return false;
    }
}



/**分类提示词
 * @param prompts 提示词
 * @returns 分类后的提示词
 */
export async function classificationPrompt(...prompts:string[]){
    const pmap = await getPatternObjectMap();
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
            else if(matchList.length >= 1 && !pobj.include(matchList[0]))
                matchList[0] = pobj;

            //如果新项目对原项不呈包含关系 则再次加入
            else if(matchList.length >= 1 && !matchList[0].include(pobj))
                matchList.push(pobj);

            if(matchList.length>1)
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
    const pmap = await getPatternObjectMap();

    //去除类别
    const nmap = category.map(s=>{
        const rs = pmap[s];
        if(rs==undefined) throwError(`未找到类别:${s}`);
        return rs;
    });

    //移除已被包含的部分
    const filterincs = await pipe(nmap,
        nmap=>Promise.all(nmap.map(async v=>{
            if(v.subcategory()==null) return [];
            return v.subcategory();
        })),
        nmap=>nmap.flat(),
    )

    const fullPatterns = nmap.filter(v=>!filterincs.includes(v.name));

    const fn = async (s: string): Promise<boolean> => {
        for (const r of fullPatterns) {
            if (await r.autotest(s)) {
                return true;
            }
        }
        return false;
    };
    return fn;
}


/**提取选项 */
export type ExtractPromptOpt = {
    /**排除类别 默认无 */
    exclude?:string[];
    /**保留类别 与exclude冲突时排除 默认全部 */
    reserve?:string[];
    /**优先保留的类别 与exclude冲突时保留 默认无 */
    must?:string[];
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
 * 先 reserve 再 exclude 再 must
 * 即保留与排除重叠时, 排除重叠部分  
 * @param input - 提示词输入
 * @param opt   - 选项
 */
export const extractPrompt = async (input:PromptCountMap,opt?:ExtractPromptOpt):Promise<ExtractPromptResult>=>{
    const {exclude,reserve,must,minrep} = opt??{};

    const mustFunc = must!=undefined&&must?.length>0 ? await getTestFunc(...must) : ()=>false;
    const excludeFunc = exclude!=undefined&&exclude?.length>0 ? await getTestFunc(...exclude) : ()=>false;
    const reserveFunc = reserve!=undefined&&reserve?.length>0 ? await getTestFunc(...reserve) : ()=>true;

    const excludeList:string[] = [];
    const reserveList:string[] = [];
    const entrys = Object.entries(input)
    for(const [k,v] of entrys){
        if(v<(minrep??0)){
            excludeList.push(k);
            continue;
        }
        if((await excludeFunc(k) && !await mustFunc(k)) || !await reserveFunc(k)) {
            excludeList.push(k);
            continue;
        }
        reserveList.push(k);
    };

    return {
        exclude:Array.from(new Set(excludeList)),
        reserve:Array.from(new Set(reserveList)),
    };
}



//(async ()=>{
//    const cate = await getPatternsCategory("clothing");
//    console.log(`clothing category:`,cate);
//
//    console.log(`categorys:`,await getPatternsCategory());
//    const pmap = await getPatternObjectMap();
//    console.log(`pattern object map:`,Object.keys(pmap));
//
//    console.log(await extractPrompt({"1girls":1},{exclude:["clothing"]}));
//
//})();