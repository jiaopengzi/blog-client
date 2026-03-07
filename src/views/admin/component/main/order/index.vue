<!--
 * FilePath    : blog-client\src\views\admin\component\main\order\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 订单列表
-->

<template>
    <section>
        <BaseTable
            :pagination="pagination"
            :table-column="cols"
            :edit-item-dialog-visible="editItemDialogVisible"
            :is-show-search="true"
            :search-str="search"
            :is-show-edit="true"
            :loading-delete="loadingDelete"
            height="calc(100vh - 270px)"
            :is-show-cursor-pointer="true"
            :is-show-user-name="true"
            :avatar-width="40"
            :is-show-user-email="true"
            :is-show-user-display-name="true"
            @update-current-page="updateCurrentPage"
            @update-page-size="updatePageSize"
            @edit-row="editRow"
            @update-search="updateSearch"
            @run-search="runSearch"
            @click-author="handleClickAuthor"
            @add-item-update-dialog-visible="addItemUpdateDialogVisible"
            @edit-item-update-dialog-visible="editItemUpdateDialogVisible"
        >
            <template #category>
                <!-- v-for 循环 orderCountGroupByStatus生成 按钮 -->
                <div class="category-group">
                    <el-button
                        v-for="item in orderCountGroupByStatus"
                        :key="item.status"
                        :class="{ active: item.status === activeStatus }"
                        @click="handleOrderCountByStatus(item.status)"
                    >
                        {{ OrderStatusDisplay[item.status] }} ({{ item.count }})
                    </el-button>
                </div>
            </template>

            <template #custom-filter>
                <div ref="customFilterRef" class="custom-filter">
                    <!-- 按照作者-->
                    <FilterTagClear v-if="tags.size" class="custom-filter-item" :tags="userPost" @clear="clearAuthorCategoryTag" />
                </div>
            </template>

            <!-- 编辑弹窗 -->
            <template #edit-item-title>
                <span class="dialog-title">订单详情</span>
            </template>

            <template #edit-item>
                <div class="dialog-edit">
                    <OrderDetail :data="editData" @edit-status="handleEditStatus" />
                </div>
            </template>
        </BaseTable>
    </section>
</template>

<script lang="ts" setup>
import { useHead } from "@unhead/vue"
import { computed, onBeforeMount, reactive, ref, watch } from "vue"

import { type OrderGetByIDRes, OrderStatus, OrderStatusDisplay } from "@/api/order/common"
import { getOrderCountByStatusAPI, type OrderCountByStatus } from "@/api/order/getCountByStatus"
import { getOrderPaginateAdminAPI, type OrderPaginationRequest } from "@/api/order/getPaginate"
import { type QueryParamsRecord } from "@/api/request"
import { ResponseCode } from "@/api/response"
import type { User } from "@/api/user/getUsers"
import type { TableColumn, TableData } from "@/components/common/base-table"
import BaseTable from "@/components/common/base-table/index.vue"
import FilterTagClear from "@/components/common/filter-tag-clear"
import OrderDetail from "@/components/common/order-detail"
import { useBaseTable } from "@/components/hooks/useBaseTable"
import { useParams } from "@/components/hooks/useParams"
import { RouteNames } from "@/router"
import { adminMenuItemMap } from "@/views/admin/component/aside"

import { useOrder } from "./hooks"
defineOptions({ name: RouteNames.Order })

useHead({
    title: adminMenuItemMap[RouteNames.Order].text,
})

const { formatCouponItems, formatPayment } = useOrder()

const cols: TableColumn[] = reactive([
    {
        prop: "id",
        label: "ID",
        sortable: true,
        minWidth: 80,
        align: "center",
        isCopyText: true,
    },
    {
        prop: "user_info",
        label: "用户",
        minWidth: 100,
        align: "center",
        isUser: true,
    },
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
        prop: "coupon_items",
        label: "优惠券",
        sortable: true,
        minWidth: 100,
        align: "center",
        formatter: formatCouponItems,
    },
    {
        prop: "payment",
        label: "支付方式",
        sortable: true,
        minWidth: 60,
        align: "center",
        formatter: formatPayment,
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
    {
        prop: "ip",
        label: "IP地址",
        sortable: true,
        minWidth: 80,
        align: "center",
    },
])

const allStatus = OrderStatus.AllStatus // 全部状态
const activeStatus = ref(OrderStatus.AllStatus)

// url query key
enum queryKey {
    Status = "status",
    KeyWord = "key_word",
}

// 查询参数
const queryParams: OrderPaginationRequest = reactive({} as OrderPaginationRequest)

// 字符串类型的 key
const stringKeys: StringKeys<OrderPaginationRequest>[] = ["user_id", "key_word"]

// 数字类型的 key
const numberKeys: NumberKeys<OrderPaginationRequest>[] = ["current_page", "page_size", "status"]

// 不需要请求的参数
const noRequestKeys: QueryParamsRecord<queryKey> = { [queryKey.Status]: allStatus }

// 订单状态
const orderCountGroupByStatus = ref<OrderCountByStatus[]>([])
const clickAuthor = ref("")
const userPost = ref<string[]>([])

const tags = computed(() => {
    const userOrderSet = new Set<string>()

    if (clickAuthor.value) {
        userOrderSet.add(clickAuthor.value)
    }

    return userOrderSet
})

watch(tags, (newVal) => {
    userPost.value = Array.from(newVal)
})

// 获取订单状态统计
async function getOrderCountByStatus() {
    const res = await getOrderCountByStatusAPI()

    if (res.data.code === ResponseCode.OrderCountByStatusSuccess) {
        const countList = res.data.data
        const total = countList.reduce((prev, cur) => {
            return prev + cur.count
        }, 0)
        const newStatus: OrderCountByStatus = { status: allStatus as unknown as OrderStatus, count: total }
        orderCountGroupByStatus.value = [newStatus, ...countList]
    }
}

// hooks 使用
const {
    editItemDialogVisible, // 编辑对话框是否可见
    search, // 搜索关键字
    toggleEditDialog, // 切换编辑对话框
    pagination, // 分页数据
    updateCurrentPage, // 更新当前页
    updatePageSize, // 更新每页显示条数
    updateSearch, // 更新搜索关键字
    editStatus, // 编辑状态
    addItemUpdateDialogVisible, // 新增对话框
    editItemUpdateDialogVisible, // 编辑对话框
    updateRouterPush, // 更新查询参数和路由
    loadingDelete, // 删除加载状态
} = useBaseTable<OrderGetByIDRes, OrderPaginationRequest, never>({
    routeName: RouteNames.Order,
    viewAPI: getOrderPaginateAdminAPI,
    viewResCode: ResponseCode.OrderGetPaginateSuccess,
    queryParams,
    options: { stringKeys, numberKeys, noRequestKeys },
})

const editData = ref<OrderGetByIDRes>({} as OrderGetByIDRes)
const editRow = (index: number, row: TableData) => {
    editData.value = row as OrderGetByIDRes
    toggleEditDialog()
}

const handleEditStatus = async (status: boolean) => {
    await editStatus(status)
    await getOrderCountByStatus()
}

// 更新数据
const updateData = async () => {
    await updateRouterPush()
}

// 执行搜索
const runSearch = async () => {
    await updateData()
}

const handleClickAuthor = async (author: User) => {
    Object.assign(queryParams, {
        user_id: author.id,
    })
    clickAuthor.value = author.user_name

    await updateData()
}

const clearAuthorCategoryTag = async () => {
    clickAuthor.value = ""
    delete queryParams.user_id

    await updateData()
}

const handleOrderCountByStatus = async (status: OrderStatus) => {
    activeStatus.value = status
    // 添加路由跳转
    Object.assign(queryParams, {
        [queryKey.Status]: status,
        [queryKey.KeyWord]: search.value,
    })

    await updateData()
}

// 将 params 解析回对应的响应式变量中(不需要请求)
const parseParamsNotLoaded = () => {
    // 在加载前将 params 解析回对应的响应式变量中
    const { status } = queryParams

    if (status) {
        activeStatus.value = status
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

// 在加载前将 params 解析回对应的响应式变量中
useParams(queryParams, pagination, search)

const parseParamsHasLoaded = () => {
    const { user_id } = queryParams

    clickAuthor.value = ""

    if (user_id) {
        for (const item of pagination.records) {
            if (item.user_info.id === user_id) {
                clickAuthor.value = item.user_info.user_name || ""
                break
            }
        }
    }
}

watch(
    () => pagination.records,
    (newRecords) => {
        if (newRecords.length > 0) {
            parseParamsHasLoaded()
        }
    },
    { deep: true },
)

onBeforeMount(async () => {
    await getOrderCountByStatus()
})
</script>

<style scoped lang="scss">
.custom-filter {
    display: flex;
    align-items: center;

    .custom-filter-item {
        margin-right: 10px;
    }
}

.dialog-title {
    font-size: 20px;
    font-weight: 700;
}

.dialog-edit {
    width: 100%;
    // 浮动 水平居中
    display: flex;
    justify-content: center;
}
</style>
