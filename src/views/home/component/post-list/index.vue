<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-09-29 10:52:39
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-24 23:49:17
 * @FilePath     : \blog-client\src\views\home\component\post-list\index.vue
 * @Description  : 文章列表
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->

<template>
    <div class="post-list">
        <PostItem
            v-for="item in paginationAC.records"
            :key="item.id"
            :post-data="item"
            @click-category="clickCategory"
            @post-id="postId"
        />
    </div>
    <!-- 分页 -->
    <div class="pagination-block" ref="paginationBlockRef">
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
import { ref, reactive, onMounted, onUnmounted, useTemplateRef, nextTick, watch } from "vue"
import { useIntersectionObserver } from "@vueuse/core"
import PostItem from "@/components/common/post-item-main"
import { type PostResPagination } from "@/api/post/common"
import { type PostCategory } from "@/api/postCategory/view"
import { type Pagination } from "@/components/common"

import { getEmptyPagination } from "@/components/common"

defineOptions({ name: "PostList" })

const { paginationData } = defineProps<{
    paginationData: Pagination<PostResPagination>
}>()

// 事件
const emit = defineEmits<{
    (event: "updateCurrentPage", val: number): void
    (event: "updatePageSize", val: number): void
    (event: "clickCategory", val: PostCategory): void
    (event: "postId", val: string): void
    (event: "paginationBlockVisible", val: boolean): void
}>()

// 当前分页数据
const paginationAC = reactive(getEmptyPagination<PostResPagination>())

// 分页组件 ref
const paginationBlockRef = useTemplateRef("paginationBlockRef")

// 更新当前页
const updateCurrentPage = (val: number) => {
    emit("updateCurrentPage", val)
}

// 更新每页显示数量
const updatePageSize = (val: number) => {
    emit("updatePageSize", val)
}

// 点击分类
const clickCategory = (val: PostCategory) => {
    emit("clickCategory", val)
}

// 点击文章
const postId = (val: string) => {
    emit("postId", val)
}

let stopIntersectionObserver: () => void // 停止监听函数
const isInitialRender = ref(true) // 是否是初始渲染

onMounted(async () => {
    await nextTick()

    const { stop } = useIntersectionObserver(paginationBlockRef, ([entry], observerElement) => {
        if (isInitialRender.value) {
            // 初次加载时不emit
            isInitialRender.value = false
        } else {
            // 非初次加载时，根据intersection情况emit
            emit("paginationBlockVisible", entry?.isIntersecting || false)
        }
    })

    stopIntersectionObserver = stop
})

watch(
    () => paginationData,
    (newVal) => {
        Object.assign(paginationAC, newVal)
    },
    { deep: true },
)

onUnmounted(() => {
    stopIntersectionObserver()
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
