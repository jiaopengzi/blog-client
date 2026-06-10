<!--
 * FilePath    : blog-client\src\components\common\base-table\base-table-list.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * @Description  : BaseTable 列表视图
-->

<template>
    <div class="table-container" style="overflow-x: auto">
        <el-table
            v-show="showListOrGridStatus"
            ref="tableRef"
            :data="pagination.records"
            stripe
            @selection-change="handleSelectionChange"
            @sort-change="handleSortChange"
            :row-style="rowStyle"
            style="width: 100%; min-width: 800px"
            :height="height"
        >
            <el-table-column v-if="isShowSelection || isShowDeleteAll" type="selection" width="50" align="center" />

            <template v-for="(col, index) in tableColumn" :key="`${String(col.prop)}-${index}`">
                <el-table-column v-if="col.isImg" :width="col.width" :min-width="col.minWidth" :align="col.align">
                    <template #header>
                        <span>{{ col.label }}</span>
                    </template>
                    <template #default="scope">
                        <div class="thumbnail" v-single-dbl-click="clickHandler(scope.row)">
                            <img
                                v-if="getRowImg(scope.row)?.url"
                                class="thumbnail-img"
                                :src="getRowImg(scope.row)?.url"
                                :style="imgStyle(getRowImg(scope.row)?.width, getRowImg(scope.row)?.height, getRowImg(scope.row)?.imgFit)"
                            />
                            <j-icon
                                v-else-if="getRowImg(scope.row)?.iconKeyName"
                                class="thumbnail-img"
                                :name="getRowImg(scope.row)?.iconKeyName"
                                :style="iconStyle(getRowImg(scope.row)?.svgFontSize)"
                            />
                            <!-- 无缩略图且有首字符时, 复用 PostThumbnail 占位图标, 与前台文章列表保持一致 -->
                            <PostThumbnail
                                v-else-if="getRowImg(scope.row)?.initial"
                                class="thumbnail-initial"
                                theme="main"
                                :initial="getRowImg(scope.row)?.initial ?? ''"
                                :style="{ width: `${getRowImg(scope.row)?.width ?? 96}px`, height: `${getRowImg(scope.row)?.height ?? 96}px` }"
                            />
                        </div>
                    </template>
                </el-table-column>

                <CustomCol v-else-if="col.isCategories" :col="col" @click-item="(item) => emit('click-category', item)" />
                <CustomCol v-else-if="col.isTags" :col="col" @click-item="(item) => emit('click-tag', item)" />
                <CustomCol v-else-if="col.isHeading" :col="col" />
                <CustomCol v-else-if="col.isHeadingWithId" :col="col" @view-post="(postID) => emit('view-post', postID)" />
                <CustomCol v-else-if="col.isCopyText" :col="col" />
                <CustomCol
                    v-else-if="col.isUser"
                    :col="col"
                    @click-author="(author) => emit('click-author', author)"
                    :is-show-cursor-pointer="isShowCursorPointer"
                    :is-show-user-name="isShowUserName"
                    :avatar-width="avatarWidth"
                    :is-show-user-email="isShowUserEmail"
                    :is-show-user-display-name="isShowUserDisplayName"
                />
                <CustomCol
                    v-else-if="col.isCommentWithPost"
                    :col="col"
                    @post-click="(postID) => emit('post-click', postID)"
                    @view-post="(postID) => emit('view-post', postID)"
                />
                <CustomCol v-else-if="col.isMarkdownPreview" :col="col" :markdown-preview-max-height="markdownPreviewMaxHeight" />
                <CustomCol v-else-if="col.formatter" :col="col" :tags-item-max-height="tagsItemMaxHeight" />
                <el-table-column
                    v-else
                    :prop="col.prop"
                    :label="col.label"
                    :sortable="col.sortable"
                    :width="col.width"
                    :min-width="col.minWidth"
                    :align="col.align"
                />
            </template>

            <el-table-column v-if="isShowEdit" width="80" align="center">
                <template #header>
                    <span>操作</span>
                </template>
                <template #default="scope">
                    <el-button size="small" type="primary" @click="emit('edit', scope.$index, scope.row)">{{ rowOperationText }}</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script lang="ts" setup>
import type { TableInstance } from "element-plus"
import { useTemplateRef } from "vue"

import type { PostCategory } from "@/api/postCategory/view"
import type { PostTag } from "@/api/postTag/view"
import type { User } from "@/api/user/getUsers"
import PostThumbnail from "@/components/common/post-thumbnail"
import { iconStyle, imgStyle } from "@/utils/style"

import CustomCol from "./custom-col"
import type { BaseTableListExpose, BaseTableListProps, TableData } from "./types"
import { getElTableVisibleRows } from "./utils"

defineOptions({ name: "BaseTableList" })

const props = defineProps<BaseTableListProps>()

const emit = defineEmits<{
    (event: "selection-change", rows: TableData[]): void
    (event: "sort-change"): void
    (event: "edit", index: number, row: TableData): void
    (event: "click-category", item: PostCategory | PostTag): void
    (event: "click-tag", item: PostCategory | PostTag): void
    (event: "click-author", author: User): void
    (event: "post-click", postID: string): void
    (event: "view-post", postID: string): void
}>()

const tableRef = useTemplateRef<TableInstance>("tableRef")

/**
 * @description: 向父层同步表格选中行.
 * @param rows 当前选中行.
 * @return void.
 */
const handleSelectionChange = (rows: TableData[]): void => {
    emit("selection-change", rows)
}

/**
 * @description: 向父层同步排序变化.
 * @return void.
 */
const handleSortChange = (): void => {
    emit("sort-change")
}

/**
 * @description: 获取当前选中行.
 * @return 当前选中行数组.
 */
const getSelectionRows = (): TableData[] => {
    return (tableRef.value?.getSelectionRows() as TableData[] | undefined) ?? []
}

/**
 * @description: 清空当前选中行.
 * @return void.
 */
const clearSelection = (): void => {
    tableRef.value?.clearSelection()
}

/**
 * @description: 切换指定行的选中状态.
 * @param row 当前数据行.
 * @param selected 是否选中.
 * @return void.
 */
const toggleRowSelection = (row: TableData, selected?: boolean): void => {
    tableRef.value?.toggleRowSelection(row, selected)
}

/**
 * @description: 获取当前列表真实可见顺序.
 * @return 当前可见行数组.
 */
const getVisibleRows = (): TableData[] => {
    return getElTableVisibleRows(props.pagination.records, tableRef.value ?? null)
}

defineExpose<BaseTableListExpose>({
    getSelectionRows,
    clearSelection,
    toggleRowSelection,
    getVisibleRows,
})
</script>

<style lang="scss" scoped>
// 首字符占位图标: 圆角裁切并禁止收缩, 视觉上与缩略图保持统一
.thumbnail-initial {
    border-radius: 4px;
    overflow: hidden;
    flex-shrink: 0;
}
</style>
