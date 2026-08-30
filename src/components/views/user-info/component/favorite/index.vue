<!--
 * FilePath    : blog-client-nuxt\src\components\views\user-info\component\favorite\index.vue
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
            :img-single-click-view-post="true"
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

import { postStarGetOwnAPI, type PostStarRes } from "@/api/post/starGetOwn"
import { type PaginationRequest } from "@/api/request"
import { ResponseCode } from "@/api/response"
import type { TableColumn } from "@/components/common/base-table"
import BaseTable from "@/components/common/base-table/index.vue"
import { generateColsUserInfoFavorite } from "@/components/common/post-list-admin/cols"
import { useBaseTable } from "@/components/hooks/useBaseTable"
import { usePostView } from "@/components/hooks/usePostView"
import { RouteNames } from "@/router"

import { UserInfoHash } from "../types"

defineOptions({ name: "UserInfoFavorite" })

useHead({
    title: "用户信息-收藏",
})

const cols: TableColumn[] = generateColsUserInfoFavorite()

const queryParams: PaginationRequest = reactive({} as PaginationRequest)

const numberKeys: NumberKeys<PaginationRequest>[] = ["current_page", "page_size"]

const { pagination, updateCurrentPage, updatePageSize, editItemUpdateDialogVisible } = useBaseTable<PostStarRes, PaginationRequest, never>({
    routeName: RouteNames.UserInfo,
    viewAPI: postStarGetOwnAPI,
    viewResCode: ResponseCode.PostStarGetOwnSuccess,
    queryParams,
    // 反馈第 1 轮: 收藏列表缩略图与前台主文章列表(pc 200x150)保持一致
    options: {
        numberKeys,
        hash: UserInfoHash.Favorite,
        tableImg: { width: 200, height: 150 },
    },
})

const { handleViewPost } = usePostView()
</script>
