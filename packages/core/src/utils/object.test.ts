// eslint-disable @typescript-eslint/camelcase
import { ObjectUtil } from './object';

describe('ObjectUtil', () => {
  describe('prefixKeys', () => {
    test('prefixes correctly', async () => {
      const original = {
        One: 1,
        Two: 2
      };

      expect(ObjectUtil.prefixKeys(original, 'prefix')).toEqual({
        prefixOne: 1,
        prefixTwo: 2
      });
    });
  });

  describe('constantizeKeys', () => {
    test('constantizes correctly', async () => {
      const original = {
        fourFive: 45,
        oneTwoThree: 123
      };

      expect(ObjectUtil.constantizeKeys(original)).toEqual({
        FOUR_FIVE: 45,
        ONE_TWO_THREE: 123
      });
    });
  });
});

// eslint-enable @typescript-eslint/camelcase
