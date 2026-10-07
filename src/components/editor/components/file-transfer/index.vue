<!--
 * FilePath    : blog-client\src\components\editor\components\file-transfer\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : Markdown 图标与短文字导入导出菜单, 支持编码校验、异步覆盖保护与本地图片内嵌
-->

<template>
    <div class="file-transfer-group" role="group" aria-label="文件导入导出" :aria-busy="busy">
        <input ref="fileInput" class="file-input" type="file" accept=".md,.markdown" tabindex="-1" aria-label="选择 Markdown 文件" @change="handleFileChange" />
        <el-dropdown trigger="click" :disabled="busy" @command="handleCommand">
            <button type="button" class="file-transfer-button" :disabled="busy" aria-label="导入和导出" title="导入和导出" @mousedown.prevent>
                <j-icon :name="IconKeys.ImportExport" custom-class="file-transfer-icon" />
            </button>
            <template #dropdown>
                <el-dropdown-menu class="file-transfer-menu">
                    <el-dropdown-item command="import" :disabled="busy">
                        <j-icon :name="IconKeys.Markdown" custom-class="menu-icon" />
                        导入
                    </el-dropdown-item>
                    <el-dropdown-item command="markdown" :disabled="busy">
                        <j-icon :name="IconKeys.Markdown" custom-class="menu-icon" />
                        导出
                    </el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
    </div>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox } from "element-plus"
import { onBeforeUnmount, ref, useTemplateRef } from "vue"

import { IconKeys } from "@/components/common/icons"

import { getFirstLevelOneMarkdownHeadingText } from "../../utils/markdown"

import { decodeMarkdownFile } from "./read-markdown"

/** 文件工具栏组, 仅在文件完整读取并确认后通知父组件替换正文. */
defineOptions({ name: "EditorFileTransfer" })

/** Markdown 导出基于点击时的正文快照, 不依赖预览节点. */
const props = defineProps<{ markdown: string }>()
/** import 返回读取成功且已确认覆盖的 Markdown 正文. */
const emit = defineEmits<{ import: [markdown: string] }>()

const fileInput = useTemplateRef<HTMLInputElement>("fileInput")
const busy = ref(false)
let disposed = false

/** 组件离开后停止尚未完成的文件操作反馈与下载. */
onBeforeUnmount(() => {
    disposed = true
})

/**
 * handleFileChange 校验后缀及编码并读取文件, 读取或确认期间正文变化时中止覆盖.
 * @param event 隐藏文件选择器的 change 事件.
 * @returns 处理完成的承诺, 错误显示为消息提示.
 */
async function handleFileChange(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement
    const file = input.files?.[0]
    // 清空选择器, 同一文件下次仍能触发 change.
    input.value = ""
    if (!file || busy.value) return
    if (!/\.(md|markdown)$/i.test(file.name)) {
        ElMessage.warning("只能导入 .md 或 .markdown 文件")
        return
    }

    busy.value = true
    // 在读取前记录正文, 避免慢文件读取期间的输入被后续导入覆盖.
    const original = props.markdown
    try {
        const buffer = await file.arrayBuffer()
        if (disposed) return
        let markdown: string
        try {
            markdown = decodeMarkdownFile(buffer)
        } catch {
            ElMessage.error("文件编码无效，请使用 UTF-8 或带 BOM 的 UTF-16 文件，当前内容未修改")
            return
        }
        if (props.markdown !== original) {
            ElMessage.warning("当前内容已发生变化，请重新导入")
            return
        }
        if (original.length > 0) {
            try {
                await ElMessageBox.confirm("导入将替换当前编辑内容，是否继续？建议先导出备份。", "导入 Markdown", {
                    confirmButtonText: "替换内容",
                    cancelButtonText: "取消",
                    type: "warning",
                })
            } catch {
                return
            }
        }
        if (disposed) return
        if (props.markdown !== original) {
            ElMessage.warning("当前内容已发生变化，请重新导入")
            return
        }
        emit("import", markdown)
        ElMessage.success("Markdown 文件已导入")
    } catch {
        if (!disposed) ElMessage.error("文件读取失败，当前内容未修改")
    } finally {
        busy.value = false
    }
}

/**
 * handleCommand 执行 Markdown 导入或内嵌图片的单文件导出.
 * @param command 菜单选择的导入或 Markdown 导出命令.
 * @returns 操作完成的承诺, 导出异常显示为消息提示.
 */
async function handleCommand(command: string): Promise<void> {
    if (busy.value) return
    if (command === "import") {
        fileInput.value?.click()
        return
    }
    if (command !== "markdown") return

    busy.value = true
    const markdown = props.markdown
    try {
        // 仅实际导出时加载图片内嵌逻辑, 不增加编辑器首屏负担.
        const { buildMarkdownExport, downloadExport } = await import("../../export")
        const title = getFirstLevelOneMarkdownHeadingText(markdown) || "文档"
        if (disposed) return
        const result = await buildMarkdownExport(markdown, title)
        if (disposed) return
        downloadExport(result.blob, result.filename)
    } catch (error) {
        if (!disposed) ElMessage.error(error instanceof Error ? error.message : "导出失败，请重试")
    } finally {
        busy.value = false
    }
}
</script>

<style scoped lang="scss">
.file-transfer-group {
    display: inline-flex;
    align-items: center;
    gap: 2px;
    flex-shrink: 0;
}

.file-input {
    display: none;
}

.file-transfer-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: pc.$editor-toolbar-height;
    padding: 0 3px;
    border: none;
    border-radius: 6px;
    background: transparent;
    color: var(--jpz-text-color-primary);
    font: inherit;
    font-size: 13px;
    white-space: nowrap;
    cursor: pointer;

    &:hover,
    &:focus-visible {
        background: var(--jpz-bg-color-page);
    }

    &:focus-visible {
        outline: 2px solid var(--el-color-primary);
        outline-offset: -2px;
    }

    &:disabled {
        cursor: wait;
        opacity: 0.65;
    }
}

:deep(.file-transfer-icon) {
    width: 28px;
    height: 28px;
    font-size: 20px;
    fill: var(--jpz-text-color-primary);
}

.file-transfer-menu {
    // 为 Markdown 图标和两个字预留空间, 保持菜单紧凑且不换行.
    width: 88px;
    max-width: calc(100vw - 24px);
}

:deep(.menu-icon) {
    margin-right: 8px;
    font-size: 18px;
    fill: currentColor;
    flex-shrink: 0;
}
</style>
