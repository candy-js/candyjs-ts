/**
 * @author
 * @license MIT
 */
"use strict";
/**
 * 视图
 */
class View {
    /**
     * constructor
     */
    constructor(context) {
        this.context = context;
    }
    /**
     * 获取视图文件路径
     *
     * @param {String} view 视图文件名
     * @return {String}
     */
    getTemplateFilePath(view) { }
    /**
     * 读取视图文件
     *
     * @param {String} view 视图文件名
     * @param {any} callback 回调函数
     * @return {String}
     */
    getTemplate(view, callback) { }
    /**
     * 从指定路径读取视图文件
     *
     * @param {String} path 文件路径
     * @param {any} callback 回调函数
     * @return {String}
     */
    getTemplateFromPath(path, callback) { }
}
/**
 * @var {String} 默认视图文件后缀
 */
View.defaultViewExtension = '.html';
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = View;
//# sourceMappingURL=View.js.map