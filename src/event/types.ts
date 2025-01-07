/**
 * @FilePath     : \blog-client\src\event\types.ts
 * @Description  : 事件类型(参考mitt：https://github.com/developit/mitt)
 */

// 事件类型可以是字符串或符号
export type EventType = string | symbol

// 事件处理函数类型
export type Handler<T = unknown> = (event: T) => void

// 通配符事件处理函数类型
export type WildcardHandler<T = Record<string, unknown>> = (
    type: keyof T,
    event: T[keyof T],
) => void

// 某个事件类型当前注册的所有事件处理函数数组
export type EventHandlerList<T = unknown> = Array<Handler<T>>

// 通配符事件处理函数数组
export type WildCardEventHandlerList<T = Record<string, unknown>> = Array<WildcardHandler<T>>

// 事件类型与其对应的事件处理函数的映射
export type EventHandlerMap<Events extends Record<EventType, unknown>> = Map<
    keyof Events | "*",
    EventHandlerList<Events[keyof Events]> | WildCardEventHandlerList<Events>
>

//  配置选项接口
export interface Options {
    enableTriggerSource?: boolean
}
export {}