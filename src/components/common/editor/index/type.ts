/**
 * @Author       : jiaopengzi
 * @Date         : 2023-12-20 21:40:36
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-12-20 22:02:58
 * @FilePath     : \blog-client\src\components\common\editor\index\type.ts
 * @Description  : 类型定义
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */
import type { MardkdownEditorCommandsKeyType } from '@/components/common/editor/command/constant'

export interface CodemirrorRef extends HTMLElement {
  runCommand: (commandName: MardkdownEditorCommandsKeyType) => void
  scrollIntoViewLine: (line: number) => void
}

export interface PreviewRef extends HTMLElement {
  navigateToHeading: (index: number) => void
  navigateToElement: (index: number) => void
  navigateGoHome: (behavior: ScrollBehavior) => void
  navigateGoEnd: (behavior: ScrollBehavior) => void
}

export interface CmContainerRef extends HTMLElement {}
