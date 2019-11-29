import * as path from 'path';
import { promisify } from 'util';
import * as fs from 'fs';
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

import { WarthogGluegunToolbox } from '../types';
import { Toolbox } from 'gluegun/build/types/domain/toolbox';

export default {
  name: 'new',
  alias: ['n'],
  run: async (toolbox: WarthogGluegunToolbox) => {
    const {
      parameters: { first }
    } = toolbox;

    let name = first;
    if (!name) {
      const { n } = await toolbox.prompt.ask([
        { type: 'input', name: 'n', message: 'What do you want your project to be called?' }
      ]);
      name = n;
    }

    const props = {
      className: toolbox.strings.pascalCase(name),
      camelName: toolbox.strings.camelCase(name),
      kebabName: toolbox.strings.kebabCase(name)
    };

    const newFolder = toolbox.filesystem.path(__dirname, '../templates/new');
    const files = await getFileRecursive(newFolder);

    files.forEach(async file => {
      const relativePath = path.relative(newFolder, file);
      await generateFile(
        toolbox,
        props,
        `new/${relativePath}`,
        process.cwd(),
        relativePath.slice(0, -4) // remove .ejs
      );
    });

    return;
  }
};

async function generateFile(
  toolbox: Toolbox,
  props: any,
  template: string,
  destFolder: string,
  filename: string
) {
  if (filename.startsWith('_')) {
    filename = filename.replace(/^_/, '.');
  }
  const target = path.join(destFolder, '/', filename);

  const generated = await toolbox.template.generate({
    template,
    target,
    props
  });

  toolbox.filesystem.write(target, generated);

  toolbox.print.info(`Generated file at ${target}`);
}

async function getFileRecursive(dir: string): Promise<string[]> {
  const subdirs = await readdir(dir);
  const files = await Promise.all(
    subdirs.map(async subdir => {
      const res = path.resolve(dir, subdir);
      return (await stat(res)).isDirectory() ? getFileRecursive(res) : [res];
    })
  );
  return Array.from(files.reduce((a, f) => a.concat(f), []));
}
