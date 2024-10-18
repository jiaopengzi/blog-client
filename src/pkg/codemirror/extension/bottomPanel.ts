/**
 * @FilePath     : \blog-client\src\pkg\codemirror\extension\bottomPanel.ts
 */
import type { Extension } from "@codemirror/state"
import type { Panel } from "@codemirror/view"
import { EditorView, showPanel, ViewUpdate } from "@codemirror/view"

import { Text } from "@codemirror/state"
import type { TextIterator } from "@codemirror/state"

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

// 更新光标位置信息
function updateCursorInfo(viewUpdate: ViewUpdate): string {
    let cursorInfo = ""
    if (viewUpdate.selectionSet) {
        // 如果光标位置发生变化
        const { state } = viewUpdate.view // 获取当前编辑器状态
        const pos = state.selection.main.head // 获取光标位置
        const line = state.doc.lineAt(pos) // 获取光标所在行
        const column = pos - line.from // 获取光标所在列
        cursorInfo = `pos:${pos} | row:${line.number} | col:${column + 1}` // 位置信息
        // console.log(cursorInfo) // 输出光标位置到控制台，您可以根据需要修改这里的逻辑
    }
    return cursorInfo
}

// 底部面板
function bottomPanel(view: EditorView): Panel {
    const dom: HTMLElement | null = document.createElement("div")
    dom.textContent = countWords(view.state.doc)
    return {
        top: false, // 面板是否顶部
        dom,
        update(update) {
            if (update.docChanged || update.selectionSet) {
                const wordCount = countWords(update.state.doc) // 字数统计
                const rowCol = updateCursorInfo(update) // 光标位置信息
                const textContent = wordCount + "| " + rowCol // 拼接底部面板内容
                dom.textContent = textContent
            }
        },
    }
}

const bottomPanelExt: Extension = [
    showPanel.of(bottomPanel),
    EditorView.updateListener.of(updateCursorInfo),
]

export { bottomPanelExt }
