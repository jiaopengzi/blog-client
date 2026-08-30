/*
 * FilePath    : blog-client-nuxt\src\components\common\video-episode\index.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : VideoEpisode 剧集左上角 icon 显示状态矩阵的单元测试 (bug02 260829-05)
 */

import { mount } from "@vue/test-utils"
import { nextTick, reactive } from "vue"
import { describe, expect, it, vi } from "vitest"

import type { PostVideoTocTree } from "@/api/post/common"

import VideoEpisode from "./index.vue"
import type { VideoEpisodeProps } from "./types"

// 仅加载目录树 hooks 本体, 避免经 barrel 引入 video-toc-tree-base/index.vue (el-tree 组件树)
vi.mock("../video-toc-tree-base", async () => {
    const hooks = await vi.importActual<typeof import("../video-toc-tree-base/hooks")>("../video-toc-tree-base/hooks")
    return { useVideoTocTree: hooks.useVideoTocTree }
})

// hooks.ts 依赖 player 的 MediaTypes; 屏蔽 player barrel 避免拉起 hls/水印等重型组件
vi.mock("@/components/player", () => ({
    MediaTypes: { HLS: "hls", MP4: "mp4" },
}))

// JIcon 以 data-name 区分 lock/play, 便于断言每集渲染的 icon 类型
vi.mock("@/components/common/icons", () => ({
    default: {
        name: "JIcon",
        props: ["name", "customClass"],
        template: '<i class="mock-j-icon" :data-name="name"></i>',
    },
    IconKeys: {
        Lock: "lock",
        Play: "play",
    },
}))

// 构造视频节点
const makeVideo = (order: number, isFree: boolean): PostVideoTocTree => ({
    id: order,
    label: `第${order}集`,
    is_chapter: false,
    video_order: order,
    file_id_hash: `hash-${order}`,
    is_free: isFree,
})

// 构造章节节点 (章节不参与 is_free 判定)
const makeChapter = (id: number, label: string, children: PostVideoTocTree[]): PostVideoTocTree => ({
    id,
    label,
    is_chapter: true,
    children,
})

const mountEpisode = (props: Partial<VideoEpisodeProps> = {}) => {
    return mount(VideoEpisode, {
        props: {
            isPaid: false,
            episodeList: [],
            currentVideoOrder: 1,
            ...props,
        },
    })
}

// 取全部集数项
const getItems = (wrapper: ReturnType<typeof mountEpisode>) => {
    return wrapper.findAll(".episode-list > div")
}

// 集数项是否为已付费样式 (icon 被 episode-item-paid 的 display:none 隐藏)
const isPaidStyle = (el: ReturnType<typeof getItems>[number]) => {
    return el.classes().includes("episode-item-paid")
}

// 集数项内渲染的 icon 类型 (lock / play / null)
const iconOf = (el: ReturnType<typeof getItems>[number]) => {
    return el.find(".mock-j-icon").attributes("data-name") || null
}

/*
 * icon 显示状态矩阵 (锁定基准, 与 SPA commit 805cd812 行为一致):
 * - isPaid=true (用户已付费)                        => episode-item-paid, icon 不显示
 * - isPaid=false 且全部视频 is_free=true (合集未收费)    => episode-item-paid, icon 不显示
 * - isPaid=false 且该集 is_free=true                 => episode-item + play icon (绿)
 * - isPaid=false 且该集 is_free=false/undefined       => episode-item + lock icon (红)
 * - 章节节点不参与 allFree 判定
 * 注意 (bug02 260829-05 二轮): 「文章/合集级未收费 (post price=0)」在本组件之上由
 * PayContent 转换 — 已解锁分支向 PostVideo 传 isShowContent(=true), 即对 VideoEpisode
 * 表现为 isPaid=true → 不显示 icon; 上述矩阵只覆盖组件级输入语义。
 */
describe("VideoEpisode 剧集左上角 icon", () => {
    it("已付费时全部集数为付费样式, 不显示 icon", () => {
        const wrapper = mountEpisode({
            isPaid: true,
            episodeList: [makeVideo(1, false), makeVideo(2, true), makeVideo(3, false)],
        })

        const items = getItems(wrapper)
        expect(items).toHaveLength(3)
        for (const item of items) {
            expect(isPaidStyle(item)).toBe(true)
        }
    })

    it("合集未收费 (全部 is_free) 时等同已付费效果, 不显示 icon", () => {
        const wrapper = mountEpisode({
            isPaid: false,
            episodeList: [makeVideo(1, true), makeVideo(2, true), makeVideo(3, true)],
        })

        const items = getItems(wrapper)
        expect(items).toHaveLength(3)
        for (const item of items) {
            expect(isPaidStyle(item)).toBe(true)
        }
    })

    it("未付费且部分免费: 免费集显示 play icon, 收费集显示 lock icon", () => {
        const wrapper = mountEpisode({
            isPaid: false,
            episodeList: [makeVideo(1, true), makeVideo(2, false), makeVideo(3, true)],
        })

        const items = getItems(wrapper)
        expect(items).toHaveLength(3)
        for (const item of items) {
            expect(isPaidStyle(item)).toBe(false)
        }
        expect(iconOf(items[0]!)).toBe("play")
        expect(iconOf(items[1]!)).toBe("lock")
        expect(iconOf(items[2]!)).toBe("play")
    })

    it("未付费且全部收费: 全部集数显示 lock icon", () => {
        const wrapper = mountEpisode({
            isPaid: false,
            episodeList: [makeVideo(1, false), makeVideo(2, false)],
        })

        const items = getItems(wrapper)
        expect(items).toHaveLength(2)
        for (const item of items) {
            expect(isPaidStyle(item)).toBe(false)
            expect(iconOf(item)).toBe("lock")
        }
    })

    it("is_free 为 undefined 的集数视为收费, 显示 lock icon", () => {
        const undefinedFree = makeVideo(1, true)
        delete undefinedFree.is_free
        const wrapper = mountEpisode({
            isPaid: false,
            episodeList: [undefinedFree, makeVideo(2, true)],
        })

        const items = getItems(wrapper)
        expect(isPaidStyle(items[0]!)).toBe(false)
        expect(iconOf(items[0]!)).toBe("lock")
        expect(iconOf(items[1]!)).toBe("play")
    })

    it("章节节点不参与 allFree 判定: 视频全免费时仍不显示 icon", () => {
        const wrapper = mountEpisode({
            isPaid: false,
            episodeList: [makeChapter(100, "第一章", [makeVideo(1, true)]), makeVideo(2, true)],
        })

        const items = getItems(wrapper)
        expect(items).toHaveLength(2)
        for (const item of items) {
            expect(isPaidStyle(item)).toBe(true)
        }
    })

    it("is_free 原地更新 (getVideosIsFree 回写路径) 后 icon 状态即时切换", async () => {
        // 复刻 pay-video/hooks.ts updateTreeIsFree 的原地回写: 同一节点对象上改 is_free
        const episodeList = reactive<PostVideoTocTree[]>([makeVideo(1, false), makeVideo(2, false)])
        const wrapper = mountEpisode({ isPaid: false, episodeList })

        let items = getItems(wrapper)
        expect(iconOf(items[0]!)).toBe("lock")
        expect(iconOf(items[1]!)).toBe("lock")

        episodeList[0]!.is_free = true
        episodeList[1]!.is_free = true
        await nextTick()

        items = getItems(wrapper)
        for (const item of items) {
            expect(isPaidStyle(item)).toBe(true)
        }
    })
})
