/**
 * @author
 * @license MIT
 */
import * as http from 'http';
import * as url from 'url';
import * as querystring from 'querystring';

import Cookie from './Cookie';
import CoreRequest from '../core/Request';

/**
 * 请求
 */
export default class Request extends CoreRequest {

    /**
     * constructor
     */
    constructor(request: http.ServerRequest) {
        super(request);
    }

    /**
     * 解析 request url
     *
     * @param {http.ServerRequest} request 请求对象
     * @return {any}
     */
    public static parseUrl(request: http.ServerRequest): any {
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
     * @return {String}
     */
    public static getClientIp(request: http.ServerRequest): string {
        let forward = request.headers['x-forwarded-for'];
        if(undefined !== forward) {
            return (<string>forward).substring(0, forward.indexOf(','));
        }

        return request.connection.remoteAddress;
    }

    /**
     * 静态方法 获取 get 参数
     *
     * @param {Object} request 请求对象
     * @param {String} param 参数名
     * @return {any}
     */
    public static getQueryString(request: http.ServerRequest, param: string): any {
        let parsed = Request.parseUrl(request);

        // 查找参数
        if(null !== parsed.query &&
            (0 === parsed.query.indexOf(param) ||
                parsed.query.indexOf('&' + param) > 0)) {

            return querystring.parse(parsed.query)[param];
        }

        if(null !== parsed.additionalQuery) {
            return parsed.additionalQuery[param];
        }

        return null;
    }

    /**
     * 静态方法 获取 post 参数
     *
     * @param {http.ServerRequest} request 请求对象
     * @param {String} param 参数名
     * @return {any}
     */
    public static getParameter(request: http.ServerRequest, param: string): any {
        if(undefined === request['body']) {
            return null;
        }

        return request['body'][param];
    }

    /**
     * 获取 cookie
     *
     * @param {http.ServerRequest} request 请求对象
     * @param {String} name cookie name
     * @see Cookie.getCookie
     */
    public static getCookie(request: http.ServerRequest, name: string): string {
        return Cookie.getCookie(request, name);
    }

    /**
     * 获取 get 参数
     *
     * @param {String} param 参数名
     * @return {any}
     */
    public getQueryString(param: string): any {
        var parsed = Request.parseUrl(this.request);

        // 查找参数
        if(null !== parsed.query &&
            (0 === parsed.query.indexOf(param) ||
                parsed.query.indexOf('&' + param) > 0)) {

            return querystring.parse(parsed.query)[param];
        }

        if(null !== parsed.additionalQuery) {
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
    public setQueryString(param: string, value: string): void {
        if(undefined === this.request['additionalQuery']) {
            this.request['additionalQuery'] = {};
        }

        this.request['additionalQuery'][param] = value;
    }

    /**
     * 获取 post 参数
     *
     * @param {String} param 参数名
     * @return {String | null | undefined}
     */
    public getParameter(param: string): any {
        if(undefined === this.request['body']) {
            return null;
        }

        return this.request['body'][param];
    }

    /**
     * 获取 cookie
     *
     * @param {String} name cookie name
     * @see Cookie.getCookie
     */
    public getCookie(name: string): string {
        return Cookie.getCookie(this.request, name);
    }

    /**
     * 获取引用网址
     *
     * @return {String | null}
     */
    public getReferer(request: http.ServerRequest): any {
        if(undefined !== this.request.headers.referer) {
            return this.request.headers.referer;
        }

        return null;
    }

    /**
     * 获取 URI 协议和主机部分
     *
     * @return {String}
     */
    public getHostInfo(): string {
        let protocol = undefined !== this.request.socket['encrypted']
            || 'https' === this.request.headers['x-forwarded-protocol']
                ? 'https'
                : 'http';

        let host = protocol + '://' + this.request.headers.host;

        return host;
    }

    /**
     * 获取当前网址 不包含锚点部分
     *
     * @return {String}
     */
    public getCurrent(): string {
        return this.getHostInfo() + this.request.url;
    }

}
