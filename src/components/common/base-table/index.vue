<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-01-23 15:24:45
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-03-26 20:44:42
 * @FilePath     : \blog-client\src\components\common\base-table\index.vue
 * @Description  : 基础表格
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->

<template>
    <div class="container">
        <div class="btns">
            <slot name="btns"></slot>
            <el-button v-if="props.isShowDeleteAll" type="danger" @click="handleBatchDelete">
                批量删除
            </el-button>
        </div>

        <el-table ref="tableRef" :data="paginationData.records" stripe max-height="700px"
            @selection-change="handleSelectionChange" style="width: 100%">
            <el-table-column type="selection" width="55" align="center" />

            <template v-for="(col, index) in tableColumn">
                <el-table-column v-if="col.isImg" :key="`img-${index}`" :width="col.width" :align="col.align">
                    <template #header>
                        <span>{{ col.label }}</span>
                    </template>
                    <template #default="scope">
                        <img v-if="scope.row.img" :src="scope.row.img.url"
                            :style="imgStyle(scope.row.img.width, scope.row.img.height, scope.row.img.imgFit)" />
                    </template>
                </el-table-column>

                <el-table-column v-else :key="index" :prop="col.prop" :label="col.label" :sortable="col.sortable"
                    :width="col.width" :align="col.align" />
            </template>

            <el-table-column width="160" align="center">
                <template #header>
                    <el-input v-model="search" size="small" placeholder="关键字搜索" />
                </template>
                <template #default="scope">
                    <el-button size="small" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
                @update:page-size="(val: number) => emit('update-page-size', val)"
                @update:page-sizes="(val: any) => emit('update-page-sizes', val)" />
        </div>
    </div>

    <!-- 弹窗 -->
    <el-dialog v-model="dialogVisibleStatus">
        <template #header>
            <slot name="add-item-title"></slot>
        </template>
        <slot name="add-item"></slot>
    </el-dialog>
</template>

<script lang="ts" setup>
import { ref, watchEffect, watch } from 'vue'
import type { ElTable } from 'element-plus'
import type { ImgFit, Pagination } from '@/components/common'
import { MsgType } from '@/components/common'
import type { TableData, TableColumn } from '@/components/common/base-table'
import { handleConfirmCommon } from '@/utils/confirm'

defineOptions({ name: 'BaseTable' })

const props = withDefaults(defineProps<{
    pagination: Pagination<TableData> // 分页配置
    tableColumn: TableColumn[] // 表格列配置
    dialogVisible: boolean // 对话框是否显示
    isShowDeleteAll: boolean // 是否显示批量删除按钮
    searchStr: string // 搜索关键字
}>(), {
    dialogVisible: false, // 默认对话框不显示
    isShowDeleteAll: false, // 默认不显示批量删除按钮
    searchStr: '' // 默认搜索关键字为空
})

const emit = defineEmits<{
    (event: 'update-current-page', value: number): void // 更新当前页
    (event: 'update-page-size', value: number): void // 更新每页显示条数
    (event: 'update-page-sizes', value: number): void // 更新每页显示条数
    (event: 'edit-row', index: number, row: TableData): void // 编辑行
    (event: 'delete-row', index: number, row: TableData): void // 删除行
    (event: 'delete-rows', rows: TableData[]): void // 删除多行
    (event: 'update-search', value: string): void // 更新搜索关键字
    (event: 'update-selection', rows: TableData[]): void // 更新选择
    (event: 'update-dialog-visible', value: boolean): void // 更新对话框状态
}>()

const tableRef = ref<InstanceType<typeof ElTable>>() //表格实例 
const search = ref(props.searchStr) // 搜索关键字
const paginationData = ref(props.pagination) // 分页配置
const dialogVisibleStatus = ref(false) // 对话框状态

// 更新分页配置
watchEffect(() => {
    paginationData.value = props.pagination
})

// 更新对话框状态
watchEffect(() => {
    dialogVisibleStatus.value = props.dialogVisible
    emit('update-dialog-visible', dialogVisibleStatus.value)
})


// 监听搜索关键字变化
watch(search, (newVal) => {
    emit('update-search', newVal)
    console.log('search====子组件:', newVal)
}, { immediate: false }) // 不立即执行 


// 处理编辑
const handleEdit = (index: number, row: TableData) => {
    emit('edit-row', index, row)
}

// 处理单个删除
const handleDelete = (index: number, row: TableData) => {
    handleConfirmCommon(() => {
        emit('delete-row', index, row)
    })
}

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

// 图片样式
function imgStyle(width: number, height: number, imgFit: ImgFit): Record<string, string> {
    return {
        width: width ? `${width}px` : '50px', // 宽度
        height: height ? `${height}px` : '50px', // 高度
        'object-fit': imgFit ? imgFit : 'cover' // 图片填充方式
    }
}

</script>

<style scoped lang="scss">
.container {
    margin: 10px;

    .btns {
        margin: 10px 0;
    }

    .pagination-block {
        display: flex;
        justify-content: center;
        margin-top: 10px;
    }


    .dialog-footer button:first-child {
        margin-right: 10px;
    }
}
</style>