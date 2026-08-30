<!--
 * FilePath    : blog-client-nuxt\src\components\layout\aside\post-tag\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 文章标签
-->

<template>
    <div class="aside-item">
        <div class="title">
            <h2>
                <j-icon :name="IconKeys.Label" custom-class="my-icon" />
                文章标签
            </h2>
        </div>
        <div v-if="noData" class="no-data-box">
            <el-empty description="暂无数据" />
        </div>
        <div v-else class="tag-box">
            <el-scrollbar max-height="300px">
                <TagItem v-for="item in items" :tag-data="item" :is-admin="isAdmin" :key="item.id" @click="handleClick(item)" />
            </el-scrollbar>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue"

import { type PostTag } from "@/api/postTag/view"
import { IconKeys } from "@/components/common/icons"
import TagItem from "@/components/common/tag-item"

defineOptions({ name: "PostTag" })

const { isAdmin = false, items = [] } = defineProps<{
    isAdmin?: boolean
    items?: PostTag[]
}>()

const emit = defineEmits<{
    (event: "click", tagItemData: PostTag): void
}>()

// 是否没有数据
const noData = computed(() => {
    const flag = items.length === 0
    return flag
})

const handleClick = (tagItemData: PostTag) => {
    emit("click", tagItemData)
}
</script>
<style scoped lang="scss">
.aside-item {
    border: 1px solid var(--jpz-border-color);
    background-color: var(--jpz-bg-color);
    border-radius: 5px;

    .title {
        background-color: var(--jpz-bg-color);
        padding: 10px 5px;
    }

    h2 {
        font-size: 16px;
        font-weight: 600;
        display: flex;
        align-items: center;
    }
}

.tag-box {
    padding: 8px;
}

.no-data-box {
    width: 100%;
    height: 160px;
    .el-empty {
        padding: 10px;
        :deep(.el-empty__image) {
            width: 80px;
            height: 80px;
        }
    }
}

.my-icon {
    font-size: 20px;
    margin-right: 5px;
    fill: var(--jpz-color-secondary);
}
</style>
