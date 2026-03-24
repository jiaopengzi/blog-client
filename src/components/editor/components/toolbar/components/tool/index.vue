<!--
 * FilePath    : blog-client-dev\src\components\editor\components\toolbar\components\tool\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 工具组件
-->

<template>
    <el-popover
        placement="bottom"
        :width="popoverWidth"
        trigger="hover"
        popper-class="popper-class"
        popper-style="background-color: transparent; border: none; box-shadow: none;"
        :show-arrow="false"
        :offset="0"
    >
        <template #reference>
            <j-icon :name="icon" custom-class="iconfont" />
        </template>

        <div class="tool-menu-grid" :style="gridStyle">
            <div v-for="item in toolMenuItems" :key="item.command" class="tool-item-wrapper">
                <el-button class="tool-item" type="default" @click="handleToolSelect(item.command)">
                    <j-icon :name="item.icon" custom-class="menu-icon" />
                    <span>{{ item.label }}</span>
                </el-button>
                <el-button class="tool-settings-btn" type="default" @click.stop="handleToolSettings(item.command)" title="设置">
                    <j-icon :name="IconKeys.Setting" custom-class="menu-icon-setting" />
                </el-button>
            </div>
        </div>
    </el-popover>
</template>

<script lang="ts" setup>
import { computed } from "vue"

import { IconKeys } from "@/components/common/icons"
import { CommandsKey } from "@/components/editor/command"

import { toolMenuItems } from "./types"

defineOptions({ name: "BarTool" })

const { icon } = defineProps<{
    icon: IconKeys
}>()

const emit = defineEmits<{
    (e: "tool-select", name: CommandsKey): void
    (e: "tool-settings", name: CommandsKey): void
}>()

const maxRowsPerColumn = 8
const columnWidth = 150

const columnCount = computed(() => {
    return Math.max(1, Math.ceil(toolMenuItems.length / maxRowsPerColumn))
})

const popoverWidth = computed(() => {
    return columnCount.value === 1 ? 170 : columnCount.value * columnWidth + 20
})

const gridStyle = computed(() => {
    return {
        gridTemplateColumns: `repeat(${columnCount.value}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${Math.min(toolMenuItems.length, maxRowsPerColumn)}, auto)`,
        gridAutoFlow: "column",
    }
})

const handleToolSelect = (name: CommandsKey) => {
    emit("tool-select", name)
}

const handleToolSettings = (name: CommandsKey) => {
    emit("tool-settings", name)
}
</script>

<style scoped lang="scss">
.tool-menu-grid {
    display: grid;
    gap: 8px;
    border-radius: 8px;
    padding: 10px;
    background-color: var(--jpz-bg-color-page);

    .tool-item-wrapper {
        display: flex;
        align-items: center;
        gap: 4px;
        min-width: 0;

        .tool-item {
            flex: 1;
            justify-content: flex-start;
            margin: 0;
            min-width: 0;
            border-radius: 4px;
        }

        .tool-settings-btn {
            margin: 0;
            padding: 8px;
            border-radius: 4px;

            .menu-icon-setting {
                width: 14px;
                height: 14px;
                fill: currentColor;
            }
        }
    }
}

.menu-icon {
    margin-right: 6px;
    width: 18px;
    height: 18px;
    font-size: 16px;
    fill: currentColor;
}

.iconfont {
    width: 28px;
    height: 28px;
    font-size: 20px;
    fill: var(--jpz-text-color-primary);
    transition: fill 0.3s ease;
    border-radius: 4px;
}

.iconfont:hover {
    background-color: var(--jpz-text-color-secondary);
}

.popper-class {
    background: transparent;
    border: none;
    box-shadow: none;
}
</style>
