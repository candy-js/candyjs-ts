/**
 * @author
 * @license MIT
 */
import * as fs from 'fs';

import Candy from '../../Candy';
import Logger from '../Logger';
import ImplTarget from '../ImplTarget';
import FileHelper from '../../helpers/FileHelper';
import TimeHelper from '../../helpers/TimeHelper';

/**
 * 文件日志
 *
 * ```
 * 'log': {
 *     'targets': {
 *         'file': {
 *             'classPath': 'candy/log/file/Target',
 *             'logPath': __dirname + '/logs'
 *         },
 *         'other': {...}
 *     },
 *     'flushInterval': 10
 * }
 * ```
 *
 */
export default class Target extends ImplTarget {

    /**
     * @property {any} config 配置
     */
    public config: any;

    /**
     * @property {String} fileExtension
     */
    public fileExtension: string;

    /**
     * @property {String} logPath 日志路径
     */
    public logPath: string;

    /**
     * constructor
     */
    constructor(config: any) {
        super();

        this.config = config;

        this.fileExtension = undefined === config.fileExtension
            ? '.log'
            : config.fileExtension;

        this.logPath = undefined === config.logPath
            ? Candy.getPathAlias('@runtime/logs')
            : config.logPath;
    }

    /**
     * @inheritdoc
     */
    public flush(messages: any[]): void {
        let msg = this.formatMessage(messages);
        let file = this.generateFile();

        // 检查目录
        fs.access(this.logPath, fs.constants.R_OK | fs.constants.W_OK, (err) => {
            if(null === err) {
                fs.appendFile(file, msg, Candy.app.encoding, (err) => {});

                return;
            }

            FileHelper.createDirectory(this.logPath, 0o777, (err) => {
                fs.appendFile(file, msg, Candy.app.encoding, (err) => {});
            });
        });
    }

    /**
     * 生成日志文件名
     */
    private generateFile(): string {
        if(undefined !== this.config.logFile) {
            return this.logPath + '/' + this.config.logFile;
        }

        var date = new Date();

        return this.logPath
            + '/'
            + date.getFullYear()
            + '-'
            + (date.getMonth() + 1)
            + '-'
            + date.getDate()
            + this.fileExtension;
    }

    /**
     * 格式化内容
     */
    private formatMessage(messages: any[]): string {
        let msg = '';
        for(let i=0,len=messages.length; i<len; i++) {
            msg += TimeHelper.format('y-m-d h:i:s', messages[i][2])
                + ' -- '
                + Logger.getLevelName(messages[i][1])
                + ' -- '
                + messages[i][0]
                + '\n';
        }

        return msg;
    }
}
