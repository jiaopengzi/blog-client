/**
 * @FilePath     : \blog-client\src\pkg\codemirror\extension\bottomPanel.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : codemirror 底部面板
 */

import type { Extension } from "@codemirror/state"
import type { TextIterator } from "@codemirror/state"
import { Text } from "@codemirror/state"
import type { Panel } from "@codemirror/view"
import { EditorView, showPanel, ViewUpdate } from "@codemirror/view"
import { getCM } from "@replit/codemirror-vim"

// 字数统计
function countWords(doc: Text): string {
    let count: number = 0
    const iter: TextIterator = doc.iter() // 获取文档迭代器
    while (!iter.next().done) {
        let inWord = false
        for (let i = 0; i < iter.value.length; i++) {
            // 匹配英文单词、中文字符以及中文标点
            const charOrWord: boolean = /[\w\u4e00-\u9fa5]/.test(iter.value[i])

            if (charOrWord && !inWord) {
                // 如果当前字符是中文，则直接增加计数
                if (/[\u4e00-\u9fa5]/.test(iter.value[i])) {
                    count++
                } else {
                    count++
                    inWord = true // 英文单词开始
                }
            } else if (!charOrWord) {
                inWord = false // 结束英文单词计数
            }
        }
    }
    return `words: ${count} `
}

// 获取光标位置信息
function getCursorInfo(view: EditorView): string {
    let cursorInfo = ""
    // 如果光标位置发生变化
    const { state } = view // 获取当前编辑器状态
    const pos = state.selection.main.head // 获取光标位置
    const line = state.doc.lineAt(pos) // 获取光标所在行
    const column = pos - line.from // 获取光标所在列
    cursorInfo = `pos: ${pos} | row: ${line.number} | col: ${column + 1}` // 位置信息
    // console.log(cursorInfo) // 输出光标位置到控制台，根据需要修改这里的逻辑
    return cursorInfo
}

// 更新光标位置信息
function updateCursorInfo(viewUpdate: ViewUpdate): string {
    if (viewUpdate.selectionSet) {
        return getCursorInfo(viewUpdate.view) // 获取光标位置信息
    }
    return "" // 如果没有选择集变化，则返回空字符串
}

// 获取 vim 的模式信息
function getVimMode(view: EditorView): string {
    const cm = getCM(view) // 获取 vim 实例
    if (cm && cm.state.vim && cm.state.vim.mode) {
        return `--${cm.state.vim.mode}--` // 返回 vim 模式名称
    }
    if (cm && cm.state.vim) {
        return `--normal--` // 返回 normal 模式名称
    }
    return "" // 如果没有 vim 实例，则返回空字符串
}

// 更新底部面板内容
function updateBottomPanelContent(view: EditorView): string {
    const contentArray: string[] = [] // 内容数组

    const vimMode = getVimMode(view) // vim 模式信息
    if (vimMode) {
        contentArray.push(vimMode) // 如果 vim 模式存在，则添加到内容数组
    }

    const wordCount = countWords(view.state.doc) // 字数统计
    contentArray.push(wordCount) // 添加字数统计到内容数组

    const rowCol = getCursorInfo(view) // 光标位置信息
    if (rowCol) {
        contentArray.push(rowCol) // 如果光标位置信息存在，则添加到内容数组
    }

    return contentArray.join(" | ") // 拼接底部面板内容
}

// 底部面板
function bottomPanel(view: EditorView): Panel {
    const dom: HTMLElement | null = document.createElement("div")
    dom.textContent = updateBottomPanelContent(view) // 初始化底部面板内容
    // todo 等待 codemirror-vim 更新， 解决 vim 模式不更新的问题 https://github.com/replit/codemirror-vim/issues/227
    return {
        top: false, // 面板是否顶部
        dom,
        update(update) {
            if (update.docChanged || update.selectionSet) {
                dom.textContent = updateBottomPanelContent(update.view) // 更新底部面板内容
            }
        },
    }
}

const bottomPanelExt: Extension = [showPanel.of(bottomPanel), EditorView.updateListener.of(updateCursorInfo)]

export { bottomPanelExt }
