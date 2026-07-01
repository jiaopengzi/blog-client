<!--
 * @FilePath     : \blog-client\src\views\admin\component\main\media\index.vue
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
 * @Description  : media 后台管理
-->

<template>
    <section>
        <MediaBase
            :table-column="cols"
            :route-name="RouteNames.Media"
            :is-show-delete-all="true"
            :is-show-list-or-grid="true"
            :show-list-or-grid-status="showListOrGridStatus"
            :is-show-grid-size-range="true"
            :grid-cell-size="gridCellSize"
            :add-item-dialog-visible="addItemDialogVisible"
            :edit-item-dialog-visible="editItemDialogVisible"
            :is-show-edit="true"
            :is-show-search="true"
            :search-str="search"
            :edit-width="editWidth"
            :edit-top="editTop"
            height="calc(100vh - 270px)"
            :pagination="pagination"
            :edit-media-data="editMediaData"
            :file-count-group-by-file-type="fileCountGroupByFileType"
            :active-file-type="activeFileType"
            :handle-file-count-by-file-type="handleFileCountByFileType"
            :media-switch-tip="mediaSwitchTip"
            :can-switch-prev-media="canSwitchPrevMedia"
            :can-switch-next-media="canSwitchNextMedia"
            :handle-prev-media="handlePrevMedia"
            :handle-next-media="handleNextMedia"
            :loading-delete="loadingDelete"
            @update-current-page="updateCurrentPage"
            @update-page-size="updatePageSize"
            @edit-row="editRow"
            @delete-rows="deleteRows"
            @update-search="updateSearch"
            @run-search="runSearch"
            @double-click-row-by-picture="clickRowByPicture"
            @add-item-update-dialog-visible="addItemUpdateDialogVisible"
            @edit-item-update-dialog-visible="editItemUpdateDialogVisible"
            @update-show-list-or-grid-status="updateShowListOrGridStatus"
            @update-grid-cell-size="updateGridCellSize"
            @toggle-add-dialog="toggleAddDialog"
            @edit-media-status="editStatus"
            @has-upload="handleHasUpload"
            @update-subtitles="updateSubtitles"
            @delete-subtitles="deleteSubtitles"
            @update-visible-rows="updateVisibleMediaRows"
        />
    </section>
</template>

<script lang="ts" setup>
import { useHead } from "@unhead/vue"

import MediaBase from "@/components/common/media-base/index.vue"
import { useMedia } from "@/components/hooks/useMedia"
import { RouteNames } from "@/router"
import { adminMenuItemMap } from "@/views/admin/component/aside"

defineOptions({ name: RouteNames.Media })

useHead({
    title: adminMenuItemMap[RouteNames.Media].text,
})

const {
    cols, // 列配置
    showListOrGridStatus, // 是否显示列表或网格
    gridCellSize, // 宫格模式单元格最小宽度
    editWidth, // 编辑宽度
    editTop, // 编辑顶部距离
    addItemDialogVisible, // 添加对话框是否可见
    editItemDialogVisible, // 编辑对话框是否可见
    search, // 搜索关键字
    pagination, // 分页数据
    editMediaData, // 编辑数据
    fileCountGroupByFileType,
    activeFileType,
    mediaSwitchTip,
    canSwitchPrevMedia,
    canSwitchNextMedia,
    updateCurrentPage, // 更新当前页
    updatePageSize, // 更新每页显示条数
    updateSearch, // 更新搜索关键字

    editRow, // 编辑行
    deleteRows, // 删除多行
    clickRowByPicture, // 点击行中的图片
    addItemUpdateDialogVisible, // 更新添加对话框状态
    editItemUpdateDialogVisible, // 更新编辑对话框状态
    updateShowListOrGridStatus, // 更新列表或网格状态
    updateGridCellSize, // 更新宫格单元格尺寸
    runSearch, // 执行搜索

    toggleAddDialog, // 切换添加对话框
    editStatus, // 编辑媒体状态
    handleHasUpload, // 处理是否有上传
    handlePrevMedia, // 切换上一条媒体
    handleNextMedia, // 切换下一条媒体
    handleFileCountByFileType, // 根据文件类型统计文件数量
    updateSubtitles, // 更新字幕
    deleteSubtitles, // 删除字幕
    updateVisibleMediaRows, // 更新当前可见媒体顺序
    loadingDelete, // 删除加载状态
} = useMedia()
</script>
