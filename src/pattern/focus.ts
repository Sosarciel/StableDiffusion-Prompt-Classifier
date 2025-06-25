import { formatPatterns } from "../Utils";
import * as details from './details';

/** 某个身体部位的特写 图片焦点 */
const set = [
    ...details.patterns.any,
    "breasts", "sideboob", "underboob",
    "legs", "feet", "toes",
    "soles", "toenails", "fingernails",
    "from below", "from behind", "from above", "from side",
    "solo focus", "groin", "vehicle focus",
    "nipples", "pussy", "anus", "vaginal",
    "back", "foot focus",
    "anal", "cervix", "after vaginal", "clitoris",
    "between legs", "eyelashes",
    "breasts apart",
    "armpit crease", "linea alba",
    "hetero", "femdom", "clothed female nude male", "penis",
    "eyeball", "eye focus", "eldritch abomination", "clothed sex", "chikan",
    "veiny penis", "pubic hair", "veins", "male pubic hair",
    "ass focus", "large penis", "backboob",
    "pervert", "female pervert", "testicles",
    "kneepits"
]
export const patterns = formatPatterns(set);
