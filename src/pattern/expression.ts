import { formatPatterns } from "../Utils";

/** 姿势 或 某个身体部位的特写 */
const set = [
    "closed mouth",
    "open mouth",
    "smile",
    "parted lips",
    "crying",
    "crying with eyes open",
    "tears",
    "blush",
    ";d",":d",":3",":<",":o","^ ^",
    "closed eyes",
    "one eye closed",
    "tongue out",
    "tongue",
    "expressionless",
    "half-closed eyes", "naughty face", "smug", "heavy breathing", "heart-shaped pupils",
    "lips", "teeth","fang out",
    "frown",
    "breath", "ahegao",
    ":/", "narrowed eyes", "nose blush",
    "grin", "smirk", "evil smile", "evil grin",
    "trembling", "one eye covered", "+ +"
]
export const patterns = formatPatterns(set);
