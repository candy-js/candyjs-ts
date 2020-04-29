/**
 * @author afu
 * @license MIT
 */
import * as fs from 'fs';

import Candy = require('../Candy');

/**
 * 视图
 */
abstract class View {

     /**
     * @property {Object} context 上下文环境
     */
    public context: any;

    /**
     * @property {String} 默认视图文件后缀
     */
    public defaultExtension: string;

    /**
     * constructor
     */
    public constructor(context: any) {
        this.context = context;
        this.defaultExtension = '.html';
    }

    /**
     * 查找视图文件路径
     *
     * @param {String} view 视图文件名
     * @return {String}
     */
    public findViewFile(view: string) {
        if('@' === view.charAt(0)) {
            return Candy.getPathAlias(view) + this.defaultExtension;
        }

        let app = Candy.app;
        let context = this.context;

        // 模块无子目录 普通控制器有子目录
        if('' !== context.moduleId) {
            return app.modules[context.moduleId]
                + '/views/'
                + view + this.defaultExtension;
        }

        return app.getAppPath()
            + '/views/'
            + context.viewPath
            + '/'
            + view + this.defaultExtension;
    }

    /**
     * 读取视图文件
     *
     * @deprecated since 4.2.1 请使用 getViewContent
     * @param {String} view 视图文件名
     * @param {Function} callback 回调函数
     * @return {String}
     */
    public getTemplateContent(view: string, callback: any) {
        this.getViewContent(view, callback);
    }

    /**
     * 读取视图文件
     *
     * @since 4.2.1
     * @param {String} view 视图文件名
     * @param {Function} callback 回调函数
     * @return {String}
     */
    public getViewContent(view, callback) {
        let file = this.findViewFile(view);

        fs.readFile(file, Candy.app.encoding, callback);
    }

    /**
     * 渲染视图文件入口
     *
     * @param {String} view 视图名
     * @param {Object} parameters 参数
     */
    public render(view: string, parameters: any = null) {
        let file = this.findViewFile(view);

        this.renderFile(file, parameters);
    }

    /**
     * 渲染视图文件
     *
     * @param {String} file 视图文件路径
     * @param {Object} parameters 参数
     */
    public abstract renderFile(file: string, parameters: any): void;

}

export = View;
