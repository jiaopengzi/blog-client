/**
 * FilePath    : blog-client\src\views\admin\component\main\links\component\view\index.test.ts
 * Description : LinkView 组件测试
 */

import { describe, expect, it } from "vitest"
import { mount } from "@vue/test-utils"
import ElementPlus from "element-plus"

import { LinkStatusCode } from "@/api/link/common"

import LinkView from "./index.vue"
import type { ViewForm } from "./types"

const createViewData = (): ViewForm => ({
    name: "测试链接",
    url: "https://example.com",
    thumbnail: "https://example.com/image.png",
    description: "测试描述",
    status: LinkStatusCode.Hidden,
})

const mountComponent = (props: Partial<InstanceType<typeof LinkView>["$props"]> = {}) => {
    return mount(LinkView, {
        props: {
            viewData: createViewData(),
            ...props,
        },
        global: {
            plugins: [ElementPlus],
        },
    })
}

describe("LinkView 组件", () => {
    it("默认渲染图片选择组件", () => {
        const wrapper = mountComponent()

        expect(wrapper.findComponent({ name: "ImageInput" }).exists()).toBe(true)
        expect(wrapper.find(".media-input .btn").exists()).toBe(true)
    })

    it("关闭图片选择按钮时仍保留图片输入和展示组件", () => {
        const wrapper = mountComponent({ isShowImageSelector: false })

        expect(wrapper.findComponent({ name: "ImageInput" }).exists()).toBe(true)
        expect(wrapper.find(".media-input .btn").exists()).toBe(false)
        expect(wrapper.find('input[placeholder="请输入链接的图片URL-必填"]').exists()).toBe(true)
    })
})
