/**
 * @Author       : jiaopengzi
 * @Date         : 2023-12-19 14:51:46
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-12-20 16:34:15
 * @FilePath     : \blog-client\src\components\common\editor\preview\index.ts
 * @Description  : ts 声明文件
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */
import ClipboardJS from 'clipboard' //代码块复制
import type { ClipboardEvent } from 'clipboard'
import { ShowMsgTip } from '@/utils/message'

export interface PriviewProps {
  preview: {
    html: string // html 内容
    imgUrls: string[] // 图片地址 list
    isShowElImageViewer: boolean // 是否显示图片预览
  } // 预览内容
  width?: string // 宽度
  height?: string // 高度
}

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
