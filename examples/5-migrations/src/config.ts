import * as dotenv from 'dotenv';
import * as path from 'path';

export function loadConfig() {
  dotenv.config({ path: path.join(__dirname, '../.env') });
}
