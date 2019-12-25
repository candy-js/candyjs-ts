/**
 * @author
 * @license MIT
 */
import * as http from 'http';

import Candy from '../Candy';
import CoreApp from '../core/Application';
import Exception from '../core/Exception';
import CoreController from '../core/Controller';
import Request from './Request';
import InvalidRouteException from '../core/InvalidRouteException';

import CoreExceptionHandler from '../core/ExceptionHandler';

/**
 * web 应用
 */
export default class Application extends CoreApp {

    /**
     * @property {String} defaultExceptionHandler 异常处理类
     */
    public defaultExceptionHandler: string;

    /**
     * @inheritdoc
     */
    constructor(config: any) {
        super(config);

        this.defaultExceptionHandler = 'candy/web/ExceptionHandler';
    }

    /**
     * @inheritdoc
     */
    public requestListener(request: http.ServerRequest, response: http.ServerResponse) {
        let route = Request.parseUrl(request).pathname;

        let controller: CoreController = this.createController(route);

        if(null === controller) {
            throw new InvalidRouteException('The route requested is invalid');
        }

        // 是否继承自框架控制器
        if( !(controller instanceof CoreController) ) {
            (controller as any).run(request, response);

            return;
        }

        controller.runControllerAction(request, response);
    }

    /**
     * @inheritdoc
     */
    public handlerException(response: http.ServerResponse, exception: Exception) {
        let handler: CoreExceptionHandler = Candy.createObject('' === this.exceptionHandler
            ? this.defaultExceptionHandler
            : this.exceptionHandler);

        handler.handlerException(response, exception);
    }

}
