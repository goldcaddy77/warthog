import * as fs from 'fs';
import * as path from 'path';

// This test makes sure that the test schema doesn't change over time
// it has a good combination of data types an options that have been inspected.
// It should not change unless we explicitly change something
describe('schema', () => {
  test("test schema doesn't change", async () => {
    const file = path.join(__dirname, '..', 'generated', 'schema.graphql');
    const schema = fs.readFileSync(file, 'utf-8');

    expect(schema).toMatchSnapshot();
  });
});
