/**
 * @Author       : jiaopengzi
 * @Date         : 2023-12-20 23:46:49
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-12-28 12:53:59
 * @FilePath     : \blog-client\src\components\common\editor\command\type.ts
 * @Description  : 类型声明文件
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */
import { CommandsKey } from './constant'
import type { IconKeys } from '@/components/common/icons'
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
