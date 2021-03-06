/**
 * @author afu
 * @license MIT
 */
import Candy = require('../Candy');
import Event = require('./Event');
import InvalidConfigException = require('./InvalidConfigException');

/**
 * 应用基类
 */
abstract class Application extends Event {

    /**
     * @property {String} encoding 编码
     */
    public encoding: string;

    /**
     * @property {Boolean} debug 调试
     */
    public debug: boolean;

    /**
     * @property {String} exceptionHandler 异常处理类
     */
    public exceptionHandler: string;

    /**
     * constructor
     *
     * @param {any} config 配置信息
     */
    constructor(config: any) {
        super();

        this.encoding = 'UTF-8';
        this.debug = false;
        this.exceptionHandler = 'candy/web/ExceptionHandler';

        Candy.app = this;
        this.init(config);
    }

    /**
     * 初始化应用
     *
     * @param {any} config 应用配置
     * @throws {InvalidConfigException} 当丢失必要配置项目时
     */
    public init(config: any): void {
        if(undefined === config.id) {
            throw new InvalidConfigException('The "id" configuration is required');
        }

        if(undefined !== config.appPath) {
            this.setAppPath(config.appPath);
            delete config.appPath;

        }

        if(undefined !== config.runtimePath) {
            this.setRuntimePath(config.runtimePath);
            delete config.runtimePath;

        } else {
            // set "app/runtime"
            this.setRuntimePath( this.getAppPath() + '/runtime');
        }

        if(undefined !== config.rootPath) {
            this.setRootPath(config.rootPath);
            delete config.rootPath;

        } else {
            this.setRootPath(process.env.PWD);
        }
    }

    /**
     * 设置应用路径
     *
     * @param {String} path 应用路径
     */
    public setAppPath(path: string): void {
        Candy.setPathAlias('@app', path);
    }

    /**
     * 得到应用目录
     *
     * @return {String} 路径
     */
    public getAppPath(): string {
        return Candy.getPathAlias('@app');
    }

    /**
     * 设置 runtime 路径
     *
     * @param {String} path 路径
     */
    public setRuntimePath(path: string): void {
        Candy.setPathAlias('@runtime', path);
    }

    /**
     * 得到 runtime 目录
     *
     * @return {String} 路径
     */
    public getRuntimePath(): string {
        return Candy.getPathAlias('@runtime');
    }

    /**
     * 设置 root 路径
     *
     * @param {String} path 路径
     */
    public setRootPath(path: string): void {
        Candy.setPathAlias('@root', path);
    }

    /**
     * 得到 root 目录
     *
     * @return {String} 路径
     */
    public getRootPath(): string {
        return Candy.getPathAlias('@root');
    }

    /**
     * handler request
     *
     * @param {Object} request
     * @param {Object} response
     */
    public abstract requestListener(request: any, response: any);

    /**
     * 异常处理
     *
     * @param {Object} response 输出类
     * @param {Exception} exception 异常类
     */
    public abstract handlerException(response: any, exception: Error);

}

export = Application;
