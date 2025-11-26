<!--
 * FilePath    : blog-client-dev\src\components\editor\components\toolbar\components\emoji\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 表情组件
-->

<template>
    <!-- emoji表情 -->
    <el-popover
        placement="bottom"
        width="310"
        trigger="hover"
        popper-class="popper-class"
        popper-style="background-color: transparent; border: none; box-shadow: none;"
        :show-arrow="false"
        :offset="0"
    >
        <template #reference>
            <j-icon :name="icon" custom-class="iconfont" />
        </template>

        <EmojiPicker :native="true" @select="onSelectEmoji" />
    </el-popover>
</template>

<script lang="ts" setup>
import EmojiPicker, { type EmojiExt } from "vue3-emoji-picker"

import type { IconKeys } from "@/components/common/icons"

defineOptions({ name: "BarEmoji" })

// 定义 props
const { icon } = defineProps<{
    icon: IconKeys // 预览内容
}>()

// 子组件 传参
const emit = defineEmits<{
    (e: "emoji-picker-selected", emoji: EmojiExt): void
}>()

// emoji 选择
const onSelectEmoji = (emoji: EmojiExt) => {
    emit("emoji-picker-selected", emoji)
}
</script>

<style scoped lang="scss">
.iconfont {
    width: 28px;
    height: 28px;
    font-size: 20px;
    fill: var(--jpz-text-color-primary);
    transition: fill 0.3s ease;
    border-radius: 4px;
}

.iconfont:hover {
    background-color: var(--jpz-text-color-secondary);
}

.popper-class {
    background: transparent;
    border: none;
    box-shadow: none;
}
</style>
