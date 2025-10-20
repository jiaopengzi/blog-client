<!--
 * FilePath    : blog-client\src\views\user-info\component\order\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 用户订单列表
-->
<template>
    <section>
        <BaseTable
            :pagination="pagination"
            :table-column="cols"
            :edit-item-dialog-visible="editItemDialogVisible"
            :is-show-search="false"
            :is-show-edit="true"
            row-operation-text="查看"
            @update-current-page="updateCurrentPage"
            @update-page-size="updatePageSize"
            @edit-row="editRow"
            @edit-item-update-dialog-visible="editItemUpdateDialogVisible"
        >
            <!-- 编辑弹窗 -->
            <template #edit-item-title>
                <span class="dialog-title">订单详情</span>
            </template>

            <template #edit-item>
                <div class="dialog-edit">
                    <OrderDetail :data="editData" :is-admin="false" @edit-status="handleEditStatus" />
                </div>
            </template>
        </BaseTable>
    </section>
</template>

<script lang="ts" setup>
import { useHead } from "@unhead/vue"
import { reactive, ref } from "vue"

import { type OrderGetByIDRes, OrderStatus, OrderStatusDisplay } from "@/api/order/common"
import { getOrderPaginateAPI, type OrderPaginationRequest } from "@/api/order/getPaginate"
import { ResponseCode } from "@/api/response"
import type { TableColumn, TableData } from "@/components/common/base-table"
import BaseTable from "@/components/common/base-table/index.vue"
import OrderDetail from "@/components/common/order-detail"
import { useBaseTable } from "@/components/hooks/useBaseTable"
import { RouteNames } from "@/router"

import { UserInfoHash } from "../types"

defineOptions({ name: "UserInfoOrder" })

useHead({
    title: "用户信息-订单",
})

const cols: TableColumn[] = reactive([
    {
        prop: "description",
        label: "产品",
        sortable: true,
        minWidth: 180,
        align: "center",
        isHeading: true,
    },
    {
        prop: "total_amount",
        label: "金额",
        sortable: true,
        minWidth: 100,
        align: "center",
        formatter: (row: TableData) => {
            if ("total_amount" in row) {
                return `${(row.total_amount / 100).toFixed(2)} 元`
            }
        },
    },
    {
        prop: "status",
        label: "订单状态",
        sortable: true,
        minWidth: 100,
        align: "center",
        formatter: (row: TableData) => {
            if ("status" in row) {
                return OrderStatusDisplay[row.status as OrderStatus]
            }
        },
    },
    {
        prop: "created_at",
        label: "下单时间",
        sortable: true,
        minWidth: 80,
        align: "center",
    },
])

// 查询参数
const queryParams: OrderPaginationRequest = reactive({} as OrderPaginationRequest)

// 数字类型的 key
const numberKeys: NumberKeys<OrderPaginationRequest>[] = ["current_page", "page_size"]

// hooks 使用
const {
    editItemDialogVisible, // 编辑对话框是否可见
    toggleEditDialog, // 切换编辑对话框
    pagination, // 分页数据
    updateCurrentPage, // 更新当前页
    updatePageSize, // 更新每页显示条数
    editStatus, // 编辑状态
    editItemUpdateDialogVisible, // 编辑对话框
} = useBaseTable<OrderGetByIDRes, OrderPaginationRequest, never>({
    routeName: RouteNames.UserInfo,
    viewAPI: getOrderPaginateAPI,
    viewResCode: ResponseCode.OrderGetPaginateSuccess,
    queryParams,
    options: { numberKeys, hash: UserInfoHash.Order },
})

const editData = ref<OrderGetByIDRes>({} as OrderGetByIDRes)

const editRow = (index: number, row: TableData) => {
    editData.value = row as OrderGetByIDRes
    toggleEditDialog()
}

const handleEditStatus = async (status: boolean) => {
    await editStatus(status)
}
</script>
