/*
 * FilePath    : blog-client\src\customElementsMount\VideoPlayer.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 挂载视频播放器到自定义元素
 */

import { createApp, h } from "vue"

import { type MediaTypes, PlayerStateManager } from "@/components/player"
import VideoPlayer from "@/components/player"

import { BaseCustomElement } from "../customElements"
import { getComponentContainersFromCustomElements } from "./getComponentContainers"

/**
 * @description: 挂载视频播放器到自定义元素
 * @param container 自定义元素父容器
 * @param childElement 自定义元素类即组件挂载容器的类
 */
export const mountVideoPlayerOnCustomElements = (container: HTMLElement, childElement: typeof BaseCustomElement) => {
    const componentContainers = getComponentContainersFromCustomElements(container, childElement)
    if (!componentContainers) return

    componentContainers.forEach((el) => {
        const videoType = (el.getAttribute("video-type") || "hls") as MediaTypes // 未设置默认为 hls
        const videoID = el.getAttribute("id") // hls 设置 videoID
        const videoSrc = el.getAttribute("src") // 非 hls 设置 videoSrc

        const videoState = new PlayerStateManager()
        videoState.setMediaType(videoType)

        // hls 设置 videoID
        if (videoID) {
            videoState.setVideoID(videoID)
        }

        // 非 hls 设置 videoSrc
        if (videoSrc) {
            videoState.setSrc(videoSrc)
        }

        const state = videoState.getState()
        const app = createApp({
            render() {
                return h(VideoPlayer, { playerState: state })
            },
        })

        app.mount(el)
    })
}
