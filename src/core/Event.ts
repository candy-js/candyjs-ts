/**
 * @author
 * @license MIT
 */

/**
 * 简单 Event
 */
export default class Event {

    /**
     * @property {Object} handlers
     * 
     * {
     *     'eventName': [fn1, fn2...]
     *     'eventName2': [fn1, fn2...]
     * }
     */
    public handlers: object;
    
    /**
     * constructor
     */
    constructor() {
        this.handlers = {};
    }
    
    /**
     * 注册事件处理
     *
     * @param {String} eventName 事件名称
     * @param {Function} handler 回调函数
     */
    public on(eventName: string, handler: Function) {
        if(undefined === this.handlers[eventName]) {
            this.handlers[eventName] = [];
        }
        
        this.handlers[eventName].push(handler);
    }
    
    /**
     * 注销事件处理
     *
     * @param {String} eventName 事件名称
     * @param {Function} handler 回调函数
     */
    public off(eventName: string, handler: Function) {
        if(undefined !== this.handlers[eventName]) {
            if(undefined === handler) {
                delete this.handlers[eventName];
                
            } else {
                for(let i=0,len=this.handlers[eventName].length; i<len; i++) {
                    if(handler === this.handlers[eventName][i]) {
                        this.handlers[eventName].splice(i, 1);
                    }
                }
            }
        }
    }
    
    /**
     * 触发
     *
     * @param {String} eventName 事件名称
     * @param {Array} param 参数
     */
    public trigger(eventName: string, param: any[]) {
        if(undefined !== this.handlers[eventName]) {
            for(let i=0,len=this.handlers[eventName].length; i<len; i++) {
                undefined === param ? this.handlers[eventName][i]() :
                    this.handlers[eventName][i].apply(null, param);
            }
        }
    }
    
    /**
     * 触发
     *
     * @param {String} eventName 事件名称
     * @param {any} params 参数
     */
    public triggerWithRestParams(eventName: string, ...params: any[]) {
        if(undefined !== this.handlers[eventName]) {
            for(let i=0,len=this.handlers[eventName].length; i<len; i++) {
                this.handlers[eventName][i](...params);
            }
        }
    }
    
}
