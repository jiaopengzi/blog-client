<!--
 * FilePath    : blog-client\src\components\common\copy-button\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 通用复制按钮组件, 点击将传入文本写入剪贴板并提示结果
-->

<template>
    <el-button class="copy-button" type="" @click="handleCopy">
        <el-icon class="copy-button-icon">
            <CopyDocument />
        </el-icon>
    </el-button>
</template>

<script lang="ts" setup>
import { CopyDocument } from "@element-plus/icons-vue"

import { copyText } from "@/utils/clipboard"
import { MessageUtil } from "@/utils/message"

defineOptions({ name: "CopyButton" })

const {
    text,
    successMsg = "复制成功",
    errorMsg = "复制失败",
} = defineProps<{
    /** text, 复制到剪贴板的文本。 */
    text: string
    /** successMsg, 复制成功提示文案, 默认 "复制成功"。 */
    successMsg?: string
    /** errorMsg, 复制失败提示文案, 默认 "复制失败"。 */
    errorMsg?: string
}>()

const emit = defineEmits<{
    /** 复制成功事件。 */
    (event: "copied"): void
}>()

/**
 * 处理复制点击, 将文本写入剪贴板并提示结果。
 * @return void。
 */
const handleCopy = () => {
    if (!text) {
        return
    }

    copyText(text)
        .then(() => {
            MessageUtil.success(successMsg)
            emit("copied")
        })
        .catch(() => {
            MessageUtil.error(errorMsg)
        })
}
</script>

<style scoped lang="scss">
.copy-button {
    margin: 0;
    padding: 0;
    border: none;
    background: transparent;
    color: var(--el-text-color-secondary);

    &:hover {
        background: transparent;
        color: var(--el-text-color-primary);
    }

    .copy-button-icon {
        margin: 0;
        padding: 0;
    }
}
</style>
