/**
 * @Author       : jiaopengzi
 * @Date         : 2024-12-30 11:30:23
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-30 11:30:35
 * @FilePath     : \blog-client\src\components\editor\preview\types.ts
 * @Description  : 类型
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

export interface PreviewProps {
    preview: {
        html: string // html 内容
        imgUrls: string[] // 图片地址 list
        isShowElImageViewer: boolean // 是否显示图片预览
    } // 预览内容
    width?: string // 宽度
    height?: string // 高度
    isShowPreviewWechat?: boolean // 是否显示微信预览
    isUserScrollPreview?: boolean // 是否用户滚动预览
}
