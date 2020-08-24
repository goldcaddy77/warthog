import * as prettier from 'prettier';
import { Container } from 'typedi';

import { logger, Logger } from '../core/logger';
import {
  generateEnumMapImports,
  entityToCreateInput,
  entityToCreateManyArgs,
  entityToOrderByEnum,
  entityToUpdateInput,
  entityToUpdateInputArgs,
  entityToWhereArgs,
  entityToWhereInput,
  entityToWhereUniqueInput
} from './TypeORMConverter';
import { getMetadataStorage, ModelMetadata } from '../metadata';

export class SchemaGenerator {
  static logger: Logger = Container.has('warthog.logger')
    ? Container.get('warthog.logger')
    : logger;

  static generate(
    // This will reference 'warthog in the deployed module, but we need to do a relative import in the examples library
    warthogImportPath = 'warthog'
  ): string {
    const metadata = getMetadataStorage();
    let template = `
      // This file has been auto-generated by Warthog.  Do not update directly as it
      // will be re-written.  If you need to change this file, update models or add
      // new TypeGraphQL objects
      // @ts-ignore
      import { DateResolver as Date } from 'graphql-scalars';
      // @ts-ignore
      import { GraphQLID as ID } from 'graphql';
      // @ts-ignore
      import { ArgsType, Field as TypeGraphQLField, Float, InputType as TypeGraphQLInputType, Int } from 'type-graphql';
      // @ts-ignore
      import { registerEnumType, GraphQLISODateTime as DateTime } from "type-graphql";

      // @ts-ignore eslint-disable-next-line @typescript-eslint/no-var-requires
      const { GraphQLJSONObject } = require('graphql-type-json');

      // @ts-ignore
      import { BaseWhereInput, JsonObject, PaginationArgs, DateOnlyString, DateTimeString } from '${warthogImportPath}';
      ${generateEnumMapImports().join('')}
    `;

    Object.keys(metadata.getModels()).forEach((modelName: string) => {
      const model: ModelMetadata = metadata.getModel(modelName);

      template += `
        ${entityToOrderByEnum(model)}
        ${entityToWhereInput(model)}
        ${entityToWhereUniqueInput(model)}
        ${entityToCreateInput(model)}
        ${entityToUpdateInput(model)}
        ${entityToWhereArgs(model)}
        ${entityToCreateManyArgs(model)}
        ${entityToUpdateInputArgs(model)}
      `;
    });

    return this.format(template);
  }

  static format(code: string, options: prettier.Options = {}) {
    try {
      // TODO: grab our prettier options (single quote, etc...)
      return prettier.format(code, {
        ...options,
        parser: 'typescript'
      });
    } catch (e) {
      this.logger.error(
        `There is a syntax error in generated code, unformatted code printed, error: ${JSON.stringify(
          e
        )}`
      );
      return code;
    }
  }
}
