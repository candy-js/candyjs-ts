/**
 * @author
 * @license MIT
 */
import * as http from 'http';

import Hook from'./core/Hook';

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
     * constructor
     *
     * @param {any} application 应用实例
     */
    constructor(application) {
        this.server = null;
        this.app = application;
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
