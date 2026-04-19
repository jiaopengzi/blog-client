<!--
 * FilePath    : blog-client\src\components\common\video-toc-item\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 视频目录项
-->
<template>
    <div class="video-toc-item" :class="{ 'is-edit-mode': isEdit, 'is-display-mode': !isEdit }">
        <span class="order" v-if="isShowOrder">{{ orderDisplay }}. </span>
        <EditableText class="text" :is-edit="isEdit" :text="text" @finishEdit="finishEdit" />
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue"

import EditableText from "@/components/common/editable-text"

defineOptions({ name: "VideoTocItem" })

const {
    order = 1,
    orderTotal = 1,
    text = "",
    isShowOrder = true,
    isEdit = true,
} = defineProps<{
    order?: number // 序号
    orderTotal?: number // 总数
    text?: string // 文本
    isShowOrder?: boolean // 是否显示序号，默认显示
    isEdit?: boolean // 是否可编辑，默认可编辑
}>()

// 事件
const emit = defineEmits<{
    (event: "finishEdit", val: string): void
}>()

const orderDisplay = computed(() => {
    // 根据总数决定前面补0的位数
    const totalDigits = orderTotal ? orderTotal.toString().length : 1
    return order.toString().padStart(totalDigits, "0")
})

// 完成编辑(失焦或按回车)
const finishEdit = (val: string) => {
    emit("finishEdit", val)
}
</script>
<style lang="scss" scoped>
.video-toc-item {
    width: 100%;
    display: flex;
    align-items: center;
    font-size: 14px;
    margin: 4px 0;
    box-sizing: border-box;

    &.is-display-mode {
        padding: 8px 12px;
        border-radius: 8px;
        transition: all 0.3s ease;

        .order {
            font-weight: 500;
            margin-right: 12px;
            opacity: 0.8;
            min-width: 32px;
        }

        .text {
            transition: color 0.3s ease;
        }
    }

    .order {
        font-weight: bold;
        margin-right: 8px;
        color: var(--jpz-text-color-secondary);
        min-width: 30px;
        text-align: right;
    }

    .text {
        flex: 1;
    }
}
</style>
