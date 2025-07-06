<!--
 * FilePath    : blog-client\src\views\admin\component\main\membership\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 会员管理
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
            height="calc(100vh - 270px)"
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

            <template #category>
                <!-- v-for 循环 membershipCountGroup生成 按钮 -->
                <div ref="categoryRef" class="category-group">
                    <el-button
                        v-for="item in membershipCountGroup"
                        :key="item.key"
                        :class="{ active: item.key === activeGroup }"
                        @click="handleMembershipCountByGroup(item)"
                    >
                        {{ item.display }} ({{ item.count }})
                    </el-button>
                </div>
            </template>
            <!-- 新增弹窗 -->
            <template #add-item-title>
                <span class="dialog-title">新增会员</span>
            </template>

            <template #add-item>
                <div class="dialog-add">
                    <AddMembership @add-status="addStatus" />
                </div>
            </template>

            <!-- 编辑弹窗 -->
            <template #edit-item-title>
                <span class="dialog-title">编辑会员</span>
            </template>

            <template #edit-item>
                <div class="dialog-edit">
                    <EditMembership :edit-data="editData" @edit-status="editStatus" />
                </div>
            </template>
        </BaseTable>
    </section>
</template>

<script lang="ts" setup>
import { useHead } from "@unhead/vue"
import { reactive, watch } from "vue"

import { type MembershipRes, MembershipStatus, MembershipStatusDisplay } from "@/api/membership/common"
import { deleteMembershipAPI, type DeleteMembershipRequest } from "@/api/membership/delete"
import { viewMembershipAPI, type ViewMembershipRequest } from "@/api/membership/view"
import { type QueryParamsRecord } from "@/api/request"
import { ResponseCode } from "@/api/response"
import type { TableColumn, TableData } from "@/components/common/base-table"
import BaseTable from "@/components/common/base-table"
import { useBaseTable } from "@/components/hooks/useBaseTable"
import { useParams } from "@/components/hooks/useParams"
import { RouteNames } from "@/router"
import { adminMenuItemMap } from "@/views/admin/component/aside"

import AddMembership from "./component/add"
import EditMembership from "./component/edit"
import { type ViewForm } from "./component/view"
import { useHeader } from "./hooks"
import { groupList, type GroupType, type MembershipCountGroupItem, queryKey } from "./types"

defineOptions({ name: RouteNames.Membership })

useHead({
    title: adminMenuItemMap[RouteNames.Membership].text,
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
        prop: "role",
        label: "会员角色",
        sortable: true,
        minWidth: 150,
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
        prop: "status",
        label: "状态",
        sortable: true,
        minWidth: 120,
        align: "center",
        formatter: (row: TableData) => {
            if ("status" in row) {
                return MembershipStatusDisplay[row.status as MembershipStatus]
            }
        },
    },
    {
        prop: "price",
        label: "价格(元)",
        sortable: true,
        minWidth: 120,
        align: "center",
    },
    {
        prop: "duration_time",
        label: "有效时间(秒)",
        sortable: true,
        minWidth: 150,
        align: "center",
    },
    {
        prop: "purchase_discount",
        label: "购买折扣(0-100)",
        sortable: true,
        minWidth: 150,
        align: "center",
    },
    {
        prop: "download_count",
        label: "下载次数",
        sortable: true,
        minWidth: 150,
        align: "center",
    },
    {
        prop: "watch_count",
        label: "观看次数",
        sortable: true,
        minWidth: 150,
        align: "center",
    },
    {
        prop: "description",
        label: "描述",
        minWidth: 200,
        align: "center",
    },
])

// 获取头部数据
const { membershipCountGroup, allGroup, activeGroup, getMembershipCountStatus } = useHeader()

const queryParams = reactive<ViewMembershipRequest>({} as ViewMembershipRequest)

// 字符串类型的 key
const stringKeys: StringKeys<ViewMembershipRequest>[] = ["key_word"]

// 数字类型的 key
const numberKeys: NumberKeys<ViewMembershipRequest>[] = ["current_page", "page_size", "status"]

// 不需要请求的参数
const noRequestKeys: QueryParamsRecord<queryKey> = { [queryKey.Group]: allGroup }

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
} = useBaseTable<MembershipRes, ViewMembershipRequest, DeleteMembershipRequest>(
    RouteNames.Membership,
    viewMembershipAPI,
    ResponseCode.MembershipViewSuccess,
    deleteMembershipAPI,
    ResponseCode.MembershipDeleteSuccess,
    queryParams,
    { stringKeys, numberKeys, noRequestKeys, refreshPromiseFns: [getMembershipCountStatus] },
)

// 执行搜索
const runSearch = async () => {
    await updateRouterPush()
}

// 处理 membershipCountGroup 点击事件
const handleMembershipCountByGroup = async (item: MembershipCountGroupItem) => {
    activeGroup.value = item.key
    // 清空重置
    Object.keys(queryParams).forEach((key) => {
        if (groupList.includes(key as GroupType)) {
            delete queryParams[key as keyof ViewMembershipRequest]
        }
    })

    // 配置查询参数
    if (item.group === queryKey.Group) {
        Object.assign(queryParams, { [queryKey.Group]: item.key })
    }

    if (item.group === queryKey.Status) {
        queryParams[queryKey.Status] = Number(item.key)
    }

    Object.assign(queryParams, {
        [queryKey.KeyWord]: search.value,
    })

    await updateRouterPush()
}

// 需要编辑的用户ID
const editData = reactive<ViewForm>({
    id: "",
    price: "", // 价格(元)
    role: "",
    duration_time: "0", // 有效时间(0表示永久有效)
    purchase_discount: 0, // 购买折扣(0-100)
    status: MembershipStatus.Disabled,
})

const editRow = (index: number, row: TableData) => {
    if ("id" in row) {
        editData.id = row.id.toString()
    }
    if ("role" in row) {
        editData.role = row.role
    }
    if ("price" in row) {
        editData.price = row.price
    }
    if ("duration_time" in row) {
        editData.duration_time = row.duration_time
    }
    if ("purchase_discount" in row) {
        editData.purchase_discount = row.purchase_discount
    }
    if ("download_count" in row) {
        editData.download_count = row.download_count
    }
    if ("watch_count" in row) {
        editData.watch_count = row.watch_count
    }
    if ("status" in row) {
        editData.status = row.status as MembershipStatus
    }
    if ("description" in row) {
        editData.description = row.description
    }

    toggleEditDialog()
}

// 在加载前将 params 解析回对应的响应式变量中
useParams(queryParams, pagination, search)

// 将 params 解析回对应的响应式变量中(不需要请求)
const parseParamsNotLoaded = () => {
    // 在加载前将 params 解析回对应的响应式变量中
    const { status } = queryParams

    if (status) {
        activeGroup.value = status.toString()
    }
}

// 监控 queryParams
watch(
    () => queryParams,
    () => {
        parseParamsNotLoaded()
    },
    { deep: true },
)
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
