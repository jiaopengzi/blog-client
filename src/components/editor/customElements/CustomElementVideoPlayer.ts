/*
 * FilePath    : blog-client\src\components\editor\customElements\CustomElementVideoPlayer.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 自定义元素 VideoPlayer 视频播放器, 用于挂载视频播放器vue组件
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
