/*
 * FilePath    : blog-client\src\components\editor\components\toolbar\types.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 类型
 */

export { Alerts } from "./components/alert"
export { type HeadingMenuItem } from "./components/heading"
export { type PayTagItem } from "./components/pay"
export { type TableRowCol } from "./components/table"
export { type ToolMenuItem } from "./components/tool"

import type { IconKeys } from "@/components/common/icons"

import type { CommandsKey } from "../../command"

/**
 * EditorExternalToolbarButton 定义编辑器工具栏可注入的外部按钮。
 * 仅用于承接业务侧传入的附加动作, 不参与编辑器内置命令分发。
 */
export interface EditorExternalToolbarButton {
    name: string
    display: string
    icon: IconKeys
    insertAfter?: CommandsKey
}

/**
 * EditorToolbarButton 定义编辑器工具栏实际渲染的按钮。
 * isExternal 用于区分内置命令与业务侧注入的附加动作。
 */
export interface EditorToolbarButton {
    name: CommandsKey | string
    display: string
    icon: IconKeys
    isExternal?: boolean
}

/**
 * mergeEditorToolbarButtons 按内置按钮顺序合并外部工具栏按钮。
 * 外部按钮可通过 insertAfter 指定插入锚点; 若锚点不存在, 则回退到工具栏末尾。
 * @param toolbarButtons - 当前编辑器内置工具栏按钮。
 * @param externalToolbarButtons - 业务侧注入的外部工具栏按钮。
 * @returns 合并后的工具栏按钮列表。
 */
export const mergeEditorToolbarButtons = (
    toolbarButtons: EditorToolbarButton[],
    externalToolbarButtons: EditorExternalToolbarButton[],
): EditorToolbarButton[] => {
    const mergedToolbarButtons: EditorToolbarButton[] = []
    const trailingExternalButtons: EditorToolbarButton[] = []
    const anchoredExternalButtons = new Map<string, EditorToolbarButton[]>()
    const anchorSet = new Set(toolbarButtons.map((button) => button.name))

    externalToolbarButtons.forEach((button) => {
        const normalizedButton: EditorToolbarButton = {
            name: button.name,
            display: button.display,
            icon: button.icon,
            isExternal: true,
        }

        if (!button.insertAfter || !anchorSet.has(button.insertAfter)) {
            trailingExternalButtons.push(normalizedButton)
            return
        }

        const buttonsAfterAnchor = anchoredExternalButtons.get(button.insertAfter) ?? []
        buttonsAfterAnchor.push(normalizedButton)
        anchoredExternalButtons.set(button.insertAfter, buttonsAfterAnchor)
    })

    toolbarButtons.forEach((button) => {
        mergedToolbarButtons.push(button)

        if (typeof button.name !== "string") {
            return
        }

        const buttonsAfterAnchor = anchoredExternalButtons.get(button.name)
        if (buttonsAfterAnchor) {
            mergedToolbarButtons.push(...buttonsAfterAnchor)
        }
    })

    mergedToolbarButtons.push(...trailingExternalButtons)
    return mergedToolbarButtons
}
