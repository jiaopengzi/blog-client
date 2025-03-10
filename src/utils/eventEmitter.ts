/**
 * @FilePath     : \blog-client\src\utils\eventEmitter.ts
 * @Description  : 事件触发器 EventEmitter 类 参考袁老师的文章 https://fe.duyiedu.com/p/t_pc/goods_pc_detail/goods_detail/course_2hzyLq1i84ydVnT200svNMYPFVH
 */

/* eslint-disable @typescript-eslint/no-unsafe-function-type */

// 定义一个事件触发器类
export class EventEmitter<T extends string> {
    // 声明一个 Map，键是事件名称，值是一组监听函数
    private events: Map<T, Set<Function>>

    constructor() {
        // 在构造函数中初始化 events Map
        this.events = new Map()
    }

    // 'on' 方法用于订阅一个事件
    on(event: T, listener: Function) {
        // 如果 events Map 中还没有这个事件，就添加一个新的 Set 对象
        if (!this.events.has(event)) {
            this.events.set(event, new Set())
        }
        // 将监听器添加到事件的 Set 中
        this.events.get(event)!.add(listener)
    }

    // 'off' 方法用于取消订阅一个事件
    off(event: T, listener: Function) {
        // 如果 events Map 中有这个事件，就从事件的 Set 中删除监听器
        if (this.events.has(event)) {
            this.events.get(event)!.delete(listener)
        }
    }

    // 'once' 方法用于订阅一个只触发一次的事件
    once(event: T, listener: Function) {
        // 定义一个只执行一次的监听器
        const onceListener = (...args: unknown[]) => {
            // 执行监听器的处理函数
            listener(...args)
            // 执行后立即取消订阅
            this.off(event, onceListener)
        }
        // 使用 'on' 方法订阅这个只执行一次的监听器
        this.on(event, onceListener)
    }

    // 'emit' 方法用于发射一个事件
    emit(event: T, ...args: unknown[]) {
        // 如果 events Map 中有这个事件
        if (this.events.has(event)) {
            // 对事件的 Set 中的每一个监听器执行处理函数，传入的参数为 'args'
            this.events.get(event)!.forEach((listener) => {
                listener(...args)
            })
        }
    }
}
