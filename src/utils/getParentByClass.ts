/*
 * FilePath    : blog-client-nuxt\src\utils\getParentByClass.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 根据类名获取父元素
 */

/**
 * @description: 获取具有指定类名的父元素
 * @param element 目标元素
 * @param className 指定类名
 * @return 具有指定类名的父元素, 如果不存在则返回 null
 */
export function getParentByClass(element: HTMLElement, className: string): HTMLElement | null {
    let currentElement = element
    while (currentElement) {
        if (currentElement.classList.contains(className)) {
            return currentElement
        }
        currentElement = currentElement.parentElement as HTMLElement
    }
    return null
}

/**
 * @description: 检查元素是否具有指定类名的父元素
 * @param element 目标元素
 * @param className 指定类名
 * @return 如果存在则返回 true, 否则返回 false
 */
export function HasParentByClass(element: HTMLElement | null, className: string): boolean {
    while (element) {
        if (element.classList.contains(className)) {
            return true
        }
        element = element.parentElement
    }
    return false
}
