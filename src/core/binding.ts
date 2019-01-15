import { onError } from 'apollo-link-error';
import { HttpLink } from 'apollo-link-http';
import * as fetch from 'cross-fetch';
import * as fs from 'fs';
import * as Debug from 'debug';
import { buildSchema, GraphQLError, printSchema } from 'graphql';
import { Binding, TypescriptGenerator } from 'graphql-binding';
import { introspectSchema, makeRemoteExecutableSchema } from 'graphql-tools';
import * as path from 'path';

import { StringMapOptional } from '..';

const debug = Debug('binding');

interface LinkOptions extends StringMapOptional {
  token?: string;
  origin: string;
}

export class Link extends HttpLink {
  constructor(uri: string, options: LinkOptions) {
    let headers = { ...options };
    if (headers.token) {
      headers['Authorization'] = `Bearer ${headers.token}`;
      delete headers.token;
    }

    debug('headers', headers);

    super({
      uri,
      headers,
      // cross-fetch library is not a huge fan of TS
      // tslint:disable-next-line:no-any
      fetch: (fetch as any) as (input: RequestInfo, init?: RequestInit) => Promise<Response>
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

    const schema = makeRemoteExecutableSchema({ link: errorLink.concat(httpLink), schema: typeDefs });
    debug('schema', JSON.stringify(schema));
    super({ schema });
  }
}

export async function getRemoteBinding(endpoint: string, options: LinkOptions) {
  if (!endpoint) {
    throw new Error('getRemoteBinding: endpoint is required');
  }

  debug('getRemoteBinding', endpoint, options);

  const link = new Link(endpoint, options);
  const introspectionResult = await introspectSchema(link);
  debug('introspectionResult', JSON.stringify(introspectionResult));

  return new RemoteBinding(link, printSchema(introspectionResult));
}

export async function generateBindingFile(inputSchemaPath: string, outputBindingFile: string) {
  const sdl = fs.readFileSync(path.resolve(inputSchemaPath), 'utf-8');
  const schema = buildSchema(sdl);

  const generatorOptions = {
    schema,
    isDefaultExport: false,
    inputSchemaPath: path.resolve(inputSchemaPath),
    outputBindingPath: path.resolve(outputBindingFile)
  };

  const generatorInstance = new TypescriptGenerator(generatorOptions);
  const code = generatorInstance.render();

  fs.writeFileSync(outputBindingFile, code);
}

export { Binding };
