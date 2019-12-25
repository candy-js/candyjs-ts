/**
 * @author
 * @license MIT
 */
import Candy from '../Candy';
import InvalidConfigException from './InvalidConfigException';

/**
 * RESTful 基类
 */
export default abstract class RestApplication {

    /**
     * @property {Boolean} debug 调试
     */
    public debug: boolean;

    /**
     * @property {String} exceptionHandler 异常处理类
     */
    public exceptionHandler: string;

    constructor(config) {
        this.debug = false;
        this.exceptionHandler = '';

        Candy.rest = this;
        this.init(config);
        Candy.config(this, config);
    }

    /**
     * 初始化应用
     *
     * @param {Object} config 应用配置
     * @throws {InvalidConfigException} 当丢失必要配置项目时
     */
    public init(config) {
        if(undefined === config.appPath) {
            throw new InvalidConfigException('The "appPath" configuration is required');
        }

        this.setAppPath(config.appPath);
        delete config.appPath;
    }

    /**
     * 设置应用路径
     *
     * @param {String} path 应用路径
     */
    public setAppPath(path): void {
        Candy.setPathAlias('@app', path);
    }

    /**
     * handler request
     *
     * @param {Object} request
     * @param {Object} response
     */
    public abstract requestListener(request, response);

    /**
     * 异常处理
     *
     * @param {Object} response 输出类
     * @param {Exception} exception 异常类
     */
    public abstract handlerException(response, exception);

}
