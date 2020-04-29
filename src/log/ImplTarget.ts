/**
 * @author afu
 * @license MIT
 */
import Event = require('../core/Event');
import ITarget = require('./ITarget');

/**
 * 日志抽象层
 */
abstract class ImplTarget extends Event implements ITarget {

    /**
     * @property {String} EVENT_FLUSH 事件
     */
    public static EVENT_FLUSH: string = 'flush';

    /**
     * @property {String} fileExtension 文件扩展名
     */
    public fileExtension: string = '.log';

    /**
     * @inheritdoc
     */
    public flush(messages: any[]): void {}

    /**
     * 触发事件
     *
     * @param {String} eventName 事件名称
     * @param {Array} param 日志信息
     */
    trigger(eventName: string, parameter: any[]): void {
        if(!this.eventsMap.has(eventName)) {
            return;
        }

        const handlers = this.eventsMap.get(eventName);
        for(let handler of handlers) {
            handler.flush(parameter);
        }
    }

}

export = ImplTarget;
