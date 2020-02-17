/**
 * @author
 * @license MIT
 */

/**
 * 辅助类
 */
export default class Candy {

    /**
     * @property {Application} app 应用实例
     */
    public static app: any = null;

    /**
     * @property {Object} pathAliases 路径别名
     */
    public static pathAliases: any = {'@candy': __dirname};

    /**
     * @property {String} fileExtention 默认文件扩展名
     */
    public static fileExtention: string = '.js';

    /**
     * @ 别名路径转换真实路径
     *
     * @param {String} alias 路径别名
     * @return {String} 路径
     */
    public static getPathAlias(alias: string): string {
        if('@' !== alias.charAt(0)) {
            return alias;
        }

        // 截取开头作为别名
        let pos: number = alias.indexOf('/');
        let root: string = -1 === pos ? alias : alias.substring(0, pos);
        if(undefined !== Candy.pathAliases[root]) {
            return -1 === pos ?
                Candy.pathAliases[root] :
                Candy.pathAliases[root] + alias.substring(pos);
        }

        return '';
    }

    /**
     * 设置路径别名
     *
     * @param {String} alias 路径别名
     * @param {String} path 路径
     */
    public static setPathAlias(alias: string, path: string): void {
        if('@' !== alias.charAt(0)) {
            alias = '@' + alias;
        }

        if(null === path) {
            delete Candy.pathAliases[alias];

            return;
        }

        if('/' === path.charAt(path.length - 1)) {
            path = path.substring(0, path.length - 1);
        }

        Candy.pathAliases[alias] = path;
    }

    /**
     * 创建对象 系统类路径约定以 candy 开头 应用类以项目目录开头
     *
     * @param {String | JSON} clazz 以某个已经定义的别名开头的类全名或带 'classPath' 键的配置
     *
     * eg.
     * candy/log/file/Target
     * or
     * {classPath: '...', ...}
     *
     * @param {any} params 构造函数参数
     * @return {any} 类实例
     */
    public static createObject(clazz: any, ...params: any[]): any {
        let realClass = '';
        let properties = null;

        if('string' === typeof clazz) {
            realClass = Candy.getPathAlias('@' + clazz);

        } else if('object' === typeof clazz && undefined !== clazz['classPath']) {
            realClass = Candy.getPathAlias('@' + clazz['classPath']);

            properties = Candy.config({}, clazz);
            delete properties['classPath'];
        }

        // 文件不存在抛出异常
        // todo

        let ClassName = require(realClass + Candy.fileExtention);
        let instance = new ClassName(...params);

        if(null !== properties) {
            Candy.config(instance, properties);
        }

        return instance;
    }

    /**
     * 导入一个类文件
     *
     * @param {String} clazz 类全名
     */
    public static include(clazz: string): any {
        let realClass: string = Candy.getPathAlias('@' + clazz);

        // 文件不存在抛出异常
        // todo

        return require(realClass + Candy.fileExtention);
    }

    /**
     * 对象配置
     *
     * @param {any} object 需要配置的对象
     * @param {Object} properties 配置项
     * @return {Object} 源对象
     */
    public static config(object: any, properties: any): void {
        for(let key in properties) {
            object[key] = properties[key];
        }

        return object;
    }

}

