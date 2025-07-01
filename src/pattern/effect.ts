import { format } from "../PatternUtils";


/**人物 */
const set = [
    "stats", "clothes writing",
    "shiny", "shadow", "viewfinder",
    "dutch angle", "science fiction","logo",
    "monochrome", "greyscale","steam",
    "dated", "sparkle", "reflection", "light particles",
    "glowing", "magic", "floating object",
    "flashing", "motion blur", "motion lines"
];
export const patterns = format(set);