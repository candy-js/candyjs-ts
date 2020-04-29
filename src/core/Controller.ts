/**
 * @author
 * @license MIT
 */
import * as http from 'http';

import CandyJs = require('../index');
import Component = require('./Component');
import View = require('./View');

/**
 * 控制器基类
 */
abstract class Controller extends Component {

    /**
     * @property {String} EVENT_BEFORE_ACTIONCALL
     */
    public static EVENT_BEFORE_ACTIONCALL: string = 'beforeActionCall';

     /**
     * @property {String} EVENT_AFTER_ACTIONCALL
     */
    public static EVENT_AFTER_ACTIONCALL: string = 'afterActionCall';

    /**
     * @property {Object} context 上下文环境 用于保存当前请求相关的信息
     */
    public context: any;

    /**
     * constructor
     */
    constructor(context: any) {
        super();

        this.context = context;
    }

    /**
     * 控制器方法执行前
     *
     * @param {http.ServerRequest} request
     * @param {http.ServerResponse} response
     */
    public beforeActionCall(request: http.ServerRequest, response: http.ServerResponse) {
        CandyJs.getLogger().trace('The beforeActionCall() method is called');
        this.triggerWithRestParameters(Controller.EVENT_BEFORE_ACTIONCALL, request, response);
    }

    /**
     * 控制器方法执行后
     *
     * @param {http.ServerRequest} request
     * @param {http.ServerResponse} response
     */
    public afterActionCall(request: http.ServerRequest, response: http.ServerResponse) {
        CandyJs.getLogger().trace('The afterActionCall() method is called');
        this.triggerWithRestParameters(Controller.EVENT_AFTER_ACTIONCALL, request, response);
    }

    /**
     * 执行控制器的方法
     *
     * @param {http.ServerRequest} request
     * @param {http.ServerResponse} response
     */
    public runControllerAction(request: http.ServerRequest, response: http.ServerResponse) {
        this.beforeActionCall(request, response);

        CandyJs.getLogger().trace('Starting to run the run() method of: ' + this.constructor.name);
        this.run(request, response);

        this.afterActionCall(request, response);
    }

    /**
     * 控制器入口
     *
     * @param {http.ServerRequest} request
     * @param {http.ServerResponse} response
     */
    public abstract run(request: http.ServerRequest, response: http.ServerResponse);

    /**
     * 获取视图类
     */
    public abstract getView(): View;

    /**
     * 设置视图类
     *
     * @param {Object} view
     */
    public abstract setView(view: any): void;

    /**
     * 渲染文件
     *
     * @param {String} view 视图名
     * @param {any} parameters 参数
     * @return string | undefined
     */
    public abstract render(view: string, parameters: any): void;

}

export = Controller;
