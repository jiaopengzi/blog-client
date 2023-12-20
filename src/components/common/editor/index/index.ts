/**
 * @Author       : jiaopengzi
 * @Date         : 2023-12-07 11:52:09
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-12-20 22:59:34
 * @FilePath     : \blog-client\src\components\common\editor\index\index.ts
 * @Description  : markdown 编辑器
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

import ClipboardJS from 'clipboard' //代码块复制
import type { ClipboardEvent } from 'clipboard'
import { ShowMsgTip } from '@/utils/message'

// 初始化 ClipboardJS 的复制代码函数
export const initializeClipboard = () => {
  const clipboard = new ClipboardJS('.copy-button', {
    text: (trigger: Element) => {
      // 获取对应 pre 元素的文本内容
      const preElement = trigger.nextElementSibling

      // 添加条件检查，确保 preElement 和 preElement.textContent 不为 null
      if (preElement && preElement.textContent !== null) {
        return preElement.textContent.trim()
      } else {
        return ''
      }
    },
  })

  clipboard.on('success', (e: ClipboardEvent) => {
    // 处理成功的反馈（例如显示提示信息）
    ShowMsgTip(ShowMsgTip.MsgType.success, '已复制到剪贴板！')
    // console.log('已复制到剪贴板！')
    // console.info('Action:', e.action)
    // console.info('Text:', e.text)
    // console.info('Trigger:', e.trigger)
    e.clearSelection()
  })

  clipboard.on('error', (e: ClipboardEvent) => {
    // 处理错误的反馈
    ShowMsgTip(ShowMsgTip.MsgType.error, '复制到剪贴板失败！')
    console.error('复制到剪贴板失败:', e)
    // console.error('Action:', e.action)
    // console.error('Trigger:', e.trigger)
  })
}

/**
 * @description: 获取具有指定类名的父元素
 * @param element 目标元素
 * @param className 指定类名
 * @return 具有指定类名的父元素，如果不存在则返回null
 */
export function getParentWithClass(element: HTMLElement, className: string): HTMLElement | null {
  let currentElement = element
  while (currentElement) {
    // 循环查找父元素
    if (currentElement.classList.contains(className)) {
      // 判断是否有指定类名
      return currentElement // 返回具有指定类名的父元素
    }
    currentElement = currentElement.parentElement as HTMLElement // 获取父元素
  }
  return null // 如果不存在则返回null
}

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
