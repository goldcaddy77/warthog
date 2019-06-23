import { system, filesystem } from 'gluegun';

const root = filesystem.path(__dirname, '../../');

const cli = async (cmd: string) =>
  system.run('node ' + filesystem.path(root, 'bin', 'warthog') + ` ${cmd}`);

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
    const output = await cli('generate --name FeatureFlag');
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
