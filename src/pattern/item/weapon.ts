import { format } from "PatternUtils";


/** 冷兵器和热兵器 */
export const patterns = [
    //冷兵器
    "weapon",
    "sword",
    "spear","polearm",
    "wand", "staff", "cane","scepter",
    "katana", "sheath", "sheathed",
    "flaming weapon", "flaming sword",

    //热兵器
    "gun", "handgun",
    "rifle", /^.+ rifle$/,
    "scope",
    "trigger discipline", "bolt action",
    "suppressor",
]