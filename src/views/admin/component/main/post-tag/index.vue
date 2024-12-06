<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-11-04 16:21:40
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-06 17:23:14
 * @FilePath     : \blog-client\src\views\admin\component\main\post-tag\index.vue
 * @Description  : 标签管理
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->

<template>
    <BaseTable
        :pagination="pagination"
        :table-column="cols"
        :add-item-dialog-visible="addItemDialogVisible"
        :edit-item-dialog-visible="editItemDialogVisible"
        :is-show-delete-all="true"
        :is-show-search="true"
        :search-str="search"
        :is-show-edit="true"
        height="calc(100vh - 228px)"
        @update-current-page="updateCurrentPage"
        @update-page-size="updatePageSize"
        @edit-row="editRow"
        @delete-rows="deleteRows"
        @update-search="updateSearch"
        @run-search="runSearch"
        @add-item-update-dialog-visible="addItemUpdateDialogVisible"
        @edit-item-update-dialog-visible="editItemUpdateDialogVisible"
    >
        <template #btns>
            <el-button type="primary" @click="toggleAddDialog"> 新增 </el-button>
        </template>

        <!-- 新增弹窗 -->
        <template #add-item-title>
            <span class="dialog-title">新增标签</span>
        </template>

        <template #add-item>
            <div class="dialog-add">
                <AddTag @add-status="addStatus" />
            </div>
        </template>

        <!-- 编辑弹窗 -->
        <template #edit-item-title>
            <span class="dialog-title">编辑标签</span>
        </template>

        <template #edit-item>
            <div class="dialog-edit">
                <EditTag :edit-data="editData" @edit-status="editStatus" />
            </div>
        </template>
    </BaseTable>
</template>

<script lang="ts" setup>
import { reactive } from "vue"
import type { TableData, TableColumn } from "@/components/common/base-table"
import { AdminSideMenu } from "@/views/admin/component/aside"
import { type PostTag } from "@/api/postTag/view"
import { viewPostTagAPI, type ViewPostTagRequest } from "@/api/postTag/view"
import { ResponseCode } from "@/api/responseCode"
import BaseTable from "@/components/common/base-table"
import AddTag from "./component/add"
import EditTag from "./component/edit"
import { type ViewForm } from "./component/view"
import { type DeletePostTagRequest, deletePostTagAPI } from "@/api/postTag/delete"
import { useBaseTable } from "@/components/hooks/useBaseTable"
import { useParams } from "@/components/hooks/useParams"

defineOptions({ name: AdminSideMenu.PostTag })

const cols: TableColumn[] = reactive([
    {
        prop: "id",
        label: "ID",
        sortable: true,
        width: 100,
        align: "center",
    },
    {
        prop: "thumbnail",
        label: "图片",
        width: 130,
        align: "center",
        isImg: true,
    },
    {
        prop: "name",
        label: "标签名称",
        sortable: true,
        minWidth: 150,
        align: "center",
    },
    {
        prop: "slug",
        label: "别名",
        sortable: true,
        width: 200,
        align: "center",
    },
    {
        prop: "created_at",
        label: "创建时间",
        sortable: true,
        minWidth: 180,
        align: "center",
    },
    {
        prop: "description",
        label: "描述",
        sortable: true,
        width: 200,
        align: "center",
        formatter: (row: TableData) => {
            return ("description" in row && row.description) || "-"
        },
    },
    {
        prop: "post_count",
        label: "文章数量",
        sortable: true,
        minWidth: 120,
        align: "center",
    },
    {
        prop: "order",
        label: "排序",
        sortable: true,
        minWidth: 120,
        align: "center",
    },
])

const queryParams = reactive<ViewPostTagRequest>({} as ViewPostTagRequest)

// hooks 使用
const {
    addItemDialogVisible, // 添加对话框是否可见
    editItemDialogVisible, // 编辑对话框是否可见
    search, // 搜索关键字
    toggleAddDialog, // 切换添加对话框
    toggleEditDialog, // 切换编辑对话框
    pagination, // 分页数据
    updateCurrentPage, // 更新当前页
    updatePageSize, // 更新每页显示条数
    updateSearch, // 更新搜索关键字
    addStatus, // 添加状态
    editStatus, // 编辑状态
    addItemUpdateDialogVisible, // 新增对话框
    editItemUpdateDialogVisible, // 编辑对话框
    deleteRows, // 删除行
    updateQueryAndRouter,
} = useBaseTable<PostTag, ViewPostTagRequest, DeletePostTagRequest>(
    AdminSideMenu.PostTag,
    viewPostTagAPI,
    ResponseCode.PostTagViewSuccess,
    deletePostTagAPI,
    ResponseCode.PostTagDeleteSuccess,
    queryParams,
)

// 执行搜索
const runSearch = () => {
    updateQueryAndRouter(true)
}

// 需要编辑的用户ID
const editData = reactive<ViewForm>({
    id: "",
    name: "",
    slug: "",
})

const editRow = (index: number, row: TableData) => {
    console.log("04============", index, row)
    if ("id" in row) {
        editData.id = row.id.toString()
    }
    if ("name" in row) {
        editData.name = row.name
    }
    if ("slug" in row) {
        editData.slug = row.slug || ""
    }
    if ("description" in row) {
        editData.description = row.description
    }
    if ("img" in row) {
        editData.thumbnail = row.img?.url
    }
    if ("order" in row && row.order !== "") {
        editData.order = row.order
    }
    toggleEditDialog()
}

// 在加载前将 params 解析回对应的响应式变量中
useParams(queryParams, search, pagination)
</script>

<style scoped lang="scss">
.dialog-title {
    font-size: 20px;
    font-weight: 700;
}

.dialog-add,
.dialog-edit {
    width: 100%;
    // 浮动 水平居中
    display: flex;
    justify-content: center;
}
</style>
