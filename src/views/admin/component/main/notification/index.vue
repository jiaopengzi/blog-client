<!--
 * FilePath    : blog-client\src\views\admin\component\main\notification\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 通知管理
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
            @update-selection="handleSelection"
            @add-item-update-dialog-visible="addItemUpdateDialogVisible"
            @edit-item-update-dialog-visible="editItemUpdateDialogVisible"
        >
            <template #btns>
                <el-button type="primary" @click="toggleAddDialog"> 新增 </el-button>
            </template>

            <template #category>
                <!-- v-for 循环 notificationCountGroup生成 按钮 -->
                <div ref="categoryRef" class="category-group">
                    <el-button
                        v-for="item in notificationCountGroup"
                        :key="item.key"
                        :class="{ active: item.key === activeGroup }"
                        @click="handleNotificationCountByGroup(item)"
                    >
                        {{ item.display }} ({{ item.count }})
                    </el-button>
                </div>
            </template>
            <template #operation>
                <!-- 批量操作 -->
                <div class="operation">
                    <el-select class="operation-item" v-model="notificationOperationSelect" placeholder="批量更改" clearable style="width: 140px">
                        <el-option
                            v-for="item in notificationBatchOperations"
                            :key="item"
                            :label="`更改为：${NotificationStatusDisplay[item] || item}`"
                            :value="item"
                        />
                    </el-select>
                    <el-button
                        class="operation-item"
                        type="primary"
                        :loading="loadingBatchOperation"
                        @click="handleNotificationStatusOperation"
                        v-show="notificationOperationSelect"
                        >更改</el-button
                    >
                </div>
            </template>
            <!-- 新增弹窗 -->
            <template #add-item-title>
                <span class="dialog-title">新增通知</span>
            </template>

            <template #add-item>
                <div class="dialog-add">
                    <AddNotification @add-status="addStatus" />
                </div>
            </template>

            <!-- 编辑弹窗 -->
            <template #edit-item-title>
                <span class="dialog-title">编辑通知</span>
            </template>

            <template #edit-item>
                <div class="dialog-edit">
                    <EditNotification :edit-data="editData" @edit-status="editStatus" />
                </div>
            </template>
        </BaseTable>
    </section>
</template>

<script lang="ts" setup>
import { useHead } from "@unhead/vue"
import { reactive, ref, watch } from "vue"

import {
    batchOperationNotificationStatusAPI,
    type BatchOperationNotificationStatusRequest,
    type NotificationStatusOperation,
} from "@/api/notification/batchOperationStatus"
import {
    NotificationCategory,
    NotificationCategoryDisplay,
    NotificationFormat,
    NotificationPushStatus,
    NotificationPushStatusDisplay,
    type NotificationRes,
    NotificationStatus,
    NotificationStatusDisplay,
} from "@/api/notification/common"
import { deleteNotificationAPI, type DeleteNotificationRequest } from "@/api/notification/delete"
import { viewNotificationAPI, type ViewNotificationRequest } from "@/api/notification/view"
import { type QueryParamsRecord } from "@/api/request"
import { ResponseCode } from "@/api/response"
import { MsgType } from "@/components/common"
import type { TableColumn, TableData } from "@/components/common/base-table"
import BaseTable from "@/components/common/base-table"
import { useBaseTable } from "@/components/hooks/useBaseTable"
import { useParams } from "@/components/hooks/useParams"
import { RouteNames } from "@/router"
import { confirmCommon } from "@/utils/confirm"
import { pollingGetStreamIDsStatus } from "@/utils/getStreamIDsStatus"
import { MessageUtil } from "@/utils/message"
import { adminMenuItemMap } from "@/views/admin/component/aside"

import AddNotification from "./component/add"
import EditNotification from "./component/edit"
import { type ViewForm } from "./component/view"
import { useHeader } from "./hooks"
import { groupList, type GroupType, type NotificationCountGroupItem, queryKey } from "./types"

defineOptions({ name: RouteNames.Notification })

useHead({
    title: adminMenuItemMap[RouteNames.Notification].text,
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
        prop: "category",
        label: "类别",
        sortable: true,
        minWidth: 120,
        align: "center",
        formatter: (row: TableData) => {
            if ("category" in row) {
                return NotificationCategoryDisplay[row.category as NotificationCategory]
            }
        },
    },
    {
        prop: "subject",
        label: "主题",
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
                return NotificationStatusDisplay[row.status as NotificationStatus]
            }
        },
    },
    {
        prop: "push_time",
        label: "推送时间",
        sortable: true,
        minWidth: 120,
        align: "center",
        formatter: (row: TableData) => {
            if ("push_time" in row) {
                return row.category === NotificationCategory.ScheduledTask && row.push_time.Valid ? row.push_time.Time : "-"
            }
        },
    },
    {
        prop: "push_status",
        label: "推送状态",
        sortable: true,
        minWidth: 120,
        align: "center",
        formatter: (row: TableData) => {
            if ("push_status" in row) {
                return NotificationPushStatusDisplay[row.push_status as NotificationPushStatus] || "-"
            }
        },
    },
])

// 可以批量操作的状态
const notificationBatchOperations = ref([NotificationStatus.Disabled, NotificationStatus.Enabled])

const notificationStatusOperationList = ref<NotificationStatusOperation[]>([])

const notificationOperationSelect = ref<NotificationStatus>()

// 获取头部数据
const { notificationCountGroup, allGroup, activeGroup, getNotificationCountStatus } = useHeader()

const queryParams = reactive<ViewNotificationRequest>({} as ViewNotificationRequest)

// 字符串类型的 key
const stringKeys: StringKeys<ViewNotificationRequest>[] = ["key_word"]

// 数字类型的 key
const numberKeys: NumberKeys<ViewNotificationRequest>[] = ["current_page", "page_size", "status"]

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
    updatePaginate, // 更新分页
    updateRouterPush,
    loadingDelete, // 删除时的加载状态
} = useBaseTable<NotificationRes, ViewNotificationRequest, DeleteNotificationRequest>(
    RouteNames.Notification,
    viewNotificationAPI,
    ResponseCode.NotificationViewSuccess,
    deleteNotificationAPI,
    ResponseCode.NotificationDeleteSuccess,
    queryParams,
    { stringKeys, numberKeys, noRequestKeys, refreshPromiseFns: [getNotificationCountStatus] },
)

// 执行搜索
const runSearch = async () => {
    await updateRouterPush()
}

// 处理 notificationCountGroup 点击事件
const handleNotificationCountByGroup = async (item: NotificationCountGroupItem) => {
    activeGroup.value = item.key
    // 清空重置
    Object.keys(queryParams).forEach((key) => {
        if (groupList.includes(key as GroupType)) {
            delete queryParams[key as keyof ViewNotificationRequest]
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
    subject: "",
    content: "",
    category: NotificationCategory.ScheduledTask,
    status: NotificationStatus.Disabled,
    format: NotificationFormat.HTML,
    push_time: {
        Time: new Date(),
        Valid: false,
    },
})

const editRow = (index: number, row: TableData) => {
    if ("id" in row) {
        editData.id = row.id.toString()
    }
    if ("to_list" in row) {
        editData.to_list = row.to_list
    }
    if ("exclude_to_list" in row) {
        editData.exclude_to_list = row.exclude_to_list
    }
    if ("subject" in row) {
        editData.subject = row.subject
    }
    if ("content" in row) {
        editData.content = row.content
    }
    if ("push_time" in row) {
        editData.push_time = row.push_time
    }
    if ("push_status" in row) {
        editData.push_status = row.push_status
    }
    if ("category" in row) {
        editData.category = row.category
    }
    if ("status" in row) {
        editData.status = row.status as NotificationStatus
    }
    if ("format" in row) {
        editData.format = row.format
    }

    toggleEditDialog()
}

// 批量操作
const loadingBatchOperation = ref(false)
const handleNotificationStatusOperation = async () => {
    if (notificationStatusOperationList.value.length > 0) {
        confirmCommon(
            "确认更改?",

            // 确认后的操作
            () => {
                loadingBatchOperation.value = true
                // 构造请求参数
                const req: BatchOperationNotificationStatusRequest = {
                    operation_list: notificationStatusOperationList.value,
                }

                batchOperationNotificationStatusAPI(req).then(async (res) => {
                    if (res.data.code === ResponseCode.NotificationStatusBatchOperationSuccess) {
                        const msg = res.data.msg
                        MessageUtil.success(msg, 3000)

                        // 轮询后端是否完成
                        await pollingGetStreamIDsStatus(res.data.data.items)

                        await updatePaginate()
                        await getNotificationCountStatus()
                        loadingBatchOperation.value = false
                    } else {
                        loadingBatchOperation.value = false
                        MessageUtil.error(res.data.msg, 3000)
                    }
                })
            },

            // 取消后的操作
            () => {},
        )
    } else {
        ElMessage({
            type: MsgType.info,
            message: "请选择需要更改的数据",
        })
    }
}

// 处理选择行
const handleSelection = async (rows: TableData[]) => {
    // 先清空
    notificationStatusOperationList.value = []

    rows.flatMap((item) => {
        if ("status" in item) {
            notificationStatusOperationList.value.push({
                id: item.id.toString(),
                status: notificationOperationSelect.value as NotificationStatus,
            })
        }
    })
}

// 监控 postOperationSelect 更改
watch(notificationOperationSelect, async (newVal) => {
    if (newVal) {
        // 更新 postStatusOperationList 状态更改为 newVal
        notificationStatusOperationList.value = notificationStatusOperationList.value.map((item) => {
            item.status = newVal
            return item
        })
    }
})

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
