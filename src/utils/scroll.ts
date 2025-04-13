/**
 * @FilePath     : \blog-client\src\utils\scroll.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 滚动条工具类
 */

import { useScroll } from "@vueuse/core"
import { watch } from "vue"

// 定义 ScrollableElement 类型，表示可以滚动的元素，可以是 HTMLElement 或 Window 对象
type ScrollableElement = HTMLElement | Window | null

// 判断元素是否可滚动
function isScrollable(element: ScrollableElement): boolean {
    if (!element) return false // 如果元素为 null，返回 false
    return element instanceof HTMLElement && (element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth)
}

// 根据传入的元素判断判断该元素是否可滚动，
// 如果是 Window 对象则返回 true,
// 如果是 HTMLElement 对象则调用 isScrollable 函数判断是否可滚动
// 如果该元素不能滚动，则向上查找其父元素，直到找到一个可滚动的元素或到达根元素为止
function findScrollableParent(element: ScrollableElement): ScrollableElement {
    if (!element) return null // 如果元素为 null，返回 null

    if (element instanceof Window) return element // 如果是 Window 对象，直接返回

    let parent: ScrollableElement = element.parentElement // 获取父元素

    while (parent) {
        if (isScrollable(parent)) return parent // 如果父元素可滚动，返回该元素
        parent = parent.parentElement // 否则继续向上查找
    }

    return window // 如果没有找到可滚动的父元素，返回 null
}

/**
 * @description: 获取元素相对于容器顶部的偏移量
 * @param container 容器元素
 * @param element 目标元素
 * @returns 元素相对于容器顶部的偏移量
 */
function getElementOffsetTop(container: ScrollableElement, element: HTMLElement): number | null {
    if (!container) return null

    // 是否为window对象
    if (container instanceof Window) {
        // 如果容器是 Window 对象，则返回元素的偏移量
        return element.getBoundingClientRect().top + window.scrollY - container.scrollY
    }

    if (!container.contains(element)) return null // 如果容器是 HTMLElement 且不包含目标元素，则返回 null

    let offsetTop = 0 // 初始化目标元素相对于容器顶部的偏移量

    // while 循环计算目标元素相对于容器顶部的偏移量
    while (element && element !== container) {
        offsetTop += element.offsetTop
        element = element.offsetParent as HTMLElement
    }

    return offsetTop
}

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
    const scrollableParent = findScrollableParent(container)
    if (!scrollableParent) return // 如果没有找到可滚动的父元素，则不执行滚动操作。

    // 使用选择器查询滚动容器内的所有元素。
    const elements = container.querySelectorAll(selectors)

    // 获取目标元素，索引可能超出元素集合的范围。
    const targetElement = elements[index] as HTMLElement

    // 如果是 br 标签，则不执行滚动操作。
    if (targetElement.tagName === "BR") return

    // 目标元素距离容器顶部的偏移量
    const targetElementOffsetTop = getElementOffsetTop(scrollableParent, targetElement)
    if (targetElementOffsetTop === null) return // 如果目标元素不在容器内，则不执行滚动操作。

    // 执行滚动
    scrollableParent.scrollTo({
        top: targetElementOffsetTop,
        behavior: behavior,
    })

    // 使用 useScroll 监听滚动事件
    const { isScrolling } = useScroll(container)
    watch(isScrolling, (newValue) => {
        if (!newValue) {
            if (callback) {
                callback()
            }
        }
    })
}
