/**
 * @author
 * @license MIT
 */
import * as http from 'http';

import Hook from './core/Hook';
import Rest from './web/Rest';
import InvalidConfigException from './core/InvalidConfigException';

export default class Restful {

    /**
     * @property {Object} config 配置信息
     */
    public config: any;

    /**
     * @property {http.Serve} server 配置信息
     */
    public server: http.Server;

    /**
     * @property {Rest} server 配置信息
     */
    public rest: Rest;

    /**
     * constructor
     *
     * @param {Object} config 配置信息
     */
    constructor(config) {
        if(undefined === config) {
            throw new InvalidConfigException('The rest config is required');
        }

        this.config = config;
        this.server = null;
        this.rest = new Rest(config);
    }

    // web
    public requestListener(req, res): void {
        try {
            this.rest.requestListener(req, res);

        } catch(e) {
            this.rest.handlerException(res, e);
        }
    }

    // handler
    public handler(req, res): void {
        Hook.getInstance().trigger(req, res, () => {
            this.requestListener(req, res);
        });
    }

    /**
     * get
     */
    public get(pattern, handler): void {
        this.rest.addRoute('GET', pattern, handler);
    }

    /**
     * post
     */
    public post(pattern, handler): void {
        this.rest.addRoute('POST', pattern, handler);
    }

    /**
     * put
     */
    public put(pattern, handler): void {
        this.rest.addRoute('PUT', pattern, handler);
    }

    /**
     * delete
     */
    public delete(pattern, handler): void {
        this.rest.addRoute('DELETE', pattern, handler);
    }

    /**
     * patch
     */
    public patch(pattern, handler): void {
        this.rest.addRoute('PATCH', pattern, handler);
    }

    /**
     * head
     */
    public head(pattern, handler): void {
        this.rest.addRoute('HEAD', pattern, handler);
    }

    /**
     * options
     */
    public options(pattern, handler): void {
        this.rest.addRoute('OPTIONS', pattern, handler);
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
     */
    public listen(port, callback): void {
        this.server = this.getServer();
        this.server.listen(port, callback);
    }

}
