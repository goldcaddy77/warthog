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
    const output = await cli('generate --name FeatureFlag --folder generated');
    let fileContents;

    expect(output).toContain('Generated file at generated/feature-flag.model.ts');
    fileContents = filesystem.read('generated/feature-flag.model.ts');
    expect(fileContents).toContain('export class FeatureFlag');

    expect(output).toContain('Generated file at generated/feature-flag.service.ts');
    fileContents = filesystem.read('generated/feature-flag.service.ts');
    expect(fileContents).toContain("@Service('FeatureFlagService')");

    expect(output).toContain('Generated file at generated/feature-flag.resolver.ts');
    fileContents = filesystem.read('generated/feature-flag.resolver.ts');
    expect(fileContents).toContain('this.service.find<FeatureFlagWhereInput>');

    // cleanup artifact
    filesystem.remove('generated');
    done();
  });
});
