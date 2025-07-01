import { format } from "../PatternUtils";
import * as footwear from './footwear';

/** 任何和主体角色有关的服装 */
const clothing = [
    ...footwear.patterns.any,

    //头饰
    "hairband"      , /^.+ hairband$/,
    "hair ornament" , /^.+ hair ornament$/,
    "headwear"      , /^.+ headwear$/,
    "hair intakes", "hair rings", "hair stick", "hairclip",
    "headband",

    //帽子
    "hat"       , /^.+ hat$/,
    "cape"      , /^.+ cape$/,
    "cap"       , /^.+ cap$/,
    "hood"      , /^.+ hood$/,
    "scrunchie" , /^.+ scrunchie$/,

    //面部
    "mask"      , /^mask .+$/, /^.+ mask$/,
    "veil"      , /^.+ veil$/,
    "eyewear"   , /^.+ eyewear$/,
    "earrings"  , /^.+ earrings$/,
    "glasses"   , "sunglasses",
    /^goggles.+ $/,

    //脖子
    "bowtie"    , /^.+ bowtie$/,
    "collar"    , /^.+ collar$/,
    "neckerchief", /^.+ neckerchief$/,
    "necktie"   , /^.+ necktie$/,
    "choker"    , /^.+ choker$/,
    "capelet"   , /^.+ capelet$/,
    "scarf"     , /^.+ red scarf$/,

    //腰部
    "belt"      , /^.+ belt$/,

    //上身服饰
    "clothes"   , /^.+ clothes$/,
    "kimono"    , /^.+ kimono$/,
    "leotard"   , /^.+ leotard$/,
    "uniform"   , /^.+ uniform$/,
    "hoodie"    , /^.+ hoodie$/,
    "apron"     , /^.+ apron$/,
    "jacket"    , /^.+ jacket$/, "jacket around waist",
    "shirt"     , /^.+ shirt$/,
    "shorts"    , /^.+ shorts$/,
    "dress"     , /^.+ dress$/,
    "vest"      , /^.+ vest$/,
    "coat"      , /^.+ coat$/,
    "armor"     , /^.+ armor$/,
    "sweater"   , /^.+ sweater$/,
    "bodysuit"  , /^.+ bodysuit$/,
    "suit"      , /^.+ suit$/,
    "labcoat"   ,

    //臀部服饰
    "hip vent",
    "skirt"     , /^.+ skirt$/,

    //内衣
    "panties"   , /^.+ panties$/,
    "swimsuit"  , /^.+ swimsuit$/,
    "bikini"    , /^.+ bikini$/,
    "bra"       , /^.+ bra$/, "no bra",
    "underwear" , "underwear only",
    "bath towel", "towel",
    "maebari"   ,

    //手部
    "gauntlets" , /^.+ gauntlets$/,
    "gloves"    , /^.+ gloves?$/,
    "sleeves"   , /^.+ sleeves$/,
    "bracelet"  , /^.+ bracelet$/,
    "cuffs"     , /^.+ cuffs$/,

    //腿部
    "legwear"   , /^.+ legwear$/,
    "pantyhose" , /^.+ pantyhose$/,
    "thighhigh" , /^.+ thighhighs?$/,
    "kneehighs" ,

    //不定装饰
    "rose"      , /^.+ rose$/,
    "ribbon"    , /^.+ ribbon$/,
    "bell"      , /^.+ bell$/,
    "flower"    , /^.+ flower$/,
    "bow"       , /^.+ bow$/,
    "bandaid"   , /^bandaid on .+$/,
    /^.+ \(symbol\)$/,
    "jewelry"   ,
    "bandages"  ,

    //穿着风格
    /^.+ cutout$/,
    "strapless",
    "off shoulder", "bare shoulders",
    "nude", "completely nude", "see-through",

    //风格套装
    "playboy bunny",
    "wa maid", "maid",
    "mummy", "jiangshi", "witch",
    /^.+ outfit$/,
    /^.+ costume$/,
    "bandaged leg", "bandaged head", "bandaged arm",


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
]

export const patterns = format(clothing);
export const includes = ["footwear"];