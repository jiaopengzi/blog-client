/**
 * FilePath    : blog-client\src\components\layout\aside\post-topic-nav\__tests__\index.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 专题导航组件测试 (树渲染/当前高亮/空数据不渲染/排序切换含记忆/点击跳转含禁用预取/手风琴互斥/文章切换链重算/链路递归 active/校准流路由失效保护)
 */

import { flushPromises, mount } from "@vue/test-utils"
import { describe, expect, it, beforeEach, vi } from "vitest"
import { defineComponent, reactive } from "vue"

import type { PostTopicNav as TopicNavData } from "@/api/post/topicNav"
import { ResponseCode } from "@/api/response"
import { LocalStorageKey } from "@/stores/local"

// 可变测试状态: useAsyncData 以普通对象模拟 (data.value 语义), 用例按需注入导航数据
const state = vi.hoisted(() => ({
    navData: null as TopicNavData | null,
    route: null as { params: { id: string }; name: string } | null,
    // 登录校准流相关 (bf-260925-01 反馈#1/#2): isLogin 供 user store 替身读取, viewTopicNavAPI 供校准 fetch 受控注入
    isLogin: false,
    viewTopicNavAPI: null as ((req: { post_id: string }) => Promise<{ data: { code: number; msg: string; data: TopicNavData | null } }>) | null,
}))

// 组件源码中 useAsyncData/useRoute 经 Nuxt 自动导入解析到 #app/composables/*, 非 nuxt 环境以受控替身提供
// data 必须为真实 computed: 模板 unref 只解包 ref/computed, 普通对象会让 navData.root_category 取值为 undefined
// data 为可写 computed (bf-260925-01 反馈#1): 登录校准流对数据槽赋值 (navData.value = ...) 时写回 state, 供守卫用例断言
// route 为 reactive 对象: postId computed 与展开链 watch 随 params.id 变化响应 (模拟客户端文章切换)
vi.mock("#app/composables/asyncData", async (importOriginal) => {
    const actual = (await importOriginal()) as Record<string, unknown>
    const { computed } = await import("vue")
    return {
        ...actual,
        useAsyncData: () => ({
            data: computed({
                get: () => state.navData,
                set: (v: TopicNavData | null) => {
                    state.navData = v
                },
            }),
        }),
    }
})

vi.mock("#app/composables/router", async (importOriginal) => {
    const actual = (await importOriginal()) as Record<string, unknown>
    return {
        ...actual,
        useRoute: () => state.route,
    }
})

// 登录校准流依赖全局 initStores/user store (bf-260925-01 反馈#2): 单测环境无 active Pinia,
// 真实 store 流会在用例结束后继续执行并抛 getActivePinia unhandled rejection, 以最小替身隔离
vi.mock("@/stores/init", () => ({
    isInitStoresReady: () => true,
    getInitStoresPromise: () => Promise.resolve(),
}))

vi.mock("@/stores/user", () => ({
    useUserStore: () => ({ isLogin: state.isLogin }),
}))

// 校准 fetch 的 API 受控注入 (bf-260925-01 反馈#1): 默认返回无数据码, 用例可替换为挂起 Promise 模拟在途
vi.mock("@/api/post/topicNav", async (importOriginal) => {
    const actual = (await importOriginal()) as Record<string, unknown>
    return {
        ...actual,
        viewTopicNavAPI: (req: { post_id: string }) => state.viewTopicNavAPI!(req),
    }
})

import PostTopicNav from "../index.vue"
import { POST_TOPIC_NAV_DATA_KEY, TOPIC_NAV_SORT_ALPHA } from "../types"

// 测试导航数据: 专题根 直属 1 篇; 章节一 两篇 + 子章节一篇; 章节2 一篇
const mockNav: TopicNavData = {
    root_category: {
        id: "990100",
        name: "测试专题A",
        slug: "topic-nav-test-a",
        order: 1,
        is_topic: true,
        posts: [{ id: "990008", post_title: "概述" }],
        children: [
            {
                id: "990101",
                name: "章节一",
                slug: "topic-nav-test-ch1",
                order: 1,
                is_topic: false,
                posts: [
                    { id: "990001", post_title: "香蕉笔记" },
                    { id: "990002", post_title: "苹果教程" },
                ],
                children: [
                    {
                        id: "990103",
                        name: "章节一-子节",
                        slug: "topic-nav-test-ch1-1",
                        order: 1,
                        is_topic: false,
                        posts: [{ id: "990003", post_title: "樱桃手册" }],
                        children: null,
                    },
                ],
            },
            {
                id: "990102",
                name: "章节二",
                slug: "topic-nav-test-ch2",
                order: 2,
                is_topic: false,
                posts: [{ id: "990006", post_title: "共享文章" }],
                children: null,
            },
        ],
    },
    current_post_id: "990001",
}

// j-icon 为全局注册组件 (plugins/directives.ts), 单测以桩替代
const JIconStub = defineComponent({ name: "JIcon", props: { name: String, customClass: String }, render: () => null })

// NuxtLink 为 Nuxt 内建组件, 以渲染 a 标签的桩替代并暴露 to/prefetch 供断言
const NuxtLinkStub = defineComponent({
    name: "NuxtLink",
    props: {
        to: { type: [String, Object], required: true },
        prefetch: { type: Boolean, default: undefined },
    },
    template: `<a class="mock-nuxt-link" :data-to="typeof to === 'string' ? to : JSON.stringify(to)" :data-prefetch="prefetch === undefined ? '' : String(prefetch)"><slot /></a>`,
})

// async setup 组件需 Suspense 承载 (组件内 await useAsyncData)
const Host = defineComponent({
    components: { PostTopicNav },
    template: `<Suspense><PostTopicNav /></Suspense>`,
})

const mountTopicNav = () =>
    mount(Host, {
        global: {
            components: { "j-icon": JIconStub },
            // NuxtLink 经 nuxt auto-import 显式 import 进 SFC (global.components 注册拦不住),
            // 须走 VTU stubs (vnode 拦截层, 对显式 import 同样生效); el-tooltip/el-icon 不 stub 用真实组件
            stubs: { NuxtLink: NuxtLinkStub, RouterLink: NuxtLinkStub, "el-tooltip": false, "el-icon": false },
        },
    })

const getPostTitles = (wrapper: ReturnType<typeof mountTopicNav>) => wrapper.findAll(".topic-nav-post").map((item) => item.text())

// 分组头按钮按分组名查找 (含同名防呆: 测试数据分组名唯一)
const findGroupHead = (wrapper: ReturnType<typeof mountTopicNav>, name: string) =>
    wrapper.findAll(".topic-nav-group-head").find((item) => item.find(".topic-nav-group-name").text() === name)

describe("PostTopicNav 组件", () => {
    beforeEach(() => {
        localStorage.clear()
        state.navData = mockNav
        state.route = reactive({ params: { id: "990001" }, name: "post" })
        state.isLogin = false
        state.viewTopicNavAPI = vi.fn(async () => ({ data: { code: ResponseCode.PostViewTopicNavIsNone, msg: "", data: null } }))
    })

    it("树渲染: 卡片标题为专题根名称, 分组带序号, 当前文章链外分组折叠", async () => {
        const wrapper = mountTopicNav()
        await flushPromises()

        expect(wrapper.find(".topic-nav-card").exists()).toBe(true)
        expect(wrapper.find(".topic-nav-title").text()).toBe("测试专题A")
        // 根直属 1 篇 + 展开的章节一 2 篇 (章节二/子章节默认折叠不渲染条目)
        expect(wrapper.findAll(".topic-nav-post")).toHaveLength(3)
        // 可见分组头: 章节一(展开) + 其子节(折叠头仍渲染) + 章节二(折叠), 顺序恒按后端 order
        const groups = wrapper.findAll(".topic-nav-group-name").map((item) => item.text())
        expect(groups).toEqual(["章节一", "章节一-子节", "章节二"])
        expect(wrapper.findAll(".topic-nav-group-index")[0]!.text()).toBe("1.")
    })

    it("手风琴默认链: 当前文章所在分组链展开, 其余折叠 (aria-expanded)", async () => {
        const wrapper = mountTopicNav()
        await flushPromises()

        expect(findGroupHead(wrapper, "章节一")!.attributes("aria-expanded")).toBe("true")
        expect(findGroupHead(wrapper, "章节一-子节")!.attributes("aria-expanded")).toBe("false")
        expect(findGroupHead(wrapper, "章节二")!.attributes("aria-expanded")).toBe("false")
    })

    it("手风琴同级互斥: 展开章节二自动折叠章节一, 再点已展开分组则该层全折叠", async () => {
        const wrapper = mountTopicNav()
        await flushPromises()

        // 点击章节二: 展开 + 章节一同级自动折叠
        await findGroupHead(wrapper, "章节二")!.trigger("click")
        expect(findGroupHead(wrapper, "章节二")!.attributes("aria-expanded")).toBe("true")
        expect(findGroupHead(wrapper, "章节一")!.attributes("aria-expanded")).toBe("false")
        expect(getPostTitles(wrapper)).toEqual(["概述", "共享文章"])

        // 切回章节一
        await findGroupHead(wrapper, "章节一")!.trigger("click")
        expect(getPostTitles(wrapper)).toEqual(["概述", "香蕉笔记", "苹果教程"])

        // 再点已展开的章节一: 该层全折叠
        await findGroupHead(wrapper, "章节一")!.trigger("click")
        expect(findGroupHead(wrapper, "章节一")!.attributes("aria-expanded")).toBe("false")
        expect(getPostTitles(wrapper)).toEqual(["概述"])
    })

    it("手风琴嵌套: 子节展开不影响父分组 (跨层不互斥)", async () => {
        const wrapper = mountTopicNav()
        await flushPromises()

        await findGroupHead(wrapper, "章节一-子节")!.trigger("click")
        expect(findGroupHead(wrapper, "章节一")!.attributes("aria-expanded")).toBe("true")
        expect(findGroupHead(wrapper, "章节一-子节")!.attributes("aria-expanded")).toBe("true")
        expect(getPostTitles(wrapper)).toEqual(["概述", "香蕉笔记", "苹果教程", "樱桃手册"])
    })

    it("文章切换重算展开链: 同专题文章切换后新链展开旧链折叠", async () => {
        const wrapper = mountTopicNav()
        await flushPromises()

        // 切到章节二的文章: 章节二自动展开, 章节一折叠, 高亮随动
        state.route!.params.id = "990006"
        await flushPromises()
        expect(findGroupHead(wrapper, "章节二")!.attributes("aria-expanded")).toBe("true")
        expect(findGroupHead(wrapper, "章节一")!.attributes("aria-expanded")).toBe("false")
        expect(wrapper.find(".topic-nav-post.is-current").text()).toBe("共享文章")

        // 切到子节文章: 链为 章节一 → 子节 (父保持展开)
        state.route!.params.id = "990003"
        await flushPromises()
        expect(findGroupHead(wrapper, "章节一")!.attributes("aria-expanded")).toBe("true")
        expect(findGroupHead(wrapper, "章节一-子节")!.attributes("aria-expanded")).toBe("true")
        expect(findGroupHead(wrapper, "章节二")!.attributes("aria-expanded")).toBe("false")
        expect(wrapper.find(".topic-nav-post.is-current").text()).toBe("樱桃手册")
    })

    it("链路递归 active (第2轮反馈#1): 当前文章所在分组链头递归 is-active, 展开其他章节折叠原链后仍保持", async () => {
        const wrapper = mountTopicNav()
        await flushPromises()

        // 990001 在章节一直属: 章节一头 active, 其子节/章节二不 active
        expect(findGroupHead(wrapper, "章节一")!.classes()).toContain("is-active")
        expect(findGroupHead(wrapper, "章节一-子节")!.classes()).not.toContain("is-active")
        expect(findGroupHead(wrapper, "章节二")!.classes()).not.toContain("is-active")

        // 点击章节二展开 (手风琴互斥折叠章节一): 原链头仍递归 active, 章节二头不 active
        await findGroupHead(wrapper, "章节二")!.trigger("click")
        expect(findGroupHead(wrapper, "章节一")!.attributes("aria-expanded")).toBe("false")
        expect(findGroupHead(wrapper, "章节一")!.classes()).toContain("is-active")
        expect(findGroupHead(wrapper, "章节二")!.classes()).not.toContain("is-active")

        // 切到子节文章 990003: 章节一 + 子节 两级链头都 active, 章节二不 active
        state.route!.params.id = "990003"
        await flushPromises()
        expect(findGroupHead(wrapper, "章节一")!.classes()).toContain("is-active")
        expect(findGroupHead(wrapper, "章节一-子节")!.classes()).toContain("is-active")
        expect(findGroupHead(wrapper, "章节二")!.classes()).not.toContain("is-active")
    })

    it("当前文章高亮: 路由文章 ID 匹配条目带 is-current", async () => {
        const wrapper = mountTopicNav()
        await flushPromises()

        const current = wrapper.find(".topic-nav-post.is-current")
        expect(current.exists()).toBe(true)
        expect(current.text()).toBe("香蕉笔记")
    })

    it("空数据不渲染: 数据为 null 时无卡片", async () => {
        state.navData = null
        const wrapper = mountTopicNav()
        await flushPromises()

        expect(wrapper.find(".topic-nav-card").exists()).toBe(false)
    })

    it("排序切换: 默认时间序(后端原数组), 点击切换字母序即时重排并记忆, 分组顺序不变", async () => {
        const wrapper = mountTopicNav()
        await flushPromises()

        // 默认时间序 = 后端原始顺序 (仅当前展开链可见条目)
        expect(getPostTitles(wrapper)).toEqual(["概述", "香蕉笔记", "苹果教程"])

        // 点击切换为字母序: 组内按标题 localeCompare 重排, 分组顺序不变
        await wrapper.find(".topic-nav-sort").trigger("click")
        expect(getPostTitles(wrapper)).toEqual(["概述", "苹果教程", "香蕉笔记"])
        const groups = wrapper.findAll(".topic-nav-group-name").map((item) => item.text())
        expect(groups).toEqual(["章节一", "章节一-子节", "章节二"])
        expect(localStorage.getItem(LocalStorageKey.TopicNavSort)).toBe(TOPIC_NAV_SORT_ALPHA)

        // 再点击切回时间序: 恢复后端原数组
        await wrapper.find(".topic-nav-sort").trigger("click")
        expect(getPostTitles(wrapper)).toEqual(["概述", "香蕉笔记", "苹果教程"])
    })

    it("排序记忆: localStorage 偏好为字母序时, 挂载后按字母序渲染", async () => {
        localStorage.setItem(LocalStorageKey.TopicNavSort, TOPIC_NAV_SORT_ALPHA)
        const wrapper = mountTopicNav()
        await flushPromises()

        // 偏好在 onMounted 恢复, flush 后生效
        expect(getPostTitles(wrapper)).toEqual(["概述", "苹果教程", "香蕉笔记"])
    })

    it("点击跳转: 非当前文章条目携带 /p/:id 链接且禁用预取(第4轮反馈#1/#2), 当前文章为非链接条目(第3轮反馈#3, 不预取自身 payload)", async () => {
        const wrapper = mountTopicNav()
        await flushPromises()

        const links = wrapper.findAll(".topic-nav-post")
        expect(links[0]!.attributes("data-to")).toBe("/p/990008")
        // 树内链接禁用 NuxtLink 预取: 多分组文章的多个链接实例/手风琴重建实例各自可见性预取会造成重复
        // _payload.json 请求, 切文后原条目回链也会预取刚离开的页面; 点击切换经路由 beforeResolve 拉取一次
        expect(links[0]!.attributes("data-prefetch")).toBe("false")
        // 当前文章 (990001) 渲染为 span: 当前位置非导航目标, 且避免 NuxtLink 指向自身触发可见性预取
        expect(links[1]!.element.tagName.toLowerCase()).toBe("span")
        expect(links[1]!.attributes("data-to")).toBeUndefined()
        expect(links[1]!.classes()).toContain("is-current")
    })

    it("校准流路由失效保护 (bf-260925-01 反馈#1): 登录校准 fetch 在途切文, 晚到的旧文章树被丢弃不覆盖数据槽", async () => {
        state.isLogin = true
        let releaseFetch!: (value: { data: { code: number; msg: string; data: TopicNavData | null } }) => void
        state.viewTopicNavAPI = () =>
            new Promise((resolve) => {
                releaseFetch = resolve
            })

        const wrapper = mountTopicNav()
        await flushPromises()

        // 校准 fetch 在途 (挂起), 模拟用户快速切换文章: 新文章的数据由 useAsyncData(watch postId) 路径负责
        state.route!.params.id = "990006"
        await flushPromises()

        // 晚到的旧文章树 resolve: 守卫丢弃 (发起时锁定 990001 ≠ 当前 990006), 数据槽保持现有树
        const staleNav = JSON.parse(JSON.stringify(mockNav)) as TopicNavData
        staleNav.root_category.name = "旧文章树"
        releaseFetch({ data: { code: ResponseCode.PostViewTopicNavSuccess, msg: "", data: staleNav } })
        await flushPromises()

        expect(state.navData).toBe(mockNav)
        expect(wrapper.find(".topic-nav-title").text()).toBe("测试专题A")
        // 当前高亮随新文章 (990006 = 共享文章), 不因晚到旧树丢失
        expect(wrapper.find(".topic-nav-post.is-current").text()).toBe("共享文章")
    })

    it("数据 key 常量: 组件与 layout-aside 互斥读取共用同一固定 key", () => {
        expect(POST_TOPIC_NAV_DATA_KEY).toBe("post-topic-nav")
    })
})
