<!--
 * FilePath    : blog-client-dev\src\components\common\copy-text\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 复制文本组件,双击文本或点击按钮均可复制
-->

<template>
    <span @dblclick="handleCopyText">
        {{ text }}
    </span>
    <el-button class="copy-text-btn" @click="handleCopyText" type="">
        <el-icon class="copy-text-icon">
            <CopyDocument />
        </el-icon>
    </el-button>
</template>

<script lang="ts" setup>
import { CopyDocument } from "@element-plus/icons-vue"

import { copyText } from "@/utils/clipboard"
import { MessageUtil } from "@/utils/message"

defineOptions({ name: "CopyText" })

const { text } = defineProps<{
    text: string
}>()

// 复制文本到剪贴板
const handleCopyText = () => {
    // 复制链接到剪贴板
    copyText(text)
        .then(() => {
            MessageUtil.success("复制成功")
        })
        .catch(() => {
            MessageUtil.error("复制失败")
        })
}
</script>
<style scoped lang="scss">
.copy-text-btn {
    margin-left: 8px;
    padding: 0;
    border: none;
    background: transparent;
    color: var(--el-text-color-secondary);
    &:hover {
        color: var(--el-text-color-primary);
    }

    .copy-text-icon {
        margin: 0;
        padding: 0;
    }
}
</style>
