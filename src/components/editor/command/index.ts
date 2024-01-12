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
import { CommandsKey } from './constant'
import type { IconKeys } from '@/components/common/icons'

export { editorInsertFormatContent } from './insert'
export {
  CommandsKey,
  MardkdownEditorCommands,
  ScrollElementTag,
  ScrollElementTagHeading,
} from './constant'

// mardkdown 编辑器 单个命令对象 的类型
export interface MardkdownEditorCommandItemType {
  tip?: string // 前端提示
  prefix?: string // 前缀
  content?: string // 内容
  suffix?: string // 后缀
  hotKey?: string // 快捷键
  action?: Function // 执行函数
  icon?: IconKeys // 图标名称
}

// 使用映射类型定义 MardkdownEditorCommandsType
export type MardkdownEditorCommandsType = {
  [key in CommandsKey]: MardkdownEditorCommandItemType
}
