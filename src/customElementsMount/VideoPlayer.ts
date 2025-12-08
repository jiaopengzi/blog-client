/*
 * FilePath    : blog-client\src\customElementsMount\VideoPlayer.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 挂载视频播放器到自定义元素
 */

import { createApp, h } from "vue"

import { MediaTypes, type PlayerState, PlayerStateManager } from "@/components/player"
import VideoPlayer from "@/components/player"

import { Attributes, Names } from "../customElements"
import { getComponentContainersFromCustomElements } from "./getComponentContainers"

// 通过自定义元素获取视频播放器状态
export const getVideoPlayerState = (el: Element, postID: string = ""): { elTarget: Element | null; state: PlayerState } => {
    let elTarget: Element | null = null
    let state: PlayerState = {} as PlayerState

    if (!el) return { elTarget, state }

    // 只会有一个元素
    const videoType = (el.getAttribute(Attributes.VideoType) || MediaTypes.HLS) as MediaTypes // 未设置默认为 hls
    const videoID = el.getAttribute(Attributes.Id) // hls 设置 videoID
    const videoSrc = el.getAttribute(Attributes.Src) // 非 hls 设置 videoSrc
    const videoPoster = el.getAttribute(Attributes.Poster) // 视频封面

    const videoState = new PlayerStateManager()
    videoState.setMediaType(videoType)
    videoState.setPostID(postID)

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

    elTarget = el
    state = videoState.getState()

    return { elTarget, state }
}

/**
 * @description: 挂载视频播放器到自定义元素
 * @param container 自定义元素父容器
 * @param tagName 自定义元素标签名
 */
export const mountVideoPlayerOnCustomElements = (container: HTMLElement, tagName: Names) => {
    const componentContainers = getComponentContainersFromCustomElements(container, tagName)

    if (!componentContainers) return

    componentContainers.forEach((el) => {
        const { elTarget, state } = getVideoPlayerState(el)
        if (!elTarget) return

        const app = createApp({
            render() {
                return h(VideoPlayer, { playerState: state })
            },
        })

        app.mount(elTarget)
    })
}
