<!--
 * @FilePath     : \blog-client\src\views\home\component\post-list\index.vue
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
 * @Description  : 主文章列表
-->

<template>
    <div class="post-list">
        <div v-if="showPostList">
            <PostItemMain v-for="item in paginationAC.records" :key="item.id" :post-data="item" @click-category="clickCategory" @post-id="postId" />
        </div>
        <div v-if="showSearchList">
            <PostItemSearch
                v-for="(item, i) in paginationAC.records"
                :key="item.id"
                :post-data="item"
                :highlight="paginationAC.highlight?.[i]"
                :highlight-key="highlightKey"
                @post-id="postId"
            />
        </div>
        <!-- 空 -->
        <el-empty v-if="paginationAC.records.length === 0" class="empty" description="没有数据" />
    </div>
    <!-- 分页 -->
    <div class="pagination-container">
        <div class="loader" v-show="isShowLoading"></div>
        <div class="pagination-block" ref="paginationBlockRef">
            <el-pagination
                v-model:current-page="paginationAC.current_page"
                v-model:page-size="paginationAC.page_size"
                :page-sizes="paginationAC.page_sizes"
                :page-count="paginationAC.page_count"
                :total="paginationAC.total"
                :background="true"
                :layout="paginationLayout"
                size="small"
                @update:current-page="updateCurrentPage"
                @update:page-size="updatePageSize"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useIntersectionObserver } from "@vueuse/core"
import { storeToRefs } from "pinia"
import { computed, nextTick, onMounted, onUnmounted, ref, useTemplateRef, watch } from "vue"

import { type PostResPagination } from "@/api/post/common"
import { type PostCategory } from "@/api/postCategory/view"
import { getEmptyPagination, type Pagination } from "@/api/response"
import PostItemMain from "@/components/common/post-item-main"
import PostItemSearch from "@/components/common/post-item-search"
import { DeviceType, useDeviceStore } from "@/stores/device"
import { useStatusStore } from "@/stores/status"

defineOptions({ name: "PostList" })

const {
    paginationData,
    isShowLoading = false,
    highlightKey,
    showPostList,
    showSearchList,
} = defineProps<{
    paginationData: Pagination<PostResPagination>
    isShowLoading?: boolean // 是否显示loading
    highlightKey?: string // 高亮的key
    showPostList?: boolean // 默认文章列表
    showSearchList?: boolean // 搜索列表
}>()

// 事件
const emit = defineEmits<{
    (event: "updateCurrentPage", val: number): void
    (event: "updatePageSize", val: number): void
    (event: "clickCategory", val: PostCategory): void
    (event: "postId", val: string): void
    (event: "paginationBlockVisible", val: boolean): void
}>()

const statusStore = useStatusStore()
const deviceStore = useDeviceStore()
const { device } = storeToRefs(deviceStore)

const paginationLayout = computed(() => {
    return device.value === DeviceType.PHONE ? "total, prev, pager, next, sizes" : "total, prev, pager, next, jumper, sizes"
})

// 当前分页数据
const paginationAC = ref(getEmptyPagination<PostResPagination>())

// 分页组件 ref
const paginationBlockRef = useTemplateRef("paginationBlockRef")

// 更新当前页
const updateCurrentPage = (val: number) => {
    // TODO: 当没有数据的时候会触发当前页为 1,导致后续问题,暂时使用 if 来解决
    if (paginationAC.value.total === 0) return
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
const postId = async (val: string) => {
    emit("postId", val)
    await statusStore.setPostId(val) // 文章详情状态
}

watch(
    () => paginationData,
    (newVal) => {
        paginationAC.value = newVal
    },
    { deep: true },
)

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

onUnmounted(() => {
    stopIntersectionObserver()
})
</script>
<style lang="scss" scoped>
.post-list {
    font-size: 14px;
    margin-top: 10px;

    // 只有最后一个元素显示下边框
    .post-item {
        border-left: 1px solid var(--jpz-border-color);
        border-right: 1px solid var(--jpz-border-color);
        border-top: 1px solid var(--jpz-border-color);

        // 选中第一个元素时，显示上边框
        &:first-child {
            border-radius: 5px 5px 0 0;
        }

        &:last-child {
            border-bottom: 1px solid var(--jpz-border-color);
            border-radius: 0 0 5px 5px;
        }
    }
}

@include respond-to("pc") {
    .post-list {
        // 最小高度,减去头部和面包屑的高度再减去 80px为了分页的高度
        min-height: calc(100vh - pc.$height-header - pc.$height-breadcrumb - 80px);
    }
}

@include respond-to("pad") {
    .post-list {
        // 最小高度,减去头部和面包屑的高度再减去 80px为了分页的高度
        min-height: calc(100vh - pad.$height-header - pad.$height-breadcrumb - 80px);
        margin-left: 10px;
        margin-right: 10px;
    }
}

@include respond-to("phone") {
    .post-list {
        // 最小高度,减去头部和面包屑的高度再减去 80px为了分页的高度
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
}

/* 参考:https://css-loaders.com/dots/ */
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
