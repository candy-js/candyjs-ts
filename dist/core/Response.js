/**
 * @author
 * @license MIT
 */
"use strict";
/**
 * server response
 */
class Response {
    /**
     * constructor
     *
     * @param {Object} response
     */
    constructor(response) {
        this.response = response;
    }
    /**
     * sends data to client and end response
     *
     * @param {String | Buffer} content
     */
    send(content) { }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Response;
//# sourceMappingURL=Response.js.map