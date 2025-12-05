<!--
 * FilePath    : blog-client\src\components\editor\components\toolbar\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 工具栏组件
-->

<template>
    <div ref="toolbarRef" id="toolbar">
        <button v-for="btn in toolbarBtns" type="button" :key="btn.name" class="toolbar-btn" @click="emitToolbarBtnClicked(btn.name)">
            <!-- 付费组件 -->
            <BarPay v-if="btn.name === CommandsKey.PayContent" :icon="btn.icon" @pay-select="handlePaySelect" />

            <!-- emoji表情 -->
            <BarEmoji v-else-if="btn.name === CommandsKey.Emoji" :icon="btn.icon" @emoji-picker-selected="handleEmojiPickerSelected" />

            <!-- 表格 -->
            <BarTable v-else-if="btn.name === CommandsKey.Table" :icon="btn.icon" @table-row-col="handleTableRowCol" />

            <!-- 提示 -->
            <BarAlert v-else-if="btn.name === CommandsKey.Alert" :icon="btn.icon" @alert-select="handleAlertSelect" />

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

import type { IconKeys } from "@/components/common/icons"

import { CommandsKey } from "../../command"
import BarAlert, { Alerts } from "./components/alert"
import BarEmoji from "./components/emoji"
import BarPay, { type PayTagItem } from "./components/pay"
import BarTable, { type TableRowCol } from "./components/table"

defineOptions({ name: "EditorToolbar" })

// 定义 props
const { toolbarBtns } = defineProps<{
    toolbarBtns: Array<{ name: CommandsKey; display: string; icon: IconKeys }> // 预览内容
}>()

// 子组件 传参
const emit = defineEmits<{
    (e: "toolbar-btn-clicked", name: CommandsKey): void
    (e: "pay-select", val: PayTagItem): void
    (e: "emoji-picker-selected", emoji: EmojiExt): void
    (e: "table-row-col", tableRowCol: TableRowCol): void
    (e: "alert-select", val: Alerts): void
    (e: "toolbar-height", height: string): void
}>()

const toolbarRef = useTemplateRef<HTMLElement | null>("toolbarRef") // 工具栏
const toolbarHeight = ref(0) // 工具栏高度

const emitToolbarBtnClicked = (name: CommandsKey) => {
    // 触发自定义事件 "onToolbarBtnClicked"，将 name 传递给父组件
    emit("toolbar-btn-clicked", name)
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

// 监听窗口变化
const { stop } = useResizeObserver(toolbarRef, () => {
    updateToolbarHeight()
})

onMounted(() => {
    updateToolbarHeight() // 初始化工具栏高度
})

onUnmounted(() => {
    stop() // 停止监听窗口变化
})
</script>

<style scoped lang="scss">
#toolbar {
    display: flex;
    flex-wrap: wrap; // 自动换行
    align-items: center;
    // justify-content: left;
    // border-bottom: 1px solid var(--jpz-border-color);
    min-height: pc.$editor-toolbar-height;
    margin-top: pc.$editor-toolbar-margin-top;
    margin-bottom: pc.$editor-toolbar-margin-top;
    background-color: var(--jpz-bg-color);
    border-radius: 4px;

    // // 两端对齐
    // justify-content: space-between;

    .toolbar-btn {
        border: none;
        background-color: transparent;
        cursor: pointer;
        outline: none;
        height: pc.$editor-toolbar-height;
        // 通过计算每个按钮的 margin-left 和 margin-right 来实现每行显示的按钮个数
        margin: 0 calc((100% - 24px * var(--icon-number-per-line)) / var(--icon-number-per-line) / 2);
        padding: 0;
    }

    // @include respond-to("pc") {
    // }

    // @include respond-to("pad") {
    // }

    @include respond-to("phone") {
        .toolbar-btn {
            // 通过计算每个按钮的 margin-left 和 margin-right 来实现每行显示的按钮个数
            margin: 0 calc((100% - 20px * var(--icon-number-per-line)) / var(--icon-number-per-line) / 2);
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
</style>
