/**
 * @Author       : jiaopengzi
 * @Date         : 2024-10-23 18:08:06
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-11-02 19:00:21
 * @FilePath     : \blog-client\src\components\editor\preview\utils\VideoPlayer.ts
 * @Description  : 挂载视频播放器到自定义元素
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { h, createApp } from "vue"
import { PlayerStateManager, type MediaTypes } from "@/components/player"
import VideoPlayer from "@/components/player"
import Icon from "@/components/common/icons"
import { BaseCustomElement } from "../customElements"
import { getComponentContainersFromCustomElements } from "./getComponentContainers"

/**
 * @description: 挂载视频播放器到自定义元素
 * @param container 自定义元素父容器
 * @param childElement 自定义元素类即组件挂载容器的类
 */
export const mountVideoPlayerOnCustomElements = (
    container: HTMLElement,
    childElement: typeof BaseCustomElement,
) => {
    const componentContainers = getComponentContainersFromCustomElements(container, childElement)
    if (!componentContainers) return

    componentContainers.forEach((el) => {
        const videoID = el.getAttribute("id")

        // 未设置默认为hls
        const videoType = (el.getAttribute("video-type") || "hls") as MediaTypes
        const videoSrc = el.getAttribute("src") || ""

        if (videoID) {
            const videoState = new PlayerStateManager()
            videoState.setVideoID(videoID)
            videoState.setMediaType(videoType)
            videoState.setSrc(videoSrc)

            const state = videoState.getState()

            const app = createApp({
                render() {
                    return h(VideoPlayer, { playerState: state })
                },
            })

            // eslint-disable-next-line vue/multi-word-component-names
            app.component("Icon", Icon) // 注册全局组件

            app.mount(el)
        }
    })
}
