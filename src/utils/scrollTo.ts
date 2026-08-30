/*
 * FilePath    : blog-client-nuxt\src\utils\scrollTo.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 滚动跳转
 */

// 可滚动的元素类型, 可以是 HTMLElement 或 Window 对象
type ScrollableElement = HTMLElement | Window | null

// 判断元素是否可滚动
function isScrollable(element: ScrollableElement): boolean {
    if (!element) return false
    return element instanceof HTMLElement && (element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth)
}

// 根据传入的元素查找可滚动的祖先元素:
// 如果是 Window 对象则直接返回自身,
// 如果是 HTMLElement 对象则调用 isScrollable 函数判断是否可滚动,
// 如果该元素不能滚动, 则向上查找其父元素, 直到找到一个可滚动的元素或到达根元素为止
function findScrollableParent(element: ScrollableElement): ScrollableElement {
    if (element instanceof Window) return element

    let parent: ScrollableElement = element

    while (parent) {
        if (isScrollable(parent)) return parent
        parent = parent.parentElement
    }

    return window // 未找到可滚动的父元素时返回 window
}

/**
 * @description: 获取元素相对于容器顶部的偏移量
 * @param container 容器元素
 * @param element 目标元素
 * @returns 元素相对于容器顶部的偏移量
 */
function getElementOffsetTop(container: ScrollableElement, element: HTMLElement): number | null {
    if (!container) return null

    // 是否为 window 对象
    if (container instanceof Window) {
        // 如果容器是 Window 对象, 则返回元素的偏移量
        return element.getBoundingClientRect().top + window.scrollY
    }

    if (!container.contains(element)) return null // 如果容器是 HTMLElement 且不包含目标元素, 则返回 null

    // 使用 getBoundingClientRect 计算目标元素相对于容器顶部的偏移量
    const containerRect = container.getBoundingClientRect()
    const elementRect = element.getBoundingClientRect()

    return elementRect.top - containerRect.top + (container as HTMLElement).scrollTop
}

/**
 * 封装监听 scrollend 并执行回调的通用函数
 * @param scrollEl 可滚动容器(Window 或 HTMLElement)
 * @param doScroll 实际执行滚动的函数
 * @param callback 滚动结束或模拟结束时执行的回调
 * @param fallbackDuration 不支持 scrollend 时的模拟等待时间(ms)
 */
function scrollEndWithCallback(scrollEl: Window | HTMLElement, doScroll: () => void, callback?: () => void, fallbackDuration = 500) {
    // 判断是否支持 scrollend
    if ("onscrollend" in scrollEl) {
        const onScrollEnd = () => {
            scrollEl.removeEventListener("scrollend", onScrollEnd)
            callback?.()
        }
        scrollEl.addEventListener("scrollend", onScrollEnd)
        doScroll()
    } else {
        doScroll()
        // 模拟滚动结束回调
        if (callback) {
            setTimeout(callback, fallbackDuration)
        }
    }
}

/**
 * 平滑滚动到指定容器内的目标元素, 或者直接使用目标元素的 `scrollIntoView` 方法
 *
 * @param target - 目标 HTML 元素。如果为 `null`, 函数将记录警告并返回
 * @param container - 可滚动的容器元素。如果为 `null`, 将直接使用目标元素的 `scrollIntoView` 方法
 * @param callback - 可选的回调函数, 在滚动完成后执行
 * @param scrollBy - 可选的偏移量, 用于调整最终滚动位置。默认为 `0`
 * @param options - 可选的滚动行为配置。默认为 `{ behavior: "smooth", block: "start", inline: "start" }`
 */
export function myScrollTo(
    target: HTMLElement | null,
    container: ScrollContainer = null,
    callback?: () => void,
    scrollBy: number = 0,
    options: ScrollIntoViewOptions = {
        behavior: "smooth",
        block: "start",
        inline: "start",
    },
): void {
    if (!target) {
        console.warn("Target element is null")
        return
    }

    // 当没有传递 container 时, 直接使用 target 的 scrollIntoView 方法
    if (container === null) {
        scrollEndWithCallback(window, () => target.scrollIntoView(options), callback)
        return
    }

    // 获取可滚动的父元素
    // Nuxt 适配: vueuse 类型收紧, container 断言为 HTMLElement(运行时行为不变)
    const scrollableParent = findScrollableParent(container as HTMLElement)

    // 如果没有找到可滚动的父元素, 则不执行滚动操作
    if (!scrollableParent) return

    // 目标元素距离容器顶部的偏移量
    const targetElementOffsetTop = getElementOffsetTop(scrollableParent, target)

    // 如果目标元素不在容器内, 则不执行滚动操作
    if (targetElementOffsetTop === null) return
    scrollEndWithCallback(
        scrollableParent,
        () =>
            scrollableParent.scrollTo({
                top: targetElementOffsetTop + scrollBy,
                behavior: options.behavior,
            }),
        callback,
    )
}
