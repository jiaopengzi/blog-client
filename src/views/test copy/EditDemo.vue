<template>
    <div class="editable-text">
        <!-- 默认显示文本 -->
        <span v-if="!isEditing" @dblclick="startEdit" class="text-display">
            {{ modelValue }}
        </span>

        <!-- 双击后显示输入框 -->
        <el-input v-else ref="inputRef" v-model="localValue" @blur="finishEdit" @keyup.enter="finishEdit" @keyup.esc="cancelEdit" size="small" autofocus />
    </div>
</template>

<script setup lang="ts">
import { nextTick, ref } from "vue"

// 定义 props
const props = defineProps({
    modelValue: {
        type: String,
        default: "",
    },
})

// 定义 emits
const emit = defineEmits(["update:modelValue"])

// 响应式数据
const isEditing = ref(false)
const localValue = ref(props.modelValue)
const inputRef = ref(null)

// 开始编辑
const startEdit = async () => {
    isEditing.value = true
    localValue.value = props.modelValue // 确保编辑时是最新值
    await nextTick() // 等待 DOM 更新
}

// 完成编辑（失焦或按回车）
const finishEdit = () => {
    isEditing.value = false
    emit("update:modelValue", localValue.value)
}

// 取消编辑（按 ESC）
const cancelEdit = () => {
    isEditing.value = false
    localValue.value = props.modelValue // 恢复原值
}
</script>

<style scoped>
.editable-text {
    display: inline-block;
}

.text-display {
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    transition: background-color 0.2s;
}

.text-display:hover {
    background-color: #f5f7fa;
}
</style>
