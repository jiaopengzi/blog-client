<!--
 * FilePath    : blog-client\src\views\home\main-content\post-detail\component\updated-at\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 页脚更新时间
-->

<template>
    <div v-if="isShow" class="updated-at-container">
        <span class="text">最后更新于：</span>
        <span class="time">{{ formatTime(data.time, data.timeZone, data.formatStr) }}</span>
    </div>
</template>

<script lang="ts" setup>
import { computed } from "vue"

import { formatTime } from "@/utils/dateTime"

import { type UpdatedAtProps } from "./types.ts"

defineOptions({ name: "DetailUpdatedAt" })

// 定义 props
const { data } = defineProps<{
    data: UpdatedAtProps
}>()

const isShow = computed(() => {
    return data.time !== ""
})
</script>

<style lang="scss" scoped>
.updated-at-container {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 100%;
    height: 28px;

    font-size: 14px;
    color: var(--jpz-text-color-placeholder);
    border-radius: 0 0 3px 3px;

    .time {
        margin-right: 10px;
    }
}
</style>
