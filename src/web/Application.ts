/**
 * @author
 * @license MIT
 */
import * as http from 'http';

import Candy from '../Candy';
import CandyJS from '../index';
import CoreApp from '../core/Application';
import Exception from '../core/Exception';
import StringHelper from '../helpers/StringHelper';
import CoreController from '../core/Controller';
import Request from './Request';
import InvalidRouteException from '../core/InvalidRouteException';

/**
 * web 应用
 */
export default class Application extends CoreApp {

    /**
     * @property {String | Object} interceptAll 拦截所有路由
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
     * @property {String} viewHandler 视图类
     */
    public viewHandler: string;

    /**
     * @property {String} controllerNamespace 默认控制器命名空间
     */
    public controllerNamespace: string;

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
    constructor(config: any) {
        super(config);

        this.routesMap = null;
        this.modules = null;
        this.viewHandler = 'candy/web/View';
        this.controllerNamespace = 'app/controllers';
        this.defaultRoute = 'index/index';
        this.defaultControllerId = 'index';

        Candy.config(this, config);
    }

    /**
     * @inheritdoc
     */
    public requestListener(request: http.ServerRequest, response: http.ServerResponse) {
        let route = Request.parseUrl(request).pathname;

        let controller: CoreController = this.createController(route);

        if(null === controller) {
            throw new InvalidRouteException('The route requested is invalid');
        }

        // 是否继承自框架控制器
        if( !(controller instanceof CoreController) ) {
            (controller as any).run(request, response);

            return;
        }

        controller.runControllerAction(request, response);
    }

    /**
     * @inheritdoc
     */
    public handlerException(response: http.ServerResponse, exception: Exception) {
        let handler = Candy.createObject(this.exceptionHandler);

        handler.handlerException(response, exception);
    }

    /**
     * 创建控制器实例
     *
     * @param {String} route 路由
     */
    public createController(route: string) {
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
            CandyJS.getLogger().trace('Starting to create controller: '
                + ('string' === typeof this.interceptAll
                    ? this.interceptAll : this.interceptAll.classPath));

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

            return Candy.createObject(clazz, {
                moduleId: moduleId,
                controllerId: controllerId,
                viewPath: viewPath
            });
        }

        clazz = this.controllerNamespace
            + '/'
            + viewPath
            + '/'
            + StringHelper.ucFirst(controllerId) + 'Controller';

        CandyJS.getLogger().trace('Starting to create controller: ' + clazz);

        return Candy.createObject(clazz, {
            moduleId: moduleId,
            controllerId: controllerId,
            viewPath: viewPath
        });
    }

}
