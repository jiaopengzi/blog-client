/**
 * FilePath    : blog-client\src\components\common\thumbnail-select-dialog\index.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 缩略图选择弹窗交互测试
 */

import { mount } from "@vue/test-utils"
import { defineComponent, h } from "vue"
import { describe, expect, it } from "vitest"

import ThumbnailSelectDialog from "./index"

const ElDialogStub = defineComponent({
    name: "ElDialog",
    props: {
        modelValue: {
            type: Boolean,
            default: false,
        },
    },
    setup(_props, { slots }) {
        return () => h("div", { class: "el-dialog-stub" }, [slots.header?.(), slots.default?.(), slots.footer?.()])
    },
})

const mountComponent = () => {
    return mount(ThumbnailSelectDialog, {
        props: {
            visible: true,
            currentUrl: "https://img/1.png",
            options: [
                { index: 1, url: "https://img/1.png" },
                { index: 2, url: "https://img/2.png" },
            ],
        },
        global: {
            stubs: {
                ElDialog: ElDialogStub,
                ElImage: true,
                ElButton: true,
                ElEmpty: true,
                ElImageViewer: true,
            },
        },
    })
}

describe("ThumbnailSelectDialog", () => {
    it("双击缩略图时应直接插入并关闭弹窗", async () => {
        const wrapper = mountComponent()

        await wrapper.findAll(".thumbnail-select-dialog__select-target")[1]!.trigger("dblclick")

        expect(wrapper.emitted("select")?.[0]).toEqual(["https://img/2.png"])
        expect(wrapper.emitted("update:visible")?.[0]).toEqual([false])
    })

    it("点击预览大图按钮后应显示图片预览器", async () => {
        const wrapper = mountComponent()

        await wrapper.find(".thumbnail-select-dialog__preview-btn").trigger("click")

        expect(wrapper.findComponent({ name: "ElImageViewer" }).exists()).toBe(true)
    })
})
