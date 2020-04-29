/**
 * @author
 * @license MIT
 */
import Candy = require('../Candy');
import Event = require('./Event');
import Behavior = require('./Behavior');

/**
 * 组件是实现 属性 (property) 行为 (behavior) 事件 (event) 的基类
 */
class Component extends Event {

    /**
     * @property {Map<String, any>} behaviorsMap the attached behaviors
     *
     * {
     *     'behaviorName1': BehaviorInstance1,
     *     'behaviorNameN': BehaviorInstanceN
     * }
     *
     */
    public behaviorsMap: Map<string, any>;

    /**
     * constructor
     */
    constructor() {
        super();

        this.behaviorsMap = new Map();
    }

    // 行为注入组件
    public injectBehaviors(): void {
        this.ensureDeclaredBehaviorsAttached();

        this.behaviorsMap.forEach((v) => {
            // 自有属性
            let keys = Object.keys(v);
            for(let i=0, len=keys.length; i<len; i++) {
                // 不覆盖已有属性
                if(undefined === this[ keys[i] ]) {
                    this[ keys[i] ] = v[ keys[i] ];
                }
            }

            // 原型属性 类的方法不可枚举 所以这里用了特殊 api
            keys = Object.getOwnPropertyNames(Object.getPrototypeOf(v));
            for(let i=0, len=keys.length; i<len; i++) {
                if('constructor' !== keys[i] && undefined === this[ keys[i]]) {
                    this[ keys[i] ] = v[ keys[i] ];
                }
            }
        });
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
        return null;
    }

    /**
     * 确保 behaviors() 声明的行为已保存到组件
     */
    public ensureDeclaredBehaviorsAttached(): void {
        let behaviors = this.behaviors();

        if(null === behaviors) {
            return;
        }

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
        if(!this.behaviorsMap.has(name)) {
            return null;
        }

        let behavior = this.behaviorsMap.get(name);

        this.behaviorsMap.delete(name);
        behavior.unListen();

        return behavior;
    }

    /**
     * 保存行为类到组件
     *
     * @param {String} name 行为的名称
     * @param {String | Behavior} behavior
     */
    public attachBehaviorInternal(name: string, behavior: any): void {
        if(!(behavior instanceof Behavior)) {
            behavior = Candy.createObject(behavior);
        }

        if(this.behaviorsMap.has(name)) {
            this.behaviorsMap.get(name).unListen();
        }

        // 行为类可以监听组件的事件并处理
        behavior.listen(this);
        this.behaviorsMap.set(name, behavior);
    }

}

export = Component;
