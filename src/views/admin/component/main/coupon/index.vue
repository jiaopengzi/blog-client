<!--
 * FilePath    : blog-client\src\views\admin\component\main\coupon\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 优惠券管理
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
                <!-- v-for 循环 couponCountGroup生成 按钮 -->
                <div ref="categoryRef" class="category-group">
                    <el-button
                        v-for="item in couponCountGroup"
                        :key="item.key"
                        :class="{ active: item.key === activeGroup }"
                        @click="handleCouponCountByGroup(item)"
                    >
                        {{ item.display }} ({{ item.count }})
                    </el-button>
                </div>
            </template>
            <!-- 新增弹窗 -->
            <template #add-item-title>
                <span class="dialog-title">新增优惠券</span>
            </template>

            <template #add-item>
                <div class="dialog-add">
                    <AddCoupon @add-status="addStatus" />
                </div>
            </template>

            <!-- 编辑弹窗 -->
            <template #edit-item-title>
                <span class="dialog-title">编辑优惠券</span>
            </template>

            <template #edit-item>
                <div class="dialog-edit">
                    <EditCoupon :edit-data="editData" @edit-status="editStatus" />
                </div>
            </template>
        </BaseTable>
    </section>
</template>

<script lang="ts" setup>
import { useHead } from "@unhead/vue"
import { reactive, watch } from "vue"

import { CouponDiscountType, CouponDiscountTypeDisplay, type CouponRes, CouponStackable, CouponStatus, CouponStatusDisplay } from "@/api/coupon/common"
import { deleteCouponAPI, type DeleteCouponRequest } from "@/api/coupon/delete"
import { viewCouponAPI, type ViewCouponRequest } from "@/api/coupon/view"
import { type QueryParamsRecord } from "@/api/request"
import { ResponseCode } from "@/api/response"
import type { TableColumn, TableData } from "@/components/common/base-table"
import BaseTable from "@/components/common/base-table/index.vue"
import { useBaseTable } from "@/components/hooks/useBaseTable"
import { useParams } from "@/components/hooks/useParams"
import { RouteNames } from "@/router"
import { adminMenuItemMap } from "@/views/admin/component/aside"

import AddCoupon from "./component/add"
import EditCoupon from "./component/edit"
import { type ViewForm } from "./component/view"
import { useHeader } from "./hooks"
import { type CouponCountGroupItem, groupList, type GroupType, queryKey } from "./types"

defineOptions({ name: RouteNames.Coupon })

useHead({
    title: adminMenuItemMap[RouteNames.Coupon].text,
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
        prop: "code",
        label: "优惠券",
        sortable: true,
        minWidth: 150,
        align: "center",
        isCopyText: true,
    },
    {
        prop: "discount_type",
        label: "优惠类型",
        sortable: true,
        minWidth: 150,
        align: "center",
        formatter: (row: TableData) => {
            if ("discount_type" in row) {
                return CouponDiscountTypeDisplay[row.discount_type as CouponDiscountType]
            }
        },
    },
    {
        prop: "amount",
        label: "优惠数量",
        sortable: true,
        minWidth: 150,
        align: "center",
        formatter: (row: TableData) => {
            if ("discount_type" in row && "amount" in row) {
                return row.discount_type === CouponDiscountType.FixedAmount ? `${(row.amount / 100).toFixed(2)} 元` : `${row.amount} %`
            }
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
                return CouponStatusDisplay[row.status as CouponStatus]
            }
        },
    },
    {
        prop: "used_count",
        label: "使用次数",
        sortable: true,
        minWidth: 150,
        align: "center",
        formatter: (row: TableData) => {
            if ("used_count" in row && "use_limit" in row) {
                return `${row.used_count} / ${row.use_limit || "无限制"}`
            }
        },
    },
    {
        prop: "description",
        label: "描述",
        minWidth: 200,
        align: "center",
    },
    {
        prop: "expire_time",
        label: "过期时间",
        sortable: true,
        minWidth: 120,
        align: "center",
        formatter: (row: TableData) => {
            if ("expire_time" in row) {
                return row.expire_time.Valid ? row.expire_time.Time : "-"
            }
        },
    },
])

// 获取头部数据
const { couponCountGroup, allGroup, activeGroup, getCouponCountStatus } = useHeader()

const queryParams = reactive<ViewCouponRequest>({} as ViewCouponRequest)

// 字符串类型的 key
const stringKeys: StringKeys<ViewCouponRequest>[] = ["key_word"]

// 数字类型的 key
const numberKeys: NumberKeys<ViewCouponRequest>[] = ["current_page", "page_size", "status"]

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
    updateRouterPushResetPage, // 重置页码后更新路由
    loadingDelete, // 删除时的加载状态
} = useBaseTable<CouponRes, ViewCouponRequest, DeleteCouponRequest>({
    routeName: RouteNames.Coupon,
    viewAPI: viewCouponAPI,
    viewResCode: ResponseCode.CouponViewSuccess,
    queryParams,
    deleteAPI: deleteCouponAPI,
    deleteResCode: ResponseCode.CouponDeleteSuccess,
    options: { stringKeys, numberKeys, noRequestKeys, enablePaginationStorage: true, refreshPromiseFns: [getCouponCountStatus] },
})

// 执行搜索
const runSearch = async () => {
    await updateRouterPushResetPage()
}

// 处理 couponCountGroup 点击事件
const handleCouponCountByGroup = async (item: CouponCountGroupItem) => {
    activeGroup.value = item.key
    // 清空重置
    Object.keys(queryParams).forEach((key) => {
        if (groupList.includes(key as GroupType)) {
            delete queryParams[key as keyof ViewCouponRequest]
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

    await updateRouterPushResetPage()
}

// 需要编辑的用户ID
const editData = reactive<ViewForm>({
    id: "",
    code: "",
    discount_type: CouponDiscountType.FixedAmount,
    expire_time: {
        Time: new Date(),
        Valid: false,
    },
    status: CouponStatus.Disabled,
    amount: 0,
    stackable: CouponStackable.Disabled, // 默认禁用叠加
})

const isCouponTableData = (row: TableData): row is CouponRes => {
    return "discount_type" in row && "amount" in row && typeof row.amount === "number"
}

const editRow = (index: number, row: TableData) => {
    if ("id" in row) {
        editData.id = row.id.toString()
    }
    if ("code" in row) {
        editData.code = row.code
    }
    if ("description" in row) {
        editData.description = row.description || ""
    }
    if (isCouponTableData(row)) {
        editData.discount_type = row.discount_type as CouponDiscountType
    }
    if (isCouponTableData(row)) {
        const amount =
            row.discount_type === CouponDiscountType.FixedAmount
                ? row.amount / 100 // 将金额转换为元
                : row.amount // 折扣类型不需要转换
        editData.amount = amount
    }
    if ("expire_time" in row && row.expire_time.Valid) {
        editData.expire_time = row.expire_time
    } else if ("expire_time" in row && !row.expire_time.Valid) {
        editData.expire_time = {
            Time: null,
            Valid: false,
        }
    }
    if ("min_spend" in row) {
        editData.min_spend = row.min_spend / 100
    }
    if ("max_spend" in row) {
        editData.max_spend = row.max_spend / 100
    }
    if ("stackable" in row) {
        editData.stackable = row.stackable
    }
    if ("use_limit" in row) {
        editData.use_limit = row.use_limit
    }
    if ("used_count" in row) {
        editData.used_count = row.used_count
    }
    if ("use_limit_per_user" in row) {
        editData.use_limit_per_user = row.use_limit_per_user
    }
    if ("status" in row) {
        editData.status = row.status as CouponStatus
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
