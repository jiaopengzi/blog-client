/**
 * @Author       : jiaopengzi
 * @Date         : 2023-12-19 14:51:46
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-10-15 09:29:27
 * @FilePath     : \blog-client\src\components\editor\preview\index.ts
 * @Description  : ts 声明文件
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

export { default } from './index.vue'

export interface PreviewProps {
  preview: {
    html: string // html 内容
    imgUrls: string[] // 图片地址 list
    isShowElImageViewer: boolean // 是否显示图片预览
  } // 预览内容
  width?: string // 宽度
  height?: string // 高度
  isShowPreviewWechat?: boolean // 是否显示微信预览
}
