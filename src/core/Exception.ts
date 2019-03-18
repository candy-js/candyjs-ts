/**
 * @author
 * @license MIT
 */

/**
 * 异常
 */
export default abstract class Exception extends Error {

    /**
     * constructor
     *
     * @param {String} message 错误信息
     */
    constructor(message) {
        super(message);

        this.name = this.constructor.name;
    }

    /**
     * 获得错误名
     *
     * @return {String}
     */
    public getName(): string {
        return this.name;
    }

}
