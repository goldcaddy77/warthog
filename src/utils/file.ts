import { writeFile } from 'fs';
import * as util from 'util';

export const writeFilePromise = util.promisify(writeFile);
