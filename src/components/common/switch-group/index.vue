<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-01-18 16:36:18
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-16 18:31:36
 * @FilePath     : \blog-client\src\components\common\switch-group\index.vue
 * @Description  : 开关组件 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->
<template>
    <ul class="switch-group">
        <li
            v-for="item in switchItems"
            :key="item.name"
            class="switch-item"
            :style="getLiStyle(item)"
        >
            <span v-if="item.namePosition === 'left'" class="display span-left"
                >{{ item.display }}
            </span>
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
                    <Icon :name="item.icon?.active" :custom-class="item.icon.activeClassName" />
                </template>
                <template #inactive-action v-if="item.icon?.inactive">
                    <Icon :name="item.icon?.inactive" :custom-class="item.icon.inactiveClassName" />
                </template>
            </el-switch>
            <span v-if="item.namePosition === 'right'" class="display span-right">{{
                item.display
            }}</span>
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
    const minWidth =
        typeof item.minWidth === "number" ? `${item.minWidth}px` : item.minWidth || "auto"
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
    // justify-content: center;
}

.my-el-switch {
    margin: 0 10px;
}

.display {
    color: var(--jpz-text-color-regular);
}

// .span-left,
// .span-right {
//     display: inline-block;
//     text-align: left;
//     width: 100px;
//     padding: 0 4px;
// }
</style>
