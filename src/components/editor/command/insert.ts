/**
 * @FilePath     : \blog-client\src\components\editor\command\insert.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : markdown 插入命令
 */

import type { MarkdownEditorCommandItem } from "@/components/editor/command"
import { EditorView } from "@/pkg/codemirror/setup"

// 从当前光标位置开始插入内容
const insert = (view: EditorView, position: number, content: string) => {
    view.dispatch({
        changes: { from: position, to: position, insert: content },
    })
}

/**
 * @description: 插入格式化内容
 * @param view 对应的编辑器实例
 * @param command 命令对象
 * @return
 */
export function editorInsertFormatContent(view: EditorView, command: MarkdownEditorCommandItem) {
    let cursorPosMove = 0 // 光标移动位置
    const range = view.state.selection.ranges[0] // 获取选中的内容
    // 判断命令对象是否有前缀、内容、后缀 任意一个
    if (command.prefix !== undefined || command.suffix !== undefined || command.content !== undefined) {
        const { prefix = "", content = "", suffix = "" } = command // 解构获取命令对象的前缀、内容、后缀

        if (range) {
            const from = range.from // 获取选中内容的开始位置
            const to = range.to // 获取选中内容的结束位置
            const hasSelectedContent = from < to // 是否有选中内容

            if (hasSelectedContent) {
                insert(view, from, prefix) // 插入前缀
                insert(view, to + prefix.length, suffix) // 插入后缀
                cursorPosMove = to + prefix.length // 光标移动到选中内容的后面
            } else {
                const combinedContent = prefix + content + suffix // 拼接前缀、内容、后缀
                insert(view, from, combinedContent) // 插入拼接后的内容
                cursorPosMove = from + prefix.length + content.length // 光标移动到内容的后面
            }
        }

        // 将光标移动指定位置 cursorPosMove 处 更新状态
        view.dispatch({
            selection: {
                anchor: cursorPosMove,
                head: cursorPosMove,
            },
        })

        view.focus() // 使编辑器获取焦点
    }
    if (command.action) {
        command.action(view)
    }
}

/**
 * @description: 插入化内容
 * @param view 对应的编辑器实例
 * @param content 要插入的内容
 */
export function editorInsertContent(view: EditorView, content: string) {
    let cursorPosMove = 0 // 光标移动位置
    const range = view.state.selection.ranges[0] // 获取选中的内容

    if (range) {
        const from = range.from // 获取选中内容的开始位置
        insert(view, from, content) // 插入内容
        cursorPosMove = from + content.length // 光标移动到内容的后面
    }

    // 将光标移动指定位置 cursorPosMove 处 更新状态
    view.dispatch({
        selection: {
            anchor: cursorPosMove,
            head: cursorPosMove,
        },
    })

    view.focus() // 使编辑器获取焦点
}
