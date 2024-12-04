/**
 * @Author       : jiaopengzi
 * @Date         : 2024-01-23 15:38:37
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-04 19:45:22
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

export interface PaginationRequest {
    current_page: number // 当前页
    page_size: number // 每页显示条数
    key_word?: string // 关键字
}

// 分页
export interface Pagination<T> {
    total: number // 总记录数量
    current_page: number // 当前页
    page_size: number // 每页显示条数
    page_count: number // 总页数
    page_sizes: number[] // 每页显示个数选择器的选项设置
    records: T[] // 数据
}

export const getEmptyPagination = <T>(): Pagination<T> => {
    return {
        total: 0, // 默认总记录数量为0
        current_page: 1, // 默认当前页为1
        page_size: 10, // 默认每页显示条数为10
        page_count: 0, // 默认总页数为0
        page_sizes: [10, 20, 30, 50], // 默认的每页显示个数选择器的选项设置
        records: [], // 默认数据为空数组
    }
}

// url 中是数字的参数名 URLQueryIsNumberKeys 的对象
export const URLQueryIsNumberKeys = {
    current_page: "current_page",
    page_size: "page_size",
}

// 表格图片配置
export interface TableImg {
    url?: string // 图片地址
    width?: number // 图片宽度 px
    height?: number // 图片高度 px
    imgFit?: ImgFit // 图片填充方式 cover | contain | fill | none | scale-down
    iconKeyName?: IconKeys // 图标键名
    svgFontSize?: number // 图标字体大小
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
