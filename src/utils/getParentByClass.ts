/**
 * @Author       : jiaopengzi
 * @Date         : 2023-12-21 14:19:20
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-01-09 17:19:00
 * @FilePath     : \blog-client\src\utils\getParentByClass.ts
 * @Description  : 根据类名获取父元素
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

/**
 * @description: 获取具有指定类名的父元素
 * @param element 目标元素
 * @param className 指定类名
 * @return 具有指定类名的父元素，如果不存在则返回null
 */
export function getParentByClass(element: HTMLElement, className: string): HTMLElement | null {
    let currentElement = element
    while (currentElement) {
        // 循环查找父元素
        if (currentElement.classList.contains(className)) {
            // 判断是否有指定类名
            return currentElement // 返回具有指定类名的父元素
        }
        currentElement = currentElement.parentElement as HTMLElement // 获取父元素
    }
    return null // 如果不存在则返回null
}

/**
 * @description: 检查元素是否具有指定类名的父元素
 * @param element 目标元素
 * @param className 指定类名
 * @return 如果存在则返回true，否则返回false
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
