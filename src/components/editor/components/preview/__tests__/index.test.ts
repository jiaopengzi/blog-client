/**
 * FilePath    : blog-client\src\components\editor\components\preview\__tests__\index.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 预览组件测试 (bugfix 260925-03: 目录标题域按文章 html 片段收集 + 观察器入场去重/离场保留 best-match)
 */

import { mount, type VueWrapper } from "@vue/test-utils"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { stableHtmlDirective } from "@/utils/stableHtmlDirective"

import HtmlPreview from "../index.vue"

// 重子组件替换为轻量桩, 隔离 hls/付费链路; PayKey 桩刻意渲染内部 h3, 模拟组件子树内携带 UI 标题
// (vi.mock 工厂被提升到文件顶部, 桩对象必须内联在工厂内, 不能引用外部辅助函数)
vi.mock("@/components/player", () => ({
    default: { name: "VideoPlayer", template: '<div class="mock-video-player"></div>' },
}))
vi.mock("@/components/common/power-bi/index.vue", () => ({
    default: { name: "PowerBi", template: '<div class="mock-power-bi"></div>' },
}))
vi.mock("@/components/common/pay-content", () => ({
    default: { name: "PayContent", template: '<div class="mock-pay-content"></div>' },
    ContentPayType: { Read: "read", Download: "download", Video: "video" },
}))
vi.mock("@/components/common/pay-key", () => ({
    default: { name: "PayKey", template: '<div class="mock-pay-key"><h3 id="radio-group-title">组件内部标题</h3></div>' },
}))
vi.mock("@/components/common/pay-membership", () => ({
    default: { name: "PayMembership", template: '<div class="mock-pay-membership"></div>' },
}))
vi.mock("@/components/common/wechat-captcha", () => ({
    default: { name: "WechatCaptcha", template: '<div class="mock-wechat-captcha"></div>' },
}))
vi.mock("@/components/common/login-view", () => ({
    default: { name: "LoginView", template: '<div class="mock-login-view"></div>' },
}))

// 捕获 useIntersectionObserver 创建的实例, 测试内手工派发交叉回调驱动观察器边界
class FakeIntersectionObserver {
    static instances: FakeIntersectionObserver[] = []
    callback: IntersectionObserverCallback
    targets: Element[] = []

    constructor(callback: IntersectionObserverCallback) {
        this.callback = callback
        FakeIntersectionObserver.instances.push(this)
    }

    observe(target: Element) {
        this.targets.push(target)
    }

    unobserve() {}

    disconnect() {}

    takeRecords() {
        return []
    }
}

const mountPreview = (props: Record<string, unknown> = {}) => {
    return mount(HtmlPreview, {
        props: {
            html: "",
            imgUrls: [],
            isShowElImageViewer: false,
            isShowPreviewWechat: false,
            isUserScrollPreview: false,
            headingShowCurrentIndex: 0,
            ...props,
        },
        global: {
            directives: { "stable-html": stableHtmlDirective },
        },
    })
}

// 读取最近一次 commit-heading-map 事件的标题 map
const lastHeadingMap = (wrapper: VueWrapper) => {
    const events = wrapper.emitted("commit-heading-map")
    const last = events?.[events.length - 1]
    return (last?.[0] as Map<string, { id: string; index: number }>) ?? null
}

// 读取最近一次 heading-show-current 事件的索引
const lastHeadingShowCurrent = (wrapper: VueWrapper): number | undefined => {
    const events = wrapper.emitted("heading-show-current")
    const last = events?.[events.length - 1]
    return last?.[0] as number | undefined
}

// 向指定实例派发一次交叉变化 (entry 形状对齐组件回调用到的字段)
const fireIntersection = (instance: FakeIntersectionObserver, target: Element, isIntersecting: boolean, top: number) => {
    instance.callback(
        [{ target, isIntersecting, intersectionRect: { top } } as unknown as IntersectionObserverEntry],
        instance as unknown as IntersectionObserver,
    )
}

describe("HtmlPreview 目录标题域 (bugfix 260925-03)", () => {
    beforeEach(() => {
        vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver)
        FakeIntersectionObserver.instances = []
    })

    afterEach(() => {
        vi.unstubAllGlobals()
    })

    it("目录标题按文章 html 片段收集, 组件子树内部标题不进入目录域", async () => {
        // 正文含一个 pay-key 自定义元素: 桩组件渲染 h3#radio-group-title (模拟播放器设置面板等组件内部 UI 标题)
        const wrapper = mountPreview({ html: '<h2 id="h-a">A</h2><pay-key id="p1" title="密钥" description="d"></pay-key><h3 id="h-b">B</h3>' })

        await vi.waitFor(() => {
            expect(wrapper.emitted("commit-heading-map")).toBeTruthy()
        })

        const map = lastHeadingMap(wrapper)
        // 组件内部标题在预览子树中真实存在 (排除是收集边界的功劳, 而非未渲染)
        const previewRoot = wrapper.element as HTMLElement
        expect(previewRoot.querySelector("#radio-group-title")).toBeTruthy()
        // 目录域只含文章自有标题, 索引与 tocHtml 对齐
        expect(map!.size).toBe(2)
        expect(map!.get("h-a")!.index).toBe(0)
        expect(map!.get("h-b")!.index).toBe(1)
        expect(map!.has("radio-group-title")).toBe(false)
    })

    it("同一标题反复跨越 threshold 只记录一次, 离场后保留 best-match 不回退首项", async () => {
        const wrapper = mountPreview({ html: '<h2 id="h-a">A</h2><h2 id="h-b">B</h2>', isUserScrollPreview: true })

        await vi.waitFor(() => {
            expect(wrapper.emitted("commit-heading-map")).toBeTruthy()
        })

        // 观察器按文章标题逐个注册: 实例与 allHeadings 顺序一致
        const [observerA, observerB] = FakeIntersectionObserver.instances
        const targetA = observerA.targets[0] as HTMLElement
        const targetB = observerB.targets[0] as HTMLElement
        expect(targetA.id).toBe("h-a")
        expect(targetB.id).toBe("h-b")

        // B 进入视口 (自底部完整出现)
        fireIntersection(observerB, targetB, true, 200)
        expect(lastHeadingShowCurrent(wrapper)).toBe(1)

        // B 再次回调 (交叉比例在 1 附近反复跨越): 旧实现重复入列, 新实现去重后仍只回写 B
        fireIntersection(observerB, targetB, true, 0)
        expect(lastHeadingShowCurrent(wrapper)).toBe(1)

        // B 离场: 旧实现因重复项把可见数组清空, best-match 落空回退索引 0; 新实现保留 B
        fireIntersection(observerB, targetB, false, 0)
        expect(lastHeadingShowCurrent(wrapper)).toBe(1)
    })

    it("无可见标题且无 best-match 时回写 -1 (引言区初始态, 无当前章节)", async () => {
        const wrapper = mountPreview({ html: '<h2 id="h-a">A</h2>', isUserScrollPreview: true })

        await vi.waitFor(() => {
            expect(wrapper.emitted("commit-heading-map")).toBeTruthy()
        })

        // 页面初载: 首个标题在视口外, 观察器初始回调为非交叉态且尚无任何标题进入过视口
        const [observerA] = FakeIntersectionObserver.instances
        fireIntersection(observerA, observerA.targets[0] as HTMLElement, false, 0)
        expect(lastHeadingShowCurrent(wrapper)).toBe(-1)
    })

    it("内容重建 (同路由切文) 后 best-match 复位, 首轮回写不残留旧文章标题索引", async () => {
        const wrapper = mountPreview({ html: '<h2 id="h-a">A</h2>', isUserScrollPreview: true })

        await vi.waitFor(() => {
            expect(wrapper.emitted("commit-heading-map")).toBeTruthy()
        })
        const [observerA] = FakeIntersectionObserver.instances
        fireIntersection(observerA, observerA.targets[0] as HTMLElement, true, 200)
        expect(lastHeadingShowCurrent(wrapper)).toBe(0)

        // 切换文章: 观察器全部重建, 新周期首轮初始回调 (标题在视口外) 不应再受旧 best-match 影响
        await wrapper.setProps({ html: '<h2 id="h-x">X</h2>' })
        await vi.waitFor(() => {
            expect(lastHeadingMap(wrapper)?.has("h-x")).toBe(true)
        })
        const freshObserver = FakeIntersectionObserver.instances[FakeIntersectionObserver.instances.length - 1]
        fireIntersection(freshObserver, freshObserver.targets[0] as HTMLElement, false, 0)
        expect(lastHeadingShowCurrent(wrapper)).toBe(-1)
    })

    it("多个标题可见时, 离场标题从可见集中移除且 best-match 落到最后可见标题", async () => {
        const wrapper = mountPreview({ html: '<h2 id="h-a">A</h2><h2 id="h-b">B</h2>', isUserScrollPreview: true })

        await vi.waitFor(() => {
            expect(wrapper.emitted("commit-heading-map")).toBeTruthy()
        })

        const [observerA, observerB] = FakeIntersectionObserver.instances
        const targetA = observerA.targets[0] as HTMLElement
        const targetB = observerB.targets[0] as HTMLElement

        // A、B 先后进入视口, best-match 为最后进入的 B
        fireIntersection(observerA, targetA, true, 200)
        fireIntersection(observerB, targetB, true, 200)
        expect(lastHeadingShowCurrent(wrapper)).toBe(1)

        // B 离场后 best-match 回到仍可见的 A
        fireIntersection(observerB, targetB, false, 0)
        expect(lastHeadingShowCurrent(wrapper)).toBe(0)

        // A 再从视口顶露出 (向下滚动场景), best-match 仍为 A
        fireIntersection(observerA, targetA, true, 0)
        expect(lastHeadingShowCurrent(wrapper)).toBe(0)
    })
})
