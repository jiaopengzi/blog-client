<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-01-23 15:24:45
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-10-06 16:34:11
 * @FilePath     : \blog-client\src\components\common\base-table\index.vue
 * @Description  : 基础表格
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->

<template>
    <!-- 参考:https://github.com/element-plus/element-plus/blob/dev/packages/components/image/src/image.vue -->
    <el-image-viewer v-if="isShowElImageViewer" @close="closeElImageViewer" :url-list="imgUrls" />
    <div class="container">
        <div class="btns">
            <!-- 按钮 -->
            <slot name="btns"></slot>
            <el-button v-if="isShowDeleteAll" type="danger" @click="handleBatchDelete">
                删除
            </el-button>
            <!-- 分类 -->
            <slot name="category"></slot>
        </div>
        <!-- 搜索 -->
        <el-input v-if="isShowSearch" class="search" v-model="search" size="default" placeholder="关键字搜索" />

        <el-table ref="tableRef" :data="paginationData.records" stripe max-height="700px"
            @selection-change="handleSelectionChange" style="width: 100%">
            <el-table-column type="selection" width="55" align="center" />

            <template v-for="(col, index) in tableColumn">
                <el-table-column v-if="col.isImg" :key="`img-${index}`" :width="col.width" :align="col.align">
                    <template #header>
                        <span>{{ col.label }}</span>
                    </template>
                    <template #default="scope">
                        <div class="thumbnail" @click="handleDelegateClick">
                            <img class="thumbnail-img" v-if="scope.row.img?.url" :src="scope.row.img.url"
                                :style="imgStyle(scope.row.img?.width, scope.row.img?.height, scope.row.img?.imgFit)" />
                            <Icon v-else-if="scope.row.img?.iconKeyName" :name="scope.row.img?.iconKeyName"
                                :style="iconStyle(scope.row.img?.fontSize)" />
                        </div>
                    </template>
                </el-table-column>
                <el-table-column v-else-if="col.formatter" :key="`formatter-${index}`" :label="col.label"
                    :sortable="col.sortable" :width="col.width" :align="col.align">
                    <template #header>
                        <span>{{ col.label }}</span>
                    </template>
                    <template #default="scope">
                        <span>{{ col.formatter(scope.row) }}</span>
                    </template>
                </el-table-column>
                <el-table-column v-else :key="index" :prop="col.prop" :label="col.label" :sortable="col.sortable"
                    :width="col.width" :align="col.align" />
            </template>

            <el-table-column v-if="isShowEdit" width="160" align="center">
                <template #header>
                    <span>操作</span>
                </template>
                <template #default="scope">
                    <el-button size="small" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <!-- <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button> -->
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="pagination-block">
            <el-pagination v-model:current-page="paginationData.current_page"
                v-model:page-size="paginationData.page_size" :page-sizes="paginationData.page_sizes"
                :page-count="paginationData.page_count" :total="paginationData.total" :background="true"
                layout="total, prev, pager, next, jumper, sizes"
                @update:current-page="(val: number) => emit('update-current-page', val)"
                @update:page-size="(val: number) => emit('update-page-size', val)" />
        </div>
    </div>

    <!-- 弹窗 add -->
    <el-dialog v-model="addItemDialogVisibleStatus" @close="addItemHandleDialogClose"
        v-bind="{ width: addWidth, top: addTop }">
        <template #header>
            <slot name="add-item-title"></slot>
        </template>
        <slot name="add-item"></slot>
    </el-dialog>
    <!-- 弹窗 edit -->
    <el-dialog v-model="editItemDialogVisibleStatus" @close="editItemHandleDialogClose"
        v-bind="{ width: editWidth, top: editTop }">
        <template #header>
            <slot name="edit-item-title"></slot>
        </template>
        <slot name="edit-item"></slot>
    </el-dialog>

</template>

<script lang="ts" setup>
import { ref, watchEffect, watch, useTemplateRef } from 'vue'
import type { ElTable } from 'element-plus'
import type { Pagination } from '@/components/common'
import { MsgType } from '@/components/common'
import type { TableData, TableColumn } from '@/components/common/base-table'
import { handleConfirmCommon } from '@/utils/confirm'
import { imgStyle, iconStyle } from '@/utils/style'

defineOptions({ name: 'BaseTable' })

// 数据
const {
    pagination,
    tableColumn,
    addItemDialogVisible = false, // 默认添加对话框不显示
    editItemDialogVisible = false, // 默认编辑对话框不显示
    isShowDeleteAll = false, // 默认不显示批量删除按钮
    isShowEdit = false, // 默认不显示批量删除按钮
    isShowSearch = false, // 默认不显示批量删除按钮
    searchStr = '', // 默认搜索关键字为空
} = defineProps<{
    pagination: Pagination<TableData> // 分页配置
    tableColumn: TableColumn[] // 表格列配置
    addItemDialogVisible?: boolean // 对话框是否显示
    editItemDialogVisible?: boolean // 对话框是否显示
    isShowDeleteAll?: boolean // 是否显示批量删除按钮
    isShowEdit?: boolean // 是否显示每行编辑按钮
    isShowSearch?: boolean // 是否显示每行编辑按钮
    searchStr?: string // 搜索关键字
    addWidth?: string // 添加对话框宽度
    addTop?: string // 添加对话框距离顶部距离
    editWidth?: string // 编辑对话框宽度
    editTop?: string // 编辑对话框距离顶部距离
}>()


// 事件
const emit = defineEmits<{
    (event: 'update-current-page', value: number): void // 更新当前页
    (event: 'update-page-size', value: number): void // 更新每页显示条数
    (event: 'edit-row', index: number, row: TableData): void // 编辑行
    (event: 'delete-row', index: number, row: TableData): void // 删除行
    (event: 'delete-rows', rows: TableData[]): void // 删除多行
    (event: 'update-search', value: string): void // 更新搜索关键字
    (event: 'update-selection', rows: TableData[]): void // 更新选择
    (event: 'add-item-update-dialog-visible', value: boolean): void // 更新添加元素对话框状态
    (event: 'edit-item-update-dialog-visible', value: boolean): void // 更新编辑元素对话框状态
}>()

const tableRef = useTemplateRef<InstanceType<typeof ElTable>>("tableRef") //表格实例 
const search = ref(searchStr) // 搜索关键字
const paginationData = ref(pagination) // 分页配置
const addItemDialogVisibleStatus = ref(false) // 对话框状态
const editItemDialogVisibleStatus = ref(false) // 对话框状态

const isShowElImageViewer = ref(false)
const imgUrls = ref<string[]>([])


// 点击事件委托,图片预览.
const handleDelegateClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target.tagName.toLowerCase() === 'img' && 'src' in target) {
        // img 图片
        const imgElement = target as HTMLImageElement // 断言 img 元素
        isShowElImageViewer.value = true // 显示图片预览
        imgUrls.value = [imgElement.src] // 图片地址
        document.body.style.overflow = 'hidden' // 隐藏滚动条
    }
}

// 关闭图片预览
const closeElImageViewer = () => {
    isShowElImageViewer.value = false
    document.body.style.overflow = 'auto'
}

// 更新分页配置
watchEffect(() => {
    paginationData.value = pagination
})

// 更新对话框状态
watchEffect(() => {
    addItemDialogVisibleStatus.value = addItemDialogVisible
    editItemDialogVisibleStatus.value = editItemDialogVisible
})

// 关闭对话框
const addItemHandleDialogClose = () => {
    emit('add-item-update-dialog-visible', false)
}

// 关闭对话框
const editItemHandleDialogClose = () => {
    emit('edit-item-update-dialog-visible', false)
}

// 监听搜索关键字变化
watch(search, (newVal) => {
    emit('update-search', newVal)
    console.log('search====子组件:', newVal)
}, { immediate: false }) // 不立即执行 


// 处理编辑
const handleEdit = (index: number, row: TableData) => {
    emit('edit-row', index, row)
    emit('edit-item-update-dialog-visible', true)
}

// // 处理单个删除
// const handleDelete = (index: number, row: TableData) => {
//     handleConfirmCommon(() => {
//         emit('delete-row', index, row)
//     })
// }

// 处理批量删除
const handleBatchDelete = () => {
    const selection = tableRef.value?.getSelectionRows()
    if (selection?.length) {
        handleConfirmCommon(() => {
            emit('delete-rows', selection)
        })
    } else {
        ElMessage({
            type: MsgType.info,
            message: '请选择需要删除的数据',
        })
    }
}

// 处理选择变化
const handleSelectionChange = (rows: TableData[]) => {
    // 选择的行
    emit('update-selection', rows)
}

</script>

<style scoped lang="scss">
.container {
    margin: 10px;

    .btns {
        margin: 10px 0;
    }

    .search {
        margin: 0 0 10px 0;
        width: 250px;

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
        float: left;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        overflow: hidden;
    }

    .thumbnail-img {
        width: 100%;
        height: 100%;
        background-size: cover;
        transition: transform 0.3s ease;
    }

    .thumbnail:hover .thumbnail-img {
        transform: scale(1.2);
    }


}

// 图片 img
img {
    display: block;
    max-width: 100%; // 确保图片不超过父元素宽度
    width: auto; // 根据图片的实际尺寸进行缩放
    margin: 4px auto;
    border-radius: 4px;
    cursor: pointer;
    // box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);     // 阴影
}
</style>