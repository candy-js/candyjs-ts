/**
 * @author
 * @license MIT
 */
import CandyJs from './index';

export default class Restful extends CandyJs {

    constructor(application) {
       super(application)
    }

    /**
     * get
     */
    public get(pattern, handler): void {
        this.app.addRoute('GET', pattern, handler);
    }

    /**
     * post
     */
    public post(pattern, handler): void {
        this.app.addRoute('POST', pattern, handler);
    }

    /**
     * put
     */
    public put(pattern, handler): void {
        this.app.addRoute('PUT', pattern, handler);
    }

    /**
     * delete
     */
    public delete(pattern, handler): void {
        this.app.addRoute('DELETE', pattern, handler);
    }

    /**
     * patch
     */
    public patch(pattern, handler): void {
        this.app.addRoute('PATCH', pattern, handler);
    }

    /**
     * head
     */
    public head(pattern, handler): void {
        this.app.addRoute('HEAD', pattern, handler);
    }

    /**
     * options
     */
    public options(pattern, handler): void {
        this.app.addRoute('OPTIONS', pattern, handler);
    }

}
