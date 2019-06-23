import * as Debug from 'debug';
import { GluegunToolbox } from 'gluegun';
import * as path from 'path';

const log = Debug('warthog:cli');

export default {
  name: 'generate',
  alias: ['g'],
  run: async (toolbox: GluegunToolbox) => {
    const {
      parameters,
      template: { generate },
      print: { info }
    } = toolbox;

    // toolbox.filesystem.

    const options = parameters.options;

    const name = options.name;
    if (!name) {
      throw new Error('name is required');
    }

    const folder = options.folder || 'generated/';
    const warthogPath = options.warthogPath || 'warthog';

    const className = toolbox.strings.pascalCase(name);
    const camelName = toolbox.strings.camelCase(name);
    const kebabName = toolbox.strings.kebabCase(name);
    const props = {
      camelName,
      className,
      fields: [
        {
          name: 'key'
        }
      ],
      kebabName,
      warthogPath
    };

    log('props', props);

    let target = path.join(folder, '/', `${kebabName}.model.ts`);
    log('target', target);
    await generate({
      template: 'model.ts.ejs',
      target,
      props
    });
    info(`Generated file at ${target}`);

    target = path.join(folder, '/', `${kebabName}.service.ts`);
    await generate({
      template: 'service.ts.ejs',
      target,
      props
    });
    info(`Generated file at ${target}`);

    target = path.join(folder, '/', `${kebabName}.resolver.ts`);
    await generate({
      template: 'resolver.ts.ejs',
      target,
      props
    });
    info(`Generated file at ${target}`);
  }
};
