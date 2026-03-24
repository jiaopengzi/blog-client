<!--
 * FilePath    : blog-client-dev\src\components\editor\components\toolbar\components\heading\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 标题
-->

<template>
    <el-popover
        placement="bottom"
        width="128"
        trigger="hover"
        popper-class="popper-class"
        popper-style="background-color: transparent; border: none; box-shadow: none;"
        :show-arrow="false"
        :offset="0"
    >
        <template #reference>
            <j-icon :name="icon" custom-class="iconfont" />
        </template>

        <div class="heading-menu">
            <el-button v-for="item in headingMenuItems" :key="item.command" class="heading-item" type="default" @click="handleHeadingSelect(item.command)">
                <j-icon :name="item.icon" custom-class="menu-icon" />
                <span>{{ item.label }}</span>
            </el-button>
        </div>
    </el-popover>
</template>

<script lang="ts" setup>
import type { IconKeys } from "@/components/common/icons"
import { CommandsKey } from "@/components/editor/command"

import { headingMenuItems } from "./types"

defineOptions({ name: "BarHeading" })

const { icon } = defineProps<{
    icon: IconKeys
}>()

const emit = defineEmits<{
    (e: "heading-select", name: CommandsKey): void
}>()

const handleHeadingSelect = (name: CommandsKey) => {
    emit("heading-select", name)
}
</script>

<style scoped lang="scss">
.heading-menu {
    display: flex;
    flex-direction: column;
    gap: 6px;
    border-radius: 8px;
    padding: 10px;
    background-color: var(--jpz-bg-color-page);

    .heading-item {
        justify-content: flex-start;
        margin: 0;
        width: 100%;
        border-radius: 4px;
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
