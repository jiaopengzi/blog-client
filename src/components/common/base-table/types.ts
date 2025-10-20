/**
 * @FilePath     : \blog-client\src\components\common\base-table\types.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 类型定义
 */

import type { AccountKeyItemRes, AccountKeyRes } from "@/api/accountKey/common"
import { type CommentResAdmin } from "@/api/comment/common"
import { type CouponRes } from "@/api/coupon/common"
import { type LinkRes } from "@/api/link/common"
import { type LoginLog } from "@/api/loginLog/getLoginLogs"
import { type MembershipRes } from "@/api/membership/common"
import { type NotificationRes } from "@/api/notification/common"
import { type OrderGetByIDRes } from "@/api/order/common"
import { type PostResPaginationByAdmin } from "@/api/post/common"
import { type PostStarRes } from "@/api/post/starGetOwn"
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
    isHeadingWithComment?: boolean // 是否为标题带有评论信息
    isUser?: boolean // 是否为用户
    isUserWithAvatar?: boolean // 是否使用用户头像
    isCommentWithPost?: boolean // 是否为评论带有文章信息
    isMarkdownPreview?: boolean // 是否为Markdown预览
    formatter?: (row: TableData) => void // 格式化函数
}

// 表格数据类型
export type TableData =
    | AccountKeyItemRes
    | AccountKeyRes
    | PostResPaginationByAdmin
    | PostStarRes
    | PostTag
    | PostCategory
    | MediaFile
    | User
    | LoginLog
    | CommentResAdmin
    | LinkRes
    | NotificationRes
    | CouponRes
    | MembershipRes
    | OrderGetByIDRes

export interface FormatTableData {
    thumbnail?: string // 缩略图
    created_at?: string // 创建时间
    updated_at?: string // 更新时间
    file_type?: string // 文件类型
    img?: TableImg // 图片
    price?: string // 价格
}
