/**
 * FilePath    : blog-client\src\views\md\component\md-customizer\editor-panel\index.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : /md 自定义面板右侧编辑器桥接层测试
 */

import { mount } from "@vue/test-utils"
import { defineComponent, h, nextTick } from "vue"
import { beforeEach, describe, expect, it, vi } from "vitest"

import MdCustomizerEditorPanel from "."

const replaceContentMock = vi.fn()

vi.mock("@/components/editor/components/codemirror/index.vue", () => {
    return {
        default: defineComponent({
            name: "EditorCodemirror",
            setup(_props, { expose }) {
                expose({
                    replaceContent: replaceContentMock,
                })

                return () => h("div")
            },
        }),
    }
})

describe("MdCustomizerEditorPanel", () => {
    beforeEach(() => {
        replaceContentMock.mockReset()
    })

    it("普通文档同步不应重置撤销历史", async () => {
        const wrapper = mount(MdCustomizerEditorPanel, {
            props: {
                doc: "first-doc",
                editorHeight: "320px",
            },
            global: {
                stubs: {
                    ElButton: true,
                },
            },
        })

        await nextTick()

        expect(replaceContentMock).toHaveBeenLastCalledWith("first-doc")

        await wrapper.setProps({ doc: "second-doc" })
        await nextTick()

        expect(replaceContentMock).toHaveBeenLastCalledWith("second-doc")
    })
})
