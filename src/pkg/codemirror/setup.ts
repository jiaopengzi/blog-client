/**
 * @Author       : jiaopengzi
 * @Date         : 2023-12-01 11:33:04
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-12-25 22:06:38
 * @FilePath     : \blog-client\src\pkg\codemirror\setup.ts
 * @Description  : 重新封装 codemirror 参考: codemirror 包源码 https://www.npmjs.com/package/codemirror
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */
import {
  lineNumbers,
  highlightActiveLineGutter,
  highlightSpecialChars,
  drawSelection,
  dropCursor,
  rectangularSelection,
  crosshairCursor,
  highlightActiveLine,
  keymap,
  gutter,
  EditorView,
} from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import type { Extension } from '@codemirror/state'
import {
  foldGutter,
  indentOnInput,
  syntaxHighlighting,
  defaultHighlightStyle,
  bracketMatching,
  foldKeymap,
} from '@codemirror/language'
import { history, defaultKeymap, historyKeymap, indentWithTab } from '@codemirror/commands'
import { highlightSelectionMatches, searchKeymap } from '@codemirror/search'
import {
  closeBrackets,
  autocompletion,
  closeBracketsKeymap,
  completionKeymap,
} from '@codemirror/autocomplete'
import { lintKeymap } from '@codemirror/lint'
import { markdown } from '@codemirror/lang-markdown'
import { bottomPanelExt } from '@/pkg/codemirror/extension/bottomPanel'
import { customKeymap } from '@/pkg/codemirror/extension/hotkey'
import { handlePasteImage, handleDropImage } from '@/pkg/codemirror/extension/imgupload'
import { emojiCompletions } from '@/pkg/codemirror/extension/emoji'

// 自定义 codemirror setup 工厂函数
const createCustomSetup = () => {
  const customSetup: Extension = (() => [
    EditorView.lineWrapping, // 自动换行
    lineNumbers(), // 行号
    highlightActiveLineGutter(), // 高亮当前行 gutter
    highlightSpecialChars(), // 高亮特殊字符
    history(), // 历史记录
    foldGutter(), // 折叠
    drawSelection(), // 选择
    dropCursor(), // 光标
    EditorState.allowMultipleSelections.of(true), // 多选
    indentOnInput(), // 缩进
    syntaxHighlighting(defaultHighlightStyle, { fallback: true }), // 语法高亮
    bracketMatching(), // 匹配
    closeBrackets(), // 关闭括号
    autocompletion({ override: [emojiCompletions] }), // 自动完成
    rectangularSelection(), // 矩形选择
    crosshairCursor(), // 十字光标
    highlightActiveLine(), // 高亮当前行
    highlightSelectionMatches(), // 高亮选择匹配
    keymap.of([
      ...closeBracketsKeymap, // 关闭括号
      ...defaultKeymap, // 默认快捷键
      ...searchKeymap, // 搜索
      ...historyKeymap, // 历史记录
      indentWithTab, // tab 缩进
      ...foldKeymap, // 折叠
      ...completionKeymap, // 自动完成
      ...lintKeymap, // 代码检查
    ]),
    gutter({ class: 'gutter-custom' }), // 为 gutter 添加 class
    markdown(), // markdown 语法
    bottomPanelExt, // 底部面板
    customKeymap, // 自定义快捷键
    handlePasteImage, // 自定义键盘事件
    handleDropImage, // 自定义拖拽事件
  ])()
  return customSetup
}
export { EditorView } from '@codemirror/view'
export { EditorState } from '@codemirror/state'
export { createCustomSetup }
