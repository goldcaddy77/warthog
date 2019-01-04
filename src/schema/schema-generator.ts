// See: https://github.com/19majkel94/type-graphql/blob/master/src/schema/schema-generator.ts
import { writeFileSync } from 'fs';
import * as path from 'path';
import * as prettier from 'prettier';
import { EntityMetadata } from 'typeorm';

import {
  entityToOrderByEnum,
  entityToWhereArgs,
  entityToWhereInput,
  entityToWhereUniqueInput,
  entityToCreateInput,
  entityToUpdateInput,
  entityToUpdateInputArgs
} from './typeorm-converter';

// tslint:disable-next-line:no-empty-interface
export interface SchemaGeneratorOptions {}

export class SchemaGenerator {
  static generateFromMetadataSync(
    entities: EntityMetadata[],
    destinationFolder: string,
    // This will reference 'warthog in the deployed module, but we need to do a relative import in the examples library
    warthogImportPath: string = 'warthog'
  ): string {
    let template = `
      // tslint:disable:variable-name

      // This is an auto-generated file
      // Do not update directly, please update models
      import { ArgsType, Field, InputType } from 'type-graphql';
      import { registerEnumType } from 'type-graphql';
      import { BaseWhereInput, PaginationArgs } from '${warthogImportPath}';
    `;

    entities.forEach((entity: EntityMetadata) => {
      template += `
        ${entityToOrderByEnum(entity)}
        ${entityToWhereInput(entity)}
        ${entityToWhereArgs(entity)}
        ${entityToWhereUniqueInput(entity)}
        ${entityToCreateInput(entity)}
        ${entityToUpdateInput(entity)}
        ${entityToUpdateInputArgs(entity)}
      `;
    });

    template += `
    // tslint:enable:variable-name
    `;

    writeFileSync(path.join(destinationFolder, 'classes.ts'), format(template), {
      encoding: 'utf8',
      flag: 'w'
    });

    return template;
  }
}

export function format(code: string, options: prettier.Options = {}) {
  try {
    // TODO: grab our prettier options (single quote, etc...)
    return prettier.format(code, {
      ...options,
      parser: 'typescript'
    });
  } catch (e) {
    console.log(`There is a syntax error in generated code, unformatted code printed, error: ${JSON.stringify(e)}`);
    return code;
  }
}
