import { colorDesc, desc, format } from "PatternUtils";


/** 背景 地点 时间 等非主体角色因素 */
export const patterns = [
    //固定物体
    "railing",
    "window",
    "campfire",
    "fireplace",
    "curtains",
    "stairs",
    "fence",
    "chalkboard",
    "wooden floor", "ceiling",
    "tombstone", "grave",
    "beach umbrella", "torii",
    "door","shouji",
    "pillar",
    "bathtub", "bath",
    "bar (place)",
    "column", "cage",

    //不定描述
    "outdoors",
    "indoors",
    desc("background"),

    //生物集群
    "crow",

    //室内环境
    "candlelight",
    "ceiling light", "tiles", "stage", "stage lights",
    "bedroom","bathroom", "shower (place)", "tile wall", "glass",

    //设计效果背景
    "cover page", "doujin cover","tachi-e",
    "sketch", "depth of field", "comic",
    "fake screenshot",
    "blurry foreground",
    "picture frame", "painting (object)",
    colorDesc("theme"),"dark",

    //特殊地点
    "ruins",
    "volcano",
    "ocean",
    "graveyard",
    "castle",

    //特殊环境/特效背景
    "explosion",
    "burning",
    "embers",
    "molten rock",
    "destruction",
    "military",
    "flame","fire",
    "fireworks",
    "air bubble",
    "bubble",
    "afloat",
    "confetti",
    "darkness",
    "smoke",
    "fog",
    "lightning",
    "contrail",
    "overflow", "soap bubbles",
]