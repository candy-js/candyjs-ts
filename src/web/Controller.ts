/**
 * @author
 * @license MIT
 */
import Candy from '../Candy';
import CoreController from '../core/Controller';

import View from './View';

/**
 * 控制器
 */
export default class Controller extends CoreController {

    /**
     * @property {String} viewHandler
     */
    public defaultViewHandler: string;

    /**
     * @property {View} view
     */
    public view: View;

    /**
     * constructor
     */
    constructor(context) {
        super(context);

        this.defaultViewHandler = 'candy/web/View';
        this.view = null;
    }

    /**
     * @inheritdoc
     */
    public getView(): View {
        if(null !== this.view) {
            return this.view;
        }

        this.view = <View>Candy.createObject(
            '' === Candy.app.viewHandler
            ? this.defaultViewHandler
            : Candy.app.viewHandler, this.context);

        return this.view;
    }

    /**
     * @inheritdoc
     */
    public run() {}

}
