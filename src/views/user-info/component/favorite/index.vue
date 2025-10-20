<!--
 * FilePath    : blog-client\src\views\user-info\component\favorite\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 收藏
-->
<template>
    <section>
        <BaseTable
            :pagination="pagination"
            :table-column="cols"
            @update-current-page="updateCurrentPage"
            @update-page-size="updatePageSize"
            @edit-item-update-dialog-visible="editItemUpdateDialogVisible"
        >
        </BaseTable>
    </section>
</template>

<script lang="ts" setup>
import { useHead } from "@unhead/vue"
import { reactive } from "vue"

import { postStarGetOwnAPI, type PostStarRes } from "@/api/post/starGetOwn"
import { type PaginationRequest } from "@/api/request"
import { ResponseCode } from "@/api/response"
import type { TableColumn } from "@/components/common/base-table"
import BaseTable from "@/components/common/base-table/index.vue"
import { generateColsUserInfoFavorite } from "@/components/common/post-list-admin/cols"
import { useBaseTable } from "@/components/hooks/useBaseTable"
import { RouteNames } from "@/router"

import { UserInfoHash } from "../types"

defineOptions({ name: "UserInfoFavorite" })

useHead({
    title: "用户信息-收藏",
})

const cols: TableColumn[] = generateColsUserInfoFavorite()

// 查询参数
const queryParams: PaginationRequest = reactive({} as PaginationRequest)

// 数字类型的 key
const numberKeys: NumberKeys<PaginationRequest>[] = ["current_page", "page_size"]

// hooks 使用
const {
    pagination, // 分页数据
    updateCurrentPage, // 更新当前页
    updatePageSize, // 更新每页显示条数
    editItemUpdateDialogVisible, // 编辑对话框
} = useBaseTable<PostStarRes, PaginationRequest, never>({
    routeName: RouteNames.UserInfo,
    viewAPI: postStarGetOwnAPI,
    viewResCode: ResponseCode.PostStarGetOwnSuccess,
    queryParams,
    options: { numberKeys, hash: UserInfoHash.Favorite },
})
</script>
