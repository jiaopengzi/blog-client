/**
 * @Author       : jiaopengzi
 * @Date         : 2023-12-19 17:46:44
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-12-28 12:33:05
 * @FilePath     : \blog-client\src\components\common\editor\toolbar\type.ts
 * @Description  : 类型声明文件
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */
import { CommandsKey } from '@/components/common/editor/command'
import type { IconKeys } from '@/components/common/icons'

export interface ToolbarProps {
  toobarBtns: Array<{ name: CommandsKey; display: string; icon: IconKeys }> // 预览内容
  iconNumberPerLine?: number // iconNumberPerLine 可选 每行显示的图标个数 默认 20
}
