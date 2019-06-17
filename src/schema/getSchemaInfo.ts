// Borrowed from https://github.com/19majkel94/type-graphql/blob/9778f9fab9e7f50363f2023b7ea366668e3d0ec9/tests/helpers/getSchemaInfo.ts
import {
  getIntrospectionQuery,
  graphql,
  IntrospectionObjectType,
  IntrospectionSchema
} from 'graphql';
import { buildSchema, BuildSchemaOptions } from 'type-graphql';

export async function getSchemaInfo(options: BuildSchemaOptions) {
  // build schema from definitions
  const schema = await buildSchema(options);

  // get builded schema info from retrospection
  const result = await graphql(schema, getIntrospectionQuery());
  expect(result.errors).toBeUndefined();

  if (!result || !result.data) {
    throw new Error('Unable to introspect schema');
  }

  const schemaIntrospection = result.data.__schema as IntrospectionSchema;
  expect(schemaIntrospection).toBeDefined();

  const queryType = schemaIntrospection.types.find(
    type => type.name === schemaIntrospection.queryType.name
  ) as IntrospectionObjectType;

  const mutationTypeNameRef = schemaIntrospection.mutationType;
  let mutationType: IntrospectionObjectType | undefined;
  if (mutationTypeNameRef) {
    mutationType = schemaIntrospection.types.find(
      type => type.name === mutationTypeNameRef.name
    ) as IntrospectionObjectType;
  }

  const subscriptionTypeNameRef = schemaIntrospection.subscriptionType;
  let subscriptionType: IntrospectionObjectType | undefined;
  if (subscriptionTypeNameRef) {
    subscriptionType = schemaIntrospection.types.find(
      type => type.name === subscriptionTypeNameRef.name
    ) as IntrospectionObjectType;
  }

  return {
    mutationType,
    queryType,
    schema,
    schemaIntrospection,
    subscriptionType
  };
}
