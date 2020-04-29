/**
 * @author
 * @license MIT
 */
import Candy = require('../Candy');
import View = require('./View');
import CoreController = require('../core/Controller');

/**
 * 控制器
 */
class Controller extends CoreController {

    public view: View;

    /**
     * constructor
     */
    constructor(context: any) {
        super(context);

        this.view = null;
    }

    /**
     * 获取视图类
     *
     * @return {Object}
     */
    public getView(): View {
        if(null === this.view) {
            this.view = Candy.createObjectAsString(Candy.app.defaultView, this.context);
        }

        return this.view;
    }

    /**
     * 设置视图类
     *
     * @param {Object} view
     */
    public setView(view: any) {
        this.view = view;
    }

    /**
     * {@inheritdoc}
     */
    public render(view: string, parameters: any = null) {
        this.getView().render(view, parameters);
    }

    /**
     * {@inheritdoc}
     */
    public run(request, response) {
        response.end('Must have a run() method in controller');
    }

}

export = Controller;
