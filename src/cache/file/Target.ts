/**
 * @author
 * @license MIT
 */
import * as fs from 'fs';

import Candy from '../../Candy';
import FileHelper from '../../helpers/FileHelper';
import CacheException from '../../core/CacheException';
import ImplTarget from '../ImplTarget';

/**
 * 文件缓存
 *
 * ```
 * 'cache': {
 *      'file': {
 *          'classPath': 'candy/cache/file/Target',
 *          'cachePath': '...'
 *      }
 * }
 * ```
 *
 */
export default class Target extends ImplTarget {

     /**
     * @property {String} fileExtension 缓存文件后缀
     */
    public fileExtension: string;

    /**
     * @property {String} cachePath 缓存目录
     */
    public cachePath: string;

    /**
     * constructor
     *
     * @param {any} config
     */
    constructor(config) {
        super();

        this.fileExtension = undefined === config.fileExtension
            ? '.bin'
            : config.fileExtension;

        this.cachePath = undefined === config.cachePath
            ? Candy.getPathAlias('@runtime/caches')
            : config.cachePath;
    }

    getCacheFile(key): string {
        return this.cachePath + '/' + key + this.fileExtension;
    }

    /**
     * @inheritdoc
     */
    public setSync(key: string, value: string, duration: number = 31536000000/* one year */): void {
        let cacheFile = this.getCacheFile(key);

        let life = (Date.now() + duration) / 1000;

        // 目录不存在就创建
        if(!fs.existsSync(this.cachePath)) {
            FileHelper.createDirectorySync(this.cachePath);
        }

        fs.writeFileSync(cacheFile, value, Candy.app.encoding);

        fs.utimesSync(cacheFile, life, life);
    }

    /**
     * @inheritdoc
     */
    public set(key: string, value: string, duration: number = 31536000000/* one year */, callback: any = null): void {
        let cacheFile = this.getCacheFile(key);

        let life = (Date.now() + duration) / 1000;

        // 检查目录
        fs.access(this.cachePath, fs.constants.R_OK | fs.constants.W_OK, (err) => {
            if(null === err) {
                fs.writeFile(cacheFile, value, Candy.app.encoding, (err) => {
                    if(null !== err) {
                        callback(err);
                        return;
                    }

                    fs.utimes(cacheFile, life, life, callback);
                });

                return;
            }

            FileHelper.createDirectory(this.cachePath, 0o777, (err) => {
                fs.writeFile(cacheFile, value, Candy.app.encoding, (err) => {
                    if(null !== err) {
                        callback(err);
                        return;
                    }

                    fs.utimes(cacheFile, life, life, callback);
                });
            });
        });
    }

    /**
     * @inheritdoc
     */
    public getSync(key: string): any {
        let ret = null;
        let cacheFile = this.getCacheFile(key);

        if(fs.existsSync(cacheFile) && fs.statSync(cacheFile).mtime.getTime() > Date.now()) {
            ret = fs.readFileSync(cacheFile, Candy.app.encoding);
        }

        return ret;
    }

    /**
     * @inheritdoc
     */
    public get(key: string, callback: any): any {
        let cacheFile = this.getCacheFile(key);

        fs.stat(cacheFile, (err, stats) => {
            if(null !== err) {
                callback(err, null);
                return;
            }

            if(stats.mtime.getTime() < Date.now()) {
                callback(new CacheException('The cache: '+ key +' has expired'), null);
                return;
            }

            fs.readFile(cacheFile, Candy.app.encoding, callback);
        });
    }

    /**
     * @inheritdoc
     */
    public deleteSync(key: string): void {
        let cacheFile = this.getCacheFile(key);

        fs.unlinkSync(cacheFile);
    }

    /**
     * @inheritdoc
     */
    public delete(key: string, callback: any): void {
        let cacheFile = this.getCacheFile(key);

        fs.unlink(cacheFile, callback);
    }

}

module.exports = Target;
