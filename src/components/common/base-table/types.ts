/**
 * @FilePath     : \blog-client\src\components\common\base-table\types.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 类型定义
 */

import type { AccountKeyItemRes, AccountKeyRes } from "@/api/accountKey/common"
import { type TransactionFlowRes } from "@/api/billingCenter/common"
import { type CommentResAdmin } from "@/api/comment/common"
import { type CouponRes } from "@/api/coupon/common"
import { type LinkRes } from "@/api/link/common"
import { type LoginLog } from "@/api/loginLog/getLoginLogs"
import { type MembershipRes, type MembershipUserRes } from "@/api/membership/common"
import { type NotificationRes } from "@/api/notification/common"
import { type OrderGetByIDRes } from "@/api/order/common"
import { type PostResPaginationByAdmin } from "@/api/post/common"
import { type PostStarRes } from "@/api/post/starGetOwn"
import { type PostCategory } from "@/api/postCategory/view"
import { type PostTag } from "@/api/postTag/view"
import { type Pagination } from "@/api/response"
import { type MediaFile } from "@/api/upload/getFiles"
import { type User } from "@/api/user/getUsers"
import { type TableImg } from "@/components/common"
import type { SingleDblClickBinding } from "@/utils/singleDblClickDirective"

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
    isHeadingWithId?: boolean // 是否为标题带有ID
    isHeadingWithComment?: boolean // 是否为标题带有评论信息
    isUser?: boolean // 是否为用户
    isUserWithAvatar?: boolean // 是否使用用户头像
    isCommentWithPost?: boolean // 是否为评论带有文章信息
    isCommentWithAdmin?: boolean // 是否为管理员查看评论
    isMarkdownPreview?: boolean // 是否为Markdown预览
    isCopyText?: boolean // 是否为可复制文本
    isScrollFormatter?: boolean // 是否为可滚动的格式化文本
    onHeadingClick?: (row: TableData) => void // 标题点击回调, isHeading 时生效
    copyPlaceholder?: string // 可复制文本的占位符, 默认 "-"; 显示内容等于占位符时隐藏复制按钮
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
    | MembershipUserRes
    | OrderGetByIDRes
    | TransactionFlowRes

export interface FormatTableData {
    thumbnail?: string // 缩略图
    created_at?: string // 创建时间
    updated_at?: string // 更新时间
    file_type?: string // 文件类型
    img?: TableImg // 图片
    price?: string // 价格
}

// BaseTable 对外属性
export interface BaseTableProps {
    pagination: Pagination<TableData> // 分页配置
    tableColumn: TableColumn[] // 表格列配置
    rowStyle?: Record<string, string> // 表格行样式
    addItemDialogVisible?: boolean // 添加对话框是否显示
    editItemDialogVisible?: boolean // 编辑对话框是否显示
    isShowListOrGrid?: boolean // 是否显示列表或宫格切换
    showListOrGridStatus?: boolean // 列表或宫格状态, true: 列表, false: 宫格
    isShowDeleteAll?: boolean // 是否显示批量删除按钮
    isShowEdit?: boolean // 是否显示编辑按钮
    isShowSearch?: boolean // 是否显示搜索框
    searchStr?: string // 搜索关键字
    addWidth?: string // 添加对话框宽度
    addTop?: string // 添加对话框顶部距离
    editWidth?: string // 编辑对话框宽度
    editTop?: string // 编辑对话框顶部距离
    tagsItemMaxHeight?: string // 标签项目最大高度
    markdownPreviewMaxHeight?: string // markdown 预览最大高度
    height?: string | number // 表格高度
    avatarWidth?: number // 用户头像宽度
    isShowUserName?: boolean // 是否显示用户名
    isShowUserEmail?: boolean // 是否显示用户邮箱
    isShowUserDisplayName?: boolean // 是否显示用户昵称
    isShowCursorPointer?: boolean // 是否显示鼠标手型
    loadingDelete?: boolean // 删除加载状态
    rowOperationText?: string // 行操作文本
    deleteConfirmMessage?: string // 自定义删除确认提示信息
}

// BaseTable 对外事件
export type BaseTableEmits = {
    (event: "update-current-page", value: number): void
    (event: "update-page-size", value: number): void
    (event: "edit-row", index: number, row: TableData): void
    (event: "delete-row", index: number, row: TableData): void
    (event: "delete-rows", rows: TableData[]): void
    (event: "update-search", value: string): void
    (event: "run-search"): void
    (event: "update-selection", rows: TableData[]): void
    (event: "double-click-row-by-picture", rows: TableData): void
    (event: "add-item-update-dialog-visible", value: boolean): void
    (event: "edit-item-update-dialog-visible", value: boolean): void
    (event: "update-show-list-or-grid-status", value: boolean): void
    (event: "click-category", tagItemData: PostCategory | PostTag): void
    (event: "click-tag", tagItemData: PostCategory | PostTag): void
    (event: "click-author", author: User): void
    (event: "post-click", postID: string): void
    (event: "view-post", postID: string): void
    (event: "update-visible-rows", rows: TableData[]): void
}

// BaseTableList 暴露给父层的表格能力
export interface BaseTableListExpose {
    getSelectionRows: () => TableData[]
    clearSelection: () => void
    toggleRowSelection: (row: TableData, selected?: boolean) => void
    getVisibleRows: () => TableData[]
}

// BaseTableList 内部属性
export interface BaseTableListProps {
    pagination: Pagination<TableData>
    tableColumn: TableColumn[]
    rowStyle?: Record<string, string>
    showListOrGridStatus: boolean
    isShowDeleteAll: boolean
    isShowEdit: boolean
    height?: string | number
    avatarWidth: number
    isShowUserName: boolean
    isShowUserEmail: boolean
    isShowUserDisplayName: boolean
    isShowCursorPointer: boolean
    rowOperationText: string
    tagsItemMaxHeight?: string
    markdownPreviewMaxHeight?: string
    clickHandler: (row: TableData) => SingleDblClickBinding
    getRowImg: (row: TableData) => TableImg | undefined
}

// BaseTableGrid 内部属性
export interface BaseTableGridProps {
    pagination: Pagination<TableData>
    checkedRows: TableData[]
    showListOrGridStatus: boolean
    isShowEdit: boolean
    rowOperationText: string
    getRowImg: (row: TableData) => TableImg | undefined
    clickInGridHandler: (row: TableData) => SingleDblClickBinding
    isSelected: (row: TableData) => boolean
}

// 可读取 Element Plus 表格可见数据的实例形状
export interface TableVisibleStoreReadable {
    store?: {
        states?: {
            data?: TableData[] | { value?: TableData[] }
        }
    }
}
