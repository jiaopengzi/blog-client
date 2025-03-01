/**
 * @Author       : jiaopengzi
 * @Date         : 2024-12-30 10:58:15
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-30 11:00:38
 * @FilePath     : \blog-client\src\components\common\base-table\types.ts
 * @Description  : 类型定义
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { type LoginLog } from "@/api/loginLog/getLoginLogs"
import { type PostResPaginationByAdmin } from "@/api/post/common"
import { type PostCategory } from "@/api/postCategory/view"
import { type PostTag } from "@/api/postTag/view"
import { type MediaFile } from "@/api/upload/getFiles"
import { type User } from "@/api/user/getUsers"
import { type TableImg } from "@/components/common"

// 表格列配置
export interface TableColumn {
    prop: string | number // 对应数据的字段名
    label: string // 显示列标题
    sortable?: boolean | undefined // 是否可排序
    width?: number | string // 列宽
    minWidth?: number | string // 最小列宽
    align?: string // 对齐方式
    isImg?: boolean // 是否为图片
    isCategories?: boolean // 是否为分类
    isTags?: boolean // 是否为标签
    isHeading?: boolean // 是否为标题
    isAuthor?: boolean // 是否为作者
    formatter?: (row: TableData) => void // 格式化函数
}

// 表格数据类型
export type TableData = PostResPaginationByAdmin | PostTag | PostCategory | MediaFile | User | LoginLog

export interface FormatTableData {
    thumbnail?: string // 缩略图
    created_at?: string // 创建时间
    updated_at?: string // 更新时间
    file_type?: string // 文件类型
    img?: TableImg // 图片
    price?: string // 价格
}
