<!--
 * FilePath    : blog-client-nuxt\src\components\views\user-info\component\comment\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 用户信息页评论列表组件
-->
<template>
    <section>
        <BaseTable
            :pagination="pagination"
            :table-column="cols"
            @update-current-page="updateCurrentPage"
            @update-page-size="updatePageSize"
            @edit-item-update-dialog-visible="editItemUpdateDialogVisible"
            @view-post="handleViewPost"
        >
        </BaseTable>
    </section>
</template>

<script lang="ts" setup>
import { reactive } from "vue"

import { CommentReviewCode, CommentStatusDisplay } from "@/api/comment/common"
import { type CommentResOwn, viewCommentOwnAPI, type ViewCommentOwnRequest } from "@/api/comment/viewOwn"
import { ResponseCode } from "@/api/response"
import type { TableColumn, TableData } from "@/components/common/base-table"
import BaseTable from "@/components/common/base-table/index.vue"
import { useBaseTable } from "@/components/hooks/useBaseTable"
import { usePostView } from "@/components/hooks/usePostView"
import { RouteNames } from "@/router"

import { UserInfoHash } from "../types"

defineOptions({ name: "UserInfoComment" })

useHead({
    title: "用户信息-评论",
})

const cols: TableColumn[] = reactive([
    {
        prop: "content",
        label: "评论内容",
        sortable: true,
        minWidth: 300,
        align: "center",
        isMarkdownPreview: true,
    },
    {
        prop: "status",
        label: "状态",
        sortable: true,
        minWidth: 100,
        align: "center",
        formatter: (row: TableData) => {
            if ("status" in row) {
                const display = CommentStatusDisplay[row.status as CommentReviewCode]
                return display
            }
        },
    },
    {
        prop: "post_info",
        label: "文章信息",
        minWidth: 120,
        align: "center",
        isCommentWithPost: true,
        isCommentWithAdmin: false,
    },
    {
        prop: "created_at",
        label: "创建时间",
        sortable: true,
        minWidth: 120,
        align: "center",
    },
])

const queryParams: ViewCommentOwnRequest = reactive({} as ViewCommentOwnRequest)

const numberKeys: NumberKeys<ViewCommentOwnRequest>[] = ["current_page", "page_size"]

const { pagination, updateCurrentPage, updatePageSize, editItemUpdateDialogVisible } = useBaseTable<CommentResOwn, ViewCommentOwnRequest, never>({
    routeName: RouteNames.UserInfo,
    viewAPI: viewCommentOwnAPI,
    viewResCode: ResponseCode.CommentViewSuccess,
    queryParams,
    options: { numberKeys, hash: UserInfoHash.Comment },
})

const { handleViewPost } = usePostView()
</script>
