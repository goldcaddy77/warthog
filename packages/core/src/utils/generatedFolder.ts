import * as path from 'path';

export const generatedFolderPath = (): string => {
  return process.env.WARTHOG_GENERATED_FOLDER || path.join(process.cwd(), 'generated');
};
