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
     * ```
     * {
     *     'eventName': [fn1, fn2...]
     *     'eventName2': [fn1, fn2...]
     * }
     * ```
     *
     */
    public eventsMap: Map<string, any[]>;

    /**
     * constructor
     */
    constructor() {
        this.eventsMap = new Map();
    }

    /**
     * 注册事件处理
     *
     * @param {String} eventName 事件名称
     * @param {any} handler 回调函数
     */
    public on(eventName: string, handler: any) {
        if(undefined === this.eventsMap.get(eventName)) {
            this.eventsMap.set(eventName, []);
        }

        this.eventsMap.get(eventName).push(handler);
    }

    /**
     * 注销事件处理
     *
     * @param {String} eventName 事件名称
     * @param {any} handler 回调函数
     */
    public off(eventName: string, handler: any) {
        const handlers = this.eventsMap.get(eventName);

        if(undefined === handlers) {
            return;
        }

        if(undefined === handler) {
            this.eventsMap.delete(eventName);
            return;
        }

        for(let i=0; i<handlers.length; i++) {
            if(handler === handlers[i]) {
                handlers.splice(i, 1);
            }
        }
    }

    /**
     * 触发
     *
     * @param {String} eventName 事件名称
     * @param {any} param 参数
     */
    public trigger(eventName: string, param: any) {
        const handlers = this.eventsMap.get(eventName);

        if(undefined === handlers) {
            return;
        }

        for(let i=0, len=handlers.length; i<len; i++) {
            handlers[i](param);
        }
    }

    /**
     * 触发
     *
     * @param {String} eventName 事件名称
     * @param {any} params 参数
     */
    public triggerWithRestParams(eventName: string, ...params: any[]) {
        const handlers = this.eventsMap.get(eventName);

        if(undefined === handlers) {
            return;
        }

        for(let i=0, len=handlers.length; i<len; i++) {
            handlers[i](...params);
        }
    }

}
