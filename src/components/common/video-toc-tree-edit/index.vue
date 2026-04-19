<!--
 * FilePath    : blog-client\src\components\common\video-toc-tree-edit\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 目录树编辑
-->
<template>
    <div class="video-toc-edit-wrapper" :class="{ 'has-data': hasTreeData }">
        <!-- 工具栏：当目录树有数据时展示 -->
        <div v-if="hasTreeData" class="video-toc-toolbar">
            <span class="toolbar-title">视频合集编辑</span>
            <div class="toolbar-actions">
                <el-dropdown @command="handleImportCommand">
                    <el-button size="small" plain>
                        <el-icon><Upload /></el-icon>
                        <span>导入</span>
                        <el-icon class="el-icon--right"><ArrowDown /></el-icon>
                    </el-button>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="file">
                                <el-icon><Upload /></el-icon>从文件导入
                            </el-dropdown-item>
                            <el-dropdown-item command="clipboard">
                                <el-icon><CopyDocument /></el-icon>从剪贴板导入
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
                <el-dropdown @command="handleExportCommand">
                    <el-button size="small" type="success" plain>
                        <el-icon><Download /></el-icon>
                        <span>导出</span>
                        <el-icon class="el-icon--right"><ArrowDown /></el-icon>
                    </el-button>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="file">
                                <el-icon><Download /></el-icon>导出到文件
                            </el-dropdown-item>
                            <el-dropdown-item command="clipboard">
                                <el-icon><CopyDocument /></el-icon>复制到剪贴板
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
            <input ref="fileInputRef" type="file" accept=".json" class="file-input-hidden" @change="handleFileImport" />
        </div>

        <VideoTocTreeBase :tree-list="treeList" :draggable="true" :show-btns="true" :is-edit="true" :is-expand-all="true" @tree-update="handleTreeUpdate" />

        <!-- 剪贴板导入对话框 -->
        <el-dialog v-model="pasteDialogVisible" title="从剪贴板导入" width="560" :close-on-click-modal="false" @opened="pasteInputRef?.focus()">
            <el-input ref="pasteInputRef" v-model="pasteContent" type="textarea" :rows="12" placeholder="请将 JSON 内容粘贴到此处（Ctrl+V）" />
            <template #footer>
                <el-button @click="pasteDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="confirmPasteImport">确认导入</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts" setup>
import { ArrowDown, CopyDocument, Download, Upload } from "@element-plus/icons-vue"
import { computed, ref, useTemplateRef } from "vue"

import { MessageUtil } from "@/utils/message"
import { copyText } from "@/utils/clipboard"

import { type Tree } from "../video-toc-tree-base"
import VideoTocTreeBase from "../video-toc-tree-base/index.vue"

defineOptions({ name: "VideoTocTreeEdit" })

// 定义 props
const {
    treeList = [], // 目录树数据
} = defineProps<{
    treeList?: Tree[]
}>()

// 事件
const emit = defineEmits<{
    (event: "tree-update", val: Tree[], videoFileIdHashList: string[]): void
}>()

const fileInputRef = useTemplateRef<HTMLInputElement>("fileInputRef")
const pasteInputRef = useTemplateRef("pasteInputRef")

// 剪贴板导入对话框状态
const pasteDialogVisible = ref(false)
const pasteContent = ref("")

// 是否有数据
const hasTreeData = computed(() => treeList.length > 0)

// 监听目录树变化
const handleTreeUpdate = (val: Tree[], videoFileIdHashList: string[]) => {
    emit("tree-update", val, videoFileIdHashList)
}

// ---------- 导入/导出逻辑 ----------

/**
 * 补零：将数字格式化为至少两位字符串.
 * @param n 待格式化的数字.
 * @returns 补零后的字符串.
 */
const pad = (n: number) => String(n).padStart(2, "0")

/**
 * 递归校验单个节点是否符合 Tree 结构.
 * 每个节点必须包含 label (string) 和 is_chapter (boolean).
 * @param node 待校验节点.
 * @returns 是否通过校验.
 */
const validateNode = (node: unknown): node is Tree => {
    if (typeof node !== "object" || node === null) return false
    const n = node as Record<string, unknown>

    // 必须字段校验
    if (typeof n.label !== "string" || typeof n.is_chapter !== "boolean") return false

    // 递归校验子节点
    if (n.children !== undefined) {
        if (!Array.isArray(n.children)) return false
        return n.children.every(validateNode)
    }

    return true
}

/**
 * 从目录树中递归提取所有视频节点的 file_id_hash（去重）.
 * @param nodes 目录树节点列表.
 * @returns 去重后的 file_id_hash 数组.
 */
const extractFileIdHashList = (nodes: Tree[]): string[] => {
    const result: string[] = []
    const traverse = (list: Tree[]) => {
        for (const node of list) {
            if (!node.is_chapter && node.file_id_hash) {
                result.push(node.file_id_hash)
            }
            if (node.children?.length) {
                traverse(node.children)
            }
        }
    }
    traverse(nodes)
    return [...new Set(result)]
}

/**
 * 校验导入的 JSON 数据是否符合 Tree[] 结构.
 * @param data 待校验数据.
 * @returns 是否通过校验.
 */
const validateTreeData = (data: unknown): data is Tree[] => {
    if (!Array.isArray(data) || data.length === 0) return false
    return data.every(validateNode)
}

/**
 * 为导入的目录树重新分配 id 与 video_order，确保与当前系统一致.
 * @param nodes 原始树节点列表.
 * @returns 重新编号后的树节点列表.
 */
const reorderTree = (nodes: Tree[]): Tree[] => {
    let orderAll = 1
    let orderVideo = 1

    const reorder = (list: Tree[]): Tree[] => {
        return list.map((node) => {
            const newNode: Tree = { ...node, id: orderAll++ }
            if (!node.is_chapter) {
                newNode.video_order = orderVideo++
            }
            if (node.children?.length) {
                newNode.children = reorder(node.children)
            }
            return newNode
        })
    }

    return reorder(nodes)
}

// 触发文件选择
const triggerImport = () => {
    fileInputRef.value?.click()
}

/**
 * 解析并应用导入数据（文件与剪贴板共用）.
 * @param content JSON 字符串.
 */
const processImportData = (content: string) => {
    try {
        const data: unknown = JSON.parse(content)

        if (!validateTreeData(data)) {
            MessageUtil.error("导入失败：JSON 格式不符合视频合集结构")
            return
        }

        const reorderedData = reorderTree(data)
        const fileIdHashList = extractFileIdHashList(reorderedData)
        emit("tree-update", reorderedData, fileIdHashList)
        MessageUtil.success("视频合集导入成功")
    } catch {
        MessageUtil.error("导入失败：请确保内容为有效的 JSON 格式")
    }
}

/**
 * 从文件导入：读取 JSON 文件 → 解析并应用.
 * @param event 文件选择事件.
 */
const handleFileImport = (event: Event) => {
    const input = event.target as HTMLInputElement
    const file = input.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.addEventListener("load", () => {
        processImportData(reader.result as string)
    })

    reader.readAsText(file)

    // 重置 input 以便再次选择相同文件时仍触发 change 事件
    input.value = ""
}

/**
 * 打开剪贴板导入对话框.
 */
const openPasteDialog = () => {
    pasteContent.value = ""
    pasteDialogVisible.value = true
}

/**
 * 确认粘贴导入：校验并应用用户粘贴的 JSON 内容.
 */
const confirmPasteImport = () => {
    if (!pasteContent.value.trim()) {
        MessageUtil.warning("请先粘贴 JSON 内容")
        return
    }
    processImportData(pasteContent.value)
    pasteDialogVisible.value = false
}

// 导入命令分发
const handleImportCommand = (command: string) => {
    if (command === "file") {
        triggerImport()
    } else if (command === "clipboard") {
        openPasteDialog()
    }
}

/**
 * 将当前目录树序列化为 JSON 并触发浏览器下载.
 */
const exportToFile = () => {
    if (treeList.length === 0) {
        MessageUtil.warning("暂无数据可导出")
        return
    }

    const json = JSON.stringify(treeList, null, 4)
    const blob = new Blob([json], { type: "application/json" })
    const url = URL.createObjectURL(blob)

    const link = document.createElement("a")
    link.href = url

    const now = new Date()
    const timestamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`
    link.download = `video-toc-${timestamp}.json`

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    MessageUtil.success("视频合集导出成功")
}

/**
 * 将当前目录树序列化为 JSON 并复制到剪贴板.
 */
const exportToClipboard = async () => {
    if (treeList.length === 0) {
        MessageUtil.warning("暂无数据可导出")
        return
    }

    try {
        const json = JSON.stringify(treeList, null, 4)
        await copyText(json)
        MessageUtil.success("已复制到剪贴板")
    } catch {
        MessageUtil.error("复制到剪贴板失败")
    }
}

// 导出命令分发
const handleExportCommand = (command: string) => {
    if (command === "file") {
        exportToFile()
    } else if (command === "clipboard") {
        exportToClipboard()
    }
}
</script>

<style lang="scss" scoped>
.video-toc-edit-wrapper {
    width: 100%;

    &.has-data {
        border: 1px solid var(--el-border-color-lighter);
        border-radius: 8px;
        overflow: hidden;
        transition: box-shadow 0.3s ease;

        &:hover {
            box-shadow: 0 2px 12px rgb(0 0 0 / 6%);
        }
    }
}

.video-toc-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 16px;
    background-color: var(--el-fill-color-lighter);
    border-bottom: 1px solid var(--el-border-color-lighter);
}

.toolbar-title {
    font-size: 14px;
    font-weight: 600;
    color: var(--jpz-text-color-primary);
    user-select: none;
}

.toolbar-actions {
    display: flex;
    gap: 8px;
}

.file-input-hidden {
    display: none;
}
</style>
