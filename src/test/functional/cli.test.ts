import * as fs from 'fs';
import { filesystem, system } from 'gluegun';
import * as path from 'path';
// eslint-disable-next-line
// @ts-ignore
import * as pgtools from 'pgtools';
import { callWarthogCLI, createDB, dropDB, spyOnStd } from '../helpers';
import { setTestServerEnvironmentVariables } from '../server-vars';
const pgtoolsCreateDB = pgtools.createdb;
const pgtoolsDropDB = pgtools.dropdb;

const root = filesystem.path(__dirname, '../../../');

const GENERATED_FOLDER = path.join(__dirname, '../../../tmp/cli-tests');

describe('cli functional tests', () => {
  const spy = spyOnStd(); // Gives us access to whatever is written to stdout as part of the CLI command
  const openMock = jest.fn();

  beforeAll(async () => {
    await filesystem.dirAsync(GENERATED_FOLDER); // cleanup test artifacts
    jest.mock('open', () => openMock);
  });

  beforeEach(() => {
    setTestServerEnvironmentVariables();
    spy.clear();
  });

  afterAll(() => {
    filesystem.remove(GENERATED_FOLDER); // cleanup test artifacts
    filesystem.remove(path.join(__dirname, 'tmp'));
    openMock.mockReset();
  });

  // This test actually calls the CLI via a system call.  This won't count towards test coverage
  // but it's the most thorough way we can actually check to see if everything is wired up correctly
  test('spin up an actual process to test the full cli is wired up', async done => {
    expect.assertions(2);

    // Construct the environment variables here so that they're passed into cli command

    const env = {
      ...process.env
    };

    const output = await system.run(
      'node ' + filesystem.path(root, 'bin', 'warthog') + ' --version',
      {
        env
      }
    );

    // TODO: should we bother with this since we don't update the version in package.json?
    expect(output).toContain('0.0.0-development');
    // This makes sure we're actually getting the version command and not the standard "help" command, which also includes the version
    expect(output).not.toContain('help');
    done();
  });

  test('outputs help', async done => {
    await callWarthogCLI('--help');
    const stdout = spy.getStdOutErr();
    expect(stdout).toContain('generate (g)');
    done();
  });

  test('generates models', async done => {
    expect.assertions(23);

    await callWarthogCLI(
      `generate user name! nickname numLogins:int! verified:bool! registeredAt:date balance:float! meta:json! --folder ${GENERATED_FOLDER}`
    );
    const stdout = spy.getStdOutErr();

    let fileContents;

    expect(stdout).toContain(`Generated file at ${GENERATED_FOLDER}/user.model.ts`);
    fileContents = filesystem.read(`${GENERATED_FOLDER}/user.model.ts`);
    expect(fileContents).toContain('export class User');

    expect(fileContents).toContain('@StringField()');
    expect(fileContents).toContain('name!: string;');

    // This also checks that prettier was run to remove trailing comma
    expect(fileContents).toContain('@StringField({ nullable: true })');
    expect(fileContents).toContain('nickname?: string;');

    expect(fileContents).toContain('@IntField()');
    expect(fileContents).toContain('numLogins!: number;');

    expect(fileContents).toContain('@BooleanField()');
    expect(fileContents).toContain('verified!: boolean;');

    // This also checks that prettier was run to remove trailing comma
    expect(fileContents).toContain('@DateField({ nullable: true })');
    expect(fileContents).toContain('registeredAt?: Date;');

    expect(fileContents).toContain('@FloatField()');
    expect(fileContents).toContain('balance!: number;');

    // Generator should dynamically add these imports
    expect(fileContents).toContain('BooleanField,');
    expect(fileContents).toContain('DateField,');
    expect(fileContents).toContain('FloatField,');
    expect(fileContents).toContain('IntField,');
    expect(fileContents).toContain('JSONField,');

    expect(stdout).toContain(`Generated file at ${GENERATED_FOLDER}/user.service.ts`);
    fileContents = filesystem.read(`${GENERATED_FOLDER}/user.service.ts`);
    expect(fileContents).toContain("@Service('UserService')");

    expect(stdout).toContain(`Generated file at ${GENERATED_FOLDER}/user.resolver.ts`);
    fileContents = filesystem.read(`${GENERATED_FOLDER}/user.resolver.ts`);
    expect(fileContents).toContain('this.service.find');

    done();
  });

  test('generates a shell of a file of no params specified', async done => {
    expect.assertions(9);

    await callWarthogCLI(`generate empty_class --folder ${GENERATED_FOLDER}`);
    const stdout = spy.getStdOutErr();

    expect(stdout).toContain(`Generated file at ${GENERATED_FOLDER}/empty-class.model.ts`);
    const fileContents = filesystem.read(`${GENERATED_FOLDER}/empty-class.model.ts`);

    expect(fileContents).toContain('export class EmptyClass extends BaseModel');
    expect(fileContents).toContain('@StringField({ nullable: true })');
    expect(fileContents).toContain('fieldName?: string;');

    // Generator should NOT dynamically add these imports
    expect(fileContents).not.toContain('BooleanField');
    expect(fileContents).not.toContain('DateField');
    expect(fileContents).not.toContain('FloatField');
    expect(fileContents).not.toContain('IntField');
    expect(fileContents).not.toContain('JSONField');

    done();
  });

  test('generates to a dynamic path', async done => {
    expect.assertions(2);

    await callWarthogCLI('generate empty_class --folder ' + GENERATED_FOLDER + '/${camelName}');
    const stdout = spy.getStdOutErr();

    // Note the camel cased "emptyClass below"
    const file = `${GENERATED_FOLDER}/emptyClass/empty-class.model.ts`;

    expect(stdout).toContain(`Generated file at ${file}`);

    const fileContents = filesystem.read(file);
    expect(fileContents).toContain('export class EmptyClass extends BaseModel');

    done();
  });

  test('requires name for db:create', async done => {
    expect.assertions(1);

    // process.env.PGUSER = 'postgres';
    await callWarthogCLI('db:create', { WARTHOG_DB_DATABASE: '' });
    const stdout = spy.getStdOutErr();

    expect(stdout).toContain('Database name is required');
    done();
  });

  test('successfully creates a database', async done => {
    pgtools.createdb = jest.fn().mockImplementation((config: any, dbname: string, cb: Function) => {
      cb(null, { success: true });
    });

    await callWarthogCLI('db:create');
    const stdout = spy.getStdOutErr();

    expect(stdout).toContain("Database 'warthog-test' created!");
    pgtools.createdb = pgtoolsCreateDB;
    done();
  });

  test('throws an error if pg library cant create DB', async done => {
    pgtools.createdb = jest.fn().mockImplementation((config: any, dbname: string, cb: Function) => {
      cb({ message: 'duplicate database' }, null);
    });

    await callWarthogCLI('db:create');
    const stdout = spy.getStdOutErr();
    expect(stdout).toContain("Database 'warthog-test' already exists");
    pgtools.createdb = pgtoolsCreateDB;
    done();
  });

  test('db:drop: throws an error if database does not exist', async done => {
    pgtools.dropdb = jest.fn().mockImplementation((config: any, dbname: string, cb: Function) => {
      cb({ name: 'invalid_catalog_name' }, null);
    });

    await callWarthogCLI('db:drop');
    const stdout = spy.getStdOutErr();

    expect(stdout).toContain("Database 'warthog-test' does not exist");
    pgtools.dropdb = pgtoolsDropDB;
    done();
  });

  test('db:drop success', async done => {
    pgtools.dropdb = jest.fn().mockImplementation((config: any, dbname: string, cb: Function) => {
      cb(null, { success: true });
    });

    await callWarthogCLI('db:drop');
    const stdout = spy.getStdOutErr();

    expect(stdout).toContain("Database 'warthog-test' dropped!");
    pgtools.dropdb = pgtoolsDropDB;
    done();
  });

  test('db:drop success', async done => {
    await callWarthogCLI('db:migrate:generate');
    const stdout = spy.getStdOutErr();
    expect(stdout).toContain('"name" option is required');
    spy.clear();

    done();
  });

  test('generates and runs migrations', async done => {
    const migrationDBName = 'warthog-test-generate-migrations';

    // Set environment variables for a test server that writes to a separate test DB and does NOT autogenerate files
    setTestServerEnvironmentVariables({
      WARTHOG_DB_DATABASE: migrationDBName,
      WARTHOG_DB_SYNCHRONIZE: 'false'
    });

    await allowError(
      dropDB(migrationDBName),
      'DropDB will likely fail since DB might not be there'
    );
    await createDB(migrationDBName);

    await callWarthogCLI('db:migrate:generate --name cli_test_db_migration');
    const stdout = spy.getStdOutErr();
    expect(stdout).toContain('-CliTestDbMigration.ts');
    expect(stdout).toContain('has been generated successfully.');

    const migrationDir = String(process.env.WARTHOG_DB_MIGRATIONS_DIR);
    const migrationFileName = fs.readdirSync(migrationDir)[0];
    const migrationContents = fs.readFileSync(path.join(migrationDir, migrationFileName), 'utf-8');

    expect(migrationContents).toContain('CREATE TABLE "kitchen_sinks"');
    expect(migrationContents).toContain('CREATE TABLE "dishs"');
    expect(migrationContents).toContain('DROP TABLE "dishs"');
    expect(migrationContents).toContain('DROP TABLE "kitchen_sinks"');
    done();
  });

  test('warthog (with no command)', async done => {
    await callWarthogCLI('');
    const stdout = spy.getStdOutErr();
    expect(stdout).toContain('Warthog: GraphQL API Framework');
    done();
  });

  test('warthog playground', async done => {
    await callWarthogCLI('playground');
    expect(openMock).toBeCalledWith('http://localhost:4000/playground', { wait: false });
    done();
  });

  test('codegen creates correct files', async done => {
    const folder = './tmp/codegen';
    filesystem.remove(folder);
    process.env.WARTHOG_GENERATED_FOLDER = folder;

    await callWarthogCLI('codegen --binding');

    // TODO: how much file content validation should we do here?
    const bindingContents = filesystem.read(`${folder}/binding.ts`);
    expect(bindingContents).toContain('export interface Binding');

    const classContents = filesystem.read(`${folder}/classes.ts`);
    expect(classContents).toContain('export enum KitchenSinkOrderByEnum');

    const indexContents = filesystem.read(`${folder}/index.ts`);
    expect(indexContents).toContain("export * from './classes';");

    const ormConfigContents = filesystem.read(`${folder}/ormconfig.ts`);
    expect(ormConfigContents).toContain('module.exports = database.getBaseConfig();');

    const schemaContents = filesystem.read(`${folder}/schema.graphql`);
    expect(schemaContents).toContain('input KitchenSinkWhereInput');

    filesystem.remove(folder);
    done();
  });

  test('warthog new', async (done: Function) => {
    const tmpFolder = path.join(__dirname, 'tmp');
    // delete folder first
    await callWarthogCLI('new foo', { WARTHOG_CLI_GENERATE_PATH: tmpFolder });

    const packageJson = require(path.join(__dirname, 'tmp', 'package.json')); // eslint-disable-line
    const caretDep = /^\^\d+/; // ex: "^4"
    expect(packageJson.dependencies['dotenv']).toMatch(caretDep);
    expect(packageJson.dependencies['reflect-metadata']).toMatch(caretDep);
    expect(packageJson.dependencies['warthog']).toMatch(caretDep);

    expect(packageJson.devDependencies['@types/jest']).toMatch(caretDep);
    expect(packageJson.devDependencies['dotenvi']).toMatch(caretDep);
    expect(packageJson.devDependencies['jest']).toMatch(caretDep);
    expect(packageJson.devDependencies['ts-jest']).toMatch(caretDep);
    expect(packageJson.devDependencies['ts-node']).toMatch(caretDep);
    expect(packageJson.devDependencies['typescript']).toMatch(caretDep);

    filesystem.remove(tmpFolder);
    done();
  });
});

async function allowError(promise: Promise<unknown>, msg: string) {
  try {
    await promise;
  } catch (error) {
    console.log(`Allowing error [${msg}]`, error.message);
  }
}
