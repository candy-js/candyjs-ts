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
 *             'logPath': '@runtime/logs',
 *             'logFile': 'system.log',
 *             'maxFileSize': 10240
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
     * @property {String} absolute path of log file. default at runtime directory of the application
     */
    public logPath: string;

    /**
     * @property {String} log file name
     */
    public logFile: string;

    /**
     * @property {Number} maxFileSize maximum log file size in KB
     */
    public maxFileSize: number;

    /**
     * constructor
     */
    constructor(config: any) {
        super();

        this.logPath = undefined === config.logPath
            ? Candy.getPathAlias('@runtime/logs')
            : config.logPath;

        this.logFile = undefined === config.logFile
            ? 'system.log'
            : config.logFile;

        this.maxFileSize = undefined === config.maxFileSize
            ? 10240
            : config.maxFileSize;
    }

    /**
     * @inheritdoc
     */
    public flush(messages: any[]): void {
        // 检查目录
        fs.access(this.logPath, fs.constants.R_OK | fs.constants.W_OK, (err) => {
            if(null === err) {
                this.writeLog(messages);

                return;
            }

            FileHelper.createDirectory(this.logPath, 0o777, (err) => {
                this.writeLog(messages);
            });
        });
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

    /**
     * 写日志
     */
    private writeLog(messages) {
        let msg = this.formatMessage(messages);
        let file = this.logPath + '/' + this.logFile;

        // check file exists
        fs.access(file, fs.constants.F_OK, (err) => {
            // file not exists
            if(null !== err) {
                fs.writeFile(file, msg, (err) => {});

                return;
            }

            // check file size
            fs.stat(file, (err, stats) => {
                if(stats.size > this.maxFileSize * 1024) {
                    let newFile = file + TimeHelper.format('ymdhis');

                    fs.rename(file, newFile, (err) => {
                        fs.appendFile(file, msg, (err) => {});
                    });

                    return;
                }

                fs.appendFile(file, msg, (err) => {});
            });
        });
    }
    
}
