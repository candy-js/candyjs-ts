/**
 * @author
 * @license MIT
 */
import Candy from '../Candy';
import StringHelper from '../helpers/StringHelper';

/**
 * 核心
 */
export default class Fate {

    /**
     * @property {String | Object} interceptAll 拦截所有路由
     *
     * ```
     * 'app/some/Class'
     *
     * or a Object config
     *
     * {
     *      'classPath': 'app/some/Class',
     *      'property': 'value'
     * }
     * ```
     *
     */
    public interceptAll: any;

    /**
     * @property {Object} routesMap 实现路由到控制器转换配置
     *
     * ```
     * {
     *     'u': 'app/controllers/user/IndexController',
     *     'account': {
     *         'classPath': 'app/controllers/user/IndexController',
     *         'property': 'value'
     *     }
     * }
     * ```
     *
     */
    public routesMap: any;

    /**
     * @property {Object} modules 注册的模块
     *
     * 'modules': {
     *     'bbs': 'app/modules/bbs'
     * }
     *
     */
    public modules: any;

    /**
     * @property {String} defaultRoute 默认路由
     */
    public defaultRoute: string;

    /**
     * @property {String} defaultControllerNamespace 默认控制器命名空间
     */
    public defaultControllerNamespace: string;

    /**
     * @property {String} defaultControllerId 默认控制器
     */
    public defaultControllerId: string;

    /**
     * constructor
     */
    constructor() {
        this.interceptAll = null;
        this.routesMap = null;
        this.modules = null;
        this.defaultRoute = 'index/index';
        this.defaultControllerNamespace = 'app/controllers';
        this.defaultControllerId = 'index';
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
        let moduleId: string = '';
        /**
         * @var {String} controllerId 当前的控制器
         */
        let controllerId: string = '';
        /**
         * @var {String} subRoute 子目录
         *
         * eg. subRoute = ''  ->  app/views/xxx.html
         * eg. subRoute = 'subdir'  ->  app/views/subdir/xxx.html
         *
         */
        let subRoute: string = '';

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
        let id: string = '';
        let pos: number = route.indexOf('/');
        if(-1 !== pos) {
            id = route.substring(0, pos);
            route = route.substring(pos + 1);
            controllerId = route;

        } else {
            id = route;
            route = '';
        }

        // 保存前缀
        subRoute = id;

        // 保存当前控制器标识
        if( -1 !== (pos = route.lastIndexOf('/')) ) {
            subRoute = subRoute + '/' + route.substring(0, pos);

            controllerId = route.substring(pos + 1);
        }
        if('' === controllerId) {
            controllerId = this.defaultControllerId;
        }

        // 搜索顺序 用户配置 -> 模块控制器 -> 普通控制器
        // 模块没有前缀目录
        let clazz: any = null;
        if(null !== this.routesMap && undefined !== this.routesMap[id]) {

            return Candy.createObject(this.routesMap[id], {
                moduleId: moduleId,
                controllerId: controllerId,
                subRoute: subRoute
            });
        }

        if(null !== this.modules && undefined !== this.modules[id]) {
            moduleId = id;

            clazz = StringHelper.trimChar(this.modules[id], '/')
                + '/controllers/'
                + StringHelper.ucFirst(controllerId) + 'Controller';

            return Candy.createObject(clazz, {
                moduleId: moduleId,
                controllerId: controllerId,
                subRoute: subRoute
            });
        }

        clazz = this.defaultControllerNamespace
            + '/'
            + subRoute
            + '/'
            + StringHelper.ucFirst(controllerId) + 'Controller';

        return Candy.createObject(clazz, {
            moduleId: moduleId,
            controllerId: controllerId,
            subRoute: subRoute
        });
    }

}
