/**
 * FilePath    : blog-client\src\views\admin\component\main\links\component\add\index.test.ts
 * Description : AddLink 组件测试
 */

import { flushPromises, shallowMount } from "@vue/test-utils"
import { afterEach, describe, expect, it, vi } from "vitest"

import { LinkStatusCode } from "@/api/link/common"
import { ResponseCode } from "@/api/response"

import AddLink from "./index.vue"

const mocks = vi.hoisted(() => ({
    insertLinkAPI: vi.fn(),
    insertLinkAdminAPI: vi.fn(),
    pollingGetStreamIDsStatus: vi.fn(),
    messageSuccess: vi.fn(),
    messageError: vi.fn(),
}))

vi.mock("@/api/link/insert", () => ({
    insertLinkAPI: mocks.insertLinkAPI,
    insertLinkAdminAPI: mocks.insertLinkAdminAPI,
}))

vi.mock("@/utils/getStreamIDsStatus", () => ({
    pollingGetStreamIDsStatus: mocks.pollingGetStreamIDsStatus,
}))

vi.mock("@/utils/message", () => ({
    MessageUtil: {
        success: mocks.messageSuccess,
        error: mocks.messageError,
    },
}))

const createSubmitForm = () => ({
    name: "测试链接",
    url: "https://example.com",
    thumbnail: "https://example.com/image.png",
    description: "测试描述",
    status: LinkStatusCode.Hidden,
})

const mountComponent = (props: Record<string, unknown> = {}) => {
    return shallowMount(AddLink, {
        props,
    })
}

describe("AddLink 组件", () => {
    afterEach(() => {
        vi.clearAllMocks()
    })

    it("前台提交申请成功后显示审核提示", async () => {
        mocks.insertLinkAPI.mockResolvedValue({
            data: {
                code: ResponseCode.LinkInsertSuccess,
                msg: "新增链接成功",
                data: null,
            },
        })

        const wrapper = mountComponent()

        wrapper.findComponent({ name: "LinkView" }).vm.$emit("submit-data", createSubmitForm())
        await flushPromises()

        expect(mocks.insertLinkAPI).toHaveBeenCalledTimes(1)
        expect(mocks.messageSuccess).toHaveBeenCalledWith("申请已提交，请等待管理员审核。", 6000)
        expect(wrapper.emitted("add-status")).toEqual([[true]])
        expect(mocks.pollingGetStreamIDsStatus).not.toHaveBeenCalled()
    })

    it("后台新增成功后仍使用服务端返回文案", async () => {
        mocks.insertLinkAdminAPI.mockResolvedValue({
            data: {
                code: ResponseCode.LinkInsertSuccess,
                msg: "新增链接成功",
                data: null,
            },
        })

        const wrapper = mountComponent({ isAdmin: true })

        wrapper.findComponent({ name: "LinkView" }).vm.$emit("submit-data", createSubmitForm())
        await flushPromises()

        expect(mocks.insertLinkAdminAPI).toHaveBeenCalledTimes(1)
        expect(mocks.messageSuccess).toHaveBeenCalledWith("新增链接成功", 6000)
        expect(wrapper.emitted("add-status")).toEqual([[true]])
    })
})
