<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-01-23 15:24:45
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-01-25 15:21:19
 * @FilePath     : \blog-client\src\components\common\base-table\index.vue
 * @Description  : 基础表格
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->

<template>
    <div class="container">
        <div class="btns">
            <el-button type="primary" @click="dialogFormVisible = true">
                新增项目
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

        <el-dialog v-model="dialogFormVisible" title="编辑">
            <el-form :model="form">
                <el-form-item label="图片" :label-width="formLabelWidth">
                    <el-input v-model="form.name" autocomplete="off" />
                </el-form-item>
                <el-form-item label="名称" :label-width="formLabelWidth">
                    <el-input v-model="form.name" autocomplete="off" />
                </el-form-item>
                <el-form-item label="描述" :label-width="formLabelWidth">
                    <el-input v-model="form.name" autocomplete="off" />
                </el-form-item>
                <el-form-item label="父级分类ID" :label-width="formLabelWidth">
                    <el-input v-model="form.name" autocomplete="off" />
                </el-form-item>
                <el-form-item label="父级分类" :label-width="formLabelWidth">
                    <el-select v-model="form.region" placeholder="选择父级分类">
                        <el-option label="父级分类1" value="shanghai" />
                        <el-option label="父级分类2" value="beijing" />
                    </el-select>
                </el-form-item>
                <el-form-item label="别名" :label-width="formLabelWidth">
                    <el-input v-model="form.name" autocomplete="off" />
                </el-form-item>

            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取消</el-button>
                    <el-button type="primary" @click="dialogFormVisible = false">保存</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>
  
<script lang="ts" setup>
import { ref, reactive, watchEffect } from 'vue'
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
    (event: 'update-search', value: string): void
    (event: 'update-selection', value: TableData[]): void
}>()

const tableRef = ref<InstanceType<typeof ElTable>>() //表格实例 
const search = ref('') // 搜索关键字
const currentPage = ref(props.pagination.currentPage) // 当前页
const pageSize = ref(props.pagination.pageSize) // 每页条数
const totalPages = ref(props.pagination.totalPages) // 总页数
const pageSizes = ref(props.pagination.pageSizes) // 每页条数

const dialogFormVisible = ref(false)
const formLabelWidth = '140px'


const form = reactive({
    name: '',
    region: '',
    date1: '',
    date2: '',
    delivery: false,
    type: [],
    resource: '',
    desc: '',
})


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

// 监听搜索关键字变化
watchEffect(() => {
    emit('update-search', search.value)
})


// 处理选择变化
const handleSelectionChange = (val: TableData[]) => {
    // 选择的行
    emit('update-selection', val)
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
  