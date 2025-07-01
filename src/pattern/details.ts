import { format } from "../PatternUtils";

/** 某个身体部位的细节描述 图片焦点 */
const set = [
    "toenail polish", "red nails", "nail polish", "blue nails",
    "partially visible vulva","cameltoe",
    "areola slip", "covered nipples",
    "cleft of venus", "covering",
    "anus peek", "crotch seam", "gusset", "breast press",
    "pink lips",
]
export const patterns = format(set);
