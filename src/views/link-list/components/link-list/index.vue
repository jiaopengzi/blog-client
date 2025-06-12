<!--
 * FilePath    : blog-client\src\views\link-list\components\link-list\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 链接列表
-->

<template>
    <div class="link-list-container" v-if="pagination.total > 0">
        <el-button v-if="!isShowDescription" class="link-list-more" type="default" @click="handleMoreClick">更多</el-button>
        <div class="link-list">
            <div v-for="item in pagination.records" :key="item.id" class="link-item">
                <LinkItem :data="item" :size="size" :is-show-description="isShowDescription" :truncated-count="truncatedCount" />
            </div>
        </div>

        <!-- 分页 -->
        <div class="pagination-container" v-if="pagination.page_count > 1 && isShowDescription">
            <div class="pagination-block" ref="paginationBlockRef">
                <!-- 注意这里使用 v-model 双向绑定, 会造成意外的触发在 update 中手动更新 -->
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
    </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia"
import { computed, onBeforeMount, reactive } from "vue"
import { useRouter } from "vue-router"

import { type ViewLinkRequest } from "@/api/link/view"
import { useParams } from "@/components/hooks/useParams"
import { RouteNames } from "@/router"
import { DeviceType, useDeviceStore } from "@/stores/device"

import LinkItem from "../link-item"
import { useLinkList } from "./hooks"

defineOptions({ name: "LinkList" })

const {
    size = 24,
    isShowDescription = false,
    truncatedCount = 50,
    isParseRouteQuery = false,
} = defineProps<{
    size?: number // 图片大小
    isShowDescription?: boolean // 是否显示描述
    truncatedCount?: number // 截断的字符数
    isParseRouteQuery?: boolean // 是否解析路由查询参数
}>()

const req = reactive<ViewLinkRequest>({})

const router = useRouter()

// 分页组件的layout
const deviceStore = useDeviceStore()
const { device } = storeToRefs(deviceStore)
const paginationLayout = computed(() => {
    return device.value === DeviceType.PHONE ? "total, prev, pager, next, sizes" : "total, prev, pager, next, jumper, sizes"
})

const {
    pagination, // 分页数据
    updateCurrentPage, // 更新当前页
    updatePageSize, // 更新每页显示条数
    updatePaginate, // 更新分页
    updateQueryParams, // 更新查询参数
} = useLinkList(req)

const handleMoreClick = () => {
    router.push({ name: RouteNames.LinkList })
}

onBeforeMount(async () => {
    if (isParseRouteQuery) {
        await updateQueryParams() // 更新查询参数
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
    position: relative;
    padding-bottom: 10px;
    padding-top: 36px;
    background-color: var(--jpz-bg-color);
    width: 100%;
}

.link-list-more {
    position: absolute;
    top: 0;
    right: 0;
    color: var(--jpz-text-color-placeholder);
    border: none;
    margin: 4px;
}

.link-list {
    padding-left: 15px;
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

// @include respond-to("pc") {
// }

@include respond-to("pad") {
    .link-list-container {
        margin-left: 10px;
        margin-right: 10px;
    }
}

@include respond-to("phone") {
    .link-list-container {
        margin-left: 10px;
        margin-right: 10px;
    }
}
</style>
