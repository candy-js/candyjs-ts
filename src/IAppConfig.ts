/**
 * The configuration of a app
 */
export default interface AppConfig {
    /**
     * 应用标识
     */
    id: number;

    /**
     * 项目路径
     */
    appPath: string;

    /**
     * 缓存路径
     */
    runtimePath?: string;

    /**
     * 项目根目录
     */
    rootPath?: string;
}