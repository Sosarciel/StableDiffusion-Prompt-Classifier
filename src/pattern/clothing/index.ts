import { desc, descPlural, format } from "PatternUtils";

/** 任何和主体角色有关的服装 */
export const patterns = [
    //头饰
    desc("hairband"), desc("hair ornament"), desc("headwear"),
    "hair intakes", "hair rings", "hair stick", "hairclip",
    "headband",

    //帽子
    desc("hat"), desc("cape"), desc("cap"),
    desc("hood"),
    desc("scrunchie"),

    //面部
    desc("mask"), /^mask .+$/,
    desc("veil"),
    desc("eyewear"),
    desc("earrings"),
    "glasses"   , "sunglasses",
    /^goggles.+ $/,
    "makeup"    ,

    //脖子
    desc("bowtie"),
    desc("collar"),
    desc("neckerchief"),
    desc("necktie"),
    desc("choker"),
    desc("capelet"),
    desc("scarf"),

    //腰部
    desc("belt"),

    //上身服饰
    desc("clothes"),
    desc("kimono"),
    desc("leotard"),
    desc("uniform"),
    desc("hoodie"),
    desc("apron"),
    desc("jacket"), "jacket around waist",
    desc("shirt"),
    desc("shorts"),
    desc("dress"),
    desc("vest"),
    desc("coat"),
    desc("armor"),
    desc("sweater"),
    desc("bodysuit"),
    desc("suit"),
    "labcoat"   ,

    //臀部服饰
    "hip vent",
    desc("skirt"),
    "miniskirt",

    //内衣
    desc("panties"),
    desc("swimsuit"),
    desc("bikini"),
    desc("bra"), "no bra",
    "underwear" , "underwear only",
    "bath towel", "towel",
    "maebari"   ,

    //手部
    desc("gauntlets"),
    descPlural("glove"),
    desc("sleeves"),
    desc("bracelet"),
    desc("cuffs"),

    //腿部
    desc("legwear"),
    desc("pantyhose"),
    descPlural("thighhigh"),
    descPlural("kneehigh"),

    //不定装饰
    desc("rose"),
    desc("ribbon"),
    desc("bell"),
    desc("flower"),
    desc("bow"),
    "bandaid"   , /^bandaid on .+$/,
    /^.+ \(symbol\)$/,
    "jewelry"   ,
    "bandages"  ,
    "tail ornament",

    //穿着风格
    /^.+ cutout$/,
    "strapless",
    "off shoulder", "bare shoulders",
    "nude", "completely nude", "see-through",
    "headwear removed",

    //风格套装
    "playboy bunny",
    "wa maid", "maid",
    "mummy", "jiangshi", "witch",
    /^.+ outfit$/,
    /^.+ costume$/,
    "bandaged leg", "bandaged head", "bandaged arm",
    "riding",


    "plaid", "head wreath", "o-ring",
    "midriff peek", "midriff",
    "jingle bell",
    "floral print",
    "frills", "covered navel",
    "serafuku", "tiara",
    "bare legs", "garter straps",
    "eyepatch", "halterneck", "corset",
    "camisole", "pajamas", "christmas",
    "fur trim", "thigh strap",
    "wristband", "sweatband", "sports bra",
    "hood up", "clothes around waist",
    "crop top", "argyle", "eyewear on head",
    "tassel", "pelvic curtain",
    "bare arms", "sleeveless", "sarong",
    "anklet", "front-tie top", "bangle",
    "headphones", "headphones around neck", "fake animal ears", "hood down",
    "sleeves past wrists", "necklace", "ring", "beret",
    "center frills", "brooch", "striped", "buttons",
    "barcode tattoo", "obi", "sash", "lolita fashion",
    "crown", "shawl", "innertube", "criss-cross halter",
    "animal ear headphones", "cloak", "medical eyepatch", "tutu","ballet slippers",
    "wataboushi", "uchikake",
    "open fly", "watch","ascot",
    "bonnet", "overalls",
    "crop top overhang", "cheerleader", "pom pom (cheerleading)",
    "polka dot", "highleg",
    "race queen", "panty straps", "bikini top only",
    "virtual youtuber",
    "no pants", "thong", "lace trim", "lace", "skirt removed",
    "pasties", "thighlet", "gold trim",
    "qing guanmao", "crotch rope", "naked bandage",
    "sarashi", "chest sarashi",
    "shackles",
    "loincloth", "sling bikini top",
    "breast curtains",
    "piercing", "navel piercing", "nipple piercing", "nipple rings",
    "tongue piercing", "pussy piercing", "ear piercing", "clitoris piercing",
    "fishnets", "leash",
    "crotchless",
    "side-tie bikini bottom", "fake tail",
    "pom pom (clothes)", "buckle",
    "topless","lingerie",
    "ribbon trim", "shrug (clothing)", "breast curtain", "flower knot",
    "bottomless", "feather boa","bodystocking", "bridal garter",
    "casual", "black serafuku", "blue serafuku",
    "monocle",
    "center opening", "armlet",
    "formal", "hakama", "red hakama",
    "blindfold", "weapon on back",
    "sundress", "spaghetti strap", "strap slip"
]