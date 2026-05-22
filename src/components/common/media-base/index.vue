<!--
 * @FilePath     : \blog-client\src\components\common\media-base\index.vue
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
 * @Description  : 媒体文件基础展示组件
-->

<template>
    <section>
        <BaseTable :pagination="pagination" :tableColumn="tableColumn" v-bind="$attrs" @update-visible-rows="updateVisibleRows">
            <template #btns>
                <el-button type="primary" @click="toggleAddDialog"> 新增 </el-button>
            </template>
            <template #category>
                <!-- v-for 循环 fileCountGroupByFileType 按钮 -->
                <div class="category-group">
                    <el-button
                        v-for="item in fileCountGroupByFileType"
                        :key="item.file_type"
                        :class="{ active: item.file_type === activeFileType }"
                        @click="handleFileCountByFileType(item.file_type)"
                    >
                        {{ item.file_extension }} ({{ item.file_count }})
                    </el-button>
                </div>
            </template>

            <!-- 新增弹窗 -->
            <template #add-item-title>
                <span class="dialog-title">新增媒体文件</span>
            </template>

            <template #add-item>
                <div class="dialog-add">
                    <AddMedia @has-upload="handleHasUpload" />
                </div>
            </template>

            <!-- 编辑弹窗  -->
            <template #edit-item-title>
                <span class="dialog-title">编辑媒体文件</span>
            </template>

            <template #edit-item>
                <div class="edit-media-panel">
                    <div v-if="mediaSwitchTip" class="media-switch-tip">
                        {{ mediaSwitchTip }}
                    </div>

                    <div class="edit-media-container">
                        <el-button class="switch-media-btn left-btn" :disabled="!canSwitchPrevMedia" @click="handlePrevMedia">
                            <el-icon class="switch-media-btn__icon" :size="18"><ArrowLeft /></el-icon>
                        </el-button>

                        <div class="edit-media-content">
                            <EditMedia
                                :edit-media-data="editMediaData"
                                @edit-media-status="editStatus"
                                @update-subtitles="updateSubtitles"
                                @delete-subtitles="deleteSubtitles"
                            />
                        </div>

                        <el-button class="switch-media-btn right-btn" :disabled="!canSwitchNextMedia" @click="handleNextMedia">
                            <el-icon class="switch-media-btn__icon" :size="18"><ArrowRight /></el-icon>
                        </el-button>
                    </div>
                </div>
            </template>
        </BaseTable>
    </section>
</template>

<script lang="ts" setup>
import { ArrowLeft, ArrowRight } from "@element-plus/icons-vue"

import { type Pagination } from "@/api/response"
import { type FileCountGroupByFileType } from "@/api/upload/getFileCountGroupByFileType"
import { type TableColumn, type TableData } from "@/components/common/base-table"
import BaseTable from "@/components/common/base-table/index.vue"
import AddMedia from "@/components/common/media-add"
import EditMedia, { type EditMediaProps } from "@/components/common/media-edit"

// 定义组件名称
defineOptions({ name: "MediaBase" })

// 数据
const {
    tableColumn,
    pagination,
    editMediaData,
    fileCountGroupByFileType,
    activeFileType,
    handleFileCountByFileType,
    mediaSwitchTip = "",
    canSwitchPrevMedia = false,
    canSwitchNextMedia = false,
    handlePrevMedia = () => {},
    handleNextMedia = () => {},
} = defineProps<{
    tableColumn: TableColumn[] // 表格列配置
    pagination: Pagination<TableData> // 分页数据
    editMediaData: EditMediaProps // 编辑媒体数据
    fileCountGroupByFileType: FileCountGroupByFileType[]
    activeFileType: string // 当前选中的文件类型
    handleFileCountByFileType: (fileType: string) => void // 根据文件类型获取文件数量
    mediaSwitchTip?: string // 媒体切换提示
    canSwitchPrevMedia?: boolean // 是否可切换到上一条媒体
    canSwitchNextMedia?: boolean // 是否可切换到下一条媒体
    handlePrevMedia?: () => void // 切换到上一条媒体
    handleNextMedia?: () => void // 切换到下一条媒体
}>()

// 事件
const emit = defineEmits<{
    (event: "toggle-add-dialog"): void // 编辑Media状态
    (event: "edit-media-status", value: boolean): void // 编辑Media状态
    (event: "has-upload", value: boolean): void // 是否有上传
    (event: "update-subtitles", language: string): void // 更新字幕
    (event: "delete-subtitles", language: string): void // 删除字幕
    (event: "update-visible-rows", rows: TableData[]): void // 更新当前可见顺序
}>()

/**
 * @description: 切换新增弹窗显示状态.
 * @return void.
 */
const toggleAddDialog = () => {
    emit("toggle-add-dialog")
}

/**
 * @description: 同步编辑媒体状态到父组件.
 * @param value 编辑状态.
 * @return void.
 */
const editStatus = (value: boolean) => {
    emit("edit-media-status", value)
}

/**
 * @description: 同步上传完成状态到父组件.
 * @param value 是否已有上传.
 * @return void.
 */
const handleHasUpload = (value: boolean) => {
    emit("has-upload", value)
}

/**
 * @description: 通知父组件刷新指定语言字幕.
 * @param language 字幕语言.
 * @return void.
 */
const updateSubtitles = (language: string) => {
    emit("update-subtitles", language)
}

/**
 * @description: 通知父组件删除指定语言字幕.
 * @param language 字幕语言.
 * @return void.
 */
const deleteSubtitles = (language: string) => {
    emit("delete-subtitles", language)
}

/**
 * @description: 将当前列表可见顺序同步到父组件.
 * @param rows 当前列表展示顺序.
 * @return void.
 */
const updateVisibleRows = (rows: TableData[]) => {
    emit("update-visible-rows", rows)
}
</script>

<style scoped lang="scss">
.edit-media-panel {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.edit-media-container {
    display: flex;
    align-items: stretch;
    gap: 16px;
    min-height: 100%;
}

.media-switch-tip {
    padding: 10px 12px;
    border: 1px solid var(--el-border-color-lighter);
    border-radius: var(--el-border-radius-base);
    background: var(--el-fill-color-light);
    color: var(--el-text-color-secondary);
    font-size: 13px;
    line-height: 1.5;
}

.edit-media-content {
    flex: 1;
    min-width: 0;
}

.switch-media-btn {
    display: inline-flex;
    align-self: center;
    align-items: center;
    justify-content: center;
    width: 36px;
    min-width: 36px;
    height: 36px;
    padding: 0;
    border: 1px solid var(--el-border-color);
    border-radius: var(--el-border-radius-base);
    background: var(--el-bg-color-overlay);
    color: var(--el-text-color-regular);
    box-shadow: none;
    transition:
        border-color 0.2s ease,
        color 0.2s ease,
        background-color 0.2s ease;

    &:hover:not(.is-disabled) {
        border-color: var(--el-color-primary-light-5);
        color: var(--el-color-primary);
        background: var(--el-fill-color-light);
    }

    &.is-disabled {
        border-color: var(--el-border-color-lighter);
        background: var(--el-fill-color-blank);
        color: var(--el-text-color-disabled);
        box-shadow: none;
    }
}

.switch-media-btn__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.dialog-title {
    font-size: 20px;
    font-weight: 700;
}
</style>
