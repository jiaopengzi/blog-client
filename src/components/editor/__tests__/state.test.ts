/**
 * FilePath    : blog-client\src\components\editor\__tests__\state.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 编辑器状态管理测试 (bugfix 260925-03: 目录高亮索引上界收敛到 tocHtml 域)
 */

import { describe, expect, it } from "vitest"

import { EditorStateManager } from "../state"

// 三级标题的 markdown, 渲染后 tocHtml 长度为 3
const MD_THREE_HEADINGS = "# 一级标题\n\n## 二级标题\n\n### 三级标题"

const createManagerWithThreeHeadings = (): EditorStateManager => {
    const manager = new EditorStateManager()
    manager.updateState(MD_THREE_HEADINGS)
    return manager
}

describe("EditorStateManager.setHeadingShowCurrentIndex (bugfix 260925-03)", () => {
    it("域内索引原样写入", () => {
        const manager = createManagerWithThreeHeadings()

        manager.setHeadingShowCurrentIndex(0)
        expect(manager.getState().headingShowCurrentIndex).toBe(0)

        manager.setHeadingShowCurrentIndex(2)
        expect(manager.getState().headingShowCurrentIndex).toBe(2)
    })

    it("越界索引收敛到目录最后一项, 防止目录高亮清空与折叠态'目录'回退", () => {
        const manager = createManagerWithThreeHeadings()

        manager.setHeadingShowCurrentIndex(9)
        expect(manager.getState().headingShowCurrentIndex).toBe(2)
    })

    it("负值为编辑器滚动同步'首个标题上方'的合法语义 (-1), 原样保留", () => {
        const manager = createManagerWithThreeHeadings()

        manager.setHeadingShowCurrentIndex(-1)
        expect(manager.getState().headingShowCurrentIndex).toBe(-1)
    })

    it("目录为空时不收敛 (空目录交由 Toc 侧重置高亮)", () => {
        const manager = new EditorStateManager()
        manager.updateState("正文没有标题")
        expect(manager.getState().tocHtml.length).toBe(0)

        manager.setHeadingShowCurrentIndex(3)
        expect(manager.getState().headingShowCurrentIndex).toBe(3)
    })

    it("同路由切文场景: 旧文章索引越过新目录长度时在写入点收敛", () => {
        const manager = createManagerWithThreeHeadings()
        manager.setHeadingShowCurrentIndex(2)

        // 切换到只有 1 个标题的新文章, 旧索引 2 对新目录越界
        manager.updateState("# 仅一个标题")
        manager.setHeadingShowCurrentIndex(2)
        expect(manager.getState().headingShowCurrentIndex).toBe(0)
    })
})
