<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-09-29 10:52:39
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-17 18:50:40
 * @FilePath     : \blog-client\src\views\home\component\post-list\index.vue
 * @Description  : 文章列表
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->

<template>
    <div class="post-list">
        <PostItem v-for="item in paginationAC.records" :key="item.id" :post-data="item" />
    </div>
    <!-- 分页 -->
    <div class="pagination-block">
        <el-pagination
            v-model:current-page="paginationAC.current_page"
            v-model:page-size="paginationAC.page_size"
            :page-sizes="paginationAC.page_sizes"
            :page-count="paginationAC.page_count"
            :total="paginationAC.total"
            :background="true"
            layout="total, prev, pager, next, jumper, sizes"
            size="small"
            @update:current-page="updateCurrentPage"
            @update:page-size="updatePageSize"
        />
    </div>
</template>

<script lang="ts" setup>
import { ref, onBeforeMount, inject } from "vue"
import PostItem from "@/components/common/post-item-main"
import { type PostResPagination } from "@/api/post/common"
import { type Pagination } from "@/components/common"

import { getEmptyPagination } from "@/components/common"

defineOptions({ name: "PostList" })

// pagination 可选，如果没有传入则从 provide 中获取
const { pagination } = defineProps<{
    pagination?: Pagination<PostResPagination>
}>()

// 保留事件
const emit = defineEmits<{
    (event: "updateCurrentPage", val: number): void
    (event: "updatePageSize", val: number): void
}>()

// 当前分页数据
const paginationAC = ref(getEmptyPagination<PostResPagination>())

// 从 provide 中获取
const paginationInject = inject<Pagination<PostResPagination>>("pagination")
const updateCurrentPageInject = inject<(val: number) => void>("updateCurrentPage")
const updatePageSizeInject = inject<(val: number) => void>("updatePageSize")

// 更新当前页
const updateCurrentPage = (val: number) => {
    emit("updateCurrentPage", val)
    if (updateCurrentPageInject) {
        updateCurrentPageInject(val)
    }
}

// 更新每页显示数量
const updatePageSize = (val: number) => {
    emit("updatePageSize", val)
    if (updatePageSizeInject) {
        updatePageSizeInject(val)
    }
}

onBeforeMount(() => {
    // 优先使用 provide 中的数据
    paginationAC.value = paginationInject ?? pagination ?? getEmptyPagination<PostResPagination>()
})
</script>
<style lang="scss" scoped>
.post-list {
    font-size: 14px;
    margin-top: 10px;
    border-left: 1px solid var(--jpz-border-color);
    border-right: 1px solid var(--jpz-border-color);
    // 除了最后一个元素显示下边框 其他都只显示上边框

    .post-item {
        border-top: 1px solid var(--jpz-border-color);

        &:last-child {
            border-bottom: 1px solid var(--jpz-border-color);
        }
    }
}

.pagination-block {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}
</style>
