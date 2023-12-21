/**
 * @Author       : jiaopengzi
 * @Date         : 2023-12-21 14:27:37
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-12-21 16:11:06
 * @FilePath     : \blog-client\src\components\common\editor\command\index.ts
 * @Description  : 入口
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

export type { MardkdownEditorCommandItemType, MardkdownEditorCommandsType } from './type'

export { editorInsertFormatContent } from './insert'
export {
  CommandsKey,
  MardkdownEditorCommands,
  ScrollElementTag,
  ScrollElementTagHeading,
} from './constant'
