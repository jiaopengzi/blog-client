<!--
 * FilePath    : blog-client\src\components\common\editable-text\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 可编辑文本
-->
<template>
    <div class="editable-text">
        <!-- 默认显示文本 -->
        <span v-if="!isEditing" @dblclick="startEdit" class="text-display">
            {{ text }}
        </span>

        <!-- 双击后显示输入框 -->
        <el-input v-else v-model="textAc" @blur="finishEdit" @keyup.enter="finishEdit" @keyup.esc="cancelEdit" autofocus />
    </div>
</template>

<script setup lang="ts">
import { nextTick, ref } from "vue"
defineOptions({ name: "EditableText" })

const { text = "" } = defineProps<{
    text?: string
}>()

// 事件
const emit = defineEmits<{
    (event: "finishEdit", val: string): void
}>()

const isEditing = ref(false)
const textAc = ref(text)

// 开始编辑
const startEdit = async () => {
    if (isEditing.value) return
    isEditing.value = true
    textAc.value = text // 确保编辑时是最新值
    await nextTick() // 等待 DOM 更新
}

// 完成编辑(失焦或按回车)
const finishEdit = () => {
    isEditing.value = false
    emit("finishEdit", textAc.value)
}

// 取消编辑(按 ESC)
const cancelEdit = () => {
    isEditing.value = false
    textAc.value = text // 恢复原值
}
</script>
<style lang="scss" scoped>
.editable-text {
    display: inline-block;
}
.text-display {
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    transition: background-color 0.3s;
}
.text-display:hover {
    background-color: #f0f0f0;
}
</style>
