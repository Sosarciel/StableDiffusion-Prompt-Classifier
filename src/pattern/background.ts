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

    //生物背景
    "bird",
    "crow",
    "dragon",

    //植物环境
    "grass",
    "lotus",
    "lily pad",
    "spider lily",
    "flower field","forest","nature",
    "field", "cherry blossoms", "leaf",

    //自然环境
    "sky", colorDesc("sky"),
    "star \(sky\)",
    "gradient sky", "cloudy sky", "night sky",
    "cloud",
    "night", "evening",
    "twilight", "moonlight", "starry sky",
    "full moon", "moon","red moon",
    "day", "sunset", "sun", "dusk", "sunrise", "sunlight",
    "underwater", "water", "swimming", "freediving",
    "light rays",
    "bare tree", "tree",
    "autumn", "summer", "winter", "spring",
    "rain",
    "wind",
    "horizon","skyline",
    "snow",
    "scenery",

    //室内环境
    "candlelight",
    "ceiling light", "tiles", "stage", "stage lights",
    "bedroom",

    //城市背景
    "building", "city",
    "skyscraper", "cityscape",
    "crowd", "contemporary",
    "road",
    "train station",
    "city lights",
    "real world location", "street",
    "classroom", "school",

    //机械背景
    "train", "train interior",
    "ground vehicle",
    "car", "sports car",
    "watercraft", "ship", "boat", 

    //设计效果背景
    "cover page", "doujin cover","tachi-e",
    "sketch", "depth of field", "comic",
    "fake screenshot",
    "blurry foreground",
    "picture frame", "painting (object)",

    //特殊地点
    "ruins",
    "volcano",
    "ocean",
    "graveyard",
    "castle",

    //复合背景
    "halloween",
    "valentine",

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
    "contrail",
    "against glass",
]



