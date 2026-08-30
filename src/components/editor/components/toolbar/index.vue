<!--
 * FilePath    : blog-client-nuxt\src\components\editor\components\toolbar\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 工具栏组件
-->

<template>
    <div ref="toolbarRef" id="toolbar">
        <button v-for="btn in toolbarBtns" type="button" :key="btn.name" class="toolbar-btn" @mousedown.prevent @click="emitToolbarBtnClicked(btn)">
            <!-- 付费 -->
            <BarPay v-if="btn.name === CommandsKey.PayContent" :icon="btn.icon" @pay-select="handlePaySelect" />

            <!-- 标题 -->
            <BarHeading v-else-if="btn.name === CommandsKey.Heading" :icon="btn.icon" @heading-select="handleHeadingSelect" />

            <!-- emoji表情 -->
            <BarEmoji v-else-if="btn.name === CommandsKey.Emoji" :icon="btn.icon" @emoji-picker-selected="handleEmojiPickerSelected" />

            <!-- 表格 -->
            <BarTable v-else-if="btn.name === CommandsKey.Table" :icon="btn.icon" @table-row-col="handleTableRowCol" />

            <!-- 提示 -->
            <BarAlert v-else-if="btn.name === CommandsKey.Alert" :icon="btn.icon" @alert-select="handleAlertSelect" />

            <!-- vim -->
            <BarVim
                v-else-if="btn.name === CommandsKey.Vim"
                :icon="btn.icon"
                :vim-mode="vimMode"
                @vim-mode-change="handleVimModeChange"
                @vim-settings="handleVimSettings"
            />

            <!-- 工具 -->
            <BarTool v-else-if="btn.name === CommandsKey.Tool" :icon="btn.icon" @tool-select="handleToolSelect" @tool-settings="handleToolSettings" />

            <!-- 其他 bar -->
            <el-tooltip v-else effect="dark" :content="btn.display" :hide-after="0" :show-after="300">
                <j-icon :name="btn.icon" custom-class="iconfont" />
            </el-tooltip>
        </button>
    </div>
</template>

<script lang="ts" setup>
import { useResizeObserver } from "@vueuse/core"
import { onMounted, onUnmounted, ref, useTemplateRef } from "vue"
import { type EmojiExt } from "vue3-emoji-picker"

import { CommandsKey } from "../../command"
import BarAlert, { Alerts } from "./components/alert"
import BarEmoji from "./components/emoji"
import BarHeading from "./components/heading"
import BarPay, { type PayTagItem } from "./components/pay"
import BarTable, { type TableRowCol } from "./components/table"
import BarTool from "./components/tool"
import type { EditorToolbarButton } from "./types"
import BarVim from "./components/vim"

defineOptions({ name: "EditorToolbar" })

const { toolbarBtns } = defineProps<{
    toolbarBtns: EditorToolbarButton[] // 工具栏按钮列表
    vimMode?: boolean // Vim 当前启用状态
}>()

// 子组件传参
const emit = defineEmits<{
    (e: "toolbar-btn-clicked", name: CommandsKey): void
    (e: "heading-select", name: CommandsKey): void
    (e: "pay-select", val: PayTagItem): void
    (e: "emoji-picker-selected", emoji: EmojiExt): void
    (e: "table-row-col", tableRowCol: TableRowCol): void
    (e: "alert-select", val: Alerts): void
    (e: "tool-select", name: CommandsKey): void
    (e: "tool-settings", name: CommandsKey): void
    (e: "vim-mode-change", enabled: boolean): void
    (e: "vim-settings", name: CommandsKey): void
    (e: "external-toolbar-btn-clicked", name: string): void
    (e: "toolbar-height", height: string): void
}>()

const toolbarRef = useTemplateRef<HTMLElement | null>("toolbarRef")
const toolbarHeight = ref(0)

const toolbarMenuCommands = new Set<CommandsKey>([
    CommandsKey.PayContent,
    CommandsKey.Heading,
    CommandsKey.Emoji,
    CommandsKey.Table,
    CommandsKey.Alert,
    CommandsKey.Tool,
])

/**
 * emitToolbarBtnClicked 将非菜单型按钮点击事件继续抛给父组件
 * Vim 按钮需要同时支持悬浮弹出菜单和点击切换, 因此不能再被菜单集合拦截
 * @param name - 当前点击的工具栏命令
 * @returns 无返回值
 */
const emitToolbarBtnClicked = (button: EditorToolbarButton) => {
    if (button.isExternal) {
        emit("external-toolbar-btn-clicked", button.name)
        return
    }

    const name = button.name as CommandsKey
    if (toolbarMenuCommands.has(name)) {
        return
    }

    // 触发自定义事件 "toolbar-btn-clicked", 将 name 传递给父组件
    emit("toolbar-btn-clicked", name)
}

const handleHeadingSelect = (name: CommandsKey) => {
    emit("heading-select", name)
}

// 插入付费组件
const handlePaySelect = (val: PayTagItem) => {
    emit("pay-select", val)
}

// emoji 选择
const handleEmojiPickerSelected = (emoji: EmojiExt) => {
    emit("emoji-picker-selected", emoji)
}

// 插入表格
const handleTableRowCol = (rc: TableRowCol) => {
    emit("table-row-col", { row: rc.row, col: rc.col })
}

// 插入提示
const handleAlertSelect = (val: Alerts) => {
    emit("alert-select", val)
}

const handleToolSelect = (name: CommandsKey) => {
    emit("tool-select", name)
}

const handleToolSettings = (name: CommandsKey) => {
    emit("tool-settings", name)
}

const handleVimModeChange = (enabled: boolean) => {
    emit("vim-mode-change", enabled)
}

const handleVimSettings = () => {
    emit("vim-settings", CommandsKey.Vim)
}

/**
 * @description: 更新工具栏高度
 */
const updateToolbarHeight = () => {
    if (toolbarRef.value) {
        // 获取包含 margin 和 border 的高度
        const style = getComputedStyle(toolbarRef.value)
        const marginTop = parseFloat(style.marginTop) || 0
        const marginBottom = parseFloat(style.marginBottom) || 0
        const totalHeight = toolbarRef.value.offsetHeight + marginTop + marginBottom
        toolbarHeight.value = totalHeight
        document.documentElement.style.setProperty("--toolbar-height", `${toolbarHeight.value}px`)
        emit("toolbar-height", `${toolbarHeight.value}px`)
    }
}

// 监听工具栏尺寸变化
const { stop } = useResizeObserver(toolbarRef, () => {
    updateToolbarHeight()
})

onMounted(() => {
    updateToolbarHeight() // 初始化工具栏高度
})

onUnmounted(() => {
    stop() // 停止尺寸监听
})
</script>

<style scoped lang="scss">
// A5(工具栏分组): 放弃"每行铺满均分"的 margin 计算, 改为固定小间距从左依次排列,
// 相近功能的按钮自然聚拢成组, 符合通用编辑器工具栏惯例 (--icon-number-per-line 不再被样式消费)
#toolbar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 2px;
    padding: 0 8px;
    min-height: pc.$editor-toolbar-height;
    margin-top: pc.$editor-toolbar-margin-top;
    margin-bottom: pc.$editor-toolbar-margin-top;
    background-color: var(--jpz-bg-color);
    border-radius: 4px;

    .toolbar-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: none;
        background-color: transparent;
        cursor: pointer;
        outline: none;
        height: pc.$editor-toolbar-height;
        margin: 0;
        padding: 0 3px;
        border-radius: 6px;
        transition: background-color 0.2s ease;

        &:hover {
            background-color: var(--jpz-bg-color-page);
        }
    }

    .iconfont {
        fill: var(--jpz-text-color-primary);
    }
}

.iconfont {
    width: 28px;
    height: 28px;
    font-size: 20px;
    transition: fill 0.3s ease;
    border-radius: 4px;
}
</style>
