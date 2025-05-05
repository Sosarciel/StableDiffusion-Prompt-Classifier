import { memoize, UtilFT } from "@zwa73/utils";
import { PROMPTSET_PATH as PROMPTSET_PATH } from "./Utils";



type Promptset = Record<string,string[]>;

export async function addPromptset(promptMap:Record<string,string[]>){
    const dataset = await memoize(UtilFT.loadJSONFile)(PROMPTSET_PATH) as Promptset;

    Object.entries(promptMap).forEach(([category,data])=>{
        dataset[category] = dataset[category] ?? [];
        if(category!='any')
            dataset[category] = Array.from(new Set([...dataset[category],...data]));
    });

    dataset.any = dataset.any ?? [];
    dataset.any = Array.from(new Set([...dataset.any,...Object.values(promptMap).flat()]));

    await UtilFT.writeJSONFile(PROMPTSET_PATH,dataset,{compress:true});
}