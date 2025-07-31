import { PRecord } from "@zwa73/js-utils";
import { memoize, pipe, throwError, UtilFT } from "@zwa73/utils";
import { format, PatternTable } from "PatternUtils";
import path from 'pathe';
import { PATTERNS_PATH } from "./Utils";
import fs from 'fs';

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
    if(pat==null || pat=="pattern") return Object
        .entries(categoryMap)
        .map(([k,v])=>({name:k,path:v}))
        .filter(v=>v.name!="pattern");

    return Object.entries(categoryMap)
        .filter(([k,v])=>{
            const rel = path.relative(PATTERNS_PATH,v.path);
            return rel.includes(path.join(pat,path.sep)) &&
                !rel.includes(path.join(pat,'index.js'));
        })
        .map(([k,v])=>({name:k,path:v}));
});

/**加载完成的pattern对象 */
export class PatternObject {
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
