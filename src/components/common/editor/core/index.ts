/**
 * @Author       : jiaopengzi
 * @Date         : 2023-12-07 11:52:09
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-01-11 12:24:08
 * @FilePath     : \blog-client\src\components\common\editor\core\index.ts
 * @Description  :
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

export type { ToolbarRef, CodemirrorRef, PreviewRef } from './type'
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
