<!--
 * FilePath    : blog-client\src\components\common\icon-input\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 图标输入
-->

<template>
    <div class="icon-input">
        <el-input class="icon-input-item in" :model-value="modelValue" @update:modelValue="$emit('update:modelValue', $event)" v-bind="$attrs" />
        <el-button class="icon-input-item btn" type="primary" @click="mediaDialogVisible = true">
            <span>选择</span>
        </el-button>
    </div>

    <!-- icon选择弹窗 -->
    <IconSelect v-if="mediaDialogVisible" v-model="mediaDialogVisible" @select-icon-key="selectIconKey" />
</template>

<script lang="ts" setup>
import { ref } from "vue"

import IconSelect from "@/components/common/icon-select"
import { IconKeys } from "@/components/common/icons"

// 定义组件名称
defineOptions({ name: "ImageInput" })

const { modelValue = "" } = defineProps<{
    modelValue: IconKeys | string | undefined | null // 绑定值
}>()

// 定义 emits 事件
const emit = defineEmits(["update:modelValue"])
// const emit = defineEmits<{
//     (event: "update:modelValue", val: IconKeys | string | null | undefined): boolean // 更新绑定值
// }>()

const mediaDialogVisible = ref(false)
const selectIconKey = (iconKey: IconKeys) => {
    // 关闭弹窗
    emit("update:modelValue", iconKey)
    mediaDialogVisible.value = false
}
</script>

<style scoped lang="scss">
.icon-container {
    display: flex;
    flex-direction: column;
    // padding: 10px 0;
    width: 100%;
}

.icon-input {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    // btn 固定宽度
    .btn {
        margin-left: 10px;
        width: 50px;
    }

    // in 使用剩余宽度
    .in {
        flex: 1;
    }
}
</style>
