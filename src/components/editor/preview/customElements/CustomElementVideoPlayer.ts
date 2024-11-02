/**
 * @Author       : jiaopengzi
 * @Date         : 2024-10-23 18:01:44
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-11-02 15:42:59
 * @FilePath     : \blog-client\src\components\editor\preview\customElements\CustomElementVideoPlayer.ts
 * @Description  : 自定义元素 VideoPlayer 视频播放器,用于挂载视频播放器vue组件
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { BaseCustomElement } from "./base"

/**
 * @description:自定义元素 VideoPlayer 视频播放器,用于挂载视频播放器vue组件
 */
export class CustomElementVideoPlayer extends BaseCustomElement {
    constructor() {
        super()
    }
}

// 注册自定义元素
customElements.define("video-player", CustomElementVideoPlayer)
