/**
 * @Author       : jiaopengzi
 * @Date         : 2024-01-23 15:25:00
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-11-06 15:51:09
 * @FilePath     : \blog-client\src\components\common\base-table\index.ts
 * @Description  :
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { type DataWithImg } from "@/components/common" // 图片填充方式
import { type User } from "@/api/user/getUsers"
import { type MediaFile } from "@/api/upload/getFiles"
import { type PostTag } from "@/api/postTag/view"
import { type PostCategory } from "@/api/postCategory/view"
import { type LoginLog } from "@/api/loginLog/getLoginLogs"
import { ImgFit, type TableImg } from "@/components/common"
import { convertToBeijingTime } from "@/utils/dateTime"
import { IconKeys } from "@/components/common/icons"

export { default } from "./index.vue"

// 表格列配置
export interface TableColumn {
    prop: string | number // 对应数据的字段名
    label: string // 列名
    sortable?: boolean | undefined // 是否可排序
    width?: number | string // 列宽
    align?: string // 对齐方式
    isImg?: boolean // 是否为图片
    formatter?: (row: TableData) => void // 格式化函数
    isTest?: boolean // 是否为测试列
}

// 文章
export interface Post extends DataWithImg {
    id: number // 文章 ID
    title: string // 文章标题
    author: string // 作者
    price: number // 价格
    categories: string[] // 分类
    tags: string[] // 标签
    views: number // 阅读量
    created_at: string // 创建时间
    updated_at?: string // 更新时间
    slug?: string // 文章别名
}

export type TableData = Post | PostTag | PostCategory | MediaFile | User | LoginLog

export interface FormatTableData {
    thumbnail?: string
    created_at?: string
    file_type?: string
    img?: TableImg
}

/**
 * @description: 格式化表格的图片和时间
 * @param TableData 表格数据
 * @param width 图片宽度
 * @param height 图片高度
 * @param imgFit 图片填充方式
 * @return  {T} 格式化后的用户信息
 */
export function formatTableData<T extends FormatTableData>(
    { thumbnail, created_at, ...tableData }: T,
    width: number = 30, // 默认值 50px
    height: number = 30, // 默认值 50px
    imgFit: ImgFit = ImgFit.Cover, // 默认值 cover
    fontSize = 30, // 默认值 30px
): T {
    const formatTableData = {
        ...tableData,
        created_at: created_at ? convertToBeijingTime(created_at) : "", // 使用 convertToBeijingTime 进行格式化
    } as T

    // 如果 thumbnail 不为空，添加 img 属性
    if (thumbnail) {
        formatTableData.img = {
            url: thumbnail,
            width: width,
            height: height,
            imgFit: imgFit,
        }
    }

    // 如果 thumbnail 为空，添加 icon 属性
    if (!thumbnail && tableData.file_type === "application/zip") {
        formatTableData.img = {
            url: "",
            fontSize: fontSize,
            iconKeyName: IconKeys.Zip,
        }
    }

    return formatTableData
}
