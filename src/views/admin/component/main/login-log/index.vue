<!--
 * @FilePath     : \blog-client\src\views\admin\component\main\login-log\index.vue
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
 * @Description  : 登录日志
-->

<template>
    <section>
        <BaseTable
            :pagination="pagination"
            :table-column="cols"
            :is-show-delete-all="true"
            :is-show-search="true"
            :search-str="search"
            :is-show-edit="false"
            :loading-delete="loadingDelete"
            height="calc(100vh - 228px)"
            @update-current-page="updateCurrentPage"
            @update-page-size="updatePageSize"
            @delete-rows="deleteRows"
            @update-search="updateSearch"
            @run-search="runSearch"
        >
            <template #btns>
                <el-input-number class="delete-num" v-model="deleteNum" :min="1" :max="10000000" />
                <el-button type="danger" :loading="loadingDeleteN" @click="handleDeleteN"> 删除N天前记录 </el-button>
            </template>
        </BaseTable>
    </section>
</template>

<script lang="ts" setup>
import { useHead } from "@unhead/vue"
import { reactive, ref } from "vue"

import { deleteLoginLogByDayAPI, type DeleteLoginLogByDayRequest } from "@/api/loginLog/deleteLoginLogByDay"
import { deleteLoginLogByIDsAPI, type DeleteLoginLogByIDsRequest } from "@/api/loginLog/deleteLoginLogByIds"
import { getLoginLogsAPI, type GetLoginLogsRequest, type LoginLog } from "@/api/loginLog/getLoginLogs"
import { handleResErr, ResponseCode } from "@/api/response"
import type { TableColumn } from "@/components/common/base-table"
import BaseTable from "@/components/common/base-table/index.vue"
import { useBaseTable } from "@/components/hooks/useBaseTable"
import { useParams } from "@/components/hooks/useParams"
import { RouteNames } from "@/router"
import { deleteConfirmCommon } from "@/utils/confirm"
import { pollingGetStreamIDsStatus } from "@/utils/getStreamIDsStatus"
import { MessageUtil } from "@/utils/message"
import { adminMenuItemMap } from "@/views/admin/component/aside"

defineOptions({ name: RouteNames.LoginLog })

useHead({
    title: adminMenuItemMap[RouteNames.LoginLog].text,
})

const cols: TableColumn[] = reactive([
    {
        prop: "id",
        label: "ID",
        sortable: true,
        minWidth: 80,
        align: "center",
    },
    {
        prop: "created_at",
        label: "登录时间",
        sortable: true,
        minWidth: 180,
        align: "center",
    },
    {
        prop: "user_id",
        label: "用户ID",
        sortable: true,
        minWidth: 180,
        align: "center",
    },
    {
        prop: "user_name",
        label: "用户名",
        sortable: true,
        minWidth: 150,
        align: "center",
    },
    {
        prop: "ip_address",
        label: "ip地址",
        sortable: true,
        minWidth: 180,
        align: "center",
    },
    {
        prop: "platform",
        label: "平台",
        sortable: true,
        minWidth: 100,
        align: "center",
    },
    {
        prop: "login_type",
        label: "登录类型",
        sortable: true,
        minWidth: 100,
        align: "center",
    },
])

const queryParams = reactive<GetLoginLogsRequest>({} as GetLoginLogsRequest)

// 字符串类型的 key
const stringKeys: StringKeys<GetLoginLogsRequest>[] = ["key_word"]

// 数字类型的 key
const numberKeys: NumberKeys<GetLoginLogsRequest>[] = ["current_page", "page_size"]

// hooks 使用
const {
    search, // 搜索关键字
    pagination, // 分页数据
    updateCurrentPage, // 更新当前页
    updatePageSize, // 更新每页显示条数
    updateSearch, // 更新搜索关键字
    deleteRows, // 删除行
    updateRouterPush,
    updatePaginate,
    loadingDelete,
} = useBaseTable<LoginLog, GetLoginLogsRequest, DeleteLoginLogByIDsRequest>({
    routeName: RouteNames.LoginLog,
    viewAPI: getLoginLogsAPI,
    viewResCode: ResponseCode.GetLoginLogsSuccess,
    deleteAPI: deleteLoginLogByIDsAPI,
    deleteResCode: ResponseCode.LoginLogDeleteByIDsSuccess,
    queryParams,
    options: { stringKeys, numberKeys },
})

// 执行搜索
const runSearch = async () => {
    updateRouterPush()
    await updatePaginate()
}

const deleteNum = ref(1)

const loadingDeleteN = ref(false)

const handleDeleteN = () => {
    deleteConfirmCommon(async () => {
        loadingDeleteN.value = true
        // 删除用户
        const deleteLoginLogByDayRequest: DeleteLoginLogByDayRequest = {
            days_before: deleteNum.value,
        }
        await deleteLoginLogByDayAPI(deleteLoginLogByDayRequest).then(async (res) => {
            if (res.data.code === ResponseCode.LoginLogDeleteByDaySuccess) {
                // 轮询后端是否完成
                await pollingGetStreamIDsStatus(res.data.data.stream_items)
                loadingDeleteN.value = false

                // 删除成功后重新获取用户列表
                runSearch()
                MessageUtil.success(res.data.msg, 3000)
            } else {
                loadingDeleteN.value = false
                // 显示错误信息
                const msg = handleResErr(res)
                MessageUtil.error(msg, 3000)
            }
        })
    })
}

// 在加载前将 params 解析回对应的响应式变量中
useParams(queryParams, pagination, search)
</script>

<style scoped lang="scss">
.delete-num {
    width: 150px;
    margin-right: 10px;
}
</style>
