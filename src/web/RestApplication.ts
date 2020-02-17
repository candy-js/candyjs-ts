/**
 * @author
 * @license MIT
 */
import * as http from 'http';

import Candy from '../Candy';
import Router from '../core/Router';
import CoreApp from '../core/Application';
import StringHelper from '../helpers/StringHelper';
import InvalidCallException from '../core/InvalidCallException';
import Request from './Request';

export default class RestApplication extends CoreApp {

    /**
     * @property {String} separator class and method separate
     */
    public static separator: string = '@';

    /**
     * @property {String} defaultExceptionHandler 异常处理
     */
    public defaultExceptionHandler: string;

    /**
     * @property {Object} methods 请求方法
     *
     * each method has the follow structure
     *
     * [ {pattern: pattern, handler: handler} ... ]
     *
     */
    public methods: any;

    /**
     * @property {Object} config 配置信息
     */
    public config: any;

    /**
     * @property {http.Serve} server 配置信息
     */
    public server: http.Server;

    constructor(config) {
        super(config);

        this.methods = {
            GET: [],
            POST: [],
            PUT: [],
            DELETE: [],
            PATCH: [],
            HEAD: [],
            OPTIONS: []
        };

        Candy.config(this, config);
    }

    /**
     * 请求处理
     *
     * @param {Object} request
     * @param {Object} response
     */
    public requestListener(request, response) {
        var route = Request.parseUrl(request).pathname;

        // {paramValues, handler}
        var ret = this.resolveRoutesCombine(route, request.method);

        if(null === ret) {
            throw new InvalidCallException('The REST route: ' + route + ' not found');
        }

        var args = null === ret.paramValues ? [null] : ret.paramValues;

        // handler is function
        if('function' === typeof ret.handler) {
            ret.handler(request, response, ...args);

            return;
        }

        // handler is string
        var pos = ret.handler.indexOf(RestApplication.separator);
        var obj = null;
        if(-1 === pos) {
            obj = Candy.createObject(ret.handler);
            obj.index(request, response, ...args);

        } else {
            obj = Candy.createObject( ret.handler.substring(0, pos) );
            obj[ ret.handler.substring(pos + 1) ](
                request,
                response,
                ...args);
        }
    }

    /**
     * 合并解析路由
     *
     * @param {String} route 路由
     * @param {String} httpMethod 请求方法
     * @return {Object | null}
     */
    public resolveRoutesCombine(route, httpMethod): any {
        var ret = null;

        // [ {pattern, handler} ... ]
        var handlers = this.methods[httpMethod];
        var tmp = {};
        for(let i=0,len=handlers.length; i<len; i++) {
            tmp[handlers[i].pattern] = handlers[i].handler;
        }
        // {pattern, params, handler}
        var combinedRoute = this.combineRoutes(tmp);

        var matches = route.match( new RegExp('(?:' + combinedRoute.pattern + ')$') );

        // 路由成功匹配
        if(null !== matches) {
            ret = {};

            var subPatternPosition = -1;
            // matches: [ 'xyz/other', undefined, undefined, undefined, 'xyz/other']
            for(let i=1,len=matches.length; i<len; i++) {
                if(undefined !== matches[i]) {
                    subPatternPosition = i;
                    break;
                }
            }

            var matchedRouteSegment = this.getMatchedSegmentBySubPatternPosition(
                combinedRoute, subPatternPosition);

            ret.handler = combinedRoute.handler[matchedRouteSegment];
            ret.paramValues = null;

            // 有参数
            if(null !== combinedRoute.params[matchedRouteSegment]) {
                // ret.paramValues = new Array(combinedRoute.params[matchedRouteSegment].length);
                ret.paramValues = [];
                for(let i=0,len=combinedRoute.params[matchedRouteSegment].length; i<len; i++) {
                    // ret.paramValues[i] = matches[subPatternPosition + i + 1];
                    ret.paramValues.push( matches[subPatternPosition + i + 1] );
                }
            }
        }

        return ret;
    }

    /**
     * 合并路由
     *
     * @param {Object} routes
     *
     * { pattern: any ... }
     *
     * @return {Object}
     *
     * eg.
     *
     * {
     *   pattern: '(abc\\/(\\d+))|(abc)|(xyz\\/other)',
     *   params: [ [ 'id' ], null, null ],
     *   handler: any
     * }
     *
     */
    public combineRoutes(routes): any {
        var ret: any = {};
        var patternArray = [];
        var paramArray = [];
        var handler = [];  // 路由配置

        var parsedRoute = null;
        for(let reg in routes) {
            parsedRoute = Router.parse(reg);

            // 为每个模式添加一个括号 用于定位匹配到的是哪一个模式
            patternArray.push( '(' + parsedRoute.pattern + ')' );
            paramArray.push(parsedRoute.params);
            handler.push(routes[reg]);
        }

        ret.pattern = patternArray.join('|');
        ret.params = paramArray;
        ret.handler = handler;

        return ret;
    }

    /**
     * 查找匹配的路由的位置
     *
     * @param {Object} combinedRoute 合并的路由
     * @param {Number} subPatternPosition 匹配的子模式位置
     * @return {Number}
     */
    public getMatchedSegmentBySubPatternPosition(combinedRoute, subPatternPosition): number {
        // '(' 在 pattern 中第 subPatternPosition 次出现的位置
        // 用于确定当前路由匹配的是第几部分
        var segment = StringHelper.nIndexOf(combinedRoute.pattern, '(', subPatternPosition);
        var tmpLine = combinedRoute.pattern.substring(0, segment).match(/\|/g);
        // 没有匹配到竖线 说明匹配的是第一部分
        segment = null === tmpLine ? 0 : tmpLine.length;

        return segment;
    }

    /**
     * Adds a route to the collection
     *
     * @param {String | Array} httpMethod
     * @param {String} pattern
     * @param {Function | String} handler
     */
    public addRoute(httpMethod, pattern, handler): void {
        if('string' === typeof httpMethod) {
            this.methods[httpMethod].push( {pattern: pattern, handler: handler} );

            return;
        }

        for(let i=0,len=httpMethod.length; i<len; i++) {
            this.methods[httpMethod[i]].push( {pattern: pattern, handler: handler} );
        }
    }

    /**
     * @inheritdoc
     */
    public handlerException(response, exception) {
        let handler = Candy.createObject(this.exceptionHandler);

        handler.handlerException(response, exception);
    }

    /**
     * get
     */
    get(pattern, handler) {
        this.addRoute('GET', pattern, handler);
    }

    /**
     * post
     */
    post(pattern, handler) {
        this.addRoute('POST', pattern, handler);
    }

    /**
     * put
     */
    put(pattern, handler) {
        this.addRoute('PUT', pattern, handler);
    }

    /**
     * delete
     */
    delete(pattern, handler) {
        this.addRoute('DELETE', pattern, handler);
    }

    /**
     * patch
     */
    patch(pattern, handler) {
        this.addRoute('PATCH', pattern, handler);
    }

    /**
     * head
     */
    head(pattern, handler) {
        this.addRoute('HEAD', pattern, handler);
    }

    /**
     * options
     */
    options(pattern, handler) {
        this.addRoute('OPTIONS', pattern, handler);
    }

}
