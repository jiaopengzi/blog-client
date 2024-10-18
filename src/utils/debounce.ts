/**
 * @Author       : jiaopengzi
 * @Date         : 2023-12-18 10:42:12
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-09-08 14:05:19
 * @FilePath     : \blog-client\src\utils\debounce.ts
 * @Description  : 防抖函数
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

// 定义 DebounceFn 类型，表示需要防抖的函数类型
type DebounceFn = (this: unknown, ...args: any[]) => void

// 定义 DebouncedFn 类型，表示防抖后的函数类型
type DebouncedFn = (...args: any[]) => void

/**
 * 防抖函数
 *
 * @param wait 防抖延迟时间，默认值为 100ms
 * @param fn 需要防抖处理的函数
 * @returns 返回经过防抖处理的新函数
 * @example const debouncedFn = debounce(fn, 100)
 */
export function debounce(wait: number = 100, fn: DebounceFn): DebouncedFn {
    // 用于存储 setTimeout 的返回值
    let timeoutId: ReturnType<typeof setTimeout> | null = null

    // 返回一个新的 debounced 函数
    return function debounced(this: unknown, ...args: any[]): void {
        // 如果 timeoutId 不为 null，表示已存在计时器，清除计时器并重新设置
        if (timeoutId !== null) {
            clearTimeout(timeoutId)
        }

        // 设置一个计时器，在指定时间后执行原始函数，并传入相应参数和正确的上下文
        timeoutId = setTimeout(() => {
            fn.call(this, ...args)
            timeoutId = null
        }, wait)
    }
}
