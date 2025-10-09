/*
 * FilePath    : blog-client\src\customElementsMount\getComponentContainers.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 获取自定义组件容器
 */

import { Names } from "../customElements"

/**
 * @description: 获取自定义组件容器
 * @param {HTMLElement} container 自定义元素父容器
 * @param {Names} tagName 自定义元素标签名
 * @return {NodeListOf<Element>} 返回自定义组件容器列表 或 null
 */
export const getComponentContainersFromCustomElements = (container: HTMLElement, tagName: Names): NodeListOf<Element> | null => {
    // 判断 container 不存在则返回
    if (!container) return null

    // 创建一个实例来获取 tagName
    const instance = document.createElement(tagName)

    // 获取标签名并转为小写
    const childElementTagName = instance.tagName.toLowerCase()

    // 查找所有自定义组件容器
    return container.querySelectorAll(childElementTagName)
}
