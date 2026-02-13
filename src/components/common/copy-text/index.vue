<!--
 * FilePath    : blog-client-dev\src\components\common\copy-text\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 复制文本组件, 双击文本或点击按钮均可复制
-->

<template>
    <span @dblclick="handleCopyText">
        {{ showText }}
    </span>
    <el-button v-if="!isPlaceholder" class="copy-text-btn" @click="handleCopyText" type="">
        <el-icon class="copy-text-icon">
            <CopyDocument />
        </el-icon>
    </el-button>
</template>

<script lang="ts" setup>
import { computed } from "vue"
import { CopyDocument } from "@element-plus/icons-vue"

import { copyText } from "@/utils/clipboard"
import { MessageUtil } from "@/utils/message"

defineOptions({ name: "CopyText" })

const {
    text,
    displayText,
    placeholder = "-",
} = defineProps<{
    /** text, 复制到剪贴板的原始文本。 */
    text: string
    /** displayText, 可选的显示文本; 传入时界面显示此值, 复制仍使用 text。 */
    displayText?: string
    /** placeholder, 占位符文本, 默认 "-"; 显示内容等于占位符时隐藏复制按钮。 */
    placeholder?: string
}>()

/** 实际显示的文本。 */
const showText = computed(() => displayText ?? text)

/** 是否为占位符, 占位符时不显示复制按钮。 */
const isPlaceholder = computed(() => showText.value === placeholder)

// 复制文本到剪贴板
const handleCopyText = () => {
    if (isPlaceholder.value) return
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
