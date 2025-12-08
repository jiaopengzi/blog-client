<!--
 * FilePath    : blog-client\src\views\admin\component\main\account-key-all\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 账号密钥管理
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
                <span class="dialog-title">新增账号密钥</span>
            </template>

            <template #add-item>
                <div class="dialog-add">
                    <AddTag @add-status="addStatus" />
                </div>
            </template>

            <!-- 编辑弹窗 -->
            <template #edit-item-title>
                <span class="dialog-title">编辑账号密钥</span>
            </template>

            <template #edit-item>
                <div class="dialog-edit">
                    <EditTag :edit-data="editData" @edit-status="editStatus" />
                </div>
            </template>
        </BaseTable>
    </section>
</template>

<script lang="ts" setup>
import { useHead } from "@unhead/vue"
import { reactive } from "vue"

import { type AccountKeyRes } from "@/api/accountKey/common"
import { deleteAccountKeyAPI, type DeleteAccountKeyRequest } from "@/api/accountKey/delete"
import { viewAccountKeyAPI, type ViewAccountKeyRequest } from "@/api/accountKey/view"
import { nullPgSqlDateTime } from "@/api/common"
import { ResponseCode } from "@/api/response"
import type { TableColumn, TableData } from "@/components/common/base-table"
import BaseTable from "@/components/common/base-table/index.vue"
import { useBaseTable } from "@/components/hooks/useBaseTable"
import { useParams } from "@/components/hooks/useParams"
import { RouteNames } from "@/router"
import { adminMenuItemMap } from "@/views/admin/component/aside"

import AddTag from "./component/add"
import EditTag from "./component/edit"
import { type ViewForm } from "./component/view"

defineOptions({ name: RouteNames.AccountKeyAll })

useHead({
    title: adminMenuItemMap[RouteNames.AccountKeyAll].text,
})

const cols: TableColumn[] = reactive([
    {
        prop: "id",
        label: "ID",
        sortable: true,
        width: 100,
        align: "center",
        isCopyText: true,
    },
    {
        prop: "title",
        label: "标题",
        sortable: true,
        minWidth: 180,
        align: "center",
        isHeading: true,
    },
    {
        prop: "price",
        label: "价格(元)",
        sortable: true,
        minWidth: 120,
        align: "center",
    },
    {
        prop: "all_quantity",
        label: "总数量",
        sortable: true,
        width: 120,
        align: "center",
    },
    {
        prop: "sale_quantity",
        label: "售出",
        sortable: true,
        width: 120,
        align: "center",
    },
    {
        prop: "inventory",
        label: "库存",
        sortable: true,
        width: 120,
        align: "center",
        formatter: (row: TableData) => {
            return "sale_quantity" in row && "all_quantity" in row ? row.all_quantity - row.sale_quantity : "-"
        },
    },
    {
        prop: "created_at",
        label: "创建时间",
        sortable: true,
        minWidth: 120,
        align: "center",
    },
    {
        prop: "description",
        label: "描述",
        sortable: true,
        align: "center",
        formatter: (row: TableData) => {
            return ("description" in row && row.description) || "-"
        },
    },
])

const queryParams = reactive<ViewAccountKeyRequest>({} as ViewAccountKeyRequest)

// 字符串类型的 key
const stringKeys: StringKeys<ViewAccountKeyRequest>[] = ["key_word"]

// 数字类型的 key
const numberKeys: NumberKeys<ViewAccountKeyRequest>[] = ["current_page", "page_size"]

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
} = useBaseTable<AccountKeyRes, ViewAccountKeyRequest, DeleteAccountKeyRequest>({
    routeName: RouteNames.AccountKeyAll,
    viewAPI: viewAccountKeyAPI,
    viewResCode: ResponseCode.AccountKeyPaginateSuccess,
    queryParams,
    deleteAPI: deleteAccountKeyAPI,
    deleteResCode: ResponseCode.AccountKeyDeleteSuccess,
    options: { stringKeys, numberKeys },
})

// 执行搜索
const runSearch = async () => {
    await updateRouterPush()
}

// 需要编辑的用户ID
const editData = reactive<ViewForm>({
    purchase_start: nullPgSqlDateTime(), // 开始购买时间
    purchase_end: nullPgSqlDateTime(), // 结束购买时间
})

const editRow = (index: number, row: TableData) => {
    if ("id" in row) {
        editData.id = row.id.toString()
    }
    if ("title" in row) {
        editData.title = row.title
    }
    if ("price" in row) {
        editData.price = Number(row.price)
    }
    if ("description" in row) {
        editData.description = row.description
    }
    if ("purchase_min" in row) {
        editData.purchase_min = row.purchase_min
    }
    if ("purchase_max" in row && row.purchase_max > 0) {
        editData.purchase_max = row.purchase_max
    }
    if ("user_max" in row && row.user_max > 0) {
        editData.user_max = row.user_max
    }
    if ("purchase_start" in row) {
        editData.purchase_start = row.purchase_start?.Valid ? row.purchase_start : nullPgSqlDateTime()
    }
    if ("purchase_end" in row) {
        editData.purchase_end = row.purchase_end?.Valid ? row.purchase_end : nullPgSqlDateTime()
    }
    // if ("pay_roles" in row) {
    //     editData.pay_roles = row.pay_roles || []
    // }

    // 清空明细
    editData.itemStr = ""
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
