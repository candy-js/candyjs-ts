/**
 * @author
 * @license MIT
 */
import * as http from 'http';

import Hook from'./core/Hook';
import Logger from './log/Logger';

/**
 * 入口
 */
export default class CandyJs {

    /**
     * @property {http.Serve} server 配置信息
     */
    public server: http.Server;

    /**
     * @property {any} app 应用实例
     */
    public app: any;

    /**
     * @property {Logger} _logger 日志对象
     */
    private static _logger: Logger;

    /**
     * constructor
     *
     * @param {any} application 应用实例
     */
    constructor(application) {
        this.server = null;
        this.app = application;
    }

    /**
     * 后去日志对象
     */
    public static getLogger() {
        if(null === CandyJs._logger) {
            CandyJs._logger = Logger.getLogger();
        }

        return CandyJs._logger;
    }

    /**
     * 设置日志对象
     *
     * @param {any} logger 日志对象
     */
    static setLogger(logger: any) {
        CandyJs._logger = logger;
    }

    // web
    public requestListener(req: http.ServerRequest, res: http.ServerResponse) {
        try {
            this.app.requestListener(req, res);

        } catch(e) {
            this.app.handlerException(res, e);
        }
    }

    // handler
    public handler(req: http.ServerRequest, res: http.ServerResponse) {
        Hook.getInstance().trigger(req, res, () => {
            this.requestListener(req, res);
        });
    }

    /**
     * 获取 http server
     *
     * @return http server
     */
    public getServer(): http.Server {
        return http.createServer(this.handler.bind(this));
    }

    /**
     * listen
     *
     * @param {Number} port
     * @param {Function} callback
     *
     * If you want to create HTTPS server you can do so as shown here
     *
     * var https = require('https');
     * var CandyJs = require('candyjs');
     * var app = new CandyJs({ ... });
     * https.createServer({ ... }, app.handler.bind(app)).listen(443);
     *
     */
    public listen(port: number, callback?: any) {
        this.server = this.getServer();
        this.server.listen(port, callback);
    }

}
