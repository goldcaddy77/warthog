import { GraphQLScalarType } from 'graphql';

export const File = new GraphQLScalarType({
  name: 'File',
  description: 'File input AWS url',
  // serialize is only called when sending the scalar back to the client in the response. The value it receives as a parameter is the value returned in the resolver (or if the resolver returned a Promise, the value the Promise resolved to).
  serialize(value: unknown): string {
    console.log('serialize :>> ', value);
    return String(value);
  },

  // parseValue is only called when parsing a variable value in a query. In this case, the method receives as a parameter the relevant JSON value from the variables object submitted along with the query.
  parseValue(value: unknown): string {
    console.log('parseValue :>> ', value);
    return String(value);
  },

  // parseLiteral is only called when parsing a literal value in a query. Literal values include strings ("foo"), numbers (42), booleans (true) and null. The value the method receives as a parameter is the AST representation of this literal value.
  parseLiteral(ast): string {
    console.log('parseLiteral :>> ', ast);
    return String(ast.kind);
  }
});

export default File;
