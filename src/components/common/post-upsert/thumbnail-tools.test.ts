/**
 * FilePath    : blog-client\src\components\common\post-upsert\thumbnail-tools.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 文章缩略图工具条事件透传测试
 */

import { mount } from "@vue/test-utils"
import { defineComponent, h } from "vue"
import { describe, expect, it } from "vitest"

import ThumbnailTools from "./thumbnail-tools.vue"

const ElSwitchStub = defineComponent({
    name: "ElSwitch",
    props: {
        modelValue: {
            type: Boolean,
            default: false,
        },
    },
    emits: ["update:modelValue"],
    setup(props, { emit }) {
        return () =>
            h("button", {
                class: "el-switch-stub",
                "data-value": String(props.modelValue),
                onClick: () => emit("update:modelValue", !props.modelValue),
            })
    },
})

const ElInputNumberStub = defineComponent({
    name: "ElInputNumber",
    props: {
        modelValue: {
            type: Number,
            default: 1,
        },
    },
    emits: ["update:modelValue"],
    setup(_props, { emit }) {
        return () =>
            h("button", {
                class: "el-input-number-stub",
                onClick: () => emit("update:modelValue", 3),
            })
    },
})

const mountComponent = (hasEditorThumbnailOptions: boolean = true) => {
    return mount(ThumbnailTools, {
        props: {
            autoInsert: false,
            insertIndex: 1,
            hasEditorThumbnailOptions,
        },
        global: {
            stubs: {
                ElSwitch: ElSwitchStub,
                ElInputNumber: ElInputNumberStub,
                ElButton: true,
            },
        },
    })
}

describe("PostUpsertThumbnailTools", () => {
    it("切换自动插入开关时应透传 update:autoInsert 事件", async () => {
        const wrapper = mountComponent()

        await wrapper.find(".el-switch-stub").trigger("click")

        expect(wrapper.emitted("update:autoInsert")?.[0]).toEqual([true])
    })

    it("修改默认插入序号时应透传 update:insertIndex 事件", async () => {
        const wrapper = mountComponent()

        await wrapper.find(".el-input-number-stub").trigger("click")

        expect(wrapper.emitted("update:insertIndex")?.[0]).toEqual([3])
    })

    it("点击从文章中选择按钮时应发出 pick-from-article 事件", async () => {
        const wrapper = mountComponent(true)

        await wrapper.findComponent({ name: "ElButton" }).trigger("click")

        expect(wrapper.emitted("pick-from-article")).toHaveLength(1)
    })

    it("没有文章图片时不应渲染从文章中选择按钮", () => {
        const wrapper = mountComponent(false)

        expect(wrapper.findComponent({ name: "ElButton" }).exists()).toBe(false)
    })
})
