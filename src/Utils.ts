import { AnyFunc } from '@zwa73/utils';
import path from 'pathe';


const escapeRegExp = (str: string) => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**根目录 */
export const ROOT_PATH = path.join(__dirname, '..');
/**模式目录 */
export const PATTERNS_PATH = path.join(ROOT_PATH, 'dist', 'pattern');
/**数据目录 */
export const DATA_PATH = path.join(ROOT_PATH, 'data');
/**词库目录 */
export const PROMPTSET_PATH = path.join(DATA_PATH, 'promptset.json');
