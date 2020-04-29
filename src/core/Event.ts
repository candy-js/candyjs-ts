/**
 * @author afu
 * @license MIT
 */

/**
 * 简单 Event
 */
class Event {

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
    public constructor() {
        this.eventsMap = new Map();
    }

    /**
     * 注册事件处理
     *
     * @param {String} eventName 事件名称
     * @param {any} handler 回调函数
     */
    public on(eventName: string, handler: any) {
        if(!this.eventsMap.has(eventName)) {
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
        if(!this.eventsMap.has(eventName)) {
            return;
        }

        if(undefined === handler) {
            this.eventsMap.delete(eventName);
            return;
        }

        const handlers = this.eventsMap.get(eventName);
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
     * @param {any} parameter 参数
     */
    public trigger(eventName: string, parameter: any) {
        if(!this.eventsMap.has(eventName)) {
            return;
        }

        const handlers = this.eventsMap.get(eventName);
        for(let i=0, len=handlers.length; i<len; i++) {
            handlers[i](parameter);
        }
    }

    /**
     * 触发
     *
     * @param {String} eventName 事件名称
     * @param {any} parameters 参数
     */
    public triggerWithRestParameters(eventName: string, ...parameters: any[]) {
        if(!this.eventsMap.has(eventName)) {
            return;
        }

        const handlers = this.eventsMap.get(eventName);
        for(let i=0, len=handlers.length; i<len; i++) {
            handlers[i](...parameters);
        }
    }

}

export = Event;
