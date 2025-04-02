/**
 * @FilePath     : \blog-client\src\pkg\codemirror\extension\bottomPanel.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : codemirror 底部面板
 */

import { type Extension, Text, type TextIterator } from "@codemirror/state"
import { EditorView, type Panel, showPanel } from "@codemirror/view"

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

// 更新底部面板内容
function updateBottomPanelContent(view: EditorView): string {
    const contentArray: string[] = [] // 内容数组

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
    // 初始化底部面板内容
    dom.textContent = updateBottomPanelContent(view)

    return {
        top: false, // 面板是否顶部
        dom,
        update(update) {
            if (update.docChanged || update.selectionSet || update.viewportChanged) {
                dom.textContent = updateBottomPanelContent(update.view) // 更新底部面板内容
            }
        },
    }
}

const bottomPanelExt: Extension = [showPanel.of(bottomPanel)]

export { bottomPanelExt }
