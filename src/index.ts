/**
 * @author
 * @license MIT
 */
import * as http from 'http';

import Candy from './Candy';
import Hook from'./core/Hook';
import CoreApp from './core/Application';
import WebApp from './web/Application';
import InvalidConfigException from './core/InvalidConfigException';

import AppConfig from './IAppConfig';

/**
 * 入口
 */
export default class CandyJs {

    /**
     * handler
     */
    public static Candy: Candy = Candy;

    /**
     * @property {AppConfig} config 配置信息
     */
    public config: AppConfig;

    /**
     * @property {http.Serve} server 配置信息
     */
    public server: http.Server;

    /**
     * @property {CoreApp} app 配置信息
     */
    public app: CoreApp;

    /**
     * constructor
     *
     * @param {AppConfig} config 配置信息
     */
    constructor(config: AppConfig) {
        if(undefined === config) {
            throw new InvalidConfigException('The app config is required');
        }

        this.config = config;
        this.server = null;
        this.app = new WebApp(config);
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
