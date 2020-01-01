import { onError } from 'apollo-link-error';
import { HttpLink } from 'apollo-link-http';
import * as fetch from 'cross-fetch';
import * as fs from 'fs';
import { buildSchema, GraphQLError, printSchema } from 'graphql';
import { Binding, TypescriptGenerator } from 'graphql-binding';
import { introspectSchema, makeRemoteExecutableSchema } from 'graphql-tools';
import * as path from 'path';

import { StringMapOptional, logger } from '../core';

interface LinkOptions extends StringMapOptional {
  token?: string;
  origin: string;
}

export class Link extends HttpLink {
  constructor(uri: string, options: LinkOptions) {
    const headers: StringMapOptional = { ...options };
    if (headers.token) {
      headers.Authorization = `Bearer ${headers.token}`;
      delete headers.token;
    }

    logger.debug('headers', headers);

    super({
      // TODO: cross-fetch library does not play nicely with TS
      fetch: (fetch as any) as (input: RequestInfo, init?: RequestInit) => Promise<Response>,
      headers,
      uri
    });
  }
}

export class RemoteBinding extends Binding {
  constructor(httpLink: HttpLink, typeDefs: string) {
    // Workaround for issue with graphql-tools
    // See https://github.com/graphql-binding/graphql-binding/issues/173#issuecomment-446366548
    const errorLink = onError((args: any) => {
      if (args.graphQLErrors && args.graphQLErrors.length === 1) {
        args.response.errors = args.graphQLErrors.concat(new GraphQLError(''));
      }
    });

    const schema = makeRemoteExecutableSchema({
      link: errorLink.concat(httpLink),
      schema: typeDefs
    });
    logger.debug('schema', JSON.stringify(schema));
    super({ schema });
  }
}

export async function getRemoteBinding(endpoint: string, options: LinkOptions) {
  if (!endpoint) {
    throw new Error('getRemoteBinding: endpoint is required');
  }

  logger.debug('getRemoteBinding', endpoint, options);

  const link = new Link(endpoint, options);
  const introspectionResult = await introspectSchema(link);
  logger.debug('introspectionResult', JSON.stringify(introspectionResult));

  return new RemoteBinding(link, printSchema(introspectionResult));
}

export async function generateBindingFile(inputSchemaPath: string, outputBindingFile: string) {
  logger.debug('generateBindingFile:start');
  const sdl = fs.readFileSync(path.resolve(inputSchemaPath), 'utf-8');
  const schema = buildSchema(sdl);

  const generatorOptions = {
    inputSchemaPath: path.resolve(inputSchemaPath),
    isDefaultExport: false,
    outputBindingPath: path.resolve(outputBindingFile),
    schema
  };

  const generatorInstance = new TypescriptGenerator(generatorOptions);

  // The generated binding considers all JSON inputs as strings.  Doing this replacement fixes it.
  // I looked for a more elegant solution, but couldn't find one
  const code = generatorInstance.render().replace(
    'export type JSONObject = string',
    `
    export type JsonValue = JsonPrimitive | JsonObject | JsonArray;

    export type JsonPrimitive = string | number | boolean | null | {};
    
        // eslint-disable-next-line @typescript-eslint/no-empty-interface
    export interface JsonArray extends Array<JsonValue> {}
    
    export type JsonObject = { [member: string]: JsonValue };

    export type JSONObject = JsonObject;
  `
  );

  fs.writeFileSync(outputBindingFile, code);
  logger.debug('generateBindingFile:end');
}

export function getOriginalError(error: any): any {
  if (error.originalError) {
    return getOriginalError(error.originalError);
  }
  if (error.errors) {
    return error.errors.map(getOriginalError)[0];
  }
  return error;
}

export function getBindingError(err: any) {
  const error = getOriginalError(err);
  if (
    error &&
    error.extensions &&
    error.extensions.exception &&
    error.extensions.exception.validationErrors
  ) {
    error.extensions.exception.validationErrors.forEach((item: any) => {
      error.validationErrors = error.validationErrors || {};
      error.validationErrors[item.property] = item.constraints;
    });
  }
  return error;
}

export { Binding };
