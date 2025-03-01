/**
 * @Author       : jiaopengzi
 * @Date         : 2024-10-23 18:08:10
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-10-23 18:15:20
 * @FilePath     : \blog-client\src\components\editor\preview\utils\getComponentContainers.ts
 * @Description  : 获取自定义组件容器
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { BaseCustomElement } from "../customElements"

/**
 * @description: 获取自定义组件容器
 * @param {HTMLElement} container 自定义元素父容器
 * @param {typeof BaseCustomElement} childElement 自定义元素类即组件挂载容器的类
 * @return {NodeListOf<Element>} 返回自定义组件容器列表 或 null
 */
export const getComponentContainersFromCustomElements = (container: HTMLElement, childElement: typeof BaseCustomElement): NodeListOf<Element> | null => {
    // 判断 container childElement 是否存在，不存在则返回
    if (!container || !childElement) return null

    // 创建一个实例来获取 tagName
    const instance = new childElement()
    const childElementTagName = instance.tagName.toLowerCase()

    // 查找所有自定义组件容器
    return container.querySelectorAll(childElementTagName)
}
