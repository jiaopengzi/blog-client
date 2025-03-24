<!--
 * @FilePath     : \blog-client\src\components\common\icons\index.vue
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
 * @Description  : 图标组件
-->

<template>
    <el-dialog v-model="isVisible" @close="handleClose">
        <template #header>
            <h4 class="header-text">选择内置图标</h4>
        </template>
        <div class="container-icon">
            <div v-for="iconKey in IconKeys" :key="iconKey">
                <el-tooltip :content="iconKey" placement="top" :show-after="300">
                    <j-icon :name="iconKey" custom-class="icon-select" @click="handleClick(iconKey as IconKeys)" />
                </el-tooltip>
            </div>
        </div>
    </el-dialog>
</template>

<script lang="ts" setup>
import { computed } from "vue"

import { IconKeys } from "@/components/common/icons"

defineOptions({ name: "IconSelect" })

// 定义 props, 默认值为不显示 false
const { isShow = false } = defineProps<{
    isShow?: boolean // 是否显示
}>()

const emit = defineEmits<{
    (event: "update:isShow", val: boolean): void
    (event: "select-icon-key", value: IconKeys): void // 选择图标
}>()

// v-model 绑定
const isVisible = computed<boolean>({
    get: () => isShow === true,
    set: (val: boolean) => emit("update:isShow", val),
})

// 关闭对话框
const handleClose = () => {
    emit("update:isShow", false)
}

// 点击图标
const handleClick = (iconKey: IconKeys) => {
    emit("select-icon-key", iconKey)
}
</script>

<style scoped lang="scss">
.container-icon {
    // 使用网格布局，每行显示 10 个图标
    display: grid;
    grid-template-columns: repeat(10, 1fr);
    gap: 10px;
    // 设置滚动条
    padding: 6px;
}

.icon-select {
    border: none;
    width: 24px;
    height: 24px;
    fill: var(--jpz-text-color-regular);
    font-size: 20px;

    &:hover {
        fill: var(--jpz-text-color-primary);
        font-size: 24px;
        cursor: pointer;
    }
}
</style>
