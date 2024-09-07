/**
 * @Author       : jiaopengzi
 * @Date         : 2023-12-07 11:52:09
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-09-07 17:46:20
 * @FilePath     : \blog-client\src\components\editor\core\index.ts
 * @Description  :
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

import type { CommandsKey, MardkdownEditorCommandItemType } from '@/components/editor/command'

export { default as EditorPost } from './EditorPost.vue'
export { default as EditorComment } from './EditorComment.vue'
/**
 * @description: 设置是否全屏的类名
 * @param baseClass 基础类名
 * @param fullScreenClass 全屏类名
 * @param isContainerItem 是否是容器子项
 * @param isFullScreen 是否全屏
 * @return {Object} 类名对象
 */
export function setIsFullScreenClassName(
  baseClass: string,
  fullScreenClass: string,
  isContainerItem: boolean,
  isFullScreen: boolean,
): object {
  return {
    [baseClass]: !isFullScreen,
    [fullScreenClass]: isFullScreen,
    'md-container-item': isContainerItem && !isFullScreen,
    'md-container-item-fs': isContainerItem && isFullScreen,
  }
}

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
