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
        <p v-if="!isEditing" @dblclick="startEdit" class="text-display">
            {{ text }}
        </p>

        <!-- 双击后显示输入框 -->
        <el-input v-else v-model="textAc" class="text-edit" @blur="finishEdit" @keyup.enter="finishEdit" @keyup.esc="cancelEdit" autofocus />
    </div>
</template>

<script setup lang="ts">
import { nextTick, ref } from "vue"
defineOptions({ name: "EditableText" })

const { text = "", isEdit = true } = defineProps<{
    text?: string
    isEdit?: boolean // 是否可编辑，默认可编辑
}>()

// 事件
const emit = defineEmits<{
    (event: "finishEdit", val: string): void
}>()

const isEditing = ref(false)
const textAc = ref(text)

// 开始编辑
const startEdit = async () => {
    if (!isEdit) return
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
    width: 100%;
}

.text-display {
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    // transition: background-color 0.3s;
    // max-width: 400px;
    // white-space: nowrap;
    // overflow: auto;
    // text-overflow: ellipsis;
    // 文字居左对齐
    // text-align: left;
    //自动换行
    // white-space: pre-wrap; // 保留空白符序列,但允许换行
    // word-wrap: break-word; // 长单词或 URL 地址换行到下一行
    // word-break: break-word;

    // 允许换行
    white-space: normal;
    word-wrap: break-word;
    overflow-wrap: break-word;
}

.text-edit {
    width: 100%;
}
</style>
