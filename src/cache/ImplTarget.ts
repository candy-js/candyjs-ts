/**
 * @author afu
 * @license MIT
 */
import ITarget = require('./ITarget');

/**
 * 缓存基类
 */
abstract class ImplTarget implements ITarget {

    /**
     * 进行初始化
     */
    public init() {}

    /**
     * @inheritdoc
     */
    public abstract setSync(key: string, value: string, duration: number): void;

    /**
     * @inheritdoc
     */
    public abstract set(key: string, value: string, duration: number, callback: any): void;

    /**
     * @inheritdoc
     */
    public abstract getSync(key: string): any;

    /**
     * @inheritdoc
     */
    public abstract get(key: string, callback: any): void;

    /**
     * @inheritdoc
     */
    public abstract deleteSync(key: string): void;

    /**
     * @inheritdoc
     */
    public abstract delete(key: string, callback: any): void;

}

export = ImplTarget;
