/**
 * FilePath    : blog-client\src\components\common\media-edit\media-show\__tests__\index.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : MediaShow 组件测试, 覆盖编辑弹窗内视频切换时的播放源重设 (bug01)
 */

import { mount } from "@vue/test-utils"
import { afterEach, describe, expect, it, vi } from "vitest"
import { nextTick, reactive } from "vue"

// mock 视频水印 hooks, 无需真实水印逻辑
vi.mock("@/components/hooks/useVideoWatermark", () => ({
    useVideoWatermark: vi.fn(),
}))

// mock 播放器模块, 收集 PlayerStateManager 的调用参数用于断言播放源切换
const managerMocks = vi.hoisted(() => ({
    setShortcutKey: vi.fn(),
    setIsAdmin: vi.fn(),
    setSize: vi.fn(),
    setVideoID: vi.fn(),
    setMediaType: vi.fn(),
    setSrc: vi.fn(),
    stop: vi.fn(),
    setCurrentTime: vi.fn(),
    setSubtitlesByVideoHashIdAuto: vi.fn(),
    getState: vi.fn(() => ({})),
}))

vi.mock("@/components/player", () => {
    // 以 class 形式提供 mock(vi.fn 产物不可 new), 实例方法全部指向共享 vi.fn 便于断言
    class MockPlayerStateManager {
        setShortcutKey = managerMocks.setShortcutKey
        setIsAdmin = managerMocks.setIsAdmin
        setSize = managerMocks.setSize
        setVideoID = managerMocks.setVideoID
        setMediaType = managerMocks.setMediaType
        setSrc = managerMocks.setSrc
        stop = managerMocks.stop
        setCurrentTime = managerMocks.setCurrentTime
        setSubtitlesByVideoHashIdAuto = managerMocks.setSubtitlesByVideoHashIdAuto
        getState = managerMocks.getState
    }
    return {
        MediaTypes: { HLS: "hls", MP4: "mp4", WEBM: "webm" },
        PlayerStateManager: MockPlayerStateManager,
        // VideoPlayer 以空渲染桩替代, 避免引入 HLS 等重型依赖
        default: { name: "VideoPlayerStub", render: () => null },
    }
})

import MediaShow from "../index.vue"

import type { MediaShowProps } from "../types"

const createVideoData = (overrides: Partial<MediaShowProps> = {}): MediaShowProps => ({
    file_id: "1",
    file_name: "hash-aaa.mp4",
    file_type: "video/mp4",
    file_url: "http://media.test/hash-aaa.mp4",
    thumbnail: "",
    file_name_display: "aaa",
    description: "",
    file_id_hash: "hash-aaa",
    is_free: false,
    is_generate_hls: false,
    subtitles_language_list: [],
    ...overrides,
})

const mountComponent = (data: MediaShowProps, hashId: string) => {
    return mount(MediaShow, {
        props: {
            hashId,
            data,
            updateSubtitlesTimestamp: 0,
        },
        global: {
            stubs: {
                // j-icon 为全局组件(由 plugins/directives.ts 注册), 测试环境以空桩替代避免解析告警
                "j-icon": true,
            },
        },
    })
}

describe("MediaShow 编辑弹窗视频切换 (bug01)", () => {
    afterEach(() => {
        Object.values(managerMocks).forEach((mock) => mock.mockClear())
    })

    it("挂载视频文件时初始化播放源", () => {
        const data = createVideoData()
        mountComponent(data, "hash-aaa")

        expect(managerMocks.setVideoID).toHaveBeenCalledWith("hash-aaa")
        expect(managerMocks.setMediaType).toHaveBeenCalledWith("mp4")
        expect(managerMocks.setSrc).toHaveBeenCalledWith("http://media.test/hash-aaa.mp4")
    })

    it("切换到下一个视频时重设播放源与进度", async () => {
        // 模拟父组件 updateForm: data 原地更新 + hashId prop 更新
        const data = reactive(createVideoData())
        const wrapper = mountComponent(data, "hash-aaa")

        Object.assign(data, createVideoData({ file_id: "2", file_name: "hash-bbb.mp4", file_url: "http://media.test/hash-bbb.mp4", file_id_hash: "hash-bbb" }))
        await wrapper.setProps({ hashId: "hash-bbb" })
        await nextTick()

        expect(managerMocks.setVideoID).toHaveBeenLastCalledWith("hash-bbb")
        expect(managerMocks.setSrc).toHaveBeenLastCalledWith("http://media.test/hash-bbb.mp4")
        // 新媒体不继承上一条视频的播放状态与播放位置
        expect(managerMocks.stop).toHaveBeenCalled()
        expect(managerMocks.setCurrentTime).toHaveBeenCalledWith(0)
    })

    it("从直链视频切换到 HLS 视频时切换媒体类型并清空直链", async () => {
        const data = reactive(createVideoData())
        const wrapper = mountComponent(data, "hash-aaa")

        Object.assign(
            data,
            createVideoData({
                file_id: "2",
                file_name: "hash-ccc.mp4",
                file_url: "http://media.test/hash-ccc.mp4",
                file_id_hash: "hash-ccc",
                is_generate_hls: true,
            }),
        )
        await wrapper.setProps({ hashId: "hash-ccc" })
        await nextTick()

        expect(managerMocks.setVideoID).toHaveBeenLastCalledWith("hash-ccc")
        expect(managerMocks.setMediaType).toHaveBeenLastCalledWith("hls")
        expect(managerMocks.setSrc).toHaveBeenLastCalledWith("")
    })
})
