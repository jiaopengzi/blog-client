<!--
 * FilePath    : blog-client\src\views\admin\component\main\links\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 链接管理
-->

<template>
    <section>
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
            :loading-delete="loadingDelete"
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
                <span class="dialog-title">新增链接</span>
            </template>

            <template #add-item>
                <div class="dialog-add">
                    <AddLink @add-status="addStatus" />
                </div>
            </template>

            <!-- 编辑弹窗 -->
            <template #edit-item-title>
                <span class="dialog-title">编辑链接</span>
            </template>

            <template #edit-item>
                <div class="dialog-edit">
                    <EditLink :edit-data="editData" @edit-status="editStatus" />
                </div>
            </template>
        </BaseTable>
    </section>
</template>

<script lang="ts" setup>
import { useHead } from "@unhead/vue"
import { reactive } from "vue"

import { type LinkRes, LinkStatusCode, LinkStatusDisplay } from "@/api/link/common"
import { deleteLinkAPI, type DeleteLinkRequest } from "@/api/link/delete"
import { viewLinkAdminAPI } from "@/api/link/view"
import type { PaginationRequest } from "@/api/request"
import { ResponseCode } from "@/api/response"
import type { TableColumn, TableData } from "@/components/common/base-table"
import BaseTable from "@/components/common/base-table"
import { useBaseTable } from "@/components/hooks/useBaseTable"
import { useParams } from "@/components/hooks/useParams"
import { RouteNames } from "@/router"
import { adminMenuItemMap } from "@/views/admin/component/aside"

import AddLink from "./component/add"
import EditLink from "./component/edit"
import { type ViewForm } from "./component/view"

defineOptions({ name: RouteNames.Links })

useHead({
    title: adminMenuItemMap[RouteNames.Links].text,
})

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
        label: "链接名称",
        sortable: true,
        minWidth: 150,
        align: "center",
    },
    {
        prop: "url",
        label: "url",
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
        prop: "status",
        label: "状态",
        sortable: true,
        minWidth: 120,
        align: "center",
        formatter: (row: TableData) => {
            if ("status" in row) {
                const display = LinkStatusDisplay[row.status as LinkStatusCode]
                return display
            }
        },
    },
    {
        prop: "order",
        label: "排序",
        sortable: true,
        minWidth: 120,
        align: "center",
    },
])

const queryParams = reactive<PaginationRequest>({} as PaginationRequest)

// 字符串类型的 key
const stringKeys: StringKeys<PaginationRequest>[] = ["key_word"]

// 数字类型的 key
const numberKeys: NumberKeys<PaginationRequest>[] = ["current_page", "page_size"]

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
    updateRouterPush,
    loadingDelete, // 删除时的加载状态
} = useBaseTable<LinkRes, PaginationRequest, DeleteLinkRequest>(
    RouteNames.Links,
    viewLinkAdminAPI,
    ResponseCode.LinkViewSuccess,
    deleteLinkAPI,
    ResponseCode.LinkDeleteSuccess,
    queryParams,
    { stringKeys, numberKeys },
)

// 执行搜索
const runSearch = async () => {
    await updateRouterPush()
}

// 需要编辑的用户ID
const editData = reactive<ViewForm>({
    id: "",
    name: "", // 名称
    url: "", // 链接地址
    thumbnail: "", // 图片URL
    description: "", // 描述信息
    status: LinkStatusCode.Hidden, // 状态，默认不显示
})

const editRow = (index: number, row: TableData) => {
    if ("id" in row) {
        editData.id = row.id.toString()
    }
    if ("name" in row) {
        editData.name = row.name
    }
    if ("url" in row) {
        editData.url = row.url
    }
    if ("img" in row) {
        editData.thumbnail = row.img?.url || ""
    }
    if ("description" in row) {
        editData.description = row.description
    }
    if ("status" in row) {
        editData.status = row.status as LinkStatusCode
    }
    if ("order" in row && row.order !== "") {
        editData.order = row.order
    }
    toggleEditDialog()
}

// 在加载前将 params 解析回对应的响应式变量中
useParams(queryParams, pagination, search)
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
