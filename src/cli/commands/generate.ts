import * as path from 'path';

import { WarthogGluegunToolbox } from '../types';

export default {
  name: 'generate',
  alias: ['g'],
  run: async (toolbox: WarthogGluegunToolbox) => {
    const {
      config: { load },
      parameters: { options },
      print: { info },
      string: { supplant },
      template: { generate }
    } = toolbox;

    const config: any = load();

    const name = options.name;
    if (!name) {
      throw new Error('name is required');
    }

    const names = {
      className: toolbox.strings.pascalCase(name),
      camelName: toolbox.strings.camelCase(name),
      kebabName: toolbox.strings.kebabCase(name)
    };

    // Allow folder to be passed in or pulled from config files
    const cliGeneratePath =
      options.folder ||
      path.join(config.get('ROOT_FOLDER'), '/', config.get('CLI_GENERATE_PATH'), '/');

    // TODO:DOCS
    // Allow interpolation of the above names into the generate path like './src/${kebabName}'
    const destFolder = supplant(cliGeneratePath, names);

    const warthogPathInGeneratedFolder = config.get('MODULE_IMPORT_PATH');
    const generatedPath = config.get('GENERATED_FOLDER');
    const generatedFolderRelativePath = path.relative(destFolder, generatedPath);

    let warthogPathInSourceFiles;
    // If we're generating inside of an external project, we'll just import from 'warthog'
    if (warthogPathInGeneratedFolder === 'warthog') {
      warthogPathInSourceFiles = 'warthog';
    } else {
      // This ensures we use a relative path in the `examples` folders within the warthog repo
      const warthogAbsolutePath = path.join(generatedPath, warthogPathInGeneratedFolder);
      warthogPathInSourceFiles = path.relative(destFolder, warthogAbsolutePath);
    }

    const props = {
      ...names,
      fields: [
        {
          name: 'key'
        }
      ],
      generatedFolderRelativePath,
      warthogPathInSourceFiles
    };

    let target = path.join(destFolder, '/', `${names.kebabName}.model.ts`);
    await generate({
      template: 'model.ts.ejs',
      target,
      props
    });
    info(`Generated file at ${target}`);

    target = path.join(destFolder, '/', `${names.kebabName}.service.ts`);
    await generate({
      template: 'service.ts.ejs',
      target,
      props
    });
    info(`Generated file at ${target}`);

    target = path.join(destFolder, '/', `${names.kebabName}.resolver.ts`);
    await generate({
      template: 'resolver.ts.ejs',
      target,
      props
    });
    info(`Generated file at ${target}`);
  }
};
