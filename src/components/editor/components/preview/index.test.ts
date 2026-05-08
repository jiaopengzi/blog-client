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

    it("未传宽高时使用 100% 作为 CSS 变量默认值", async () => {
        const wrapper = mount(HtmlPreview, {
            props: {
                html: "<p>preview content</p>",
                imgUrls: [],
                isShowElImageViewer: false,
            },
            global: {
                directives: {
                    "stable-html": stableHtmlDirective,
                },
            },
        })

        await waitForAsyncRender()

        const previewElement = wrapper.get("#preview").element as HTMLElement

        expect(previewElement.style.getPropertyValue("--jpz-codemirror-width")).toBe("100%")
        expect(previewElement.style.getPropertyValue("--jpz-codemirror-height")).toBe("100%")
    })

    it("纯数字宽高会自动补齐 px 单位", async () => {
        const wrapper = mount(HtmlPreview, {
            props: {
                html: "<p>preview content</p>",
                imgUrls: [],
                isShowElImageViewer: false,
                width: "320",
                height: "640",
            },
            global: {
                directives: {
                    "stable-html": stableHtmlDirective,
                },
            },
        })

        await waitForAsyncRender()

        const previewElement = wrapper.get("#preview").element as HTMLElement

        expect(previewElement.style.getPropertyValue("--jpz-codemirror-width")).toBe("320px")
        expect(previewElement.style.getPropertyValue("--jpz-codemirror-height")).toBe("640px")
    })

    it("显式单位宽高会保持原值", async () => {
        const wrapper = mount(HtmlPreview, {
            props: {
                html: "<p>preview content</p>",
                imgUrls: [],
                isShowElImageViewer: false,
                width: "75%",
                height: "50vh",
            },
            global: {
                directives: {
                    "stable-html": stableHtmlDirective,
                },
            },
        })

        await waitForAsyncRender()

        const previewElement = wrapper.get("#preview").element as HTMLElement

        expect(previewElement.style.getPropertyValue("--jpz-codemirror-width")).toBe("75%")
        expect(previewElement.style.getPropertyValue("--jpz-codemirror-height")).toBe("50vh")
    })

    it("运行时 setProps 更新宽高后会同步刷新 CSS 变量", async () => {
        const wrapper = mount(HtmlPreview, {
            props: {
                html: "<p>preview content</p>",
                imgUrls: [],
                isShowElImageViewer: false,
                width: "320",
                height: "640",
            },
            global: {
                directives: {
                    "stable-html": stableHtmlDirective,
                },
            },
        })

        await waitForAsyncRender()

        const previewElement = wrapper.get("#preview").element as HTMLElement

        expect(previewElement.style.getPropertyValue("--jpz-codemirror-width")).toBe("320px")
        expect(previewElement.style.getPropertyValue("--jpz-codemirror-height")).toBe("640px")

        await wrapper.setProps({
            width: "75%",
            height: "480px",
        })

        await waitForAsyncRender()

        expect(previewElement.style.getPropertyValue("--jpz-codemirror-width")).toBe("75%")
        expect(previewElement.style.getPropertyValue("--jpz-codemirror-height")).toBe("480px")
    })
})
