<!--
 * FilePath    : blog-client\src\views\admin\component\main\billing-center\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 计费中心
-->

<template>
    <section class="billing-center">
        <!-- 账号信息卡片 -->
        <AccountCard
            :loading="accountLoading"
            :is-registered="isRegistered"
            :account-info="accountInfo"
            @register="showRegisterDialog"
            @recharge="showRechargeDialog"
            @notify="showNotifyDialog"
            @reset-cert="showResetCertDialog"
        />

        <!-- 交易流水列表 -->
        <div v-if="isRegistered" class="transaction-section">
            <BaseTable
                :pagination="pagination"
                :table-column="cols"
                :is-show-search="false"
                height="calc(100vh - 460px)"
                :loading-delete="loadingDelete"
                @update-current-page="updateCurrentPage"
                @update-page-size="updatePageSize"
                @add-item-update-dialog-visible="addItemUpdateDialogVisible"
                @edit-item-update-dialog-visible="editItemUpdateDialogVisible"
            >
                <template #category>
                    <!-- 交易类型筛选按钮组 -->
                    <div class="category-group">
                        <el-button
                            v-for="item in transactionTypeOptions"
                            :key="item.value"
                            :class="{ active: item.value === activeType }"
                            @click="handleTypeFilter(item.value)"
                        >
                            {{ item.label }}
                        </el-button>
                    </div>
                </template>

                <template #custom-filter>
                    <div class="custom-filter">
                        <!-- 关联ID -->
                        <div class="custom-filter-item">
                            <el-input v-model="filterRelatedId" placeholder="关联ID" clearable style="width: 200px" />
                        </div>

                        <!-- 交易类型下拉 -->
                        <div class="custom-filter-item">
                            <el-select v-model="filterType" placeholder="全部类型" clearable style="width: 120px">
                                <el-option v-for="item in transactionTypeFilterOptions" :key="item.value" :label="item.label" :value="item.value" />
                            </el-select>
                        </div>

                        <!-- 日期筛选组 -->
                        <DateRangeShortcuts class="date-filter" v-model:start="filterDateStart" v-model:end="filterDateEnd" @change="handleDateChange" />

                        <!-- 查询 / 重置 -->
                        <div class="custom-filter-item">
                            <el-button type="primary" @click="handleSearch">查询</el-button>
                            <el-button @click="handleReset">重置</el-button>
                        </div>
                    </div>
                </template>
            </BaseTable>
        </div>

        <!-- 注册弹窗 -->
        <el-dialog v-model="registerDialogVisible" title="注册计费中心" width="480px" destroy-on-close>
            <RegisterForm @register-status="handleRegisterStatus" />
        </el-dialog>

        <!-- 充值弹窗 -->
        <el-dialog v-model="rechargeDialogVisible" width="520px" destroy-on-close class="billing-dialog billing-dialog--recharge">
            <template #header>
                <div class="billing-dialog-header">
                    <el-icon :size="22"><Wallet /></el-icon>
                    <span>账户充值</span>
                </div>
            </template>
            <RechargeForm @recharge-status="handleRechargeStatus" />
        </el-dialog>

        <!-- 通知设置弹窗 -->
        <el-dialog v-model="notifyDialogVisible" width="520px" destroy-on-close class="billing-dialog billing-dialog--notify">
            <template #header>
                <div class="billing-dialog-header">
                    <el-icon :size="22"><Bell /></el-icon>
                    <span>通知阈值设置</span>
                </div>
            </template>
            <NotifyForm :account-info="accountInfo!" @notify-status="handleNotifyStatus" />
        </el-dialog>

        <!-- 重置证书弹窗 -->
        <el-dialog v-model="resetCertDialogVisible" width="520px" destroy-on-close class="billing-dialog billing-dialog--cert">
            <template #header>
                <div class="billing-dialog-header">
                    <el-icon :size="22"><Key /></el-icon>
                    <span>重置证书</span>
                </div>
            </template>
            <ResetCertForm @reset-cert-status="handleResetCertStatus" />
        </el-dialog>
    </section>
</template>

<script lang="ts" setup>
import { Bell, Key, Wallet } from "@element-plus/icons-vue"
import { useHead } from "@unhead/vue"
import { debounce } from "throttle-debounce"
import { onBeforeMount, reactive, ref, watch } from "vue"
import type { ResPromise, Res, Pagination } from "@/api/response"

import { Currency, TransactionType, TransactionTypeDisplay } from "@/api/billingCenter/common"
import { billingCenterTransactionFlowListAPI, type TransactionFlowListRequest } from "@/api/billingCenter/transactionFlowList"
import type { TransactionFlowRes } from "@/api/billingCenter/common"
import type { QueryParamsRecord } from "@/api/request"
import { ResponseCode } from "@/api/response"
import type { TableColumn } from "@/components/common/base-table"
import BaseTable from "@/components/common/base-table/index.vue"
import { useBaseTable } from "@/components/hooks/useBaseTable"
import { useParams } from "@/components/hooks/useParams"
import { RouteNames } from "@/router"
import DateRangeShortcuts from "@/components/common/date-range-shortcuts/index.vue"
import { adminMenuItemMap } from "@/views/admin/component/aside"

import NotifyForm from "./component/notify"
import RechargeForm from "./component/recharge"
import RegisterForm from "./component/register"
import ResetCertForm from "./component/reset-cert"
import AccountCard from "./component/account-card"
import { useBillingCenter } from "./hooks"
import { queryKey } from "./types"

defineOptions({ name: RouteNames.BillingCenter })

useHead({
    title: adminMenuItemMap[RouteNames.BillingCenter].text,
})

const { accountInfo, isRegistered, accountLoading, getAccountInfo, formatAmount, formatAmountColumn, formatTransactionType, formatRelatedId } =
    useBillingCenter()

// 弹窗可见性
const registerDialogVisible = ref(false)
const rechargeDialogVisible = ref(false)
const notifyDialogVisible = ref(false)
const resetCertDialogVisible = ref(false)

// 显示弹窗
const showRegisterDialog = () => {
    registerDialogVisible.value = true
}
const showRechargeDialog = () => {
    rechargeDialogVisible.value = true
}
const showNotifyDialog = () => {
    notifyDialogVisible.value = true
}
const showResetCertDialog = () => {
    resetCertDialogVisible.value = true
}

// 交易类型选项(含全部)
const transactionTypeOptions = Object.values(TransactionType)
    .filter((value) => typeof value === "number")
    .map((value) => ({
        label: TransactionTypeDisplay[value as TransactionType],
        value: value as TransactionType,
    }))

// 交易类型筛选选项(不含全部, 用于下拉框, 带符号)
const transactionTypeFilterOptions = Object.values(TransactionType)
    .filter((value) => typeof value === "number" && value !== TransactionType.All)
    .map((value) => ({
        label: TransactionTypeDisplay[value as TransactionType],
        value: value as TransactionType,
    }))

// 当前选中的交易类型
const activeType = ref(TransactionType.All)

// 筛选表单变量
const filterRelatedId = ref("")
const filterType = ref<TransactionType | "">("")
const filterDateStart = ref("")
const filterDateEnd = ref("")

// 表格列配置
const cols: TableColumn[] = reactive([
    {
        prop: "id",
        label: "ID",
        minWidth: 80,
        align: "center",
        isCopyText: true,
    },
    {
        prop: "type",
        label: "类型",
        sortable: true,
        minWidth: 100,
        align: "center",
        formatter: formatTransactionType,
    },
    {
        prop: "amount",
        label: "金额",
        minWidth: 120,
        align: "center",
    },
    {
        prop: "balance_before",
        label: "变动前余额",
        minWidth: 140,
        align: "center",
    },
    {
        prop: "balance_after",
        label: "变动后余额",
        minWidth: 140,
        align: "center",
    },
    {
        prop: "description",
        label: "描述",
        minWidth: 200,
        align: "center",
    },
    {
        prop: "related_id",
        label: "关联ID",
        minWidth: 80,
        align: "center",
        formatter: formatRelatedId,
    },
    {
        prop: "created_at",
        label: "时间",
        sortable: true,
        minWidth: 160,
        align: "center",
    },
])

// 查询参数
const queryParams: TransactionFlowListRequest = reactive({} as TransactionFlowListRequest)

// 字符串类型的 key
const stringKeys: StringKeys<TransactionFlowListRequest>[] = ["date_start", "date_end", "user_id", "related_id"]

// 数字类型的 key
const numberKeys: NumberKeys<TransactionFlowListRequest>[] = ["current_page", "page_size", "type"]

// 不需要请求的参数(全部类型不作为请求参数)
const noRequestKeys: QueryParamsRecord<queryKey> = { [queryKey.Type]: TransactionType.All }

// 包装 API, 自动注入固定的 currency 参数
const wrappedTransactionFlowListAPI = (params: TransactionFlowListRequest): ResPromise<Res<Pagination<TransactionFlowRes>>> => {
    return billingCenterTransactionFlowListAPI({
        ...params,
        currency: Currency.CNY,
    })
}

// hooks 使用
const {
    search,
    pagination,
    updateCurrentPage,
    updatePageSize,
    addItemUpdateDialogVisible,
    editItemUpdateDialogVisible,
    updateRouterPush,
    updatePaginate,
    loadingDelete,
} = useBaseTable<TransactionFlowRes, TransactionFlowListRequest, never>({
    routeName: RouteNames.BillingCenter,
    viewAPI: wrappedTransactionFlowListAPI,
    viewResCode: ResponseCode.BillingCenterTransactionFlowListSuccess,
    queryParams,
    options: { stringKeys, numberKeys, noRequestKeys },
})

// 处理交易类型筛选
const handleTypeFilter = debounce(300, async (type: TransactionType) => {
    activeType.value = type
    Object.assign(queryParams, {
        [queryKey.Type]: type,
    })
    await updateRouterPush()
})

// 日期组件 change 回调
const handleDateChange = (start: string, end: string) => {
    filterDateStart.value = start
    filterDateEnd.value = end
}

// 查询
const handleSearch = debounce(300, async () => {
    const params: Partial<TransactionFlowListRequest> = {}

    if (filterRelatedId.value) {
        params.related_id = filterRelatedId.value
    }
    if (filterType.value !== "") {
        params.type = filterType.value
        activeType.value = filterType.value
    }
    if (filterDateStart.value) {
        params.date_start = filterDateStart.value
    }
    if (filterDateEnd.value) {
        params.date_end = filterDateEnd.value
    }

    // 清空当前 queryParams 中的筛选字段
    delete queryParams.related_id
    delete queryParams.date_start
    delete queryParams.date_end
    delete queryParams.type

    Object.assign(queryParams, params)
    await updateRouterPush()
})

// 重置
const handleReset = debounce(300, async () => {
    filterRelatedId.value = ""
    filterType.value = ""
    filterDateStart.value = ""
    filterDateEnd.value = ""
    activeType.value = TransactionType.All

    delete queryParams.related_id
    delete queryParams.date_start
    delete queryParams.date_end
    delete queryParams.type

    await updateRouterPush()
})

// 在加载前将 params 解析回对应的响应式变量中
useParams(queryParams, pagination, search)

// 将 params 解析回对应的响应式变量中(不需要请求)
const parseParamsNotLoaded = () => {
    const { type, related_id, date_start, date_end } = queryParams

    if (type !== undefined) {
        activeType.value = type as TransactionType
        filterType.value = type === TransactionType.All ? "" : (type as TransactionType)
    }
    if (related_id) {
        filterRelatedId.value = related_id
    }
    if (date_start) {
        filterDateStart.value = date_start
    }
    if (date_end) {
        filterDateEnd.value = date_end
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

// 注册成功回调
const handleRegisterStatus = async (status: boolean) => {
    registerDialogVisible.value = false
    if (status) {
        await getAccountInfo()
    }
}

// 充值成功回调
const handleRechargeStatus = async (status: boolean) => {
    rechargeDialogVisible.value = false
    if (status) {
        await getAccountInfo()
        await updatePaginate()
    }
}

// 通知设置回调
const handleNotifyStatus = async (status: boolean) => {
    notifyDialogVisible.value = false
    if (status) {
        await getAccountInfo()
    }
}

// 重置证书回调
const handleResetCertStatus = async (status: boolean) => {
    resetCertDialogVisible.value = false
}

onBeforeMount(async () => {
    await getAccountInfo()
})
</script>

<style scoped lang="scss">
.billing-center {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.transaction-section {
    background: var(--el-bg-color);
    border-radius: 8px;
    padding: 16px;
    border: 1px solid var(--el-border-color-lighter);
}

.custom-filter {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;

    .custom-filter-item {
        display: flex;
        align-items: center;
        gap: 6px;
    }

    .date-filter {
        margin: 0 16px;
    }

    .filter-label {
        font-size: 13px;
        color: var(--el-text-color-secondary);
        white-space: nowrap;
    }
}

// 弹窗统一商务风格
:deep(.billing-dialog) {
    border-radius: 12px;
    overflow: hidden;

    .el-dialog__header {
        padding: 20px 24px 16px;
        margin: 0;
        border-bottom: 1px solid var(--el-border-color-lighter);
        background: var(--el-bg-color);
    }

    .el-dialog__body {
        padding: 24px;
    }
}

// 弹窗头部图标 + 标题
.billing-dialog-header {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 17px;
    font-weight: 700;
    color: var(--el-text-color-primary);

    .el-icon {
        color: var(--jpz-color-primary);
    }
}

// 充值弹窗强调色
:deep(.billing-dialog--recharge) {
    .el-dialog__header {
        border-bottom-color: var(--jpz-color-secondary);
    }

    .billing-dialog-header .el-icon {
        color: var(--jpz-color-secondary);
    }
}

// 通知弹窗主色
:deep(.billing-dialog--notify) {
    .el-dialog__header {
        border-bottom-color: var(--jpz-color-primary);
    }
}

// 证书弹窗警告色
:deep(.billing-dialog--cert) {
    .el-dialog__header {
        border-bottom-color: var(--el-color-warning);
    }

    .billing-dialog-header .el-icon {
        color: var(--el-color-warning);
    }
}
</style>
