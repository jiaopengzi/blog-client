/**
 * @Author       : jiaopengzi
 * @Date         : 2023-12-11 15:32:10
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-10-21 17:32:32
 * @FilePath     : \blog-client\src\utils\scroll.ts
 * @Description  : 滚动条工具类
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

import { useScroll } from "@vueuse/core"
import { watch } from "vue"

/**
 * @description: 滚动到指定元素
 * @param container 滚动容器
 * @param index 目标元素索引
 * @param selectors 元素选择器，默认为所有元素
 * @param behavior 滚动行为，默认为平滑滚动
 */
export function scrollToElement(
    container: HTMLElement | null,
    index: number,
    selectors: string = "*",
    behavior: ScrollBehavior = "smooth",
    callback?: () => void,
): void {
    // 如果容器为null，则不执行滚动操作。
    if (!container) return
    // 使用 useScroll 监听滚动事件
    const { isScrolling } = useScroll(container)

    // 使用选择器查询滚动容器内的所有元素。
    const elements = container.querySelectorAll(selectors)

    // 获取目标元素，索引可能超出元素集合的范围。
    const targetElement = elements[index] as HTMLElement

    // 如果是 br 标签，则不执行滚动操作。
    if (targetElement.tagName === "BR") return

    // 目标元素距离容器顶部的偏移量
    const targetElementOffsetTop = getElementOffsetTop(container, targetElement)
    // 目标元素存在且容器有偏移量
    if (container.offsetTop && targetElementOffsetTop) {
        // 计算滚动目标的偏移量，并通过容器的偏移量调整。
        container.scrollTo({
            top: targetElementOffsetTop - container.offsetTop,
            behavior: behavior,
        })
    }

    watch(isScrolling, (newValue) => {
        if (!newValue) {
            if (callback) {
                callback()
            }
        }
    })
}

/**
 * @description: 获取元素相对于容器顶部的偏移量
 * @param container 容器元素
 * @param element 目标元素
 * @returns 元素相对于容器顶部的偏移量
 */
function getElementOffsetTop(container: HTMLElement, element: HTMLElement): number | null {
    if (!container.contains(element)) return null // 如果容器不包含目标元素，则返回null

    let offsetTop = 0 // 初始化目标元素相对于容器顶部的偏移量

    // while 循环计算目标元素相对于容器顶部的偏移量
    while (element && element !== container) {
        offsetTop += element.offsetTop
        element = element.offsetParent as HTMLElement
    }

    return offsetTop
}
