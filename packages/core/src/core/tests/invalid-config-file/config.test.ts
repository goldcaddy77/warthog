import { Config } from '../../config';

describe('Config (invalid file)', () => {
  test('does not allow invalid config keys', async done => {
    expect.assertions(2);
    try {
      new Config({ configSearchPath: __dirname });
    } catch (error) {
      expect(error.message).toContain('invalid keys');
      expect(error.message).toContain('badkey1');
    }

    done();
  });
});
