import * as dotenv from 'dotenv';
import { system, filesystem } from 'gluegun';
import * as path from 'path';

const root = filesystem.path(__dirname, '../../');

const cli = async (cmd: string) => {
  // Construct the environment variables here so that they're passed into cli command
  const config = dotenv.config({ path: path.join(__dirname, './.env.test') });

  const env = {
    ...process.env,
    ...config.parsed
  };

  return system.run('node ' + filesystem.path(root, 'bin', 'warthog') + ` ${cmd}`, {
    env
  });
};

describe('Integration tests', () => {
  beforeEach(() => {
    jest.setTimeout(20000);
  });

  afterAll(() => {
    // cleanup artifact
    filesystem.remove('generated');
  });

  // TODO: re-enable
  test('outputs version', async done => {
    // TODO: should we bother with this since we don't update the version in package.json?
    const output = await cli('--version');
    expect(output).toContain('0.0.0-development');
    done();
  });

  test('outputs help', async done => {
    const output = await cli('--help');
    expect(output).toContain('generate (g)');
    done();
  });

  test('generates file', async done => {
    const output = await cli(
      'generate user name! nickname numLogins:int! verified:bool! registeredAt:date balance:float! --folder generated'
    );
    let fileContents;

    expect(output).toContain('Generated file at generated/user.model.ts');
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

    expect(output).toContain('Generated file at generated/user.service.ts');
    fileContents = filesystem.read('generated/user.service.ts');
    expect(fileContents).toContain("@Service('UserService')");

    expect(output).toContain('Generated file at generated/user.resolver.ts');
    fileContents = filesystem.read('generated/user.resolver.ts');
    expect(fileContents).toContain('this.service.find<UserWhereInput>');

    done();
  });

  test('generates file', async done => {
    const output = await cli('generate empty_class --folder generated');

    expect(output).toContain('Generated file at generated/empty-class.model.ts');
    const fileContents = filesystem.read('generated/empty-class.model.ts');

    expect(fileContents).toContain('export class EmptyClass extends BaseModel');
    expect(fileContents).toContain('@StringField({ nullable: true })');
    expect(fileContents).toContain('fieldName?: string;');

    done();
  });
});
