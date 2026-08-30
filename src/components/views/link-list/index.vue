<!--
 * FilePath    : blog-client-nuxt\src\components\views\link-list\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 链接列表
-->

<template>
    <div class="link-list-container" v-if="pagination.total > 0">
        <div class="link-list">
            <div v-for="item in pagination.records" :key="item.id" class="link-item">
                <LinkItem :data="item" :size="size" :is-show-description="isShowDescription" :truncated-count="truncatedCount" />
            </div>
        </div>

        <!-- 分页 -->
        <div class="pagination-container" v-if="pagination.page_count > 1 && isPagination">
            <div class="pagination-block" ref="paginationBlockRef">
                <!-- 注意: 使用 v-model 双向绑定会造成意外触发, 这里在 update 事件中手动更新 -->
                <el-pagination
                    :current-page="pagination.current_page"
                    :page-size="pagination.page_size"
                    :page-sizes="pagination.page_sizes"
                    :page-count="pagination.page_count"
                    :total="pagination.total"
                    :background="true"
                    :layout="paginationLayout"
                    size="small"
                    @update:current-page="updateCurrentPage"
                    @update:page-size="updatePageSize"
                />
            </div>
        </div>
        <div v-if="!isPagination" class="link-list-more-container">
            <el-button class="link-list-more" type="default" @click="handleMoreClick">更多</el-button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onBeforeMount, reactive } from "vue"
import { useRouter } from "vue-router"

import { type ViewLinkRequest } from "@/api/link/view"
import { useParams } from "@/components/hooks/useParams"
import { RouteNames } from "@/router"
import { useDevice } from "@/components/hooks/useDevice"

import LinkItem from "./link-item"
import { useLinkList } from "./hooks"

defineOptions({ name: "LinkList" })

const {
    size = 24,
    isShowDescription = false,
    truncatedCount = 50,
    isParseRouteQuery = false,
    isPagination = false,
} = defineProps<{
    size?: number
    isShowDescription?: boolean
    truncatedCount?: number
    isParseRouteQuery?: boolean
    isPagination?: boolean
}>()

const req = reactive<ViewLinkRequest>({})

const router = useRouter()

const { paginationLayout } = useDevice()

const { pagination, updateCurrentPage, updatePageSize, updatePaginate, updateQueryParams } = useLinkList(req)

const handleMoreClick = () => {
    router.push({ name: RouteNames.LinkList })
}

onBeforeMount(async () => {
    if (isParseRouteQuery) {
        await updateQueryParams()
    }

    // 初始化分页数据
    await updatePaginate()
})

// 在加载前将 params 解析回对应的响应式变量中
useParams(req, pagination)
</script>
<style lang="scss" scoped>
.link-list-container {
    border-radius: 4px;
    background-color: var(--jpz-bg-color);
    width: 100%;
}

.link-list-more-container {
    display: flex;
    justify-content: right;
    align-items: center;
    padding-right: 10px;
    padding-bottom: 10px;

    .link-list-more {
        color: var(--jpz-text-color-placeholder);
        border: none;
    }
}

.link-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: left;
    gap: 10px;
}

.pagination-container {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.pagination-block {
    display: flex;
    justify-content: center;
    margin: 10px;
}

@include respond-to("pc") {
    .link-list {
        padding: 15px;
        padding-top: 20px;
    }
}

@include respond-to("pad") {
    .link-list {
        padding: 15px;
        padding-top: 20px;
    }
}

@include respond-to("phone") {
    .link-list {
        padding: 10px;
    }
}
</style>
