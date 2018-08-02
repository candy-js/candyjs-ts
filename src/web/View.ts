/**
 * @author
 * @license MIT
 */
import * as fs from 'fs';

import Candy from '../Candy';
import CoreView from '../core/View';

/**
 * 视图
 */
export default class View extends CoreView {

    /**
     * constructor
     */
    constructor(context) {
        super(context);
    }

    /**
     * @inheritdoc
     */
    public getTemplateFilePath(view: string): string {
        let app = Candy.app;
        let context = this.context;
        let path = '';

        // 模块无子目录 普通控制器有子目录
        if('' !== context['moduleId']) {
            path = app.modules[context['moduleId']]
                + '/views/'
                + view + View.defaultViewExtension;

        } else {
            path = app.getAppPath()
                + '/views/'
                + ('' === context['viewPath'] ? '.' : context['viewPath'])
                + '/'
                + view + View.defaultViewExtension;
        }

        return path;
    }

    /**
     * @inheritdoc
     */
    public getTemplate(view: string, callback: any): void {
        let path = this.getTemplateFilePath(view);

        fs.readFile(path, Candy.app.encoding, callback);
    }

    /**
     * @inheritdoc
     */
    public getTemplateFromPath(path: string, callback: any): void {
        fs.readFile(path, Candy.app.encoding, callback);
    }

}
