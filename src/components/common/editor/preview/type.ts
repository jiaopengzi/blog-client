/**
 * @Author       : jiaopengzi
 * @Date         : 2023-12-21 13:16:18
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-12-21 13:17:27
 * @FilePath     : \blog-client\src\components\common\editor\preview\type.ts
 * @Description  : ts 声明文件
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

export interface PriviewProps {
  preview: {
    html: string // html 内容
    imgUrls: string[] // 图片地址 list
    isShowElImageViewer: boolean // 是否显示图片预览
  } // 预览内容
  width?: string // 宽度
  height?: string // 高度
}
