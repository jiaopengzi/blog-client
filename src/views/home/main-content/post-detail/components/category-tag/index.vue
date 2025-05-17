<!--
 * FilePath    : blog-client\src\views\home\main-content\post-detail\component\category-tag\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 分类和标签
-->

<template>
    <div class="category-tag-container" v-if="isShowCategory || isShowTag">
        <tag-item-base v-for="(item, index) in items" :key="index" :tag-base="{ id: index.toString(), display: item.display }" @click-item="clickItem" />
    </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia"
import { computed, type ComputedRef } from "vue"

import { type PostCategory } from "@/api/postCategory/view"
import { type PostTag } from "@/api/postTag/view"
import { convert } from "@/api/setting/getAPPOption"
import TagItemBase from "@/components/common/tag-item-base"
import { useOptionsStore } from "@/stores/options"

import type { CategoryTagItem, CategoryTagProps } from "./types"

defineOptions({ name: "DetailPrevNext" })

// 定义 props
const { data } = defineProps<{ data: CategoryTagProps }>()

// 事件
const emit = defineEmits<{
    (event: "click-category", val: PostCategory): void
    (event: "click-tag", val: PostTag): void
}>()

// 获取全局配置
const optionsStore = useOptionsStore()
const { app_options: opt } = storeToRefs(optionsStore)

const isShowCategory = computed(() => {
    return data.categories.length > 0 && convert(opt.value.show_category_enable)
})

const isShowTag = computed(() => {
    return data.tags.length > 0 && convert(opt.value.show_tags_enable)
})

const items: ComputedRef<CategoryTagItem[]> = computed(() => {
    const items: CategoryTagItem[] = []
    if (isShowCategory.value) {
        data.categories.map((srcItem) => {
            const item: CategoryTagItem = {
                id: srcItem.id,
                display: srcItem.name,
                type: "category",
                srcData: srcItem,
            }

            items.push(item)
        })
    }

    if (isShowTag.value) {
        data.tags.map((srcItem) => {
            const item: CategoryTagItem = {
                id: srcItem.id,
                display: srcItem.name,
                type: "tag",
                srcData: srcItem,
            }
            items.push(item)
        })
    }

    return items
})

// 事件处理函数
const clickItem = (index: string) => {
    const idx = Number(index)
    const item = items.value[idx]
    if (item) {
        if (item.type === "category") {
            emit("click-category", item.srcData as PostCategory)
        } else if (item.type === "tag") {
            emit("click-tag", item.srcData as PostTag)
        }
    }
}
</script>

<style lang="scss" scoped>
.category-tag-container {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 10px;
}

// @include respond-to("pc") {
// }

@include respond-to("pad") {
    .category-tag-container {
        padding: 0 10px;
    }
}

@include respond-to("phone") {
    .category-tag-container {
        padding: 0 10px;
    }
}
</style>
