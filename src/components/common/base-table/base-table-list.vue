<!--
 * FilePath    : blog-client\src\components\common\base-table\base-table-list.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * @Description  : BaseTable 列表视图
-->

<template>
    <div class="table-container" style="overflow-x: auto" @dblclick="handleContainerDblclick">
        <el-table
            v-show="showListOrGridStatus"
            ref="tableRef"
            :key="tableKey"
            :data="pagination.records"
            stripe
            border
            @selection-change="handleSelectionChange"
            @sort-change="handleSortChange"
            @header-dragend="handleHeaderDragend"
            :row-style="rowStyle"
            style="width: 100%; min-width: 800px"
            :height="height"
        >
            <el-table-column v-if="isShowSelection || isShowDeleteAll" type="selection" width="50" align="center" :resizable="false" />

            <template v-for="(col, index) in tableColumn" :key="`${String(col.prop)}-${index}`">
                <el-table-column v-if="col.isImg" :prop="String(col.prop)" :width="resolveColWidth(col)" :min-width="col.minWidth" :align="col.align">
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

                <CustomCol v-else-if="col.isCategories" :col="col" :width="resolveColWidth(col)" @click-item="(item) => emit('click-category', item)" />
                <CustomCol v-else-if="col.isTags" :col="col" :width="resolveColWidth(col)" @click-item="(item) => emit('click-tag', item)" />
                <CustomCol v-else-if="col.isHeading" :col="col" :width="resolveColWidth(col)" />
                <CustomCol v-else-if="col.isHeadingWithId" :col="col" :width="resolveColWidth(col)" @view-post="(postID) => emit('view-post', postID)" />
                <CustomCol v-else-if="col.isCopyText" :col="col" :width="resolveColWidth(col)" />
                <CustomCol
                    v-else-if="col.isUser"
                    :col="col"
                    :width="resolveColWidth(col)"
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
                    :width="resolveColWidth(col)"
                    @post-click="(postID) => emit('post-click', postID)"
                    @view-post="(postID) => emit('view-post', postID)"
                />
                <CustomCol v-else-if="col.isMarkdownPreview" :col="col" :width="resolveColWidth(col)" :markdown-preview-max-height="markdownPreviewMaxHeight" />
                <CustomCol v-else-if="col.formatter" :col="col" :width="resolveColWidth(col)" :tags-item-max-height="tagsItemMaxHeight" />
                <el-table-column
                    v-else
                    :prop="col.prop"
                    :label="col.label"
                    :sortable="col.sortable"
                    :width="resolveColWidth(col)"
                    :min-width="col.minWidth"
                    :align="col.align"
                />
            </template>

            <el-table-column v-if="isShowEdit" width="80" align="center" :resizable="false">
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
import type { TableColumnCtx, TableInstance } from "element-plus"
import { ref, useTemplateRef, watch } from "vue"

import type { PostCategory } from "@/api/postCategory/view"
import type { PostTag } from "@/api/postTag/view"
import type { User } from "@/api/user/getUsers"
import PostThumbnail from "@/components/common/post-thumbnail"
import { iconStyle, imgStyle } from "@/utils/style"

import CustomCol from "./custom-col"
import type { BaseTableListExpose, BaseTableListProps, TableColumn, TableData } from "./types"
import { clearStoredColumnWidths, getElTableVisibleRows, persistColumnWidth, readStoredColumnWidths } from "./utils"

defineOptions({ name: "BaseTableList" })

const props = defineProps<BaseTableListProps>()

// 当前路由已持久化的列宽映射 (列 prop -> 宽度 px), 初始即读取以便首屏恢复
const storedWidths = ref<Record<string, number>>(readStoredColumnWidths(props.routeName ?? ""))

// el-table 重挂载键: 恢复默认列宽时自增, 强制 el-table 按默认配置重建全部列
const tableKey = ref(0)

// 列头边界拖拽热区宽度 (px), 与 Element Plus 内部判定保持一致
const RESIZE_HANDLE_ZONE = 8

// 路由切换 (表格复用) 时重新加载对应分组的列宽
watch(
    () => props.routeName,
    (routeName) => {
        storedWidths.value = readStoredColumnWidths(routeName ?? "")
    },
)

/**
 * @description: 计算列的有效宽度: 优先使用本地持久化宽度, 否则回退到列自身配置的固定宽度.
 * @param col 表格列配置.
 * @return 有效列宽 (px) 或 undefined (使用 minWidth 弹性布局).
 */
const resolveColWidth = (col: TableColumn): number | string | undefined => {
    const stored = storedWidths.value[String(col.prop)]
    return stored ?? col.width
}

/**
 * @description: 列宽拖拽结束时持久化新宽度, 按 routeName + 列 prop 分组存储.
 * @param newWidth 拖拽后的新列宽.
 * @param _oldWidth 拖拽前的旧列宽 (未使用).
 * @param column 被拖拽的 Element Plus 列对象, property 对应 TableColumn.prop.
 * @return void.
 */
const handleHeaderDragend = (newWidth: number, _oldWidth: number, column: TableColumnCtx<TableData>): void => {
    const routeName = props.routeName ?? ""
    const prop = column?.property
    // 无 routeName 或列无 prop (如选择列/操作列) 时不持久化
    if (!routeName || !prop) {
        return
    }
    storedWidths.value = { ...storedWidths.value, [prop]: Math.round(newWidth) }
    persistColumnWidth(routeName, prop, newWidth)
}

/**
 * @description: 恢复所有列到传入的默认列宽: 清除本地持久化并重挂载表格.
 * @return void.
 */
const resetColumnWidths = (): void => {
    clearStoredColumnWidths(props.routeName ?? "")
    storedWidths.value = {}
    // 重挂载 el-table, 使各列按默认配置 (resolveColWidth 回退到 col.width) 重新计算宽度
    tableKey.value += 1
}

/**
 * @description: 在列宽拖拽热区 (列头右边界附近) 双击时, 一键恢复所有列的默认列宽.
 * @param event 双击事件.
 * @return void.
 */
const handleContainerDblclick = (event: MouseEvent): void => {
    const tableEl = (tableRef.value as unknown as { $el?: HTMLElement } | null)?.$el
    const headerCells = tableEl?.querySelectorAll<HTMLElement>(".el-table__header th.el-table__cell")
    if (!headerCells || headerCells.length === 0) {
        return
    }

    const { clientX, clientY } = event
    // 仅当双击落在某个列头右边界的拖拽热区内时才触发恢复, 与普通表头双击区分
    for (const cell of headerCells) {
        const rect = cell.getBoundingClientRect()
        const nearRightEdge = Math.abs(rect.right - clientX) <= RESIZE_HANDLE_ZONE
        const insideHeader = clientY >= rect.top && clientY <= rect.bottom
        if (nearRightEdge && insideHeader) {
            resetColumnWidths()
            return
        }
    }
}

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

// el-table 仅在 border 开启时才提供列宽拖拽手柄, 因此开启 border 以启用调整能力,
// 再通过以下样式隐藏所有竖向分隔线与外描边, 保持页面原有的无边框观感 (拖拽基于 JS 检测, 不依赖可视边框)
:deep(.el-table--border) {
    border: none;

    // 移除右侧与顶部外描边伪元素
    &::after,
    &::before {
        display: none;
    }
}

// 隐藏表头与表体单元格的竖向分隔线
:deep(.el-table--border .el-table__cell) {
    border-right: none;
}

// 鼠标移入表头时显示列头竖向分隔线, 提示列边界即为拖拽热区, 便于快速定位并拖拽调整列宽;
// 排除最后一列以避免在表格右缘露出多余竖线.
// 不加 transition: border-style 由 none 切换为 solid 时, border-color 过渡的起始色会回退到 currentColor (深色文字色),
// 导致先闪一下深色再变淡, 观感不佳; 直接以目标浅色即时显示即可.
:deep(.el-table__header-wrapper:hover thead th.el-table__cell:not(:last-child)) {
    border-right: 1px solid var(--el-border-color-lighter);
}

// 隐藏内层包裹容器的外描边补丁
:deep(.el-table--border .el-table__inner-wrapper::after) {
    display: none;
}

:deep(.el-table__border-left-patch) {
    display: none;
}
</style>
