/**
 * @Author       : jiaopengzi
 * @Date         : 2023-12-21 14:27:37
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-01-11 16:53:16
 * @FilePath     : \blog-client\src\components\common\editor\command\index.ts
 * @Description  : 入口
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

export { editorInsertFormatContent } from './insert'
export {
  CommandsKey,
  MarkdownEditorCommands,
  ScrollElementTag,
  ScrollElementTagHeading
} from './constant'

export type { MarkdownEditorCommandItemType, MarkdownEditorCommandsType } from './constant'
