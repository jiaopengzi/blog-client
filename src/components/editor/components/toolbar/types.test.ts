/**
 * FilePath    : blog-client\src\components\editor\components\toolbar\types.test.ts
 * Author      : GitHub Copilot
 * Description : 编辑器外部工具栏按钮排序测试
 */

import { describe, expect, it } from "vitest"

import { IconKeys } from "@/components/common/icons"

import { CommandsKey } from "../../command"
import { mergeEditorToolbarButtons, type EditorToolbarButton } from "./types"

describe("mergeEditorToolbarButtons", () => {
    it("会将外部按钮插入到指定内置按钮后方", () => {
        const toolbarButtons: EditorToolbarButton[] = [
            { name: CommandsKey.Fullscreen, display: "全屏", icon: IconKeys.Fullscreen },
            { name: CommandsKey.Help, display: "帮助", icon: IconKeys.Help },
        ]

        const mergedButtons = mergeEditorToolbarButtons(toolbarButtons, [
            {
                name: "post-upsert-add-media",
                display: "添加媒体",
                icon: IconKeys.Media,
                insertAfter: CommandsKey.Fullscreen,
            },
            {
                name: "post-upsert-insert-post-content",
                display: "文章引用",
                icon: IconKeys.Article,
                insertAfter: CommandsKey.Fullscreen,
            },
        ])

        expect(mergedButtons.map((button) => button.name)).toEqual([
            CommandsKey.Fullscreen,
            "post-upsert-add-media",
            "post-upsert-insert-post-content",
            CommandsKey.Help,
        ])
    })
})
