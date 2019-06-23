import * as cosmiconfig from 'cosmiconfig';
import { getBaseConfig } from '../src';

export async function getConfig() {
  const explorer = cosmiconfig('warthog');
  const config = await explorer.search();
  const baseConfig = getBaseConfig();

  return {
    ...config,
    ...baseConfig
  };
}
