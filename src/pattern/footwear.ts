
import { formatPatterns } from "../Utils";



/** 任何对脚部或鞋的描写 */
const set = [
    /^[^ ]+ footwear$/,
    /^.*boots$/,
    /.*socks/,
    "shoes removed",
    "shoes",
    "no shoes",
    "high heels",
    "slippers",
    "barefoot",
    "sneakers",
    "mary janes",
    "knee boots",
    "loafers",
    "sandals",
    "thigh boots",
    "high heel boots",
    "tabi",
    "single shoe","paw shoes",
    "strappy heels",
    "shoe soles", "zouri", "geta"
]

export const patterns = formatPatterns(set);

