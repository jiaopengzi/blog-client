import { flushPromises, mount } from "@vue/test-utils"
import { reactive } from "vue"
import { afterEach, describe, expect, it, vi } from "vitest"
import { createPinia, setActivePinia } from "pinia"

import { PayStrategy } from "@/api/post/common"
import { stableHtmlDirective } from "@/utils/stableHtmlDirective"

import PayContent from "./index"
import { ContentPayType, type PayContentProps } from "./types"

const updateFromServerMock = vi.fn()
const permissionRoleStoreState = reactive({
    membershipRoles: [] as string[],
    getIsLoaded: false,
})

vi.mock("@/stores/permissionRole", () => ({
    usePermissionRoleStore: () => ({
        get membershipRoles() {
            return permissionRoleStoreState.membershipRoles
        },
        get getIsLoaded() {
            return permissionRoleStoreState.getIsLoaded
        },
        updateFromServer: updateFromServerMock,
    }),
}))

vi.mock("../icons", () => ({
    default: {
        name: "JIcon",
        template: '<i class="mock-j-icon"></i>',
    },
    IconKeys: {
        Lock: "lock",
    },
}))

vi.mock("../pay-video", () => ({
    default: {
        name: "PostVideo",
        template: '<div class="mock-post-video"></div>',
    },
}))

vi.mock("@/components/common/power-bi/index.vue", () => ({
    default: {
        name: "PowerBi",
        props: ["src", "maskcolor"],
        template: '<div class="mock-power-bi"></div>',
    },
}))

vi.mock("@/components/player", () => ({
    default: {
        name: "VideoPlayer",
        props: ["playerState"],
        template: '<div class="mock-video-player"></div>',
    },
}))

vi.mock("@/customElements", () => ({
    Names: {
        VideoPlayer: "video-player",
        PowerBi: "power-bi",
        PayKey: "pay-key",
        PayMembership: "pay-membership",
        PayVideo: "pay-video",
        PayRead: "pay-read",
        PayDownload: "pay-download",
        WechatCaptcha: "wechat-captcha",
        LoginView: "login-view",
    },
    parseHtmlToContentParts: (html: string) => [{ type: "html" as const, content: html }],
}))

vi.mock("@/customElementsMount/PowerBI", () => ({
    getPowerBIState: () => ({ src: "", maskcolor: "" }),
}))

vi.mock("@/components/editor", () => ({
    EditorStateManager: class {
        private state = { html: "" }

        updateState(markdown: string) {
            this.state.html = markdown
        }

        getState() {
            return this.state
        }
    },
}))

const mountComponent = (props: Partial<PayContentProps> = {}) => {
    return mount(PayContent, {
        props: {
            markdown: "<p>测试内容</p>",
            contentPayType: ContentPayType.Read,
            price: "100",
            payStrategy: PayStrategy.All,
            payRoles: [],
            ...props,
        },
        global: {
            directives: { "stable-html": stableHtmlDirective },
            stubs: {
                ElButton: {
                    props: ["loading"],
                    emits: ["click"],
                    template: '<button class="el-button" :data-loading="loading" @click="$emit(\'click\')"><slot /></button>',
                },
            },
        },
    })
}

describe("PayContent", () => {
    afterEach(() => {
        setActivePinia(createPinia())
        permissionRoleStoreState.membershipRoles = []
        permissionRoleStoreState.getIsLoaded = false
        vi.clearAllMocks()
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    it("仅购买策略下不显示 VIP 文案, 且不会请求会员角色", async () => {
        const wrapper = mountComponent({
            payStrategy: PayStrategy.Buy,
        })

        await flushPromises()

        expect(updateFromServerMock).not.toHaveBeenCalled()
        expect(wrapper.text()).not.toContain("升级为 VIP")
        expect(wrapper.text()).not.toContain("当前需拥有")
        expect(wrapper.text()).toContain("立即解锁")
        expect(wrapper.text()).not.toContain("开通会员")
    })

    it("购买和 VIP 策略下仅展示文章支持的会员角色交集", async () => {
        permissionRoleStoreState.membershipRoles = ["黄金会员", "钻石会员"]
        permissionRoleStoreState.getIsLoaded = true

        const wrapper = mountComponent({
            payStrategy: PayStrategy.All,
            payRoles: ["系统管理员", "黄金会员"],
        })

        await flushPromises()

        expect(updateFromServerMock).not.toHaveBeenCalled()
        expect(wrapper.text()).toContain("拥有")
        expect(wrapper.text()).toContain("黄金会员")
        expect(wrapper.text()).toContain("可免费查看")
        expect(wrapper.text()).not.toContain("系统管理员")
        expect(wrapper.text()).toContain("立即解锁")
        expect(wrapper.text()).toContain("开通会员")
    })

    it("仅 VIP 策略且无角色交集时展示默认会员引导文案", async () => {
        permissionRoleStoreState.membershipRoles = ["黄金会员"]
        permissionRoleStoreState.getIsLoaded = true

        const wrapper = mountComponent({
            payStrategy: PayStrategy.VIP,
            payRoles: ["系统管理员"],
        })

        await flushPromises()

        expect(wrapper.text()).toContain("该内容受保护")
        expect(wrapper.text()).not.toContain("需付费")
        expect(wrapper.text()).not.toContain("元解锁")
        expect(wrapper.text()).toContain("升级为 VIP 会员，畅享海量专属内容。")
        expect(wrapper.text()).not.toContain("立即解锁")
        expect(wrapper.text()).toContain("开通会员")
    })

    it("购买和 All 策略下仍显示价格解锁文案", async () => {
        permissionRoleStoreState.membershipRoles = ["黄金会员"]
        permissionRoleStoreState.getIsLoaded = true

        const wrapper = mountComponent({
            payStrategy: PayStrategy.All,
            price: "100",
        })

        await flushPromises()

        expect(wrapper.text()).toContain("该内容受保护")
        expect(wrapper.text()).toContain("需付费")
        expect(wrapper.text()).toContain("元解锁阅读")
    })

    it("权限角色 store 拉取失败时优雅降级为默认会员引导", async () => {
        const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => void 0)
        updateFromServerMock.mockRejectedValue(new Error("network error"))

        const wrapper = mountComponent({
            payStrategy: PayStrategy.All,
            payRoles: ["黄金会员"],
        })

        await flushPromises()

        expect(wrapper.text()).toContain("升级为 VIP 会员，畅享海量专属内容。")
        expect(wrapper.text()).not.toContain("当前需拥有 黄金会员 身份才能查看")
        expect(warnSpy).toHaveBeenCalledTimes(1)

        warnSpy.mockRestore()
    })

    it("已购买或免费内容时直接展示正文", async () => {
        permissionRoleStoreState.getIsLoaded = true

        const paidWrapper = mountComponent({
            isPaid: true,
            markdown: "<p>已解锁正文</p>",
        })

        const freeWrapper = mountComponent({
            isPaid: false,
            price: "0",
            markdown: "<p>免费正文</p>",
        })

        await flushPromises()

        expect(paidWrapper.text()).toContain("已解锁正文")
        expect(paidWrapper.find(".no-pay").exists()).toBe(false)
        expect(freeWrapper.text()).toContain("免费正文")
        expect(freeWrapper.find(".no-pay").exists()).toBe(false)
    })

    it("点击不同操作按钮时触发对应事件", async () => {
        permissionRoleStoreState.membershipRoles = ["黄金会员"]
        permissionRoleStoreState.getIsLoaded = true

        const wrapper = mountComponent({
            payStrategy: PayStrategy.All,
            contentPayType: ContentPayType.Download,
        })

        await flushPromises()

        const buttons = wrapper.findAll("button.el-button")
        await buttons[0]!.trigger("click")
        await buttons[1]!.trigger("click")

        expect(wrapper.emitted("pay-single")).toEqual([[ContentPayType.Download]])
        expect(wrapper.emitted("pay-vip")).toEqual([[ContentPayType.Download]])
    })

    it("store 未加载且无会员角色时会触发一次权限角色拉取", async () => {
        updateFromServerMock.mockImplementation(async () => {
            permissionRoleStoreState.membershipRoles = ["黄金会员"]
            permissionRoleStoreState.getIsLoaded = true
        })

        const wrapper = mountComponent({
            payStrategy: PayStrategy.All,
            payRoles: ["黄金会员"],
        })

        await flushPromises()

        expect(updateFromServerMock).toHaveBeenCalledTimes(1)
        expect(wrapper.text()).toContain("黄金会员")
    })
})
