<!--
 * @FilePath     : \blog-client\src\views\home\component\post-list\index.vue
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
 * @Description  : 主文章列表
-->

<template>
    <el-pagination
        v-model:current-page="paginationAC.current_page"
        v-model:page-size="paginationAC.page_size"
        :page-sizes="paginationAC.page_sizes"
        :page-count="paginationAC.page_count"
        :total="paginationAC.total"
        @update:current-page="updateCurrentPage"
    />
</template>

<script lang="ts" setup>
import { reactive, watch } from "vue"

import { type PostResPagination } from "@/api/post/common"
import { getEmptyPagination, type Pagination } from "@/api/response"
defineOptions({ name: "PostList" })

const { paginationData } = defineProps<{
    paginationData: Pagination<PostResPagination>
}>()

const paginationAC = reactive(getEmptyPagination<PostResPagination>())

watch(
    () => paginationData,
    (newVal, oldVal) => {
        console.log("============>当前页更新 old ac", paginationAC.current_page)
        Object.assign(paginationAC, newVal)
        console.log("============>当前页更新 new ac", paginationAC.current_page)
        console.log("============>当前页更新 old", oldVal.current_page)
        console.log("============>当前页更新 new", newVal.current_page)
    },
    { deep: true },
)

const updateCurrentPage = (val: number) => {
    console.log("============>使用 update 方法当前页更新", val)
}
</script>
