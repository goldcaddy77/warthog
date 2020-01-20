import * as fs from 'fs';
import * as path from 'path';

export async function cleanUpTestData() {
  try {
    fs.unlinkSync(path.join(__dirname, '../../', String(process.env.WARTHOG_DB_DATABASE)));
  } catch (error) {
    //
  }

  try {
    fs.unlinkSync(path.join(process.cwd(), String(process.env.WARTHOG_DB_DATABASE)));
  } catch (error) {
    //
  }

  return;
}
