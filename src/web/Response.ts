/**
 * @author
 * @license MIT
 */
import * as http from 'http';

import Candy = require('../Candy');
import CoreResponse = require('../core/Response');
import Cookie = require('./Cookie');
import HttpException = require('../core/HttpException');

/**
 * HTTP response
 *
 * 使用 response 输出内容
 *
 * var response = new Response(res);
 * response.setContent('some data from server');
 * response.send();
 *
 * 使用 response 重定向
 *
 * response.redirect('http://foo.com');
 *
 */
class Response extends CoreResponse {

    /**
     * @var Object list of HTTP status codes and the corresponding texts
     */
    public static httpStatuses = {
        // Informational
        '100': 'Continue',
        '101': 'Switching Protocols',
        '102': 'Processing',
        '118': 'Connection timed out',

        // Success
        '200': 'OK',
        '201': 'Created',
        '202': 'Accepted',
        '203': 'Non-Authoritative',
        '204': 'No Content',
        '205': 'Reset Content',
        '206': 'Partial Content',
        '207': 'Multi-Status',
        '208': 'Already Reported',
        '210': 'Content Different',
        '226': 'IM Used',

        // Redirection
        '300': 'Multiple Choices',
        '301': 'Moved Permanently',
        '302': 'Found',
        '303': 'See Other',
        '304': 'Not Modified',
        '305': 'Use Proxy',
        '306': 'Reserved',
        '307': 'Temporary Redirect',
        '308': 'Permanent Redirect',
        '310': 'Too many Redirect',

        // Client error
        '400': 'Bad Request',
        '401': 'Unauthorized',
        '402': 'Payment Required',
        '403': 'Forbidden',
        '404': 'Not Found',
        '405': 'Method Not Allowed',
        '406': 'Not Acceptable',
        '407': 'Proxy Authentication Required',
        '408': 'Request Time-out',
        '409': 'Conflict',
        '410': 'Gone',
        '411': 'Length Required',
        '412': 'Precondition Failed',
        '413': 'Request Entity Too Large',
        '414': 'Request-URI Too Long',
        '415': 'Unsupported Media Type',
        '416': 'Requested range unsatisfiable',
        '417': 'Expectation failed',
        '418': 'I\'m a teapot',
        '422': 'Unprocessable entity',
        '423': 'Locked',
        '424': 'Method failure',
        '425': 'Unordered Collection',
        '426': 'Upgrade Required',
        '428': 'Precondition Required',
        '429': 'Too Many Requests',
        '431': 'Request Header Fields Too Large',
        '449': 'Retry With',
        '450': 'Blocked by Windows Parental Controls',

        // Server error
        '500': 'Internal Server Error',
        '501': 'Not Implemented',
        '502': 'Bad Gateway or Proxy Error',
        '503': 'Service Unavailable',
        '504': 'Gateway Time-out',
        '505': 'HTTP Version not supported',
        '507': 'Insufficient storage',
        '508': 'Loop Detected',
        '509': 'Bandwidth Limit Exceeded',
        '510': 'Not Extended',
        '511': 'Network Authentication Required'
    };

    /**
     * @property {String} encoding 编码
     */
    public encoding: string;

    /**
     * @property {String} version HTTP protocol version
     */
    public version: string;

    /**
     * @property {Number} statusCode the HTTP status code
     */
    public statusCode: number;

    /**
     * @property {String} statusText the HTTP status description that comes together with the status code.
     */
    public statusText: string;

    /**
     * @property {Object} headers HTTP headers
     */
    public headers: any;

    /**
     * @property {String | Buffer} content HTTP content
     */
    public content: string | Buffer;

    /**
     * @property {Array} cookies HTTP cookies
     */
    public cookies: string[];

    /**
     * constructor
     */
    constructor(response: http.ServerResponse) {
        super(response);

        this.encoding = Candy.app.encoding;
        //this.version = '1.1';
        this.statusCode = 200;
        this.statusText = 'OK';
        this.headers = {};
        this.content = '';
        this.cookies = [];
    }

    /**
     * 得到 http status code
     *
     * @return {Number}
     */
    public getStatusCode(): number {
        return this.statusCode;
    }

    /**
     * 设置 http status code
     *
     * @param {Number} value the status code
     * @param {String} text the status text
     * @return {Response}
     */
    public setStatusCode(value: number, text?: string): Response {
        if(value < 100 || value >= 600) {
            throw new HttpException('The HTTP status code is invalid');
        }

        this.statusCode = value;

        if(undefined === text) {
            this.statusText = undefined !== Response.httpStatuses[String(value)] ?
                Response.httpStatuses[String(value)] : '';

        } else {
            this.statusText = text;
        }

        return this;
    }

    /**
     * 获取 header
     *
     * @param {String} name header name
     * @return {String | null}
     */
    public getHeader(name: string): string | null {
        if(undefined !== this.headers[name]) {
            return this.headers[name];
        }

        return null;
    }

    /**
     * 设置 header
     *
     * @param {String} name header name
     * @param {String} value of header
     * @return {Response}
     */
    public setHeader(name: string, value: string): Response {
        this.headers[name] = value;

        return this;
    }

    /**
     * 获取实体内容
     *
     * @return {String | Buffer}
     */
    public getContent(): string | Buffer {
        return this.content;
    }

    /**
     * 设置实体内容
     *
     * @param {String | Buffer} content 实体内容
     * @return {Response}
     */
    public setContent(content: string | Buffer): Response {
        this.content = content;

        return this;
    }

    /**
     * 设置一条 cookie
     *
     * @param {String} name cookie name
     * @param {String} value cookie value
     * @param {Object} options other config
     * @return {Response}
     */
    public setCookie(name: string, value: string, options: any): Response {
        if(undefined === options) {
            options = {};
        }

        var cookie = new Cookie(name,
            encodeURIComponent(value),
            options['expires'],
            options['path'],
            options['domain'],
            options['secure'],
            options['httpOnly']);

        this.cookies.push(cookie.toString());

        return this;
    }

    /**
     * @inheritdoc
     */
    public send(content?: string): void {
        if(undefined !== content) {
            this.setContent(content);
        }

        this.sendHeaders();
        this.sendContent();

        this.response.end();
    }

    /**
     * 发送 header
     */
    public sendHeaders(): void {
        if((this.response).headersSent) {
            return;
        }

        for(let name in this.headers) {
            this.response.setHeader(name, this.headers[name]);
        }

        if(this.cookies.length > 0) {
            Cookie.setCookie(<http.ServerResponse>this.response, this.cookies);
        }

        this.response.writeHead(this.statusCode, this.statusText);
    }

    /**
     * 发送内容
     */
    public sendContent(): void {
        this.response.write(this.content, this.encoding);
    }

    /**
     * 重定向
     *
     * @param {String} url
     * @param {Number} statusCode
     */
    public redirect(url: string, statusCode: number = 302): void {
        this.setHeader('Location', url);

        this.setStatusCode(statusCode);

        this.send();
    }

}

export = Response;
