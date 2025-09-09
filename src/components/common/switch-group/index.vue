<!--
 * @FilePath     : \blog-client\src\components\common\switch-group\index.vue
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
 * @Description  : 开关组件 
-->

<template>
    <ul class="switch-group">
        <li v-for="item in switchItems" :key="item.name" class="switch-item" :style="getLiStyle(item)">
            <span v-if="item.namePosition === 'left'" class="display">{{ item.display }} </span>
            <el-switch
                v-model="item.status"
                :style="getSwitchStyle(item)"
                class="my-el-switch"
                inline-prompt
                :active-text="item.label?.active"
                :inactive-text="item.label?.inactive"
                @change="updateStatus"
            >
                <template #active-action v-if="item.icon?.active">
                    <j-icon :name="item.icon?.active" :custom-class="item.icon.activeClassName" />
                </template>
                <template #inactive-action v-if="item.icon?.inactive">
                    <j-icon :name="item.icon?.inactive" :custom-class="item.icon.inactiveClassName" />
                </template>
            </el-switch>
            <span v-if="item.namePosition === 'right'" class="display">{{ item.display }}</span>
        </li>
    </ul>
</template>

<script lang="ts" setup>
import type { SwitchItem } from "./types"

defineOptions({ name: "SwitchGroup" })

const { switchItems } = defineProps<{
    switchItems: SwitchItem[] // 开关项
}>()

const emit = defineEmits<{
    (event: "update-status", value: SwitchItem[]): void
}>()

const updateStatus = () => {
    emit("update-status", switchItems)
}

const getSwitchStyle = (item: SwitchItem) => {
    const colorOn = item.color?.active || "#13ce66"
    const colorOff = item.color?.inactive || "#ff4949"

    return `
    --el-switch-on-color: ${colorOn}; 
    --el-switch-off-color: ${colorOff}; 
    `
}

const getLiStyle = (item: SwitchItem) => {
    const minWidth = typeof item.minWidth === "number" ? `${item.minWidth}px` : item.minWidth || "auto"
    return `min-width: ${minWidth};`
}
</script>

<style lang="scss" scoped>
.switch-group {
    display: flex;
    align-items: center;
    flex-wrap: wrap; // 自动换行
}

.switch-item {
    display: flex;
    align-items: center;
}

.display {
    margin-right: 4px;
    color: var(--jpz-text-color-regular);
}
</style>
