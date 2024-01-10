/**
 * @Author       : jiaopengzi
 * @Date         : 2023-12-20 21:40:36
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-01-10 15:51:25
 * @FilePath     : \blog-client\src\components\common\editor\core\type.ts
 * @Description  : 类型定义
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

import type {
  CommandsKey,
  MardkdownEditorCommandItemType,
} from '@/components/common/editor/command'

// ComponentPublicInstance 与 HTMLElement 并集 为了解决 $el 问题
// 参考：https://cn.vuejs.org/guide/typescript/composition-api.html#typing-component-template-refs
export interface ToolbarRef extends HTMLElement {
  root: HTMLElement
}

export interface CodemirrorRef extends HTMLElement {
  root: HTMLElement
  runCommand: (commandName: CommandsKey, customContent?: MardkdownEditorCommandItemType) => void
  scrollIntoViewLine: (line: number) => void
}

export interface PreviewRef extends HTMLElement {
  root: HTMLElement
  navigateToHeading: (index: number) => void
  navigateToElement: (index: number) => void
  navigateGoHome: (behavior: ScrollBehavior) => void
  navigateGoEnd: (behavior: ScrollBehavior) => void
}
