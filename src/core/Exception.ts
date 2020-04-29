/**
 * @author afu
 * @license MIT
 */

/**
 * 异常
 */
abstract class Exception extends Error {

    /**
     * constructor
     *
     * @param {String} message 错误信息
     */
    public constructor(message) {
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

export = Exception;
