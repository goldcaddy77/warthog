import { GraphQLScalarType, Kind } from 'graphql';

export const FileScalar = new GraphQLScalarType({
  name: 'FileScalar',
  description: 'File input AWS url',

  // serialize is only called when sending the scalar back to the client in the response. The value it receives as a parameter is the value returned in the resolver (or if the resolver returned a Promise, the value the Promise resolved to).
  serialize(value: unknown): string {
    console.log('serialize :>> ', value);
    // check the type of received value
    // if (!(value instanceof ObjectId)) {
    //   throw new Error('FileScalar can only serialize ObjectId values');
    // }
    // return value.toHexString(); // value sent to the client
    return String(value);
  },

  // parseValue is only called when parsing a variable value in a query. In this case, the method receives as a parameter the relevant JSON value from the variables object submitted along with the query.
  parseValue(value: unknown): string {
    console.log('parseValue');
    console.log('parseValue :>> ', value);
    // check the type of received value
    if (typeof value !== 'string') {
      throw new Error('FileScalar can only parse string values');
    }
    // return new ObjectId(value); // value from the client input variables
    return String(value);
  },

  // parseLiteral is only called when parsing a literal value in a query. Literal values include strings ("foo"), numbers (42), booleans (true) and null. The value the method receives as a parameter is the AST representation of this literal value.
  parseLiteral(ast): string {
    console.log('parseLiteral :>> ', ast);

    // check the type of received value
    if (ast.kind !== Kind.STRING) {
      throw new Error('FileScalar can only parse string values');
    }
    // return new ObjectId(ast.value); // value from the client query
    return String(ast.kind);
  }
});

export default FileScalar;

// export const GraphQLTimestamp = new GraphQLScalarType({
//     name: "Timestamp",
//     description:
//       "The javascript `Date` as integer. " +
//       "Type represents date and time as number of milliseconds from start of UNIX epoch.",
//     serialize(value: Date) {
//       if (!(value instanceof Date)) {
//         throw new Error(`Unable to serialize value '${value}' as it's not an instance of 'Date'`);
//       }
//       return value.getTime();
//     },
//     parseValue(value: unknown) {
//       if (typeof value !== "number") {
//         throw new Error(
//           `Unable to parse value '${value}' as GraphQLTimestamp scalar supports only number values`,
//         );
//       }

//       return convertTimestampToDate(value);
//     },
//     parseLiteral(ast) {
//       if (ast.kind !== Kind.INT) {
//         throw new Error(
//           `Unable to parse literal value of kind '${ast.kind}' as GraphQLTimestamp scalar supports only '${Kind.INT}' ones`,
//         );
//       }

//       const num = Number.parseInt(ast.value, 10);
//       return convertTimestampToDate(num);
//     },
//   });

////////////

// export const CustomScalar = new GraphQLScalarType({
//     name: "Custom",
//     parseLiteral: () => "TypeGraphQL parseLiteral",
//     parseValue: () => "TypeGraphQL parseValue",
//     serialize: () => "TypeGraphQL serialize",
//   });
//   export class CustomType {}

//   export const ObjectScalar = new GraphQLScalarType({
//     name: "ObjectScalar",
//     parseLiteral: () => ({
//       value: "TypeGraphQL parseLiteral",
//     }),
//     parseValue: () => ({
//       value: "TypeGraphQL parseValue",
//     }),
//     serialize: obj => obj.value,
//   });
