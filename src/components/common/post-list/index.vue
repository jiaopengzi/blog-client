<!--
 * FilePath    : blog-client-nuxt\src\components\common\post-list\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 文章列表
-->

<template>
    <div class="post-list">
        <div v-if="showPostList">
            <PostItemMain
                v-for="item in paginationData.records"
                :key="item.id"
                :post-data="item"
                :post-list-summary-truncate="postListSummaryTruncate"
                :is-hide-time-icon="isHideTimeIcon"
                :is-set-time-margin="isSetTimeMargin"
                @click-category="clickCategory"
                @post-id="postId"
            />
        </div>
        <div v-if="showSearchList">
            <PostItemSearch
                v-for="(item, i) in paginationData.records"
                :key="item.id"
                :post-data="item"
                :highlight="paginationData.highlight?.[i]"
                :highlight-key="highlightKey"
                @post-id="postId"
            />
        </div>
        <!-- 空(feature01: el-empty 内部 useId 在 SSR 双端不一致, ClientOnly 渲染避免 hydration mismatch) -->
        <ClientOnly>
            <el-empty v-if="paginationData.records.length === 0" class="empty" description="没有数据" />
        </ClientOnly>
    </div>
    <!-- 分页(feature01: el-pagination 内部 useId 在 SSR 双端不一致, ClientOnly 渲染避免 hydration mismatch;
         列表条目与摘要已 SSR 直出, 分页控件仅交互用途) -->
    <div class="pagination-container">
        <div class="loader" v-show="isShowLoading"></div>
        <ClientOnly>
            <div class="pagination-block" ref="paginationBlockRef">
                <!-- 注意这里使用 v-model 双向绑定, 会造成意外的触发在 update 中手动更新 -->
                <el-pagination
                    :current-page="paginationData.current_page"
                    :page-size="paginationData.page_size"
                    :page-sizes="paginationData.page_sizes"
                    :page-count="paginationData.page_count"
                    :total="paginationData.total"
                    :background="true"
                    :layout="paginationLayout"
                    size="small"
                    @update:current-page="updateCurrentPage"
                    @update:page-size="updatePageSize"
                />
            </div>
        </ClientOnly>
    </div>

    <!-- 链接列表 -->
    <LinkList class="links" />
</template>

<script lang="ts" setup>
import { useIntersectionObserver } from "@vueuse/core"
import { storeToRefs } from "pinia"
import { nextTick, onMounted, onUnmounted, ref, useTemplateRef, watch } from "vue"

import { useDevice } from "@/components/hooks/useDevice"
import { type PostResPagination } from "@/api/post/common"
import { type PostCategory } from "@/api/postCategory/view"
import { type Pagination } from "@/api/response"
import PostItemMain from "@/components/common/post-item-main"
import PostItemSearch from "@/components/common/post-item-search"
import { useStatusStore } from "@/stores/status"
import LinkList from "@/components/views/link-list"

defineOptions({ name: "PostList" })

const {
    paginationData,
    isShowLoading = false,
    highlightKey,
    showPostList,
    showSearchList,
    postListSummaryTruncate = 100,
    isHideTimeIcon = false,
    isSetTimeMargin = false,
} = defineProps<{
    paginationData: Pagination<PostResPagination>
    isShowLoading?: boolean // 是否显示 loading
    highlightKey?: string // 高亮的 key
    showPostList?: boolean // 默认文章列表
    showSearchList?: boolean // 搜索列表
    postListSummaryTruncate?: number
    isHideTimeIcon?: boolean
    isSetTimeMargin?: boolean
}>()

// 事件声明
const emit = defineEmits<{
    (event: "updateCurrentPage", val: number): void
    (event: "updatePageSize", val: number): void
    (event: "clickCategory", val: PostCategory): void
    (event: "postId", val: string): void
    (event: "paginationBlockVisible", val: boolean): void
}>()

const statusStore = useStatusStore()

const { disablePagination } = storeToRefs(statusStore)

const { paginationLayout } = useDevice()

const paginationBlockRef = useTemplateRef("paginationBlockRef")

watch(
    () => [showSearchList, paginationData.total],
    ([showSearchList, total]) => {
        // 搜索列表无数据时临时禁用分页, 避免触发分页事件造成无意义的请求
        if (showSearchList && total === 0) {
            statusStore.setDisablePagination(true)
        }
    },
    { immediate: true },
)

const updateCurrentPage = (val: number) => {
    if (disablePagination.value) {
        // 说明拦截到了分页事件, 需要恢复分页
        statusStore.setDisablePagination(false)
        return
    }
    emit("updateCurrentPage", val)
}

const updatePageSize = (val: number) => {
    if (disablePagination.value) {
        // 说明拦截到了分页事件, 需要恢复分页
        statusStore.setDisablePagination(false)
        return
    }
    emit("updatePageSize", val)
}

const clickCategory = (val: PostCategory) => {
    emit("clickCategory", val)
}

// 点击文章
const postId = async (val: string) => {
    emit("postId", val)
}

let stopIntersectionObserver: () => void
const isInitialRender = ref(true)

onMounted(async () => {
    await nextTick()

    const { stop } = useIntersectionObserver(paginationBlockRef, ([entry]) => {
        if (isInitialRender.value) {
            // 初次加载时不 emit
            isInitialRender.value = false
        } else {
            // 非初次加载时, 根据 intersection 情况 emit
            emit("paginationBlockVisible", entry?.isIntersecting || false)
        }
    })

    stopIntersectionObserver = stop
})

onUnmounted(() => {
    stopIntersectionObserver()
})
</script>
<style lang="scss" scoped>
.post-list {
    font-size: 14px;

    // 只有最后一个元素显示下边框
    .post-item,
    .search-item {
        border-left: 1px solid var(--jpz-border-color);
        border-right: 1px solid var(--jpz-border-color);
        border-top: 1px solid var(--jpz-border-color);

        // 选中第一个元素时, 显示上边框
        &:first-child {
            border-radius: 5px 5px 0 0;
        }

        &:last-child {
            border-bottom: 1px solid var(--jpz-border-color);
            border-radius: 0 0 5px 5px;
        }
    }
}

.links {
    margin-top: 10px;
    width: 100%;
}

@include respond-to("pc") {
    .post-list {
        // 最小高度, 减去头部和面包屑的高度, 再减去 80px 作为分页的高度
        min-height: calc(100vh - pc.$height-header - pc.$height-breadcrumb - 80px);
    }
}

@include respond-to("pad") {
    .post-list {
        // 最小高度, 减去头部和面包屑的高度, 再减去 80px 作为分页的高度
        min-height: calc(100vh - pad.$height-header - pad.$height-breadcrumb - 80px);
        margin-left: 10px;
        margin-right: 10px;
    }
}

@include respond-to("phone") {
    .post-list {
        // 最小高度, 减去头部和面包屑的高度, 再减去 80px 作为分页的高度
        min-height: calc(100vh - phone.$height-header - phone.$height-breadcrumb - 80px);
        margin-left: 10px;
        margin-right: 10px;
    }
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
    // 防止分页组件在手机端溢出撑大页面产生横向滚动条
    max-width: 100%;
    overflow-x: auto;
}

/* 参考: https://css-loaders.com/dots/ */
.loader {
    width: 60px;
    aspect-ratio: 3;
    --_g: no-repeat radial-gradient(circle closest-side, var(--jpz-color-primary) 90%, #0000);
    background:
        var(--_g) 0% 50%,
        var(--_g) 50% 50%,
        var(--_g) 100% 50%;
    background-size: calc(100% / 3) 50%;
    animation: l3 1s infinite linear;
    margin-top: 20px;
}
@keyframes l3 {
    20% {
        background-position:
            0% 0%,
            50% 50%,
            100% 50%;
    }
    40% {
        background-position:
            0% 100%,
            50% 0%,
            100% 50%;
    }
    60% {
        background-position:
            0% 50%,
            50% 100%,
            100% 0%;
    }
    80% {
        background-position:
            0% 50%,
            50% 50%,
            100% 100%;
    }
}
</style>
