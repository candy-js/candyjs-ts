/**
 * @author
 * @license MIT
 */
import Candy from '../Candy';
import View from './View';
import CoreController from '../core/Controller';

/**
 * 控制器
 */
export default class Controller extends CoreController {

    /**
     * @property {View} view
     */
    public view: View;

    /**
     * constructor
     */
    constructor(context) {
        super(context);

        this.view = null;
    }

    /**
     * @inheritdoc
     */
    public getView(): View {
        if(null === this.view) {
            this.view = Candy.createObject(Candy.app.viewHandler, this.context);
        }

        return this.view;
    }

    /**
     * @inheritdoc
     */
    public run() {}

}
