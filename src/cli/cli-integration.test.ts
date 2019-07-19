import * as dotenv from 'dotenv';
import { system, filesystem } from 'gluegun';
import * as path from 'path';

import { spyOnStdOut } from '../../test/helpers';

const root = filesystem.path(__dirname, '../../');

import { run } from './cli';

const warthogCLI = async (cmd: string) => {
  const oldArgv = process.argv;
  // Gluegun requires the command come in as the 3rd argument
  process.argv = ['/fake/path/to/node', '/fake/path/to/warthog', ...cmd.split(' ')];
  await run(process.argv);
  process.argv = oldArgv;
};

describe('Integration tests', () => {
  const spy = spyOnStdOut(); // Gives us access to whatever is written to stdout as part of the CLI command

  beforeEach(() => {
    jest.setTimeout(20000);
  });

  afterAll(() => {
    // cleanup artifact
    filesystem.remove('generated');
  });

  // TODO: should we bother with this since we don't update the version in package.json?
  test('spin up an actual process to test the full cli is wired up', async done => {
    // Construct the environment variables here so that they're passed into cli command
    const config = dotenv.config({ path: path.join(__dirname, './.env.test') });

    const env = {
      ...process.env,
      ...config.parsed
    };

    const output = await system.run(
      'node ' + filesystem.path(root, 'bin', 'warthog') + ' --version',
      {
        env
      }
    );

    expect(output).toContain('0.0.0-development');
    // Make sure it's not outputting the help command
    expect(output).not.toContain('help');
    done();
  });

  test('outputs help', async done => {
    await warthogCLI('--help');
    const stdout = spy.getStdOut();
    expect(stdout).toContain('generate (g)');
    done();
  });

  test('generates models', async done => {
    await warthogCLI(
      'generate user name! nickname numLogins:int! verified:bool! registeredAt:date balance:float! --folder generated'
    );
    const stdout = spy.getStdOut();

    let fileContents;

    expect(stdout).toContain('Generated file at generated/user.model.ts');
    fileContents = filesystem.read('generated/user.model.ts');
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

    expect(stdout).toContain('Generated file at generated/user.service.ts');
    fileContents = filesystem.read('generated/user.service.ts');
    expect(fileContents).toContain("@Service('UserService')");

    expect(stdout).toContain('Generated file at generated/user.resolver.ts');
    fileContents = filesystem.read('generated/user.resolver.ts');
    expect(fileContents).toContain('this.service.find<UserWhereInput>');

    done();
  });

  test('generates a shell of a file of no params specified', async done => {
    await warthogCLI('generate empty_class --folder generated');
    const stdout = spy.getStdOut();

    expect(stdout).toContain('Generated file at generated/empty-class.model.ts');
    const fileContents = filesystem.read('generated/empty-class.model.ts');

    expect(fileContents).toContain('export class EmptyClass extends BaseModel');
    expect(fileContents).toContain('@StringField({ nullable: true })');
    expect(fileContents).toContain('fieldName?: string;');

    done();
  });
});
