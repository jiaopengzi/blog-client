/*
 * FilePath    : blog-client\src\components\common\post-list-admin\cols.ts
 * Description : 生成文章列表的列配置
 */

import { reactive } from "vue"

import { PostStatusCode, PostStatusDisplay, PostType } from "@/api/post/common"
import type { TableColumn, TableData } from "@/components/common/base-table"
import { formatTime } from "@/utils/dateTime"

// 基础列配置
const baseColumns: TableColumn[] = [
    {
        prop: "id",
        label: "ID",
        sortable: true,
        width: 100,
        align: "center",
    },
    {
        prop: "thumbnail",
        label: "图片",
        width: 130,
        align: "center",
        isImg: true,
    },
    {
        prop: "post_title",
        label: "标题",
        sortable: true,
        width: 180,
        align: "center",
        isHeading: true,
    },
]

// 分类和标签列配置
const categoryColumns: TableColumn[] = [
    {
        prop: "categories",
        label: "分类",
        sortable: true,
        width: 180,
        align: "center",
        isCategories: true,
    },
    {
        prop: "tags",
        label: "标签",
        sortable: true,
        width: 180,
        align: "center",
        isTags: true,
    },
]

// 统计信息列
const statsColumns: TableColumn[] = [
    {
        prop: "price",
        label: "价格(元)",
        sortable: true,
        minWidth: 100,
        align: "center",
    },
    {
        prop: "view_count",
        label: "浏览",
        sortable: true,
        minWidth: 80,
        align: "center",
    },
    {
        prop: "comment_count",
        label: "评论",
        sortable: true,
        minWidth: 80,
        align: "center",
    },
    {
        prop: "like_count",
        label: "点赞",
        sortable: true,
        minWidth: 80,
        align: "center",
    },
    {
        prop: "star_count",
        label: "收藏",
        sortable: true,
        minWidth: 80,
        align: "center",
    },
]

// 作者和状态列
const authorStatusColumns: TableColumn[] = [
    {
        prop: "author_info",
        label: "作者",
        sortable: true,
        minWidth: 120,
        align: "center",
        isUser: true,
    },
    {
        prop: "post_status",
        label: "状态",
        sortable: true,
        minWidth: 120,
        align: "center",
        formatter: (row: TableData) => {
            if ("post_status" in row) {
                const display = PostStatusDisplay[row.post_status as PostStatusCode]
                // 判断是否为定时或者过期
                if (row.post_status === PostStatusCode.Future && row.post_push_time?.Time) {
                    return `${display}(${formatTime(row.post_push_time.Time)})`
                }

                if (row.post_status === PostStatusCode.Expired && row.post_expired_time?.Time) {
                    return `${display}(${formatTime(row.post_expired_time.Time)})`
                }

                return display
            }
        },
    },
    {
        prop: "created_at",
        label: "创建时间",
        sortable: true,
        minWidth: 120,
        align: "center",
    },
]

// 获取文章统计数据
export function generateCols(postType: PostType) {
    // 创建基础列
    const columns = [...baseColumns]

    // 添加分类和标签列 仅文章类型
    if (postType === PostType.Post) {
        columns.push(...categoryColumns)
    }

    // 添加统计信息列
    columns.push(...statsColumns)

    // 添加作者和状态列
    columns.push(...authorStatusColumns)

    return reactive(columns)
}
