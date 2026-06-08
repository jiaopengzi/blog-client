/**
 * @Author       : jiaopengzi
 * @Date         : 2024-01-23 15:38:37
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2025-01-03 11:27:43
 * @FilePath     : \blog-client\src\components\common\index.ts
 * @Description  : 公用信息
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import type { IconKeys } from "@/components/common/icons"

// 图片填充方式
export enum ImgFit {
    Cover = "cover", // 默认值
    Contain = "contain", // 保持宽高比缩放图片，使图片的长边能完全显示出来
    Fill = "fill", // 拉伸图片，使图片填满元素
    None = "none", // 保持原图尺寸
    ScaleDown = "scale-down", // 保持原图尺寸，但是不超过元素的尺寸
}

// 表格图片配置
export interface TableImg {
    url?: string // 图片地址
    width?: number // 图片宽度 px
    height?: number // 图片高度 px
    imgFit?: ImgFit // 图片填充方式 cover | contain | fill | none | scale-down
    iconKeyName?: IconKeys // 图标键名
    svgFontSize?: number // 图标字体大小
    initial?: string // 无缩略图时展示的首字符占位内容, 与前台文章列表保持一致
}

// 具有 img 属性的数据类型
export type DataWithImg = {
    img?: TableImg // 图片
}

// 枚举 alert 弹窗 element 组件类型
export enum MsgType {
    success = "success",
    info = "info",
    warning = "warning",
    error = "error",
}

// 枚举 alert 弹窗 element 组件标题
export enum MsgTitle {
    success = "成功",
    info = "提示",
    warning = "警告",
    error = "错误",
}
