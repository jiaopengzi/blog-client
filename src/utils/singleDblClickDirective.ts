/*
 * FilePath    : blog-client\src\utils\permissionDirective.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 权限指令
 */

import type { Directive, DirectiveBinding } from "vue"

/** 单击/双击回调函数签名 */
export type ClickHandler = (event: MouseEvent) => void

/** 指令传入的参数类型
 *
 * single: 单击回调函数
 *
 * double: 双击回调函数
 *
 * delay: 判定单击 vs. 双击的时间间隔（毫秒）
 */
export interface SingleDblClickBinding {
    single?: ClickHandler
    double?: ClickHandler
    delay?: number
}

/**
 * 使用方式：
 * v-single-dbl-click="{ single: handleSingle, double: handleDouble, delay: 300 }"
 * single / double 分别对应单击、双击时执行的回调函数
 * delay 为判定单击 vs. 双击的时间间隔（毫秒），默认 300
 */
export const singleDblClickDirective: Directive = {
    mounted(el: HTMLElement, binding: DirectiveBinding<SingleDblClickBinding>): void {
        const { single, double, delay = 300 } = binding.value || {}
        let timer: ReturnType<typeof setTimeout> | null = null

        // 监听原生 click 事件
        el.addEventListener("click", (event: MouseEvent): void => {
            // 如果已存在定时器, 说明再次点击了, 视为双击
            if (timer) {
                clearTimeout(timer)
                timer = null
                double?.(event)
            } else {
                // 否则开启定时器，等待 delay 毫秒后认定为单击
                timer = setTimeout((): void => {
                    single?.(event)
                    timer = null
                }, delay)
            }
        })
    },

    // 在 unmounted 时需要取消监听
    unmounted(el: HTMLElement) {
        el.removeEventListener("click", () => {})
    },
}
