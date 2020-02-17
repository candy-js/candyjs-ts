/**
 * @author
 * @license MIT
 */
import * as http from 'http';

import Candy from '../Candy';
import CoreExceptionHandler from '../core/ExceptionHandler';

/**
 * web 异常错误处理
 */
export default class ExceptionHandler extends CoreExceptionHandler {

    /**
     * @inheritdoc
     */
    handlerException(response: http.ServerResponse, exception: Error): void {
        response.setHeader('Content-Type', 'text/plain');
        response.writeHead(500);

        response.end(null !== Candy.app && true === Candy.app.debug
            ? exception.message + '\n' + exception.stack
            : 'The server encountered an internal error');
    }

}
