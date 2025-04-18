import { CacheKey } from '@common/constants/cache.constant';
import * as util from 'node:util';

export const CreateCacheKey = (key: CacheKey, ...args: string[]): string => {
  return util.format(key, ...args);
};
