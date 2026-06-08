<!--
 * FilePath    : blog-client\src\components\common\copy-text\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 复制文本组件, 双击文本或点击按钮均可复制
-->

<template>
    <span @dblclick="handleCopyText">
        {{ showText }}
    </span>
    <CopyButton v-if="!isPlaceholder" class="copy-text-btn" :text="text" />
</template>

<script lang="ts" setup>
import { computed } from "vue"

import CopyButton from "@/components/common/copy-button"
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
// 仅保留与文本的间距, 按钮外观由 CopyButton 组件统一提供
.copy-text-btn {
    margin-left: 8px;
}
</style>
