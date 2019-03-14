import 'reflect-metadata';

import { IntrospectionEnumType, IntrospectionSchema } from 'graphql';
import { ObjectType, Query, Resolver } from 'type-graphql';
import { Container } from 'typedi';

import { getSchemaInfo } from '../schema';

import { EnumField } from './EnumField';

describe('Enums', () => {
  let schemaIntrospection: IntrospectionSchema;

  beforeAll(async () => {
    // TODO: should we set this up as part of the test harness?
    Container.set('warthog.generated-folder', process.cwd());

    enum StringEnum {
      Foo = 'FOO',
      Bar = 'BAR'
    }

    @ObjectType()
    class StringEnumInput {
      @EnumField('StringEnum', StringEnum, { nullable: true })
      stringEnumField?: StringEnum;
    }

    @Resolver(of => StringEnumInput)
    class SampleResolver {
      @Query(returns => StringEnum)
      getStringEnumValue(): StringEnum {
        return StringEnum.Foo;
      }
    }

    const schemaInfo = await getSchemaInfo({
      resolvers: [SampleResolver]
    });
    schemaIntrospection = schemaInfo.schemaIntrospection;
  });

  describe('EnumField', () => {
    it('Puts an enum in the GraphQL schema', async () => {
      const myEnum = schemaIntrospection.types.find((type: any) => {
        return type.kind === 'ENUM' && type.name === 'StringEnum';
      }) as IntrospectionEnumType;

      expect(myEnum).toBeDefined();
      expect(myEnum.enumValues.length).toEqual(2);
    });
  });
});
