/**
 * @author afu
 * @license MIT
 */
import * as http from 'http';

/**
 * server request
 */
class Request {

    public request: http.ServerRequest;

    /**
     * 入口脚本名字
     */
    protected _scriptFile: string;

    /**
     * constructor
     *
     * @param {http.ServerRequest} request
     */
    constructor(request: http.ServerRequest) {
        this.request = request;

        this._scriptFile = '';
    }

    /**
     * 返回入口文件名
     *
     * @return {String}
     */
    getScriptFile(): string {
        if('' === this._scriptFile) {
            this._scriptFile = process.mainModule.filename;
        }

        return this._scriptFile;
    }

}

export = Request;
