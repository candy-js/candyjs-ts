/**
 * @author afu
 * @license MIT
 */
import Candy = require('../Candy');
import InvalidConfigException = require('../core/InvalidConfigException');

/**
 * 缓存
 */
class Cache {

    /**
     * @var {Map<String, any>} _caches
     */
    public static _caches: any = {};

    /**
     * 获取 cache 实例
     *
     * @param {String} cacheFlag
     */
    public static getCache(cacheFlag: string = ''): any {
        if('' === cacheFlag) {
            throw new InvalidConfigException('Invalid parameter: cacheFlag');
        }
        if(undefined === Candy.app.cache || undefined === Candy.app.cache[cacheFlag]) {
            throw new InvalidConfigException('No cache config found');
        }
        if(undefined === Candy.app.cache[cacheFlag].classPath) {
            throw new InvalidConfigException('The cache config lost key: classPath');
        }

        if(undefined === Cache._caches[cacheFlag] || null === Cache._caches[cacheFlag]) {
            Cache._caches[cacheFlag] = Candy.createObjectAsString(
                Candy.app.cache[cacheFlag].classPath,
                Candy.app.cache[cacheFlag]);

            Cache._caches[cacheFlag].init();
        }

        return Cache._caches[cacheFlag];
    }

}

export = Cache;
