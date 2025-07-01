import { format } from "../PatternUtils";


/** 非环境类的可移动的物品或是手持物 */
const set = [
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

    //装饰物
    "feathers",
    "chain", "broken chain",
    "rope", "red rope", "lanyard",
    "beads", "gem",
    "charm (object)",
    "slime (substance)","pointer", "orb",
    "headgear",
    "talisman", "ofuda", "gohei",
    "gold", "cross", "spikes",
    "circlet",
    "coin",  "drawstring",  "zipper pull tab",

    //植物
    "petals", "branch", "bouquet","potted plant",
    "plant",

    //文具
    "book", "pen", "pencil", "stylus",
    "open book", "notebook",
    "scroll", "paper",
    "paintbrush", "calligraphy brush",
    "eraser", "chalk",

    //食物
    "food",
    "fruit", "cherry", "orange slice", "orange (fruit)", "pumpkin", "apple", "banana", "carrot", "grapes",
    "drink", "tropical drink",
    "alcohol", "wine","cocktail",
    "dango",
    "candy", "candy cane",
    "popsicle", "bubble tea",
    "ice cream",
    "chocolate", "heart-shaped chocolate",

    //家具
    "table", "chair",
    "lantern", "paper lantern",
    "pillow", "locker", "clock",
    "candle", "vase", "candlestand",
    "cushion", "jack-o'-lantern",
    "lamp","stool", "drawing tablet",

    //载具相关
    "inflatable raft", "innertube",
    "motor vehicle",

    //生活用品/工具
    "hand fan",
    "paper fan","uchiwa",
    "folding fan","folded fan",
    "umbrella","oil-paper umbrella",
    "smoking pipe", "kiseru",
    "hand mirror","watering can",
    "harp", "instrument",

    //餐具
    "cup", "disposable cup", "teacup",
    "wine glass", "drinking glass",
    "drinking straw",
    "tray","wind chime",
    "fork","knife","spoon",
    "cocktail glass", "bowl", "plate",

    //包/包裹
    "pouch","bag","basket", "handbag",
    "gift box","box","gift",
    "school bag", "shoulder bag", "bag charm",
    "can", "treasure chest",

    //电子设备
    "phone", "cellphone","smartphone","microphone",
    "cable",
    "tablet pc", "computer",
    "handheld game console",  "laptop",

    //玩具
    "teddy bear",
    "stuffed toy",
    "bell", "stuffed animal",
    "card", "playing card",
    "ball", "balloon",
    "sex toy", "riding crop",
    "doll", "character doll", "babydoll",

    //小动物/生物
    "bear", "animal", "crab",
    "tanuki","panda",
    "cat","black cat",
    "robot", "drone",
    "bug", "butterfly",
    "bat (animal)",
    "monster", "creature", "skeleton", "ghost",

    //杂项物品
    "test tube", "vial", "bottle", "signature",

    //其他
    "eyewear removed",

]

export const patterns = format(set);
