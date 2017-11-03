"use strict";
const url = require("url");
const querystring = require("querystring");
const Cookie_1 = require("./Cookie");
const Request_1 = require("../core/Request");
/**
 * 请求
 */
class Request extends Request_1.default {
    /**
     * constructor
     */
    constructor(request) {
        super(request);
    }
    /**
     * 解析 request url
     *
     * @param {http.ServerRequest} request 请求对象
     */
    static parseUrl(request) {
        let obj = url.parse(request.url);
        return {
            protocol: obj.protocol,
            host: obj.host,
            hash: obj.hash,
            query: obj.query,
            additionalQuery: undefined === request['additionalQuery'] ? null : request['additionalQuery'],
            pathname: obj.pathname
        };
    }
    /**
     * 获取客户端 ip
     *
     * @param {http.ServerRequest} request 请求对象
     */
    static getClientIp(request) {
        let forward = request.headers['x-forwarded-for'];
        if (undefined !== forward) {
            return forward.substring(0, forward.indexOf(','));
        }
        return request.connection.remoteAddress;
    }
    /**
     * 静态方法 获取 get 参数
     *
     * @param {Object} request 请求对象
     * @param {String} param 参数名
     * @return {String | null | ''}
     */
    static getQueryString(request, param) {
        let parsed = Request.parseUrl(request);
        // 查找参数
        if (null !== parsed.query &&
            (0 === parsed.query.indexOf(param) ||
                parsed.query.indexOf('&' + param) > 0)) {
            return querystring.parse(parsed.query)[param];
        }
        if (null !== parsed.additionalQuery) {
            return parsed.additionalQuery[param];
        }
        return null;
    }
    /**
     * 静态方法 获取 post 参数
     *
     * @param {http.ServerRequest} request 请求对象
     * @param {String} param 参数名
     * @return {String | null | undefined | ''}
     */
    static getParameter(request, param) {
        if (undefined === request['body']) {
            return null;
        }
        return request['body'][param];
    }
    /**
     *
     * @param {http.ServerRequest} request 请求对象
     * @param {String} name cookie name
     */
    static getCookie(request, name) {
        return Cookie_1.default.getCookie(request, name);
    }
    /**
     * 获取 get 参数
     *
     * @param {String} param 参数名
     * @return {String | null | ''}
     */
    getQueryString(param) {
        var parsed = Request.parseUrl(this.request);
        // 查找参数
        if (null !== parsed.query &&
            (0 === parsed.query.indexOf(param) ||
                parsed.query.indexOf('&' + param) > 0)) {
            return querystring.parse(parsed.query)[param];
        }
        if (null !== parsed.additionalQuery) {
            return parsed.additionalQuery[param];
        }
        return null;
    }
    /**
     * 设置 get 参数
     *
     * @param {String} param 参数名
     * @param {String} value 参数值
     */
    setQueryString(param, value) {
        if (undefined === this.request['additionalQuery']) {
            this.request['additionalQuery'] = {};
        }
        this.request['additionalQuery'][param] = value;
    }
    /**
     * 获取 post 参数
     *
     * @param {String} param 参数名
     * @return {String | null | undefined | ''}
     */
    getParameter(param) {
        if (undefined === this.request['body']) {
            return null;
        }
        return this.request['body'][param];
    }
    /**
     * 获取 cookie
     *
     * @param {String} name cookie name
     */
    getCookie(name) {
        return Cookie_1.default.getCookie(this.request, name);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Request;
//# sourceMappingURL=Request.js.map