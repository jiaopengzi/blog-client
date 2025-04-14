/**
 * @FilePath     : \blog-client\src\components\hooks\useScroll\useScroll.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 滚动事件监听
 */

import { onMounted, onUnmounted, unref } from "vue"

import type { Direction, ScrollContainer, ScrollHandler } from "./types"

/**
 * @description 获取滚动位置
 * @param container 滚动容器
 * @return 滚动位置
 */
const getScrollPosition = (container: ScrollContainer): number => {
    if (!container || container === window) {
        return window.scrollY || document.documentElement.scrollTop
    }
    return (container as HTMLElement).scrollTop
}

/**
 * @description 验证容器类型 确保是 Window 或 HTMLElement
 * @param container 滚动容器
 * @return 验证后的容器
 */
const validContainer = (container: ScrollContainer): Window | HTMLElement => {
    // 如果容器是 null 或 undefined，则返回 window
    if (!container) {
        console.warn("Container is null or undefined")
        return window
    }

    // 如果容器是 window，则直接返回 window
    if (container === window) {
        return window
    }

    // 使用 unref 将容器转换为原始值
    container = unref(container)

    // 如果不是 HTMLElement，则返回 window
    if (!(container instanceof HTMLElement)) {
        console.warn("Container must be a valid HTML element")
        return window
    }

    return container
}

/**
 * @description 监听滚动事件
 * @param handler 滚动事件回调函数
 * @param container 滚动容器 Window 或 HTMLElement(可选,默认为 window)
 */
export function useScroll(handler: ScrollHandler, container?: ScrollContainer) {
    let lastPosition = 0
    let lastTimestamp = performance.now()

    // 处理滚动事件的核心逻辑
    const handleScroll = () => {
        const currentPosition = getScrollPosition(container)

        const currentTimestamp = performance.now()
        const direction: Direction = currentPosition > lastPosition ? "down" : "up"

        // 计算滚动速度（像素/秒）
        const deltaTime = currentTimestamp - lastTimestamp
        const deltaPosition = Math.abs(currentPosition - lastPosition)
        const speed = (deltaPosition / deltaTime) * 1000

        // 触发回调函数
        handler({
            position: currentPosition,
            direction,
            speed,
        })

        // 更新滚动记录
        lastPosition = currentPosition
        lastTimestamp = currentTimestamp
    }

    onMounted(() => {
        // 容器类型校验
        container = validContainer(container)

        // 初始化位置
        lastPosition = getScrollPosition(container)

        // 添加滚动事件监听
        container.addEventListener("scroll", handleScroll, { passive: true })
    })

    onUnmounted(() => {
        // 容器类型校验
        container = validContainer(container)

        // 移除滚动事件监听
        container.removeEventListener("scroll", handleScroll)
    })
}
