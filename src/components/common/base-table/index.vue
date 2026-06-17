<!--
 * @FilePath     : \blog-client\src\components\common\base-table\index.vue
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
 * @Description  : 基础表格
-->

<template>
    <!-- 参考:https://github.com/element-plus/element-plus/blob/dev/packages/components/image/src/image.vue -->
    <el-image-viewer v-if="isShowElImageViewer" @close="closeElImageViewer" :url-list="imgUrls" />
    <div class="container" :style="gridCellStyle">
        <div class="btns">
            <slot name="btns"></slot>
            <el-button v-if="props.isShowDeleteAll" type="danger" @click="handleBatchDelete" :loading="props.loadingDelete"> 删除 </el-button>

            <span v-if="props.isShowListOrGrid" class="is-show-list-or-grid">
                <SwitchGroup :switch-items="switchItemList" @update-status="updateStatus" />
            </span>

            <!-- 宫格模式下显示单元格尺寸调节滑块, 用户可按需调整每个单元格的大小 -->
            <span v-if="props.isShowGridSizeRange && !props.showListOrGridStatus" class="grid-size-range">
                <span class="grid-size-range__label">宫格大小</span>
                <el-slider
                    class="grid-size-range__slider"
                    :model-value="props.gridCellSize"
                    :min="gridCellSizeMin"
                    :max="gridCellSizeMax"
                    :step="gridCellSizeStep"
                    :show-tooltip="true"
                    :format-tooltip="formatGridSizeTooltip"
                    @input="handleGridCellSizeChange"
                />
            </span>
        </div>

        <slot name="category"></slot>

        <div class="filter-operation">
            <el-input v-if="props.isShowSearch" class="search filter-operation-item" v-model="search" placeholder="关键字搜索" clearable />
            <slot name="custom-filter"></slot>
            <el-button v-if="props.isShowSearch" class="filter-operation-item" type="primary" @click="runSearch">搜索</el-button>
            <slot name="operation"></slot>
        </div>

        <BaseTableList
            ref="listRef"
            :pagination="props.pagination"
            :table-column="props.tableColumn"
            :row-style="props.rowStyle"
            :show-list-or-grid-status="props.showListOrGridStatus"
            :is-show-delete-all="props.isShowDeleteAll"
            :is-show-selection="props.isShowSelection"
            :is-show-edit="props.isShowEdit"
            :height="props.height"
            :avatar-width="props.avatarWidth"
            :is-show-user-name="props.isShowUserName"
            :is-show-user-email="props.isShowUserEmail"
            :is-show-user-display-name="props.isShowUserDisplayName"
            :is-show-cursor-pointer="props.isShowCursorPointer"
            :row-operation-text="props.rowOperationText"
            :tags-item-max-height="props.tagsItemMaxHeight"
            :markdown-preview-max-height="props.markdownPreviewMaxHeight"
            :click-handler="clickHandler"
            :get-row-img="getRowImg"
            @selection-change="handleSelectionChange"
            @sort-change="handleSortChange"
            @edit="handleEdit"
            @click-category="handleCategoryClick"
            @click-tag="handleTagClick"
            @click-author="handleAuthorClick"
            @post-click="handlePostClick"
            @view-post="handleViewPost"
        />

        <BaseTableGrid
            :pagination="props.pagination"
            :checked-rows="checkedRows"
            :show-list-or-grid-status="props.showListOrGridStatus"
            :is-show-edit="props.isShowEdit"
            :row-operation-text="props.rowOperationText"
            :get-row-img="getRowImg"
            :click-in-grid-handler="clickInGridHandler"
            :is-selected="isSelected"
            @update-checked-rows="checkedRows = $event"
            @checked-grid-change="handleCheckedGridChange"
            @edit="handleEdit"
        />

        <div class="pagination-block">
            <el-pagination
                :current-page="props.pagination.current_page"
                :page-size="props.pagination.page_size"
                :page-sizes="props.pagination.page_sizes"
                :page-count="props.pagination.page_count"
                :total="props.pagination.total"
                :background="true"
                :layout="paginationLayout"
                size="small"
                @update:current-page="updateCurrentPage"
                @update:page-size="updatePageSize"
            />
        </div>
    </div>

    <el-dialog
        class="add-item-dialog"
        v-if="addItemDialogVisibleStatus"
        v-model="addItemDialogVisibleStatus"
        @close="addItemHandleDialogClose"
        v-bind="{ width: props.addWidth, top: props.addTop }"
        :align-center="true"
    >
        <template #header>
            <slot name="add-item-title"></slot>
        </template>
        <slot name="add-item"></slot>
    </el-dialog>

    <el-dialog
        class="edit-item-dialog"
        v-if="editItemDialogVisibleStatus"
        v-model="editItemDialogVisibleStatus"
        @close="editItemHandleDialogClose"
        v-bind="{ width: props.editWidth, top: props.editTop }"
        :align-center="true"
    >
        <template #header>
            <slot name="edit-item-title"></slot>
        </template>
        <slot name="edit-item"></slot>
    </el-dialog>
</template>

<script lang="ts" setup>
import { computed } from "vue"

import SwitchGroup from "@/components/common/switch-group"

import BaseTableGrid from "./base-table-grid.vue"
import BaseTableList from "./base-table-list.vue"
import type { BaseTableEmits, BaseTableProps } from "./types"
import { useBaseTable } from "./useBaseTable"

defineOptions({ name: "BaseTable" })

const props = withDefaults(defineProps<BaseTableProps>(), {
    addItemDialogVisible: false,
    editItemDialogVisible: false,
    isShowListOrGrid: false,
    showListOrGridStatus: true,
    isShowGridSizeRange: false,
    gridCellSize: 260,
    isShowDeleteAll: false,
    isShowSelection: false,
    isShowEdit: false,
    isShowSearch: false,
    searchStr: "",
    avatarWidth: 30,
    isShowUserName: false,
    isShowUserEmail: false,
    isShowUserDisplayName: true,
    isShowCursorPointer: false,
    loadingDelete: false,
    rowOperationText: "编辑",
})

const emit = defineEmits<BaseTableEmits>()

// 宫格单元格最小宽度的可调范围 (px)
const gridCellSizeMin = 140
const gridCellSizeMax = 420
const gridCellSizeStep = 10

/**
 * @description: 将宫格单元格宽度注入为 CSS 变量, 供 .grid 网格列宽使用.
 * @return 包含 --grid-cell-min 变量的内联样式对象.
 */
const gridCellStyle = computed(() => ({
    "--grid-cell-min": `${props.gridCellSize}px`,
}))

/**
 * @description: 滑块拖动时向父层同步最新的宫格单元格宽度.
 * @param value 最新单元格宽度, 可能为数组 (区间滑块), 此处仅取单值.
 * @return void.
 */
const handleGridCellSizeChange = (value: number | number[]) => {
    emit("update-grid-cell-size", Array.isArray(value) ? value[0] : value)
}

/**
 * @description: 格式化滑块提示文案, 显示当前单元格宽度.
 * @param value 当前单元格宽度.
 * @return 带单位的提示文案.
 */
const formatGridSizeTooltip = (value: number) => `${value}px`

const {
    paginationLayout,
    listRef,
    search,
    addItemDialogVisibleStatus,
    editItemDialogVisibleStatus,
    isShowElImageViewer,
    imgUrls,
    checkedRows,
    switchItemList,
    updateCurrentPage,
    updatePageSize,
    updateStatus,
    closeElImageViewer,
    clickHandler,
    clickInGridHandler,
    getRowImg,
    handleSortChange,
    addItemHandleDialogClose,
    editItemHandleDialogClose,
    runSearch,
    handleEdit,
    handleCategoryClick,
    handleTagClick,
    handleAuthorClick,
    handlePostClick,
    handleViewPost,
    handleBatchDelete,
    handleSelectionChange,
    handleCheckedGridChange,
    isSelected,
} = useBaseTable(props, emit)
</script>

<style scoped lang="scss">
.container {
    margin: 10px;
}

.is-show-list-or-grid {
    margin-left: 10px;
}

// 宫格大小调节: 标签 + 滑块, 与切换按钮同排, 紧凑布局
.grid-size-range {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    margin-left: 16px;

    &__label {
        font-size: 13px;
        color: var(--el-text-color-secondary);
        white-space: nowrap;
    }

    &__slider {
        width: 160px;
    }
}

.btns {
    display: flex;
    align-items: center;
    margin: 10px 0;
}

.search {
    width: 250px;
}

:deep(.table-container) {
    overflow-x: auto;
}

// 宫格容器: 自适应列宽, 单元格最小宽度由 --grid-cell-min 控制 (默认 260px), 用户可通过滑块调整
:deep(.grid) {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(var(--grid-cell-min, 260px), 1fr));
    gap: 16px;
    padding: 4px;
}

// 宫格卡片: 正方形圆角卡片, 悬停浮起, 缩略图填满整张卡片
// 使用 li.grid-item 提升优先级, 覆盖 .thumbnail 的 height: 100%, 让 aspect-ratio 生效
:deep(li.grid-item) {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    height: auto;
    aspect-ratio: 1 / 1;
    border-radius: 6px;
    overflow: hidden;
    background: var(--el-fill-color-light);
    border: 1px solid var(--el-border-color-lighter);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
    transition:
        box-shadow 0.25s ease,
        transform 0.25s ease,
        border-color 0.25s ease;

    &:hover {
        box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
        border-color: var(--el-color-primary-light-5);
        transform: translateY(-2px);
    }

    .grid-item-selection-status {
        position: absolute;
        top: 6px;
        right: 6px;
        z-index: 2;
    }
    .grid-item-edit {
        position: absolute;
        bottom: 6px;
        left: 6px;
        z-index: 2;
        display: none;
    }
}

// 宫格图片: 绝对定位填满卡片, 用 !important 覆盖列表视图遗留的固定像素内联尺寸
:deep(.grid-item img.thumbnail-img) {
    position: absolute;
    inset: 0;
    width: 100% !important;
    height: 100% !important;
    object-fit: cover;
    border-radius: 0;
}

// 宫格占位图标 (如 zip, 视频): 居中放大, 与放大后的卡片视觉协调
:deep(.grid-item .thumbnail-img:not(img)) {
    font-size: 72px !important;
}

.filter-operation {
    display: flex;
    align-items: center;
    margin: 10px 0;
    .filter-operation-item {
        margin-right: 10px;
    }
}

:deep(.el-checkbox) {
    margin: 0;
    padding: 0;
    height: 14px;
}
:deep(.el-checkbox__label) {
    display: none;
}

:deep(.grid-item:hover .grid-item-edit) {
    display: block;
}

:deep(.grid-item.el-checkbox__inner) {
    display: none;
}

.pagination-block {
    display: flex;
    justify-content: center;
    margin-top: 10px;
}

.dialog-footer button:first-child {
    margin-right: 10px;
}

:deep(.thumbnail) {
    display: flex;
    justify-content: center;
    align-items: center;
    float: left;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    overflow: hidden;
}

:deep(.thumbnail-img) {
    cursor: pointer;
    width: 100%;
    height: 100%;
    background-size: cover;
    transition: transform 0.3s ease;
}

:deep(.thumbnail:hover .thumbnail-img) {
    transform: scale(1.2);
}

:deep(img) {
    display: block;
    max-width: 100%;
    width: auto;
    margin: 4px auto;
    border-radius: 4px;
}

:deep(h4) {
    font-weight: 700;
}
</style>
