import { formatPatterns } from "../Utils";


/** 人数 */
const set = [
    "solo",
    "multiple girls",
    /\dgirls/,
    /\dboys/,
    /\dgirl/,
    /\dboy/,
    "people", "multiple boys", "6+boys"
]

export const patterns = formatPatterns(set);
