
export const parseStrlist = (str:string)=>str
    .split(/( |,)/)
    .map(s=>s.trim())
    .filter(s=>s.length>0)
    .filter(s=>s!=',')