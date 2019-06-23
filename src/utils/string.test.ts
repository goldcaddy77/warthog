import { StringUtil } from './string';

describe('StringUtil', () => {
  describe('toConstant', () => {
    it('converts string correctly', async () => {
      expect(StringUtil.constantize('myCoolString')).toEqual('MY_COOL_STRING');
    });

    it('handles consecutive caps correctly', async () => {
      expect(StringUtil.constantize('USDValue')).toEqual('USD_VALUE');
      expect(StringUtil.constantize('myUSDValue')).toEqual('MY_USD_VALUE');
    });
  });
});
