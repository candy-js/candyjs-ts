/**
 * @author afu
 * @license MIT
 */
class Hook {

    /**
     * @property {any[]} handlers
     */
    private static handlers: any[] = [];

    /**
     * @property {Number} index
     */
    public index: number;

    /**
     * @property {any} request
     */
    public req: any;

    /**
     * @property {any} response
     */
    public res: any;

    /**
     * @property {any} callback
     */
    public callback: any;

    /**
     * 注册
     *
     * @param {any} handler
     */
    public static addHook(handler: any) {
        Hook.handlers.push(handler);
    }

    /**
     * constructor
     */
    public constructor() {
        this.index = 0;

        this.req = null;
        this.res = null;
        this.callback = null;
    }

    /**
     * 获取一个 handler
     */
    public getHook(): any {
        if(this.index === Hook.handlers.length) {
            this.index = 0;

            return null;
        }

        let ret = Hook.handlers[this.index];
        this.index++;

        return ret;
    }

    /**
     * 触发
     *
     * @param {Object} req
     * @param {Object} res
     * @param {Function} callback
     */
    public trigger(req: any, res: any, callback: any) {
        this.req = req;
        this.res = res;
        this.callback = callback;

        let first = this.getHook();
        // 没有插件
        if(null === first || 'function' !== typeof first) {
            callback(req, res);
            return;
        }

        this.triggerHook(first);
    }

    public triggerHook(next: any) {
        next(this.req, this.res, () => {
            let nextHandler = this.getHook();

            if(null !== nextHandler && 'function' === typeof nextHandler) {
                this.triggerHook(nextHandler);
                return;
            }

            this.callback(this.req, this.res);
        });
    }

}

export = Hook;
