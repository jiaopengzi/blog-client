<!--
 * @FilePath     : \blog-client\src\components\common\base-table\index.vue
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
 * @Description  : 基础表格 table-layout="auto"
-->

<template>
    <!-- 参考:https://github.com/element-plus/element-plus/blob/dev/packages/components/image/src/image.vue -->
    <!-- <el-image-viewer v-if="isShowElImageViewer" @close="closeElImageViewer" :url-list="imgUrls" /> -->
    <div class="container">
        <div class="btns">
            <!-- 按钮 -->
            <slot name="btns"></slot>
            <el-button v-if="isShowDeleteAll" type="danger" @click="handleBatchDelete"> 删除 </el-button>

            <span v-if="isShowListOrGrid">
                <SwitchGroup :switch-items="switchItemList" @update-status="updateStatus" />
            </span>
        </div>

        <!-- 分组显示插槽 -->
        <slot name="category"></slot>

        <!-- 筛选和操作 -->
        <div class="filter-operation">
            <!-- 搜索 -->
            <el-input v-if="isShowSearch" class="search filter-operation-item" v-model="search" placeholder="关键字搜索" clearable />

            <!-- 其他筛选插槽 -->
            <slot class="filter-operation-item" name="custom-filter"></slot>
            <el-button class="filter-operation-item" type="primary" @click="runSearch">搜索</el-button>

            <!-- 操作插槽 -->
            <slot class="filter-operation-item operation" name="operation"></slot>
        </div>

        <!-- 表格内容 -->
        <el-table
            v-show="showListOrGridStatus"
            ref="tableRef"
            :data="pagination.records"
            stripe
            @selection-change="handleSelectionChange"
            :row-style="rowStyle"
            style="width: 100%"
            :height="height"
        >
            <!-- 选择框 -->
            <el-table-column type="selection" width="50" align="center" />

            <template v-for="(col, index) in tableColumn">
                <!-- 图片 -->
                <el-table-column v-if="col.isImg" :key="`img-${index}`" :width="col.width" :min-width="col.minWidth" :align="col.align">
                    <template #header>
                        <span>{{ col.label }}</span>
                    </template>
                    <template #default="scope">
                        <div class="thumbnail" @click="handleDelegateClick(scope.row)">
                            <img
                                v-if="scope.row.img?.url"
                                class="thumbnail-img"
                                :src="scope.row.img?.url"
                                :style="imgStyle(scope.row.img?.width, scope.row.img?.height, scope.row.img?.imgFit)"
                            />
                            <j-icon
                                v-else-if="scope.row.img?.iconKeyName"
                                class="thumbnail-img"
                                :name="scope.row.img?.iconKeyName"
                                :style="iconStyle(scope.row.img?.fontSize)"
                            />
                        </div>
                    </template>
                </el-table-column>

                <!-- 分类信息 -->
                <CustomCol v-else-if="col.isCategories" :key="`category-${index}`" :col="col" @click-item="handleCategoryClick" />

                <!-- 标签信息 -->
                <CustomCol v-else-if="col.isTags" :key="`tag-${index}`" :col="col" @click-item="handleTagClick" />

                <!-- 标题 -->
                <CustomCol v-else-if="col.isHeading" :key="`heading-${index}`" :col="col" />

                <!-- 作者 -->
                <CustomCol v-else-if="col.isAuthor" :key="`author-${index}`" :col="col" @click-author="handleAuthorClick" />

                <!-- 格式化文本 -->
                <CustomCol v-else-if="col.formatter" :key="`format-${index}`" :col="col" :tags-item-max-height="tagsItemMaxHeight" />

                <!-- 不需要处理，显示原值 -->
                <el-table-column
                    v-else
                    :key="col.prop"
                    :prop="col.prop"
                    :label="col.label"
                    :sortable="col.sortable"
                    :width="col.width"
                    :min-width="col.minWidth"
                    :align="col.align"
                />
            </template>
            <!-- 编辑按钮 -->
            <el-table-column v-if="isShowEdit" width="80" align="center">
                <template #header>
                    <span>操作</span>
                </template>
                <template #default="scope">
                    <el-button size="small" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <!-- <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button> -->
                </template>
            </el-table-column>
        </el-table>

        <!-- 宫格 -->
        <el-checkbox-group v-show="!showListOrGridStatus" v-model="checkedRows" @change="handleCheckedGridChange">
            <el-empty v-if="!hasData" />

            <ul ref="gridRef" class="grid">
                <li v-for="(row, index) in pagination.records" :key="row.id" class="thumbnail grid-item">
                    <el-checkbox v-if="isSelected(row)" class="grid-item-selection-status" :key="row" :value="row" size="large" />

                    <img
                        v-if="row.img?.url"
                        class="thumbnail-img"
                        :src="row.img.url"
                        :style="imgStyle(row.img?.width, row.img?.height, row.img?.imgFit)"
                        @click="handleDelegateGridClick(row)"
                    />

                    <j-icon
                        v-else-if="row.img?.iconKeyName"
                        class="thumbnail-img"
                        :name="row.img?.iconKeyName"
                        :style="iconStyle(row.img?.svgFontSize)"
                        @click="handleDelegateGridClick(row)"
                    />

                    <el-button class="grid-item-edit" size="small" type="primary" @click="handleEdit(index, row)">编辑</el-button>
                </li>
            </ul>
        </el-checkbox-group>

        <!-- 分页 -->
        <div ref="paginationBlockRef" class="pagination-block">
            <el-pagination
                v-model:current-page="paginationAC.current_page"
                v-model:page-size="paginationAC.page_size"
                :page-sizes="paginationAC.page_sizes"
                :page-count="paginationAC.page_count"
                :total="paginationAC.total"
                :background="true"
                layout="total, prev, pager, next, jumper, sizes"
                size="small"
                @update:current-page="updateCurrentPage"
                @update:page-size="updatePageSize"
            />
        </div>
    </div>

    <!-- 弹窗 add -->
    <el-dialog
        v-if="addItemDialogVisibleStatus"
        v-model="addItemDialogVisibleStatus"
        @close="addItemHandleDialogClose"
        v-bind="{ width: addWidth, top: addTop }"
        :align-center="true"
    >
        <template #header>
            <slot name="add-item-title"></slot>
        </template>
        <slot name="add-item"></slot>
    </el-dialog>

    <!-- 弹窗 edit -->
    <el-dialog
        v-if="editItemDialogVisibleStatus"
        v-model="editItemDialogVisibleStatus"
        @close="editItemHandleDialogClose"
        v-bind="{ width: editWidth, top: editTop }"
        :align-center="true"
    >
        <template #header>
            <slot name="edit-item-title"></slot>
        </template>
        <slot name="edit-item"></slot>
    </el-dialog>
</template>

<script lang="ts" setup>
import type { ElTable } from "element-plus"
import { reactive, ref, useTemplateRef, watch, watchEffect } from "vue"

import type { PostTag } from "@/api/postTag/view"
import { getEmptyPagination, type Pagination } from "@/api/response"
import type { User } from "@/api/user/getUsers"
import { MsgType } from "@/components/common"
import type { SwitchItem, SwitchItemColor, SwitchItemLabel } from "@/components/common/switch-group"
import SwitchGroup from "@/components/common/switch-group"
import { deleteConfirmCommon } from "@/utils/confirm"
import { iconStyle, imgStyle } from "@/utils/style"

import CustomCol from "./custom-col"
import type { TableColumn, TableData } from "./types"

defineOptions({ name: "BaseTable" })

// 数据
const {
    pagination,
    tableColumn,
    rowStyle,
    addItemDialogVisible = false,
    editItemDialogVisible = false,
    isShowListOrGrid = false,
    showListOrGridStatus = true,
    isShowDeleteAll = false,
    isShowEdit = false,
    isShowSearch = false,
    searchStr = "",
    addWidth,
    addTop,
    editWidth,
    editTop,
    tagsItemMaxHeight,
    height,
} = defineProps<{
    pagination: Pagination<TableData> // 分页配置
    tableColumn: TableColumn[] // 表格列配置
    rowStyle?: Record<string, string> // 表格行样式
    addItemDialogVisible?: boolean // 对话框是否显示
    editItemDialogVisible?: boolean // 对话框是否显示
    isShowListOrGrid?: boolean // 是否显示列表或宫格
    showListOrGridStatus?: boolean // 列表或宫格状态  true:列表,false:宫格
    isShowDeleteAll?: boolean // 是否显示批量删除按钮
    isShowEdit?: boolean // 是否显示每行编辑按钮
    isShowSearch?: boolean // 是否显示每行编辑按钮
    searchStr?: string // 搜索关键字
    addWidth?: string // 添加对话框宽度
    addTop?: string // 添加对话框距离顶部距离
    editWidth?: string // 编辑对话框宽度
    editTop?: string // 编辑对话框距离顶部距离
    tagsItemMaxHeight?: string // 标签项目最大高度
    height?: string | number
}>()

// 事件
const emit = defineEmits<{
    (event: "update-current-page", value: number): void // 更新当前页
    (event: "update-page-size", value: number): void // 更新每页显示条数
    (event: "edit-row", index: number, row: TableData): void // 编辑行
    (event: "delete-row", index: number, row: TableData): void // 删除行
    (event: "delete-rows", rows: TableData[]): void // 删除多行
    (event: "update-search", value: string): void // 更新搜索关键字
    (event: "run-search"): void // 执行搜索
    (event: "update-selection", rows: TableData[]): void // 更新选择
    (event: "click-row-by-picture", rows: TableData): void // 点击行中的图片
    (event: "add-item-update-dialog-visible", value: boolean): void // 更新添加元素对话框状态
    (event: "edit-item-update-dialog-visible", value: boolean): void // 更新编辑元素对话框状态
    (event: "is-show-list-or-grid", value: boolean): void // 是否显示列表或宫格
    (event: "click-category", tagItemData: PostTag): void // 点击分类
    (event: "click-tag", tagItemData: PostTag): void // 点击标签
    (event: "click-author", author: User): void // 点击作者
}>()

const tableRef = useTemplateRef<InstanceType<typeof ElTable>>("tableRef") //表格实例

const search = ref(searchStr) // 搜索关键字
// const paginationData = ref<Pagination<TableData>>(pagination)
const addItemDialogVisibleStatus = ref(false) // 对话框状态
const editItemDialogVisibleStatus = ref(false) // 对话框状态

// const isShowElImageViewer = ref(false)
// const imgUrls = ref<string[]>([])

// 当前分页数据
const paginationAC = reactive(getEmptyPagination<Pagination<TableData>>())

// 更新当前页
const updateCurrentPage = (val: number) => {
    emit("update-current-page", val)
}

// 更新每页显示数量
const updatePageSize = (val: number) => {
    emit("update-page-size", val)
}

watch(
    () => pagination,
    (newVal) => {
        Object.assign(paginationAC, newVal)
    },
    { deep: true },
)

// 判断是否有数据
const hasData = ref(false)

const switchItemLabel: SwitchItemLabel = {
    active: "表格",
    inactive: "宫格",
}

const switchItemColor: SwitchItemColor = {
    active: "#409EFF",
    inactive: "#409EFF",
}

const switchItemList: SwitchItem[] = reactive([
    {
        name: "listOrGrid",
        status: showListOrGridStatus,
        label: switchItemLabel,
        color: switchItemColor,
    },
])

const updateStatus = (items: SwitchItem[]) => {
    emit("is-show-list-or-grid", items[0].status)
}

// 处理宫格点击事件
const handleDelegateGridClick = (row: TableData) => {
    // 宫格点击事件，首先判断 row 是否在 gridSelection 中，如果在，则取消选中，否则选中
    emit("click-row-by-picture", row)
    const gridSelection = tableRef.value?.getSelectionRows() as TableData[]
    const i = gridSelection.findIndex((item) => item === row)
    if (i === -1) {
        tableRef.value?.toggleRowSelection(row)
    } else {
        tableRef.value?.toggleRowSelection(row, false)
    }
}

// 列表图片点击事件
const handleDelegateClick = (row: TableData) => {
    emit("click-row-by-picture", row)
}

// // 点击事件委托,图片预览.
// const handleDelegateClick = (event: MouseEvent) => {
//   const target = event.target as HTMLElement
//   if (target.tagName.toLowerCase() === 'img' && 'src' in target) {
//     // img 图片
//     const imgElement = target as HTMLImageElement // 断言 img 元素
//     isShowElImageViewer.value = true // 显示图片预览
//     imgUrls.value = [imgElement.src] // 图片地址
//     document.body.style.overflow = 'hidden' // 隐藏滚动条
//   }
// }

// 关闭图片预览
// const closeElImageViewer = () => {
//     isShowElImageViewer.value = false
//     document.body.style.overflow = "auto"
// }

// 更新分页配置
watchEffect(() => {
    // paginationData.value = pagination

    // 更新是否有数据
    hasData.value = pagination.records.length > 0
    // hasData.value = paginationData.value.records.length > 0
})

// 更新对话框状态
watchEffect(() => {
    addItemDialogVisibleStatus.value = addItemDialogVisible
    editItemDialogVisibleStatus.value = editItemDialogVisible
})

// 关闭对话框
const addItemHandleDialogClose = () => {
    emit("add-item-update-dialog-visible", false)
}

// 关闭对话框
const editItemHandleDialogClose = () => {
    emit("edit-item-update-dialog-visible", false)
}

// 监听搜索关键字变化
watch(
    () => searchStr,
    (newVal) => {
        search.value = newVal
    },
)

watch(
    () => search.value,
    (newVal) => {
        // 如果字数大于50则截取前50个字符
        if (newVal.length > 50) {
            newVal = newVal.substring(0, 50)
        }

        emit("update-search", newVal)
    },
)

// 执行搜索
const runSearch = () => {
    emit("run-search")
}

// 处理编辑
const handleEdit = (index: number, row: TableData) => {
    emit("edit-row", index, row)
    emit("edit-item-update-dialog-visible", true)
}

// 处理分类点击
const handleCategoryClick = (tagItemData: PostTag) => {
    emit("click-category", tagItemData)
}

// 处理标签点击
const handleTagClick = (tagItemData: PostTag) => {
    emit("click-tag", tagItemData)
}

// 处理作者点击
const handleAuthorClick = (author: User) => {
    emit("click-author", author)
}

// // 处理单个删除
// const handleDelete = (index: number, row: TableData) => {
//     deleteConfirmCommon(() => {
//         emit('delete-row', index, row)
//     })
// }

// 处理批量删除
const handleBatchDelete = () => {
    const selection = tableRef.value?.getSelectionRows()
    if (selection?.length) {
        deleteConfirmCommon(() => {
            emit("delete-rows", selection)
        })
    } else {
        ElMessage({
            type: MsgType.info,
            message: "请选择需要删除的数据",
        })
    }
}

// 已经选择的行
const checkedRows = ref<TableData[]>([])

// 处理选择变化
const handleSelectionChange = (rows: TableData[]) => {
    checkedRows.value = rows
    emit("update-selection", rows)
}

// 复选框状态变化
const handleCheckedGridChange = (rows: TableData[]) => {
    // 1、清空表格选择
    tableRef.value?.clearSelection()

    // 2、选中宫格选择
    rows.forEach((row) => {
        tableRef.value?.toggleRowSelection(row, true)
    })
}

// 宫格模式下是否选中
const isSelected = (row: TableData) => {
    return checkedRows.value.includes(row)
}
</script>

<style scoped lang="scss">
.container {
    margin: 10px;
}
.btns {
    display: flex;
    margin: 10px 0;
}

.search {
    width: 250px;
}

.grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 20px;
}

.grid-item {
    display: flex;
    justify-content: center;
    align-items: center;
    // border: 1px solid #dddddd;
    position: relative;
    .grid-item-selection-status {
        position: absolute;
        top: 0;
        right: 0;
        // display: none;
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

    // .operation {
    //     margin-left: 20px;
    // }
}

:deep(.el-checkbox) {
    margin: 0;
    padding: 0;
    height: 14px;
}
:deep(.el-checkbox__label) {
    display: none;
}

// 宫格 hover 显示编辑按钮
.grid-item:hover .grid-item-edit {
    display: block;
}

// 当选择选中时，显示选择状态
.grid-item.el-checkbox__inner {
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

.thumbnail {
    display: flex;
    justify-content: center;
    align-items: center;
    float: left;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    overflow: hidden;
}

.thumbnail-img {
    cursor: pointer;
    width: 100%;
    height: 100%;
    background-size: cover;
    transition: transform 0.3s ease;
}

.thumbnail:hover .thumbnail-img {
    transform: scale(1.2);
}

// 图片 img
img {
    display: block;
    max-width: 100%; // 确保图片不超过父元素宽度
    width: auto; // 根据图片的实际尺寸进行缩放
    margin: 4px auto;
    border-radius: 4px;
    // box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);     // 阴影
}

:deep(h4) {
    font-weight: 700;
}
</style>
