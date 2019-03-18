/**
 * @author
 * @license MIT
 */
import Event from '../core/Event';
import ITarget from './ITarget';

/**
 * 日志抽象层
 */
export default abstract class ImplTarget extends Event implements ITarget {

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
    public flush(messages: any[]): void {};

    /**
     * 触发事件
     *
     * @param {String} eventName 事件名称
     * @param {Array} param 日志信息
     */
    trigger(eventName: string, param: any[]): void {
        if(undefined === this.handlers[eventName]) {
            return;
        }

        for(let handler of this.handlers[eventName]) {
            handler.flush(param);
        }
    }

}
