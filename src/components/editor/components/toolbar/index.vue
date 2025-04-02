<!--
 * FilePath    : blog-client\src\components\editor\components\toolbar\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 工具栏组件
-->

<template>
    <div ref="toolbarRef" id="toolbar">
        <button v-for="btn in props.toolbarBtns" type="button" :key="btn.name" class="toolbar-btn" @click="emitToolbarBtnClicked(btn.name)">
            <el-popover
                v-if="btn.name === CommandsKey.Emoji"
                placement="bottom"
                width="310"
                trigger="hover"
                popper-class="popper-class"
                popper-style="background-color: transparent; border: none; box-shadow: none;"
                :show-arrow="false"
                :offset="0"
            >
                <template #reference>
                    <j-icon :name="btn.icon" custom-class="iconfont" />
                </template>

                <EmojiPicker :native="true" @select="onSelectEmoji" />
            </el-popover>

            <el-popover
                v-else-if="btn.name === CommandsKey.Table"
                placement="bottom"
                width="260"
                trigger="hover"
                popper-class="popper-class"
                popper-style="background-color: transparent; border: none; box-shadow: none;"
                :show-arrow="false"
                :offset="0"
            >
                <template #reference>
                    <j-icon :name="btn.icon" custom-class="iconfont" />
                </template>

                <div class="table-row-col">
                    <div class="row">
                        <span>行数：</span>
                        <el-input-number v-model="row" :min="1" :max="10000" controls-position="right" @change="handleRowChange" />
                    </div>

                    <div class="col">
                        <span>列数：</span>
                        <el-input-number v-model="col" :min="1" :max="10000" controls-position="right" @change="handleColChange" />
                    </div>
                    <el-button type="primary" @click="handleTableRowCol">插入表格</el-button>
                </div>
            </el-popover>

            <el-tooltip v-else effect="dark" :content="btn.display" :hide-after="0">
                <j-icon :name="btn.icon" custom-class="iconfont" />
            </el-tooltip>
        </button>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, useTemplateRef, watch } from "vue"
import EmojiPicker, { type EmojiExt } from "vue3-emoji-picker"

import { CommandsKey } from "../../command"
import type { TableRowCol, ToolbarProps } from "./types"

defineOptions({ name: "EditorToolbar" })

// 定义 props
const props = defineProps<ToolbarProps>()

// 设置 iconNumberPerLine 默认值为 20
// const iconNumberPerLine = ref<number>(props.iconNumberPerLine || 20);

// 子组件 传参
const emit = defineEmits<{
    (e: "toolbar-btn-clicked", name: CommandsKey): void
    (e: "emoji-picker-selected", emoji: EmojiExt): void
    (e: "table-row-col", tableRowCol: TableRowCol): void
}>()

const toolbarRef = useTemplateRef<HTMLElement | null>("toolbarRef") // 工具栏
const toolbarHeight = ref(0) // 工具栏高度

const emitToolbarBtnClicked = (name: CommandsKey) => {
    // 触发自定义事件 "onToolbarBtnClicked"，将 name 传递给父组件
    emit("toolbar-btn-clicked", name)
}

// 插入表格的行列数
const row = ref(3)
const col = ref(3)

// 表格行列数变化
const handleRowChange = (value: number) => {
    row.value = value
}

// 表格行列数变化
const handleColChange = (value: number) => {
    col.value = value
}

// 插入表格
const handleTableRowCol = () => {
    emit("table-row-col", { row: row.value, col: col.value })
}

// 监听工具栏高度变化
watch(
    toolbarRef,
    () => {
        updateToolbarHeight()
    },
    { deep: true },
)

/**
 * @description: 更新工具栏高度
 */
const updateToolbarHeight = () => {
    if (toolbarRef.value) {
        toolbarHeight.value = toolbarRef.value.clientHeight
        document.documentElement.style.setProperty("--toolbar-height", `${toolbarHeight.value}px`)
    }
}

// const toolbarClass = computed(() => getClassName('toolbar', 'toolbar-fs', false));
// const toolbarBtnClass = computed(() => getClassName('toolbar-btn', 'toolbar-btn-fs', false));

// const setToolbarIconNumberPerLine = () => {
//     // 初始化编辑器宽度和高度
//     if (toolbarRef.value) {
//         toolbarRef.value.style.setProperty('--icon-number-per-line', `${iconNumberPerLine.value}`);
//     }
// }

// emoji 选择
const onSelectEmoji = (emoji: EmojiExt) => {
    emit("emoji-picker-selected", emoji)
    // console.log(emoji)
}

onMounted(async () => {
    // 初始化 CodeMirror
    // setToolbarIconNumberPerLine() // 初始化工具栏每行显示的按钮个数
    updateToolbarHeight() // 初始化工具栏高度
})

defineExpose({
    root: toolbarRef,
})
</script>

<style scoped lang="scss">
#toolbar {
    display: flex;
    flex-wrap: wrap; // 自动换行
    align-items: center;
    // justify-content: left;
    border-bottom: 1px solid var(--jpz-border-color);
    min-height: pc.$editor-toolbar-height;
    margin-top: pc.$editor-toolbar-margin-top;
    margin-bottom: pc.$editor-toolbar-margin-top;
    background-color: var(--jpz-bg-color);

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
}

.table-row-col {
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 8px;
    padding-top: 10px;
    padding-bottom: 10px;
    background-color: var(--jpz-bg-color);

    .row,
    .col {
        display: flex;
        align-items: center;
        margin-bottom: 10px;

        span {
            margin-right: 10px;
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
