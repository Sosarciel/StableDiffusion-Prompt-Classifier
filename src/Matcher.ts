import fs from 'fs';
import { PATTERNS_PATH } from './Utils';
import path from 'pathe';
import { ivk, memoize, pipe, PRecord, SLogger, throwError, UtilFT } from '@zwa73/utils';
import { format, PatternTable, PatternToken } from './PatternUtils';


type ChildPatternData = {
    name:string;
    path:string;
}

type PatternData = ChildPatternData&{
    /**单层子类别 */
    child?:ChildPatternData[];
}

let categoryMap:Record<string,PatternData> = null as any;
/**获取类别路径映射表 */
export const getPatternCategoryMap = async ()=>{
    if(categoryMap!=null) return categoryMap;
    categoryMap = await pipe(
        UtilFT.fileSearchGlob(PATTERNS_PATH,'**/*.js'),
        fileNames => Promise.all(fileNames.map(async filepath=>{
            const parsed = path.parse(filepath);
            if(parsed.name=='index'){
                const child = await pipe(
                    fs.promises.readdir(parsed.dir,{withFileTypes:true}),
                    files => files.map(f=>{
                        const name = path.parse(f.name).name;
                        if(f.isDirectory()){
                            //console.log(name)
                            return {
                                name,path: path.join(parsed.dir,f.name,'index.js'),
                            };
                        }
                        else if(f.isFile() && f.name.endsWith('.js') && !f.name.endsWith('index.js')){
                            //console.log(name)
                            return {
                                name,path:path.join(parsed.dir,f.name)
                            };
                        }
                        else return undefined;
                    }),
                    files => files.filter(f=>f!=undefined),
                    files => files as PatternData[]
                );
                return {
                    name:path.parse(parsed.dir).name,
                    path:filepath,
                    child,
                };
            }
            return {name:parsed.name,path:filepath};
        })),
        entrys=>entrys.reduce((acc,cur)=>{
            const {name,path} = cur;
            acc[name] = cur;
            return acc;
        },{} as Record<string,PatternData>)
    );
    return categoryMap;
};

/**获取所有子类别 */
export const getPatternsCategory = memoize(async (pat?:string)=>{
    const categoryMap = await getPatternCategoryMap();
    if(pat==null) return Object
        .entries(categoryMap)
        .map(([k,v])=>({name:k,path:v}));

    return Object.entries(categoryMap)
        .filter(([k,v])=>{
            const rel = path.relative(PATTERNS_PATH,v.path);
            return rel.includes(path.join(pat,path.sep)) &&
                !rel.includes(path.join(pat,'index.js'));
        })
        .map(([k,v])=>({name:k,path:v}));
});


class PatternObject {
    static patternObjectMap:PRecord<string,PatternObject> = {};
    private patterns:PatternTable={};
    private _subcategory:string[]=[];
    private _child:PatternObject[]=[];
    name:string;

    private constructor(public data:PatternData){
        this.name = data.name;
    }

    /**创建pattern对象 */
    static async create(category:string){
        const map = await getPatternCategoryMap();
        if(map[category]==undefined)
            throwError(`未找到类别:${category}`);

        if(PatternObject.patternObjectMap[category]!=undefined)
            return PatternObject.patternObjectMap[category];

        const instance = new PatternObject(map[category]);
        PatternObject.patternObjectMap[category] = instance;

        await PatternObject.init(instance);

        return instance;
    }

    /**初始化对象 */
    private static async init(po:PatternObject){
        const data = require(po.data.path);
        //console.log(data.patterns)
        po.patterns = format([...data.patterns]);
        po._subcategory = (await getPatternsCategory(po.name)).map(v=>v.name);

        for(const child of po.data.child??[])
            po._child.push(await PatternObject.create(child.name));
    };

    /**包含某个类别 */
    include(target:PatternObject|string){
        if(typeof target=='string')
            return this._subcategory.includes(target);

        return this._subcategory.includes(target.name);
    }

    /**获取所有子/孙类别 */
    subcategory(){
        return this._subcategory;
    }

    /**测试target是否符合patterm */
    autotest(target:string){
        if(this.patterns.text?.includes(target)) return true;
        if(this.patterns.regex?.some(re=>re.test(target))) return true;
        if(this._child.some(c=>c.autotest(target))) return true;
        return false;
    }
}



/**分类提示词
 * @param prompts 提示词
 * @returns 分类后的提示词
 */
export async function classificationPrompt(...prompts:string[]){
    const pmap = await Promise.all(Object.entries(await getPatternCategoryMap())
        .map(([name,data])=>PatternObject.create(name)));

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
    //去除类别
    const nmap = await Promise.all(category.map(async s=>{
        const rs = await PatternObject.create(s);
        if(rs==undefined) throwError(`未找到类别:${s}`);
        return rs;
    }));

    //移除已被包含的部分
    const filterincs = await pipe(nmap,
        nmap=>Promise.all(nmap.map(async v=>{
            if(v.subcategory()==null) return [];
            return v.subcategory();
        })),
        nmap=>nmap.flat(),
    )

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
    const {exclude,reserve,include,minrep} = opt??{};

    const reserveFunc = reserve!=undefined&&reserve?.length>0 ? await getTestFunc(...reserve) : ()=>false;
    const excludeFunc = exclude!=undefined&&exclude?.length>0 ? await getTestFunc(...exclude) : ()=>false;
    const includeFunc = include!=undefined&&include?.length>0 ? await getTestFunc(...include) : ()=>true;

    const excludeList:string[] = [];
    const reserveList:string[] = [];
    const entrys = Object.entries(input)
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

    return {
        exclude:Array.from(new Set(excludeList)),
        reserve:Array.from(new Set(reserveList)),
    };
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