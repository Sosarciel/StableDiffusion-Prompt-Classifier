
import { formatPatterns } from "../Utils";



/** 任何对脚部或鞋的描写 */
const set = [
    "footwear"      , /^[^ ]+ footwear$/,
    "boots"         , /^.+ boots$/,
    "socks"         , /^.+ socks$/,
    "shoes"         , /^.+ shoes$/,
    "heels"         , /^.+ heels$/,

    "shoes removed", "barefoot",
    "slippers",
    "sneakers",
    "mary janes",
    "loafers",
    "sandals",
    "tabi",
    "single shoe",
    "shoe soles", "zouri", "geta","toeless legwear"
]

export const patterns = formatPatterns(set);

