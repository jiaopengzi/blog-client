/**
 * @Author       : jiaopengzi
 * @Date         : 2023-12-20 21:40:36
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-12-21 14:24:22
 * @FilePath     : \blog-client\src\components\common\editor\core\type.ts
 * @Description  : 类型定义
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

import type { CommandsKey } from '@/components/common/editor/command/constant'

export interface CodemirrorRef extends HTMLElement {
  runCommand: (commandName: CommandsKey) => void
  scrollIntoViewLine: (line: number) => void
}

export interface PreviewRef extends HTMLElement {
  navigateToHeading: (index: number) => void
  navigateToElement: (index: number) => void
  navigateGoHome: (behavior: ScrollBehavior) => void
  navigateGoEnd: (behavior: ScrollBehavior) => void
}

export interface CmContainerRef extends HTMLElement {}
