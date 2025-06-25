import { formatPatterns } from "../Utils";


/**水印 */
const set = [
    "watermark",
    "uncensored", "convenient censoring",
    "character name",
    "text", "japanese text", "censored text",
    "chinese text", "english text",
    "censored", "mosaic censoring",
    "patreon logo", "patreon username", "artist name",
    "colophon", "company name", "copyright name", "copyright",
    "commentary", "dated commentary",
    "release date", "signature", "character signature", "borrowed character", "web address",
    "blur censor", "novelty censor", "bar censor", "engrish text",
    "ranguage", "content rating",
];
export const patterns = formatPatterns(set);