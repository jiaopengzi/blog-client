<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-01-23 15:24:45
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-01-27 16:53:27
 * @FilePath     : \blog-client\src\components\common\base-table\index.vue
 * @Description  : 基础表格
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->

<template>
    <div class="container">
        <div class="btns">
            <el-button type="primary" @click="dialogVisible = true">
                新增
            </el-button>
            <el-button type="danger" @click="handleBatchDelete">
                批量删除
            </el-button>
        </div>

        <el-table ref="tableRef" :data="data" stripe max-height="500px" @selection-change="handleSelectionChange"
            style="width: 100%">
            <el-table-column type="selection" width="55" align="center" />

            <template v-for="(col, index) in tableColumn">
                <el-table-column v-if="col.isImg" :key="`img-${index}`" :width="col.width" :align="col.align">
                    <template #header>
                        <span>{{ col.label }}</span>
                    </template>
                    <template #default="scope">
                        <img v-if="scope.row.img" :src="scope.row.img.url" :style="imgStyle" />
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
            <el-pagination :hide-on-single-page="false" v-model:current-page="currentPage" v-model:page-size="pageSize"
                :background="true" layout="prev, pager, next, jumper, total, sizes" :total="totalPages"
                :page-sizes="pageSizes" @current-change="handleCurrentChange" @size-change="handleSizeChange" />
        </div>
    </div>
    <el-dialog v-model="dialogVisible">
        <template #header>
            <slot name="add-item-title"></slot>
        </template>
        <slot name="add-item"></slot>
    </el-dialog>
</template>
  
<script lang="ts" setup>
import { ref, watchEffect } from 'vue'
import type { ElTable } from 'element-plus'
import type { Pagination } from '@/components/common'
import { MsgTitle, MsgType } from '@/components/common'
import type { TableData, TableColumn } from '@/components/common/base-table'

defineOptions({ name: 'BaseTable' })

const props = defineProps<{
    data: TableData[]
    pagination: Pagination
    tableColumn: TableColumn[]
}>()

const emit = defineEmits<{
    (event: 'update-current-page', value: number): void
    (event: 'update-page-sizes', value: number): void
    (event: 'edit-row', index: number, row: TableData): void
    (event: 'delete-row', index: number, row: TableData): void
    (event: 'delete-rows', rows: TableData[]): void
    (event: 'update-search', value: string): void
    (event: 'update-selection', rows: TableData[]): void

}>()

const tableRef = ref<InstanceType<typeof ElTable>>() //表格实例 
const search = ref('') // 搜索关键字
const currentPage = ref(props.pagination.currentPage) // 当前页
const pageSize = ref(props.pagination.pageSize) // 每页条数
const totalPages = ref(props.pagination.totalPages) // 总页数
const pageSizes = ref(props.pagination.pageSizes) // 每页条数

const dialogVisible = ref(false)

// 处理分页变化
const handleCurrentChange = (val: number) => {
    emit('update-current-page', val)
}

// 处理每页条数变化
const handleSizeChange = (val: number) => {
    emit('update-page-sizes', val)
}

// 处理编辑
const handleEdit = (index: number, row: TableData) => {
    emit('edit-row', index, row)
}

// 处理删除
const handleDelete = (index: number, row: TableData) => {
    ElMessageBox.confirm(
        '是否需要删除?',
        MsgTitle[MsgType.warning],
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: MsgType.warning,
        }
    )
        .then(() => {
            emit('delete-row', index, row)
            ElMessage({
                type: MsgType.success,
                message: '删除完成',
            })

        })
        .catch(() => {
            ElMessage({
                type: MsgType.info,
                message: '取消删除',
            })
        })
}


// 处理批量删除
const handleBatchDelete = () => {
    const selection = tableRef.value?.getSelectionRows()
    if (selection?.length) {
        ElMessageBox.confirm(
            '是否需要删除?',
            MsgTitle[MsgType.warning],
            {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: MsgType.warning,
            }
        )
            .then(() => {

                emit('delete-rows', selection)
                ElMessage({
                    type: MsgType.success,
                    message: '删除完成',
                })
            })
            .catch(() => {
                ElMessage({
                    type: MsgType.info,
                    message: '取消删除',
                })
            })
    } else {
        ElMessage({
            type: MsgType.info,
            message: '请选择需要删除的数据',
        })
    }
}
// 监听搜索关键字变化
watchEffect(() => {
    emit('update-search', search.value)
})


// 处理选择变化
const handleSelectionChange = (rows: TableData[]) => {
    // 选择的行
    emit('update-selection', rows)
}

// 图片样式
function imgStyle(tableData: TableData): Record<string, string> {
    return {
        width: tableData.img?.width ? `${tableData.img?.width}px` : '50px', // 宽度
        height: tableData.img?.height ? `${tableData.img?.height}px` : '50px', // 高度
        'object-fit': tableData.img?.['object-fit'] ? tableData.img?.['object-fit'] : 'cover' // 圆角
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
  
  