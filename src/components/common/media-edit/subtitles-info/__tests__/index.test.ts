/**
 * @FilePath     : \blog-client\src\components\common\media-edit\subtitles-info\__tests__\index.test.ts
 * @Description  : SubtitlesInfo 组件测试, 覆盖本地字幕文件选择功能
 */

import ElementPlus from "element-plus"
import { afterEach, describe, expect, it, vi } from "vitest"
import { mount } from "@vue/test-utils"
import { nextTick } from "vue"

// mock 播放器模块, 避免引入 HLS 等重型依赖
vi.mock("@/components/player", () => ({
    Language: { zh: "中文", en: "英文" },
}))

// mock 字幕相关 API, 避免真实网络请求
vi.mock("@/api/video/deleteSubtitles", () => ({ deleteSubtitlesAPI: vi.fn() }))
vi.mock("@/api/video/getSubtitlesByAdmin", () => ({ getSubtitlesByAdminAPI: vi.fn() }))
vi.mock("@/api/video/upsertSubtitles", () => ({ upsertSubtitlesAPI: vi.fn() }))
vi.mock("@/utils/getStreamIDsStatus", () => ({ pollingGetStreamIDsStatus: vi.fn() }))

// mock 消息提示, 便于断言调用
const messageMock = {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
}
vi.mock("@/utils/message", () => ({
    MessageUtil: {
        success: (...args: unknown[]) => messageMock.success(...args),
        error: (...args: unknown[]) => messageMock.error(...args),
        warning: (...args: unknown[]) => messageMock.warning(...args),
    },
}))

import SubtitlesInfo from "../index.vue"

const VALID_VTT = `WEBVTT

1
00:00:00.000 --> 00:00:03.000 line:88% position:50% align:center
这是一个字幕示例。
`

const mountComponent = () => {
    return mount(SubtitlesInfo, {
        props: {
            fileId: "1",
            hashId: "hash-1",
            subtitlesList: [],
        },
        global: {
            plugins: [ElementPlus],
        },
    })
}

// 用给定文件触发 input 的 change 事件
const dispatchFileChange = async (input: HTMLInputElement, file: File | null) => {
    Object.defineProperty(input, "files", {
        configurable: true,
        value: file ? [file] : [],
    })
    input.dispatchEvent(new Event("change"))
    await nextTick()
}

describe("SubtitlesInfo 本地字幕文件选择", () => {
    afterEach(() => {
        messageMock.success.mockClear()
        messageMock.error.mockClear()
        messageMock.warning.mockClear()
    })

    it("渲染选择文件按钮与隐藏的文件输入框", () => {
        const wrapper = mountComponent()
        const buttons = wrapper.findAll("button")
        expect(buttons.some((btn) => btn.text() === "选择文件")).toBe(true)
        expect(wrapper.find("input.subtitles-file-input").exists()).toBe(true)
    })

    it("选择合法 WebVTT 文件后写入字幕内容", async () => {
        const wrapper = mountComponent()
        const input = wrapper.find("input.subtitles-file-input").element as HTMLInputElement

        const file = new File([VALID_VTT], "demo.vtt", { type: "text/vtt" })
        await dispatchFileChange(input, file)

        // FileReader 读取为异步, 等待其完成
        await vi.waitFor(() => {
            expect(messageMock.success).toHaveBeenCalled()
        })

        const textarea = wrapper.find("textarea").element as HTMLTextAreaElement
        expect(textarea.value).toContain("WEBVTT")
        expect(messageMock.error).not.toHaveBeenCalled()
    })

    it("选择非 .vtt / .webvtt 扩展名文件时提示且不写入", async () => {
        const wrapper = mountComponent()
        const input = wrapper.find("input.subtitles-file-input").element as HTMLInputElement

        const file = new File([VALID_VTT], "demo.txt", { type: "text/plain" })
        await dispatchFileChange(input, file)

        expect(messageMock.warning).toHaveBeenCalled()
        const textarea = wrapper.find("textarea").element as HTMLTextAreaElement
        expect(textarea.value).toBe("")
    })

    it("选择内容非法的字幕文件时报错且不写入", async () => {
        const wrapper = mountComponent()
        const input = wrapper.find("input.subtitles-file-input").element as HTMLInputElement

        const file = new File(["not a valid vtt content"], "bad.vtt", { type: "text/vtt" })
        await dispatchFileChange(input, file)

        await vi.waitFor(() => {
            expect(messageMock.error).toHaveBeenCalled()
        })

        const textarea = wrapper.find("textarea").element as HTMLTextAreaElement
        expect(textarea.value).toBe("")
    })
})
