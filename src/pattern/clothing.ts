import { formatPatterns } from "../Utils";
import * as footwear from './footwear';

/** 任何和主体角色有关的服装 */
const clothing = [
    ...footwear.patterns.any,
    /^.+ \(symbol\)$/, /^goggles.+ $/,

    //头饰
    "hairband"  , /^.+ hairband$/,
    "hair ornament", /^.+ hair ornament$/,

    //帽子
    "hat"       , /^.+ hat$/,
    "cape"      , /^.+ cape$/,
    "cap"       , /^.+ cap$/,
    "hood"      , /^.+ hood$/,

    //面部
    "mask"      , /^mask .+$/, /^.+ mask$/,
    "veil"      , /^.+ veil$/,

    //脖子
    "bowtie"    , /^.+ bowtie$/,
    "collar"    , /^.+ collar$/,
    "neckerchief", /^.+ neckerchief$/,
    "necktie"   , /^.+ necktie$/,
    "choker"    , /^.+ choker$/,

    //腰部
    "belt"      , /^.+ belt$/,

    //身体服饰
    "kimono"    , /^.+ kimono$/,
    "leotard"   , /^.+ leotard$/,
    "uniform"   , /^.+ uniform$/,
    "hoodie"    , /^.+ hoodie$/,
    "apron"     , /^.+ apron$/,
    "jacket"    , /^.+ jacket$/,

    //内衣
    "panties"   , /^.+ panties$/,

    //手部
    "gauntlets" , /^.+ gauntlets$/,

    //不定装饰
    "rose"      , /^.+ rose$/,
    "ribbon"    , /^.+ ribbon$/,
    "bell"      , /^.+ bell$/,

    "capelet"   , /^.+ capelet$/,
    "headwear"  , /^.+ headwear$/,
    "eyewear"   , /^.+ eyewear$/,
    "earrings"  , /^.+ earrings$/,
    "scrunchie" , /^.+ scrunchie$/,
    "swimsuit"  , /^.+ swimsuit$/,
    "bikini"    , /^.+ bikini$/,
    "flower"    , /^.+ flower$/,
    "legwear"   , /^.+ legwear$/,
    "clothes"   , /^.+ clothes$/,
    "shirt"     , /^.+ shirt$/,
    "skirt"     , /^.+ skirt$/,
    "gloves"    , /^.+ gloves?$/,
    "pantyhose" , /^.+ pantyhose$/,
    "sleeves"   , /^.+ sleeves$/,
    "shorts"    , /^.+ shorts$/,
    "dress"     , /^.+ dress$/,
    "thighhigh" , /^.+ thighhighs?$/,
    "vest"      , /^.+ vest$/,
    "coat"      , /^.+ coat$/,
    "bow"       , /^.+ bow$/,

    "labcoat",
    "plaid", "bandaid", "head wreath", "o-ring",
    "sweater vest", "midriff peek", "hair intakes", "midriff",
    "wa maid", "shoulder cutout", "bandages", "bandaid on leg",
    "jingle bell", "hair rings", "jacket around waist", "headband",
    "sweater", "off shoulder", "bare shoulders", "floral print",
    "frills", "ribbon", "covered navel", "see-through",
    "serafuku", "tiara",
    "clothing cutout", "navel cutout", "strapless",
    "bare legs", "maid", "wrist cuffs", "garter straps",
    "eyepatch", "bath towel", "halterneck", "corset",
    "underwear", "single sock", "camisole", "pajamas", "christmas",
    "fur trim", "witch hat", "thigh strap", "witch",
    "hairclip", "wristband", "sweatband", "sports bra",
    "hood up", "clothes around waist", "official alternate costume",
    "crop top", "argyle", "eyewear on head", "sunglasses",
    "tassel", "pelvic curtain", "jewelry", "bracelet",
    "bodysuit", "bare arms", "sleeveless", "sarong",
    "anklet", "front-tie top", "bead bracelet", "bangle",
    "headphones", "headphones around neck", "fake animal ears", "hood down",
    "sleeves past wrists", "necklace", "ring", "beret",
    "center frills", "brooch", "striped", "buttons",
    "barcode tattoo", "playboy bunny", "hair stick", "obi", "sash", "lolita fashion",
    "crown", "shawl", "innertube", "criss-cross halter",
    "animal ear headphones", "cloak", "medical eyepatch", "tutu","ballet slippers",
    "wataboushi", "uchikake",
    "bra","scarf","ribbed sweater",
    "shoulder armor", "armor",
    "sideless outfit", "red scarf", "open fly", "watch","ascot",
    "santa costume","bonnet", "overalls",
    "crop top overhang", "no bra", "cheerleader", "pom pom (cheerleading)",
    "alternate costume", "polka dot", "highleg",
    "race queen", "panty straps", "bikini top only",
    "nude", "completely nude", "virtual youtuber",
    "kneehighs", "no pants", "thong", "lace trim", "lace", "skirt removed",
    "pasties", "underwear only", "thighlet", "gold trim", "jiangshi",
    "halloween costume", "qing guanmao", "crotch rope", "naked bandage",
    "sarashi", "mummy costume", "chest sarashi",
    "cuffs", "shackles", "ankle cuffs",
    "bandaged leg", "bandaged head", "bandaged arm", "mummy",
    "loincloth", "sling bikini top", "harem outfit",
    "breast curtains",
    "piercing", "navel piercing", "nipple piercing", "nipple rings",
    "tongue piercing", "pussy piercing", "ear piercing", "clitoris piercing",
    "fishnets", "fishnet bodysuit",  "leash",
    "crotchless", "cupless bra",
    "side-tie bikini bottom", "towel", "fake tail",
    "pom pom (clothes)", "buckle",
    "topless","lingerie",
    "maebari", "ribbon trim", "shrug (clothing)", "breast curtain", "flower knot",
    "bottomless","black bra", "feather boa","bodystocking", "bridal garter",
    "black sweater", "casual", "black serafuku", "blue serafuku",
    "red sweater", "off-shoulder sweater", "monocle", "glasses",
    "center opening", "armlet",
    "suit", "business suit", "formal", "hakama", "red hakama",
    "hip vent","babydoll",
]

export const patterns = formatPatterns(clothing);
export const includes = ["footwear"];