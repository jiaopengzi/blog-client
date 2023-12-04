/**
 * @Author       : jiaopengzi
 * @Date         : 2023-12-02 11:30:23
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-12-02 22:59:35
 * @FilePath     : \blog-client\src\components\common\editor\command\insert.ts
 * @Description  : markdown 插入命令
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

import { EditorView } from '@/pkg/codemirror/setup'
import type { MardkdownEditorCommandItemType } from '@/components/common/editor/command/constant'

/**
 * @description: 插入格式化内容
 * @param view 对应的编辑器实例
 * @param item 命令对象
 * @return
 */
export function insert(view: EditorView, command: MardkdownEditorCommandItemType) {
  let insertContent = ''
  let cursorPosMove = 0
  if (command.prefix) {
    insertContent += command.prefix
    cursorPosMove += command.prefix.length
  }
  if (command.content) {
    insertContent += command.content
    cursorPosMove += command.content.length
  }
  if (command.suffix) {
    insertContent += command.suffix
  }
  const cursorPos = view.state.selection.main.head // 获取光标位置
  const transaction = view.state.update({
    changes: { from: cursorPos, to: cursorPos, insert: insertContent }, // 插入内容
  })
  view.dispatch(transaction) // 更新编辑器内容
  // 将光标移动指定位置
  view.dispatch(
    view.state.update({
      selection: {
        anchor: cursorPos + cursorPosMove,
        head: cursorPos + cursorPosMove,
      },
    }),
  )
  view.focus() // 使编辑器获取焦点
}
