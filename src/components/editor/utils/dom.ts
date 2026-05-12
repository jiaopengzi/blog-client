/**
 * FilePath    : blog-client\src\components\editor\utils\dom.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : DOM 工具函数
 */

/**
 * @description 检查元素自身或其任意祖先是否包含指定类名
 * @param element 起始元素
 * @param className 要检查的 CSS 类名
 * @returns 若找到匹配元素则返回 true, 否则 false
 */
export function hasClassName(element: HTMLElement | SVGElement, className: string): boolean {
    let current: Element | null = element
    while (current) {
        // 检查当前元素是否包含该类名(兼容 SVGElement 无 classList 的情况)
        if ("classList" in current && current.classList instanceof DOMTokenList && current.classList.contains(className)) {
            return true
        }
        current = current.parentElement
    }
    return false
}

// 判断当前元素或其任意祖先是否为 code 标签
export function isCodeTag(element: HTMLElement | SVGElement): boolean {
    let current: Element | null = element
    while (current) {
        if (current.tagName.toLowerCase() === "code") {
            return true
        }
        current = current.parentElement
    }
    return false
}

export function isHeadingElement(el: HTMLElement | SVGElement): boolean {
    return el instanceof HTMLElement && /^H[1-6]$/.test(el.tagName)
}
