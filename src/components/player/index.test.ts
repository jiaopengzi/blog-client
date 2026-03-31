/**
 * FilePath    : blog-client\src\components\player\index.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 播放器组件单元测试
 */

import { mount } from "@vue/test-utils"
import { reactive } from "vue"
import { describe, expect, it, vi } from "vitest"

vi.mock("@vueuse/core", async (importOriginal) => {
    const actual = await importOriginal<typeof import("@vueuse/core")>()

    return {
        ...actual,
        useResizeObserver: vi.fn(),
        useMutationObserver: vi.fn(),
        useMagicKeys: () => ({}),
    }
})

vi.mock("./hooks/fullScreen", () => ({
    useFullscreen: () => ({
        handleFullscreenChange: vi.fn(),
        handleOrientationChange: vi.fn(),
    }),
}))

vi.mock("./hooks/mouse", () => ({
    useMouse: () => ({
        controlsHidden: false,
        handleMousemove: vi.fn(),
        handleMouseenter: vi.fn(),
        handleMouseleave: vi.fn(),
    }),
}))

vi.mock("./hooks/subtitles", () => ({
    useSubtitles: () => ({
        isShowSubtitles: false,
        subtitlesSrc: "",
        srclang: "zh-CN",
        subtitlesLabel: "简体中文",
    }),
}))

vi.mock("./hooks/hls", () => ({
    useHls: () => ({
        hls: { value: null },
        destroyHls: vi.fn(),
        loadHls: vi.fn(),
    }),
}))

import VideoPlayer from "./index.vue"
import { createDefaultPlayerState } from "./utils"

describe("VideoPlayer", () => {
    it("在 canplay 之前无法 seek 时, 会在可播放后恢复历史进度", async () => {
        const playerState = reactive(createDefaultPlayerState())
        playerState.postId = "post-1"
        playerState.videoID = "video-1"
        playerState.playProgress.currentTime = 52

        const wrapper = mount(VideoPlayer, {
            props: {
                playerState,
            },
            global: {
                stubs: {
                    Controls: true,
                    VideoWatermark: {
                        template: '<div><slot></slot><slot name="toc"></slot></div>',
                    },
                    JIcon: true,
                },
            },
        })

        const videoElement = wrapper.find("video").element as HTMLVideoElement
        let readyState = 0
        let currentTime = 0

        Object.defineProperty(videoElement, "readyState", {
            configurable: true,
            get: () => readyState,
        })

        Object.defineProperty(videoElement, "duration", {
            configurable: true,
            get: () => 120,
        })

        Object.defineProperty(videoElement, "playbackRate", {
            configurable: true,
            get: () => 1,
        })

        Object.defineProperty(videoElement, "buffered", {
            configurable: true,
            get: () => ({
                length: 0,
                end: () => 0,
            }),
        })

        Object.defineProperty(videoElement, "currentTime", {
            configurable: true,
            get: () => currentTime,
            set: (value: number) => {
                if (readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
                    currentTime = value
                }
            },
        })

        playerState.isUserInput = true
        await wrapper.vm.$nextTick()

        expect(currentTime).toBe(0)

        readyState = HTMLMediaElement.HAVE_METADATA
        await wrapper.find("video").trigger("loadedmetadata")
        expect(currentTime).toBe(0)

        readyState = HTMLMediaElement.HAVE_FUTURE_DATA
        await wrapper.find("video").trigger("canplay")

        expect(currentTime).toBe(52)
        expect(playerState.isUserInput).toBe(false)
    })
})
