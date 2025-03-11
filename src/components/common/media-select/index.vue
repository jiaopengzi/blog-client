<!--
 * @FilePath     : \blog-client\src\components\common\media-select\index.vue
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
 * @Description  : 媒体文件选择 
-->

<template>
    <el-dialog v-model="isVisible" width="98%" top="3vh" @close="handleClose" footer-class="media-select-dialog-footer">
        <template #header>
            <h4 class="header-text">选择媒体文件</h4>
        </template>

        <MediaBase
            :table-column="cols"
            :is-show-delete-all="true"
            :is-show-list-or-grid="true"
            :show-list-or-grid-status="showListOrGridStatus"
            :add-item-dialog-visible="addItemDialogVisible"
            :edit-item-dialog-visible="editItemDialogVisible"
            :is-show-edit="true"
            :is-show-search="true"
            :search-str="search"
            :edit-width="editWidth"
            :edit-top="editTop"
            height="calc(100vh - 340px)"
            :pagination="pagination"
            :search="search"
            :edit-media-data="editMediaData"
            :file-count-group-by-file-type="fileCountGroupByFileType"
            :active-file-type="activeFileType"
            :handle-file-count-by-file-type="handleFileCountByFileTypeAc"
            @update-current-page="updateCurrentPageAc"
            @update-page-size="updatePageSizeAc"
            @update-search="updateSearchAc"
            @run-search="runSearchAc"
            @edit-row="editRow"
            @delete-rows="deleteRows"
            @click-row-by-picture="clickRowByPicture"
            @add-item-update-dialog-visible="addItemUpdateDialogVisible"
            @edit-item-update-dialog-visible="editItemUpdateDialogVisible"
            @update-show-list-or-grid-status="updateShowListOrGridStatus"
            @toggle-add-dialog="toggleAddDialog"
            @edit-media-status="editStatus"
            @has-upload="handleHasUpload"
            @update-subtitles="updateSubtitlesAc"
            @delete-subtitles="deleteSubtitlesAc"
            @update-selection="updateSelection"
        >
        </MediaBase>

        <template #footer>
            <el-button type="primary" class="insert" @click="insert">
                <span>插入</span>
            </el-button>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue"

import type { TableData } from "@/components/common/base-table"
import MediaBase from "@/components/common/media-base"
import { useMedia } from "@/components/hooks/useMedia"
import { MessageUtil } from "@/utils/message"

// 定义组件名称
defineOptions({ name: "SelectMedia" })

// 定义 props, 默认值为不显示 false
const { isShow = false } = defineProps<{
    isShow?: boolean // 是否显示
}>()

// 定义 emit
const emit = defineEmits<{
    (event: "update:isShow", val: boolean): void
    (event: "insert", selection: TableData[]): void
}>()

// v-model 绑定
const isVisible = computed<boolean>({
    get: () => isShow === true,
    set: (val: boolean) => emit("update:isShow", val),
})

// 关闭对话框
const handleClose = () => {
    emit("update:isShow", false)
}

const {
    cols, // 列配置
    showListOrGridStatus, // 是否显示列表或网格
    editWidth, // 编辑宽度
    editTop, // 编辑顶部距离
    addItemDialogVisible, // 添加对话框是否可见
    editItemDialogVisible, // 编辑对话框是否可见
    search, // 搜索关键字
    pagination, // 分页数据
    editMediaData, // 编辑媒体数据
    fileCountGroupByFileType,
    activeFileType,
    updateCurrentPage, // 更新当前页
    updatePageSize, // 更新每页显示条数
    updateSearch, // 更新搜索关键字
    updatePaginate, // 更新分页

    editRow, // 编辑行
    deleteRows, // 删除多行
    clickRowByPicture, // 点击行中的图片
    addItemUpdateDialogVisible, // 更新添加对话框状态
    editItemUpdateDialogVisible, // 更新编辑对话框状态
    updateShowListOrGridStatus, // 更新列表或网格状态

    toggleAddDialog, // 切换添加对话框
    editStatus, // 编辑媒体状态
    handleHasUpload, // 处理是否有上传
    handleFileCountByFileType, // 根据文件类型统计文件数量
    updateSubtitles, // 更新字幕
    deleteSubtitles, // 删除字幕
} = useMedia()

// 更新搜索关键字
const updateSearchAc = async (val: string) => {
    updateSearch(val, false)
}

// 更新当前页
const updateCurrentPageAc = async (val: number) => {
    updateCurrentPage(val, false)
}

// 更新每页显示条数
const updatePageSizeAc = async (val: number) => {
    updatePageSize(val, false)
}

// 更新数据
const updateDataAc = async () => {
    await updatePaginate()
}

// 执行搜索
const runSearchAc = async () => {
    await updateDataAc()
}

// 处理文件类型统计
const handleFileCountByFileTypeAc = async (fileType: string) => {
    await handleFileCountByFileType(fileType, false)
}

// 更新字幕
const updateSubtitlesAc = async (language: string) => {
    await updateSubtitles(language, false)
}

// 删除字幕
const deleteSubtitlesAc = async (language: string) => {
    await deleteSubtitles(language, false)
}

// 选择的行
const selectionRows = ref<TableData[]>([])

// 更新选择
const updateSelection = (selection: TableData[]) => {
    selectionRows.value = selection
}

// 插入
const insert = () => {
    // 首先判断是否选择数据,没有选择数据则显示警告提示
    if (selectionRows.value.length === 0) {
        return MessageUtil.warning("请选择数据")
    }

    // 选择数据不能大于10条
    if (selectionRows.value.length > 10) {
        return MessageUtil.warning("选择数据不能大于10条")
    }

    emit("insert", selectionRows.value)

    // 关闭对话框
    handleClose()
}
</script>

<!-- <style scoped lang="scss"> -->
<style lang="scss">
.header-text {
    font-size: 18px;
    font-weight: 700;
    color: var(--jpz-text-color-regular);
}

// 使用 :deep 不生效, 这里去掉 scoped
.media-select-dialog-footer {
    padding-top: 0;
}

.insert {
    margin-right: 16px;
}
</style>
