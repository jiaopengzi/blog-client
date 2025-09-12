<!--
 * FilePath    : blog-client\src\views\admin\component\main\account-key-item\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 账号密钥子表管理
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
            :is-show-edit="false"
            height="calc(100vh - 228px)"
            :loading-delete="loadingDelete"
            @update-current-page="updateCurrentPage"
            @update-page-size="updatePageSize"
            @delete-rows="deleteRows"
            @update-search="updateSearch"
            @run-search="runSearch"
        >
        </BaseTable>
    </section>
</template>

<script lang="ts" setup>
import { useHead } from "@unhead/vue"
import { reactive } from "vue"

import { type AccountKeyItemRes } from "@/api/accountKey/common"
import { deleteAccountKeyItemAPI, type DeleteAccountKeyItemRequest } from "@/api/accountKey/deleteItem"
import { viewAccountKeyItemAPI, type ViewAccountKeyItemRequest } from "@/api/accountKey/viewItem"
import { ResponseCode } from "@/api/response"
import type { TableColumn, TableData } from "@/components/common/base-table"
import BaseTable from "@/components/common/base-table/index.vue"
import { useBaseTable } from "@/components/hooks/useBaseTable"
import { useParams } from "@/components/hooks/useParams"
import { RouteNames } from "@/router"
import { adminMenuItemMap } from "@/views/admin/component/aside"

defineOptions({ name: RouteNames.AccountKeyItem })

useHead({
    title: adminMenuItemMap[RouteNames.AccountKeyItem].text,
})

const cols: TableColumn[] = reactive([
    {
        prop: "id",
        label: "ID",
        sortable: true,
        width: 80,
        align: "center",
    },
    {
        prop: "content",
        label: "内容",
        sortable: true,
        minWidth: 180,
        align: "center",
        isHeading: true,
    },
    // {
    //     prop: "product_id",
    //     label: "产品ID",
    //     sortable: true,
    //     width: 100,
    //     align: "center",
    // },
    {
        prop: "product_title",
        label: "产品标题",
        sortable: true,
        width: 180,
        align: "center",
    },
    {
        prop: "created_at",
        label: "创建时间",
        sortable: true,
        minWidth: 120,
        align: "center",
    },
    {
        prop: "email",
        label: "购买者邮箱",
        sortable: true,
        align: "center",
    },
    {
        prop: "purchase_user_id",
        label: "用户ID",
        sortable: true,
        align: "center",
        formatter: (row: TableData) => {
            if ("purchase_user_id" in row) {
                if (row.purchase_user_id === "0") {
                    return ""
                }
                return row.purchase_user_id
            }
        },
    },
    {
        prop: "purchase_order_id",
        label: "订单ID",
        sortable: true,
        align: "center",
        formatter: (row: TableData) => {
            if ("purchase_order_id" in row) {
                if (row.purchase_order_id === "0") {
                    return ""
                }
                return row.purchase_order_id
            }
        },
    },
    {
        prop: "purchase_time",
        label: "购买时间",
        sortable: true,
        align: "center",
        formatter: (row: TableData) => {
            if ("purchase_time" in row && row.purchase_time?.Valid) {
                return row.purchase_time.Time
            }
        },
    },
])

const queryParams = reactive<ViewAccountKeyItemRequest>({} as ViewAccountKeyItemRequest)

// 字符串类型的 key
const stringKeys: StringKeys<ViewAccountKeyItemRequest>[] = ["key_word"]

// 数字类型的 key
const numberKeys: NumberKeys<ViewAccountKeyItemRequest>[] = ["current_page", "page_size"]

// hooks 使用
const {
    addItemDialogVisible, // 添加对话框是否可见
    editItemDialogVisible, // 编辑对话框是否可见
    search, // 搜索关键字
    pagination, // 分页数据
    updateCurrentPage, // 更新当前页
    updatePageSize, // 更新每页显示条数
    updateSearch, // 更新搜索关键字
    deleteRows, // 删除行
    updateRouterPush,
    loadingDelete, // 删除时的加载状态
} = useBaseTable<AccountKeyItemRes, ViewAccountKeyItemRequest, DeleteAccountKeyItemRequest>({
    routeName: RouteNames.AccountKeyItem,
    viewAPI: viewAccountKeyItemAPI,
    viewResCode: ResponseCode.AccountKeyItemPaginateSuccess,
    queryParams,
    deleteAPI: deleteAccountKeyItemAPI,
    deleteResCode: ResponseCode.AccountKeyItemDeleteSuccess,
    options: { stringKeys, numberKeys },
})

// 执行搜索
const runSearch = async () => {
    await updateRouterPush()
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
