/**
 * @author afu
 * @license MIT
 */

 /**
  * 缓存接口
  */
interface ITarget {

    /**
     * 同步写入缓存
     *
     * @param {String} key 缓存键
     * @param {String} value 缓存值
     * @param {Number} duration 缓存时间 毫秒
     */
    setSync(key: string, value: string, duration: number): void;

    /**
     * 写入缓存
     *
     * @param {String} key 缓存键
     * @param {String} value 缓存值
     * @param {Number} duration 缓存时间 毫秒
     * @param {Function} callback 回调
     */
    set(key: string, value: string, duration: number, callback: any): void;

    /**
     * 同步读取缓存
     *
     * @param {String} key 缓存键
     */
    getSync(key: string): any;

    /**
     * 读取缓存
     *
     * @param {String} key 缓存键
     * @param {Function} callback 回调
     */
    get(key: string, callback: any): any;

    /**
     * 同步删除缓存
     *
     * @param {String} key 缓存键
     */
    deleteSync(key: string): void;

    /**
     * 删除缓存
     *
     * @param {String} key 缓存键
     * @param {Function} callback 回调
     */
    delete(key: string, callback: any): void;

}

export = ITarget;
