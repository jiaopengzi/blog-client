/**
 * @Author       : jiaopengzi
 * @Date         : 2024-01-23 15:25:00
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-11-25 14:51:23
 * @FilePath     : \blog-client\src\components\common\base-table\index.ts
 * @Description  : 基础表格组件
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { type User } from "@/api/user/getUsers"
import { type MediaFile } from "@/api/upload/getFiles"
import { type PostInfoRes } from "@/api/post/common"
import { type PostTag } from "@/api/postTag/view"
import { type PostCategory } from "@/api/postCategory/view"
import { type LoginLog } from "@/api/loginLog/getLoginLogs"
import { ImgFit, type TableImg } from "@/components/common"
import { formatTime } from "@/utils/dateTime"
import { IconKeys } from "@/components/common/icons"

export { default } from "./index.vue"

// 表格列配置
export interface TableColumn {
    prop: string | number // 对应数据的字段名
    label: string // 显示列标题
    sortable?: boolean | undefined // 是否可排序
    width?: number | string // 列宽
    align?: string // 对齐方式
    isImg?: boolean // 是否为图片
    isCategories?: boolean // 是否为分类
    isTags?: boolean // 是否为标签
    isHeading?: boolean // 是否为标题
    isAuthor?: boolean // 是否为作者
    formatter?: (row: TableData) => void // 格式化函数
}

// 表格数据类型
export type TableData = PostInfoRes | PostTag | PostCategory | MediaFile | User | LoginLog

export interface FormatTableData {
    thumbnail?: string // 缩略图
    created_at?: string // 创建时间
    updated_at?: string // 更新时间
    file_type?: string // 文件类型
    img?: TableImg // 图片
    price?: string // 价格
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
    { thumbnail, created_at, updated_at, price, ...tableData }: T,
    width: number = 30, // 默认值 50px
    height: number = 30, // 默认值 50px
    imgFit: ImgFit = ImgFit.Cover, // 默认值 cover
    fontSize = 30, // 默认值 30px
): T {
    const formatTableData = {
        ...tableData,
        // 使用 formatTime 进行格式化
        created_at: created_at ? formatTime(created_at) : "",
        updated_at: updated_at ? formatTime(updated_at) : "",
        price: price ? Number(price) / 100 + "元" : "",
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
