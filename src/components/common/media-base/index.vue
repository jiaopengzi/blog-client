<!--
 * @FilePath     : \blog-client\src\components\common\media-base\index.vue
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
 * @Description  : 媒体文件基础展示组件
-->

<template>
    <section>
        <BaseTable :pagination="pagination" :tableColumn="tableColumn" v-bind="$attrs">
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
                <EditMedia
                    :edit-media-data="editMediaData"
                    @edit-media-status="editStatus"
                    @update-subtitles="updateSubtitles"
                    @delete-subtitles="deleteSubtitles"
                />
            </template>
        </BaseTable>
    </section>
</template>

<script lang="ts" setup>
import { type Pagination } from "@/api/response"
import { type FileCountGroupByFileType } from "@/api/upload/getFileCountGroupByFileType1"
import type { TableColumn, TableData } from "@/components/common/base-table"
import BaseTable from "@/components/common/base-table"
import AddMedia from "@/components/common/media-add"
import EditMedia, { type EditMediaProps } from "@/components/common/media-edit"

// 定义组件名称
defineOptions({ name: "MediaBase" })

// 数据
const { tableColumn, pagination, editMediaData, fileCountGroupByFileType, activeFileType, handleFileCountByFileType } = defineProps<{
    tableColumn: TableColumn[] // 表格列配置
    pagination: Pagination<TableData> // 分页数据
    editMediaData: EditMediaProps // 编辑媒体数据
    fileCountGroupByFileType: FileCountGroupByFileType[]
    activeFileType: string // 当前选中的文件类型
    handleFileCountByFileType: (fileType: string) => void // 根据文件类型获取文件数量
}>()

// 事件
const emit = defineEmits<{
    (event: "toggle-add-dialog"): void // 编辑Media状态
    (event: "edit-media-status", value: boolean): void // 编辑Media状态
    (event: "has-upload", value: boolean): void // 是否有上传
    (event: "update-subtitles", language: string): void // 更新字幕
    (event: "delete-subtitles", language: string): void // 删除字幕
}>()

// 切换添加对话框
const toggleAddDialog = () => {
    emit("toggle-add-dialog")
}

// 编辑Media状态
const editStatus = (value: boolean) => {
    emit("edit-media-status", value)
}

const handleHasUpload = (value: boolean) => {
    emit("has-upload", value)
}

// 更新字幕
const updateSubtitles = (language: string) => {
    emit("update-subtitles", language)
}

// 删除字幕
const deleteSubtitles = (language: string) => {
    emit("delete-subtitles", language)
}
</script>

<style scoped lang="scss">
.dialog-title {
    font-size: 20px;
    font-weight: 700;
}
</style>
