/**
 * @Author       : jiaopengzi
 * @Date         : 2023-12-20 21:40:36
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-12-27 00:45:34
 * @FilePath     : \blog-client\src\components\common\editor\core\type.ts
 * @Description  : 类型定义
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

import type { ComponentPublicInstance } from 'vue'
import type {
  CommandsKey,
  MardkdownEditorCommandItemType,
} from '@/components/common/editor/command'

export type MdContainerRef = ComponentPublicInstance & HTMLElement

// ComponentPublicInstance 与 HTMLElement 并集 为了解决 $el 问题
// 参考：https://cn.vuejs.org/guide/typescript/composition-api.html#typing-component-template-refs
export type ToolbarRef = ComponentPublicInstance & HTMLElement

interface Codemirror extends HTMLElement {
  runCommand: (commandName: CommandsKey, customContent?: MardkdownEditorCommandItemType) => void
  scrollIntoViewLine: (line: number) => void
}
export type CodemirrorRef = ComponentPublicInstance & Codemirror

interface Preview extends HTMLElement {
  navigateToHeading: (index: number) => void
  navigateToElement: (index: number) => void
  navigateGoHome: (behavior: ScrollBehavior) => void
  navigateGoEnd: (behavior: ScrollBehavior) => void
}
export type PreviewRef = ComponentPublicInstance & Preview

export type CmContainerRef = ComponentPublicInstance & HTMLElement
