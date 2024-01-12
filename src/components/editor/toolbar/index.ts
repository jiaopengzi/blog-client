/**
 * @Author       : jiaopengzi
 * @Date         : 2023-12-19 17:56:15
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-01-12 12:03:11
 * @FilePath     : \blog-client\src\components\editor\toolbar\index.ts
 * @Description  :
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

import { CommandsKey } from '@/components/editor/command'

export { default } from './index.vue'

import type { IconKeys } from '@/components/common/icons'

export interface ToolbarProps {
  toobarBtns: Array<{ name: CommandsKey; display: string; icon: IconKeys }> // 预览内容
  iconNumberPerLine?: number // iconNumberPerLine 可选 每行显示的图标个数 默认 20
}
