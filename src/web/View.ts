/**
 * @author
 * @license MIT
 */
import * as fs from 'fs';

import Candy = require('../Candy');
import CoreView = require('../core/View');

/**
 * 视图
 */
class View extends CoreView {

    /**
     * constructor
     */
    public constructor(context: any) {
        super(context);
    }

    /**
     * {@inheritdoc}
     */
    public renderFile(file: string, parameters: any) {}

}

export = View;
