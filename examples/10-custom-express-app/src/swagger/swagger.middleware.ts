import * as bodyParser from 'body-parser';
import * as express from 'express';
import { initialize as openapiInitialize } from 'express-openapi';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import * as path from 'path';
import { validateAllResponses } from './schema_validator';

export function initializeSwaggerMiddleware(app: express.Application) {
  // pull in the base Swagger schema from our yaml
  const apiDoc = yaml.safeLoad(fs.readFileSync(path.resolve(__dirname, 'schema.yaml'), 'utf-8'));

  // initialize the swagger wrapper on express and setup routes and validation
  openapiInitialize({
    apiDoc: {
      ...apiDoc,
      'x-express-openapi-additional-middleware': [validateAllResponses],
      'x-express-openapi-validation-strict': true
    },
    app,
    consumesMiddleware: {
      'application/json': bodyParser.json()
    },
    exposeApiDocs: true,
    paths: [
      {
        path: '/user/id/:userId',
        module: require('../api-routes/user')
      }
    ],
    validateApiDoc: true
  });
}
