/**
 * @Author       : jiaopengzi
 * @Date         : 2024-10-23 17:58:58
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-10-23 18:05:41
 * @FilePath     : \blog-client\src\components\editor\preview\customElements\index.ts
 * @Description  : 自定义元素
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

export * from "./base"
export * from "./CustomElementVideoPlayer"
import { CustomElementVideoPlayer } from "./CustomElementVideoPlayer"

// 将所有自定义元素类放入对象
const customElementsObj = {
    "video-player": CustomElementVideoPlayer,
}

// 遍历对象进行注册
Object.entries(customElementsObj).forEach(([tagName, elementClass]) => {
    customElements.define(tagName, elementClass)
})
