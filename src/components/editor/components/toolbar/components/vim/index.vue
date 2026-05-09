<!--
 * FilePath    : blog-client\src\components\editor\components\toolbar\components\vim\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : Vim 工具栏弹层组件
-->

<template>
    <el-popover
        placement="bottom"
        :width="170"
        trigger="click"
        popper-class="popper-class"
        popper-style="background-color: transparent; border: none; box-shadow: none;"
        :show-arrow="false"
        :offset="0"
    >
        <template #reference>
            <j-icon :name="icon" custom-class="iconfont" />
        </template>

        <div class="vim-popover">
            <SwitchGroup :switch-items="switchItems" @update-status="handleSwitchUpdate" />

            <el-button class="vim-settings-btn" type="default" @click.stop="handleOpenSettings">
                <j-icon :name="IconKeys.Setting" custom-class="menu-icon-setting" />
                <span>快捷键映射</span>
            </el-button>
        </div>
    </el-popover>
</template>

<script lang="ts" setup>
import { computed } from "vue"

import { IconKeys } from "@/components/common/icons"
import SwitchGroup, { type SwitchItem } from "@/components/common/switch-group"

defineOptions({ name: "BarVim" })

const { icon, vimMode = false } = defineProps<{
    icon: IconKeys // 工具栏图标
    vimMode?: boolean // 当前 Vim 开关状态
}>()

const emit = defineEmits<{
    (event: "vim-mode-change", enabled: boolean): void
    (event: "vim-settings"): void
}>()

/**
 * switchItems 构建 Vim 开关项, 复用通用 switch-group 组件.
 * @returns Vim 开关项数组.
 */
const switchItems = computed<SwitchItem[]>(() => {
    return [
        {
            name: "vim-mode",
            display: "Vim 模式",
            status: vimMode,
            namePosition: "left",
            label: { active: "开", inactive: "关" },
            minWidth: 160,
        },
    ]
})

/**
 * handleSwitchUpdate 在开关状态变化时将最新启用状态抛给父组件.
 * @param items - switch-group 返回的开关数组.
 * @returns 无返回值.
 */
const handleSwitchUpdate = (items: SwitchItem[]): void => {
    emit("vim-mode-change", Boolean(items[0]?.status))
}

/**
 * handleOpenSettings 打开 Vim 映射设置弹窗.
 * @returns 无返回值.
 */
const handleOpenSettings = (): void => {
    emit("vim-settings")
}
</script>

<style scoped lang="scss">
.vim-popover {
    display: flex;
    flex-direction: column;
    gap: 10px;
    border-radius: 8px;
    padding: 12px;
    background-color: var(--jpz-bg-color-page);

    .vim-settings-btn {
        justify-content: flex-start;
        margin: 0;
        border-radius: 4px;

        .menu-icon-setting {
            width: 14px;
            height: 14px;
            margin-right: 6px;
            fill: currentColor;
        }
    }
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
