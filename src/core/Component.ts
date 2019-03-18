/**
 * @author
 * @license MIT
 */
import Candy from '../Candy';
import Event from './Event';
import Behavior from './Behavior';

/**
 * 组件是实现 属性 (property) 行为 (behavior) 事件 (event) 的基类
 */
export default class Component extends Event {

    /**
     * @property {Object} eventsMap the attached event handlers
     *
     * ```
     * {
     *     'eventName': [fn1, fn2...]
     *     'eventName2': [fn1, fn2...]
     * }
     * ```
     *
     */
    public eventsMap: any;

    /**
     * @property {Object} behaviorsMap the attached behaviors
     *
     * ```
     * {
     *     'behaviorName': BehaviorInstance
     *     ...
     * }
     * ```
     *
     */
    public behaviorsMap: any;

    /**
     * constructor
     */
    constructor() {
        super();

        this.eventsMap = {};
        this.behaviorsMap = {};

        this.ensureDeclaredBehaviorsAttached();
    }

    // 行为注入组件
    public inject(): void {
        let keys: string[] = Object.keys(this.behaviorsMap);

        if(0 === keys.length) return;

        // 相对于其他编程语言来说这种处理方式并不是很好
        // 但在 javascript 中没找到更好的解决方式 暂时写成这样了
        let ret: string[] = null;
        for(var i=0,length=keys.length; i<length; i++) {
            // 本身
            ret = Object.getOwnPropertyNames(this.behaviorsMap[keys[i]]);
            for(let x=0,len=ret.length; x<len; x++) {
                if(undefined !== this[ret[x]]) {
                    continue;
                }

                this[ret[x]] = this.behaviorsMap[keys[i]][ret[x]];
            }

            // 原型链
            ret = Object.getOwnPropertyNames(Object.getPrototypeOf(this.behaviorsMap[keys[i]]));
            for(let x=0,len=ret.length; x<len; x++) {
                if('constructor' === ret[x] || undefined !== this[ret[x]]) {
                    continue;
                }

                this[ret[x]] = this.behaviorsMap[keys[i]][ret[x]];
            }
        }
    }

    /**
     * 声明该组件的行为列表 子类组件可以重写该方法去指定要附加的行为类
     *
     * ```
     * {
     *     'behaviorName': {
     *         'classPath': 'BehaviorClassName',
     *         'property1': 'value1',
     *         'property2': 'value2'
     *     },
     *     'behaviorName2': 'BehaviorClassName2'
     *     'behaviorName3': BehaviorClassInstance
     * }
     * ```
     *
     * @return {Object}
     */
    public behaviors(): any {
        return {};
    }

    /**
     * 确保 behaviors() 声明的行为已保存到组件
     */
    public ensureDeclaredBehaviorsAttached(): void {
        let behaviors: any = this.behaviors();
        for(let name in behaviors) {
            this.attachBehaviorInternal(name, behaviors[name]);
        }
    }

    /**
     * 向组件附加一个行为
     *
     * @param {String} name 行为的名称
     * @param {String | Behavior} behavior
     */
    public attachBehavior(name: string, behavior: string | Behavior): void {
        this.attachBehaviorInternal(name, behavior);
    }

    /**
     * 删除组件的行为
     *
     * @param {String} name 行为的名称
     * @return {Object | null}
     */
    public detachBehavior(name: string): any {
        if(undefined !== this.behaviorsMap[name]) {
            let behavior = this.behaviorsMap[name];

            delete this.behaviorsMap[name];
            behavior.unListen();

            return behavior;
        }

        return null;
    }

    /**
     * 保存行为类到组件
     *
     * @param {String} name 行为的名称
     * @param {String | Behavior} behavior
     */
    public attachBehaviorInternal(name: string, behavior: string | Behavior): void {
        if(!(behavior instanceof Behavior)) {
            behavior = Candy.createObject(behavior);
        }

        if(undefined !== this.behaviorsMap[name]) {
            this.behaviorsMap[name].unListen();
        }

        // 行为类可以监听组件的事件并处理
        (<Behavior>behavior).listen(this);
        this.behaviorsMap[name] = behavior;
    }

}
