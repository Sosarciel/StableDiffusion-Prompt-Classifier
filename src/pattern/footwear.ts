
import { desc, descPlural, format } from "../PatternUtils";



/** 任何对脚部或鞋的描写 */
const set = [
    desc("footwear"),
    desc("boots"),
    descPlural("sock"),
    desc("shoes"), "shoes removed",
    desc("heels"),

    "barefoot",
    "slippers",
    "sneakers",
    "mary janes",
    "loafers",
    "sandals",
    "tabi",
    "single shoe",
    "shoe soles", "zouri", "geta","toeless legwear"
]

export const patterns = format(set);

