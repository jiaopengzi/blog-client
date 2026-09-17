/**
 * FilePath    : blog-client\src\components\hooks\useTocNavigation\index.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 目录点击导航 hook 测试 (260917-01: 自 layout-aside 抽出的共用导航逻辑; feedback#2 收敛为纯 store 写入)
 */

import { createPinia, setActivePinia } from "pinia"
import { describe, expect, it, beforeEach } from "vitest"

import { useStatusStore } from "@/stores/status"

import { useTocNavigation } from "./index"

const tocHtml = [
    { index: 0, level: 1, text: "一级标题", anchor: "h-1" },
    { index: 1, level: 2, text: "二级标题", anchor: "h-2" },
]

describe("useTocNavigation", () => {
    let statusStore: ReturnType<typeof useStatusStore>

    beforeEach(() => {
        setActivePinia(createPinia())
        statusStore = useStatusStore()
        statusStore.tocHtml = [...tocHtml]
    })

    it("点击目录项: 仅写入锚点与高亮索引 (滚动与 URL 由 post-detail 的 anchorHash watch 单点驱动)", () => {
        const { tocHeadingClicked } = useTocNavigation()
        tocHeadingClicked(1)

        expect(statusStore.anchorHash).toBe("#h-2")
        expect(statusStore.tocHeadingShowCurrentIndex).toBe(1)
    })

    it("索引越界时静默返回, 不产生副作用", () => {
        const { tocHeadingClicked } = useTocNavigation()
        tocHeadingClicked(9)

        expect(statusStore.anchorHash).toBe("")
        expect(statusStore.tocHeadingShowCurrentIndex).toBe(0)
    })
})
