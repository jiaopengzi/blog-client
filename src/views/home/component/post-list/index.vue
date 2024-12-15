<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-09-29 10:52:39
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-15 19:43:51
 * @FilePath     : \blog-client\src\views\home\component\post-list\index.vue
 * @Description  : 文章列表
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->

<template>
    <div class="post-list">
        <PostItem v-for="item in paginationData.records" :key="item.id" :post-data="item" />
    </div>
    <!-- 分页 -->
    <div class="pagination-block">
        <el-pagination
            v-model:current-page="paginationData.current_page"
            v-model:page-size="paginationData.page_size"
            :page-sizes="paginationData.page_sizes"
            :page-count="paginationData.page_count"
            :total="paginationData.total"
            :background="true"
            layout="total, prev, pager, next, jumper, sizes"
            size="small"
        />
    </div>
</template>

<script lang="ts" setup>
// @update:current-page="(val: number) => emit('update-current-page', val)"
// @update:page-size="(val: number) => emit('update-page-size', val)"

import { ref, onBeforeMount } from "vue"
import PostItem from "@/components/common/post-item-main"
import { type PostResPagination } from "@/api/post/common"
import { viewPostAPI, type ViewPostRequest } from "@/api/post/view"
import { ResponseCode } from "@/api/responseCode"
import { getEmptyPagination } from "@/components/common"

defineOptions({ name: "PostList" })

const paginationData = ref(getEmptyPagination<PostResPagination>())

// 获取文章列表
const getPostList = async () => {
    const req: ViewPostRequest = {
        current_page: paginationData.value.current_page,
        page_size: paginationData.value.page_size,
    }

    await viewPostAPI(req).then((res) => {
        console.log("getPostList", res)
        if (res.data.code === ResponseCode.PostViewSuccess) {
            paginationData.value = res.data.data
        }
    })
}

onBeforeMount(() => {
    getPostList()
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
