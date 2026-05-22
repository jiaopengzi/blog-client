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
    <div class="container">
        <div class="btns">
            <slot name="btns"></slot>
            <el-button v-if="props.isShowDeleteAll" type="danger" @click="handleBatchDelete" :loading="props.loadingDelete"> 删除 </el-button>

            <span v-if="props.isShowListOrGrid" class="is-show-list-or-grid">
                <SwitchGroup :switch-items="switchItemList" @update-status="updateStatus" />
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
    isShowDeleteAll: false,
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

.btns {
    display: flex;
    margin: 10px 0;
}

.search {
    width: 250px;
}

:deep(.table-container) {
    overflow-x: auto;
}

:deep(.grid) {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 20px;
}

:deep(.grid-item) {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    .grid-item-selection-status {
        position: absolute;
        top: 0;
        right: 0;
        z-index: 1;
    }
    .grid-item-edit {
        position: absolute;
        bottom: 0;
        left: 0;
        display: none;
    }
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
