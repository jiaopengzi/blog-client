/**
 * FilePath    : blog-client\src\views\md\component\md-customizer\index.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : /md 自定义弹窗组件测试
 */

import { mount } from "@vue/test-utils"
import { defineComponent, nextTick } from "vue"
import { beforeEach, describe, expect, it, vi } from "vitest"

import MdCustomizer from "."

const { saveMdCustomStateMock, clearMdCustomStateMock, setImageCaptionFormatMock, setHljsThemeMock, cssExampleMock } = vi.hoisted(() => {
    return {
        saveMdCustomStateMock: vi.fn(),
        clearMdCustomStateMock: vi.fn(),
        setImageCaptionFormatMock: vi.fn(),
        setHljsThemeMock: vi.fn().mockResolvedValue(void 0),
        cssExampleMock: vi.fn((previewSelector?: string) => (previewSelector ? `example-css:${previewSelector}` : "example-css")),
    }
})

vi.mock("@/stores/md-custom", () => {
    const defaultState = {
        imageCaptionFormat: "alt",
        customCss: "",
        showLineNumbers: true,
        fontFamily: "",
        fontSize: "16px",
        themeColor: "",
        paragraphIndent: "2em",
    }

    return {
        getDefaultMdCustomState: () => ({ ...defaultState }),
        loadMdCustomState: () => ({ ...defaultState }),
        saveMdCustomState: saveMdCustomStateMock,
        clearMdCustomState: clearMdCustomStateMock,
    }
})

vi.mock("@/pkg/marked/extension/renderer", () => {
    return {
        ImageCaptionFormat: {
            Alt: "alt",
            Filename: "filename",
            None: "none",
        },
        setImageCaptionFormat: setImageCaptionFormatMock,
    }
})

vi.mock("@/pkg/highlight.js/theme-switcher", () => {
    return {
        setHljsTheme: setHljsThemeMock,
    }
})

vi.mock("../customize-style", () => {
    return {
        MD_PREVIEW_SCOPE_SELECTOR: ".md-page-preview",
        buildMdPresetCss: () => "",
        buildMdCustomizerEditorDoc: (state: { customCss: string }) => (state.customCss ? `doc:${state.customCss}` : "doc:default"),
        extractMdCustomUserCss: (doc: string) => doc.replace(/^doc:/, ""),
    }
})

vi.mock("@/utils/cssExample", () => ({
    cssExample: cssExampleMock,
}))

vi.mock("@/utils/cssValidator", () => ({
    removeCommentsSafe: (css: string) => css,
}))

vi.mock("@/utils/style", () => ({
    scopeCssToSelector: (css: string) => css,
    scopeCustomThemeCss: (css: string) => css,
}))

const MdCustomizerConfigPanelStub = defineComponent({
    name: "MdCustomizerConfigPanel",
    emits: ["reset"],
    template: '<button class="reset-trigger" @click="$emit(\'reset\')">reset</button>',
})

const MdCustomizerEditorPanelStub = defineComponent({
    name: "MdCustomizerEditorPanel",
    props: {
        doc: {
            type: String,
            required: true,
        },
        editorHeight: {
            type: String,
            required: true,
        },
    },
    emits: ["update-editor-doc", "insert-css-example"],
    template: `
        <div>
            <div class="editor-doc">{{ doc }}</div>
            <button class="editor-change" @click="$emit('update-editor-doc', 'doc:manual-css')">change</button>
            <button class="insert-example" @click="$emit('insert-css-example')">insert</button>
        </div>
    `,
})

describe("MdCustomizer", () => {
    beforeEach(() => {
        saveMdCustomStateMock.mockReset()
        clearMdCustomStateMock.mockReset()
        setImageCaptionFormatMock.mockReset()
        setHljsThemeMock.mockClear()
        cssExampleMock.mockClear()
        document.head.innerHTML = ""
    })

    it("用户手动修改后再次重置应仍然把默认文档同步回右侧编辑器", async () => {
        const wrapper = mount(MdCustomizer, {
            props: {
                visible: true,
            },
            global: {
                stubs: {
                    Teleport: true,
                    MdCustomizerConfigPanel: MdCustomizerConfigPanelStub,
                    MdCustomizerEditorPanel: MdCustomizerEditorPanelStub,
                },
            },
        })

        await nextTick()
        await Promise.resolve()
        await nextTick()

        expect(wrapper.find(".editor-doc").text()).toBe("doc:default")

        await wrapper.find(".editor-change").trigger("click")
        await nextTick()

        expect(wrapper.find(".editor-doc").text()).toBe("doc:manual-css")

        await wrapper.find(".reset-trigger").trigger("click")
        await Promise.resolve()
        await nextTick()

        expect(wrapper.find(".editor-doc").text()).toBe("doc:default")
    })

    it("插入示例时应使用 /md 预览根选择器", async () => {
        const wrapper = mount(MdCustomizer, {
            props: {
                visible: true,
            },
            global: {
                stubs: {
                    Teleport: true,
                    MdCustomizerConfigPanel: MdCustomizerConfigPanelStub,
                    MdCustomizerEditorPanel: MdCustomizerEditorPanelStub,
                },
            },
        })

        await nextTick()
        await Promise.resolve()
        await nextTick()

        await wrapper.find(".insert-example").trigger("click")
        await nextTick()

        expect(cssExampleMock).toHaveBeenCalledWith(".md-page-preview")
        expect(wrapper.find(".editor-doc").text()).toBe("doc:example-css:.md-page-preview")
        expect(saveMdCustomStateMock).toHaveBeenLastCalledWith({ customCss: "example-css:.md-page-preview" })
    })
})
