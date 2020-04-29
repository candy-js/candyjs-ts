/**
 * @author
 * @license MIT
 */
import * as http from 'http';

import Candy = require('../Candy');
import CandyJS = require('../index');
import CoreApp = require('../core/Application');
import StringHelper = require('../helpers/StringHelper');
import WebController = require('./Controller');
import Request = require('./Request');
import InvalidRouteException = require('../core/InvalidRouteException');

/**
 * web 应用
 */
class Application extends CoreApp {

    /**
     * @property {String | Object} interceptAll 拦截所有路由
     *
     * 'app/some/Class'
     *
     * or a Object config
     *
     * {
     *      'classPath': 'app/some/Class',
     *      'property': 'value'
     * }
     *
     */
    public interceptAll: any;

    /**
     * @property {Object} routesMap 实现路由到控制器转换配置
     *
     * {
     *     'u': 'app/controllers/user/IndexController',
     *     'account': {
     *         'classPath': 'app/controllers/user/IndexController',
     *         'property': 'value'
     *     }
     * }
     *
     */
    public routesMap: any;

    /**
     * @property {Object} modules 注册的模块
     *
     * 'modules': {
     *     'bbs': 'app/modules/bbs'
     * }
     */
    public modules: any;

    /**
     * @property {String} defaultView 视图类
     */
    public defaultView: string;

    /**
     * @property {String} defaultControllerNamespace 默认控制器命名空间
     */
    public defaultControllerNamespace: string;

    /**
     * @property {String} defaultRoute 默认路由
     */
    public defaultRoute: string;

    /**
     * @property {String} defaultControllerId 默认控制器
     */
    public defaultControllerId: string;

    /**
     * @inheritdoc
     */
    constructor(config) {
        super(config);

        this.interceptAll = null;
        this.routesMap = null;
        this.modules = null;
        this.defaultView = 'candy/web/View';
        this.defaultControllerNamespace = 'app/controllers';
        this.defaultRoute = 'index/index';
        this.defaultControllerId = 'index';

        Candy.config(this, config);
    }

    /**
     * @inheritdoc
     */
    public requestListener(request: http.ServerRequest, response: http.ServerResponse): void {
        let route = Request.parseUrl(request).pathname;

        CandyJS.getLogger().trace('Route requested: ' + route);

        let controller = this.createController(route);

        if(null === controller) {
            throw new InvalidRouteException('The route requested is invalid');
        }

        // 是否继承自框架控制器
        if( !(controller instanceof WebController) ) {
            CandyJS.getLogger().trace('Starting to run the run() method of: ' + controller.constructor.name);
            controller.run(request, response);
            return;
        }

        CandyJS.getLogger().trace('Starting to run the runControllerAction() method of: ' + controller.constructor.name);

        controller.context.request = request;
        controller.context.response = response;
        controller.runControllerAction(request, response);
    }

    /**
     * @inheritdoc
     */
    public handlerException(response: http.ServerResponse, exception: any): void {
        let handler = Candy.createObject(this.exceptionHandler);

        handler.handlerException(response, exception);
    }

    /**
     * 创建控制器实例
     *
     * @param {String} route 路由
     */
    public createController(route: string): any {
        /**
         * @var {String} moduleId 当前的模块
         */
        let moduleId = '';
        /**
         * @var {String} controllerId 当前的控制器
         */
        let controllerId = '';
        /**
         * @var {String} viewPath 子目录
         *
         * eg. viewPath = ''  ->  app/views/xxx.html
         * eg. viewPath = 'subdir'  ->  app/views/subdir/xxx.html
         *
         */
        let viewPath = '';

        route = StringHelper.lTrimChar(route, '/');

        // route eg. index/index
        if('' === route || '/' === route) {
            route = this.defaultRoute;
        }

        // 检测非法
        if(!/^[\w\-\/]+$/.test(route) || route.indexOf('//') >= 0) {
            return null;
        }

        // 拦截路由
        if(null !== this.interceptAll) {
            return Candy.createObject(this.interceptAll);
        }

        // 解析路由
        // 目录前缀或模块 id
        let id = '';
        let pos = route.indexOf('/');
        if(-1 !== pos) {
            id = route.substring(0, pos);
            route = route.substring(pos + 1);
            controllerId = route;

        } else {
            id = route;
            route = '';
        }

        // 保存前缀
        viewPath = id;

        // 保存当前控制器标识
        if( -1 !== (pos = route.lastIndexOf('/')) ) {
            viewPath = viewPath + '/' + route.substring(0, pos);

            controllerId = route.substring(pos + 1);
        }
        if('' === controllerId) {
            controllerId = this.defaultControllerId;
        }

        // 搜索顺序 用户配置 -> 模块控制器 -> 普通控制器
        // 模块没有前缀目录
        let clazz = null;
        if(null !== this.routesMap && undefined !== this.routesMap[id]) {
            CandyJS.getLogger().trace('Starting to create controller: '
                + ('string' === typeof this.routesMap[id]
                    ? this.routesMap[id] : this.routesMap[id].classPath));

            return Candy.createObject(this.routesMap[id], {
                moduleId: moduleId,
                controllerId: controllerId,
                viewPath: viewPath
            });
        }

        if(null !== this.modules && undefined !== this.modules[id]) {
            moduleId = id;

            clazz = StringHelper.trimChar(this.modules[id], '/')
                + '/controllers/'
                + StringHelper.ucFirst(controllerId) + 'Controller';

            CandyJS.getLogger().trace('Starting to create controller: ' + this.modules[id]);

            return Candy.createObjectAsString(clazz, {
                moduleId: moduleId,
                controllerId: controllerId,
                viewPath: viewPath
            });
        }

        clazz = this.defaultControllerNamespace
            + '/'
            + viewPath
            + '/'
            + StringHelper.ucFirst(controllerId) + 'Controller';

        CandyJS.getLogger().trace('Starting to create controller: ' + clazz);

        return Candy.createObjectAsString(clazz, {
            moduleId: moduleId,
            controllerId: controllerId,
            viewPath: viewPath
        });
    }

}

export = Application;
