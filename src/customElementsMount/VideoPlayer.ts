/*
 * FilePath    : blog-client\src\customElementsMount\VideoPlayer.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 挂载视频播放器到自定义元素
 */

import { createApp, h } from "vue"

import { MediaTypes, PlayerStateManager } from "@/components/player"
import VideoPlayer from "@/components/player"

import { Attributes, Names } from "../customElements"
import { getComponentContainersFromCustomElements } from "./getComponentContainers"

/**
 * @description: 挂载视频播放器到自定义元素
 * @param container 自定义元素父容器
 * @param tagName 自定义元素标签名
 */
export const mountVideoPlayerOnCustomElements = (container: HTMLElement, tagName: Names) => {
    const componentContainers = getComponentContainersFromCustomElements(container, tagName)
    if (!componentContainers) return

    componentContainers.forEach((el) => {
        const videoType = (el.getAttribute(Attributes.VideoType) || MediaTypes.HLS) as MediaTypes // 未设置默认为 hls
        const videoID = el.getAttribute(Attributes.Id) // hls 设置 videoID
        const videoSrc = el.getAttribute(Attributes.Src) // 非 hls 设置 videoSrc
        const videoPoster = el.getAttribute(Attributes.Poster) // 视频封面

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

        // 设置视频封面
        if (videoPoster) {
            videoState.setPoster(videoPoster)
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
