import { mount } from "@vue/test-utils"
import { nextTick } from "vue"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { CommandsKey } from "@/components/editor/command"
import { stableHtmlDirective } from "@/utils/stableHtmlDirective"

const {
    debounceMock,
    useResizeObserverMock,
    useIntersectionObserverMock,
    mountPayContentOnCustomElementsMock,
    prepareCopyWithCustomStyleMock,
    writePreparedHtmlToClipboardMock,
    scaleDisplayKatexByFontSizeMock,
    copyWithCustomStyleMock,
} = vi.hoisted(() => ({
    debounceMock: vi.fn((_: number, callback: () => void) => callback),
    useResizeObserverMock: vi.fn(() => ({
        stop: vi.fn(),
    })),
    useIntersectionObserverMock: vi.fn(() => ({
        stop: vi.fn(),
    })),
    mountPayContentOnCustomElementsMock: vi.fn(),
    prepareCopyWithCustomStyleMock: vi.fn(async () => "prepared-html"),
    writePreparedHtmlToClipboardMock: vi.fn(async () => undefined),
    scaleDisplayKatexByFontSizeMock: vi.fn(),
    copyWithCustomStyleMock: vi.fn(async () => undefined),
}))

vi.mock("throttle-debounce", () => ({
    debounce: debounceMock,
}))

vi.mock("@vueuse/core", () => ({
    useResizeObserver: useResizeObserverMock,
    useIntersectionObserver: useIntersectionObserverMock,
}))

vi.mock("@/customElementsMount", () => ({
    mountPayContentOnCustomElements: mountPayContentOnCustomElementsMock,
}))

vi.mock("../../utils", () => ({
    copyWithCustomStyle: copyWithCustomStyleMock,
    htmlHandleWeChat: (html: string) => html,
    prepareCopyWithCustomStyle: prepareCopyWithCustomStyleMock,
    scaleDisplayKatexByFontSize: scaleDisplayKatexByFontSizeMock,
    writePreparedHtmlToClipboard: writePreparedHtmlToClipboardMock,
}))

import HtmlPreview from "./index"

const waitForAsyncRender = async () => {
    await nextTick()
    await Promise.resolve()
    await nextTick()
}

const requestAnimationFrameMock = vi.fn((callback: FrameRequestCallback) => {
    callback(0)
    return 1
})

const cancelAnimationFrameMock = vi.fn()

describe("HtmlPreview", () => {
    beforeEach(() => {
        vi.stubGlobal("requestAnimationFrame", requestAnimationFrameMock)
        vi.stubGlobal("cancelAnimationFrame", cancelAnimationFrameMock)
        debounceMock.mockClear()
        useResizeObserverMock.mockClear()
        useIntersectionObserverMock.mockClear()
        mountPayContentOnCustomElementsMock.mockClear()
        prepareCopyWithCustomStyleMock.mockClear()
        writePreparedHtmlToClipboardMock.mockClear()
        scaleDisplayKatexByFontSizeMock.mockClear()
        copyWithCustomStyleMock.mockClear()
        requestAnimationFrameMock.mockClear()
        cancelAnimationFrameMock.mockClear()
    })

    it("仅在 isEditing 为 true 时预生成复制缓存", async () => {
        const wrapper = mount(HtmlPreview, {
            props: {
                html: "<p>preview content</p>",
                imgUrls: [],
                isShowElImageViewer: false,
                viewCommand: {
                    commandName: "" as CommandsKey,
                    time: new Date(),
                },
            },
            global: {
                directives: {
                    "stable-html": stableHtmlDirective,
                },
            },
        })

        await waitForAsyncRender()
        expect(prepareCopyWithCustomStyleMock).not.toHaveBeenCalled()

        await wrapper.setProps({
            isEnableCopyCache: true,
            height: "640px",
        })

        await waitForAsyncRender()
        expect(prepareCopyWithCustomStyleMock).toHaveBeenCalledTimes(1)
    })

    it("未命中缓存时仍允许手动复制", async () => {
        const wrapper = mount(HtmlPreview, {
            props: {
                html: "<p>preview content</p>",
                imgUrls: [],
                isShowElImageViewer: false,
                viewCommand: {
                    commandName: "" as CommandsKey,
                    time: new Date(0),
                },
            },
            global: {
                directives: {
                    "stable-html": stableHtmlDirective,
                },
            },
        })

        await waitForAsyncRender()
        expect(prepareCopyWithCustomStyleMock).not.toHaveBeenCalled()

        await wrapper.setProps({
            viewCommand: {
                commandName: CommandsKey.Copy,
                time: new Date(1),
            },
        })

        await waitForAsyncRender()
        expect(copyWithCustomStyleMock).toHaveBeenCalledTimes(1)
        expect(writePreparedHtmlToClipboardMock).not.toHaveBeenCalled()
    })
})
