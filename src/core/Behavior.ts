/**
 * @author afu
 * @license MIT
 */
import Component = require('./Component');

/**
 * 所有行为类的基类
 *
 * 一个行为类可以用于在不改变原组件代码的情况下增强其功能
 * 当行为附加到组件后它将 注入 它的方法和属性到组件中
 * 然后就可以像访问组件自己的方法和属性一样访问它们
 *
 * 行为类还能够监听组件的事件并作出响应
 */
class Behavior {

    /**
     * @property {Component} component 拥有行为的组件
     */
    public component: Component;

    constructor() {
        this.component = null;
    }

    /**
     * 声明要监听的组件的事件和对应事件的处理程序
     *
     * @return {Object}
     *
     * {
     *      eventName1: handler1,
     *      eventNameN: handlerN
     * }
     *
     */
    public events(): any {
        return null;
    }

    /**
     * 监听组件的事件
     *
     * @param {Component} component 组件
     */
    public listen(component: Component): void {
        this.component = component;

        let events = this.events();

        if(null === events) {
            return;
        }

        for(let eventName in events) {
            this.component.on(eventName, events[eventName]);
        }
    }

    /**
     * 取消监听组件的事件
     */
    public unListen(): void {
        if(null === this.component) {
            return;
        }

        let events = this.events();

        if(null === events) {
            return;
        }

        for(let eventName in events) {
            this.component.off(eventName, events[eventName]);
        }

        this.component = null;
    }

}

export = Behavior;
