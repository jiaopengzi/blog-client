/**
 * @FilePath     : \blog-client\src\event\emitter.ts.
 * @Description  : 事件处理器(参考mitt：https://github.com/developit/mitt)
 */

import type { EventHandlerList, EventHandlerMap, EventType, Handler, Options, WildCardEventHandlerList, WildcardHandler } from "./types"

export class Emitter<Events extends Record<EventType, unknown> = Record<string, unknown>> {
    // 单例实例
    private static instance: Emitter<Record<string, unknown>>

    // 存储所有事件处理函数的映射
    private all: EventHandlerMap<Events>

    // 是否启用触发源记录
    private enableTriggerSource: boolean

    // 私有构造函数，防止外部实例化
    private constructor(all?: EventHandlerMap<Events>, options?: Options) {
        this.all = all || new Map()
        this.enableTriggerSource = options?.enableTriggerSource ?? false
    }

    // 获取单例实例的方法
    public static getInstance<Events extends Record<EventType, unknown>>(all?: EventHandlerMap<Events>, options?: Options): Emitter<Events> {
        if (!Emitter.instance) {
            // 如果实例不存在，则创建一个新的实例
            Emitter.instance = new Emitter(all, options) as Emitter<Record<string, unknown>>
        }

        // 返回单例实例
        return Emitter.instance as Emitter<Events>
    }

    // 获取触发源的方法
    private getTriggerSource(): string {
        const error = new Error()
        const stack = error.stack?.split("\n")[3] // 根据堆栈结构调整索引
        return stack?.trim() || "unknown source"
    }

    // 注册事件处理函数
    on<Key extends keyof Events>(type: Key, handler: Handler<Events[Key]>, triggerSource?: string): void
    on(type: "*", handler: WildcardHandler<Events>, triggerSource?: string): void
    on<Key extends keyof Events>(type: Key | "*", handler: Handler<Events[keyof Events]> | WildcardHandler<Events>, triggerSource?: string): void {
        // 获取触发源信息
        const source = this.enableTriggerSource ? triggerSource || this.getTriggerSource() : triggerSource
        // 获取当前事件类型的处理函数数组
        const handlers: Array<Handler<Events[keyof Events]> | WildcardHandler<Events>> | undefined = this.all.get(type)
        // 包装处理函数和触发源
        const handlerWithSource = {
            handler: handler as Handler<Events[keyof Events]>,
            triggerSource: source,
        }
        if (handlers) {
            // 如果处理函数数组存在，则添加新的处理函数
            handlers.push(handlerWithSource.handler)
        } else {
            // 如果处理函数数组不存在，则创建新的数组并添加处理函数
            this.all.set(type, [handlerWithSource.handler] as EventHandlerList<Events[keyof Events]>)
        }
    }

    // 取消注册事件处理函数
    off<Key extends keyof Events>(type: Key, handler?: Handler<Events[Key]>): void
    off(type: "*", handler: WildcardHandler<Events>): void
    off<Key extends keyof Events>(type: Key | "*", handler?: Handler<Events[keyof Events]> | WildcardHandler<Events>): void {
        // 获取当前事件类型的处理函数数组
        const handlers: Array<Handler<Events[keyof Events]> | WildcardHandler<Events>> | undefined = this.all.get(type)
        if (handlers) {
            if (handler) {
                // 如果提供了处理函数，则从数组中移除该处理函数
                handlers.splice(handlers.indexOf(handler) >>> 0, 1)
            } else {
                // 如果没有提供处理函数，则清空数组
                this.all.set(type, [])
            }
        }
    }

    // 触发事件
    emit<Key extends keyof Events>(type: Key, evt?: Events[Key]): void {
        // 获取当前事件类型的处理函数数组
        let handlers = this.all.get(type)
        if (handlers) {
            // 调用所有处理函数
            ;(handlers as EventHandlerList<Events[keyof Events]>).slice().map((handler) => {
                handler(evt!)
            })
        }

        // 获取通配符事件处理函数数组
        handlers = this.all.get("*")
        if (handlers) {
            // 调用所有通配符处理函数
            ;(handlers as WildCardEventHandlerList<Events>).slice().map((handler) => {
                handler(type, evt!)
            })
        }
    }
}

export {}
