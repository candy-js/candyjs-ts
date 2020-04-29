/**
 * @author afu
 * @license MIT
 */
import * as http from 'http';

/**
 * server response
 */
abstract class Response {

    public response: http.ServerResponse;

    /**
     * constructor
     *
     * @param {Object} response
     */
    constructor(response: http.ServerResponse) {
        this.response = response;
    }

    /**
     * sends data to client and end response
     *
     * @param {String | Buffer} content
     */
    public abstract send(content: string | Buffer): void;

}

export = Response;
