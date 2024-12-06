<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-06-28 16:56:39
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-06 17:28:04
 * @FilePath     : \blog-client\src\views\admin\component\main\login-log\index.vue
 * @Description  : 登录日志
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->

<template>
    <BaseTable
        :pagination="pagination"
        :table-column="cols"
        :is-show-delete-all="true"
        :is-show-search="true"
        :search-str="search"
        :is-show-edit="false"
        height="calc(100vh - 228px)"
        @update-current-page="updateCurrentPage"
        @update-page-size="updatePageSize"
        @delete-rows="deleteRows"
        @update-search="updateSearch"
        @run-search="runSearch"
    >
        <template #btns>
            <el-input-number class="delete-num" v-model="deleteNum" :min="1" :max="10000000" />
            <el-button type="danger" @click="handleDeleteN"> 删除N天前记录 </el-button>
        </template>
    </BaseTable>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue"
import type { TableData, TableColumn } from "@/components/common/base-table"
import { AdminSideMenu } from "@/views/admin/component/aside"
import {
    getLoginLogsAPI,
    type GetLoginLogsRequest,
    type LoginLog,
} from "@/api/loginLog/getLoginLogs"
import { ResponseCode, handleErrInfo } from "@/api/responseCode"
import {
    deleteLoginLogByDayAPI,
    type DeleteLoginLogByDayRequest,
} from "@/api/loginLog/deleteLoginLogByDay"
import {
    deleteLoginLogByIDsAPI,
    type DeleteLoginLogByIDsRequest,
} from "@/api/loginLog/deleteLoginLogByIds"
import { ShowMsgTip } from "@/utils/message"
import { deleteConfirmCommon } from "@/utils/confirm"

import BaseTable from "@/components/common/base-table"
import { useBaseTable } from "@/components/hooks/useBaseTable"
import { useParams } from "@/components/hooks/useParams"

defineOptions({ name: AdminSideMenu.LoginLog })

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
        prop: "ip_country",
        label: "国家",
        sortable: true,
        minWidth: 180,
        align: "center",
    },
    {
        prop: "ip_region_name",
        label: "地区",
        sortable: true,
        minWidth: 140,
        align: "center",
    },
    {
        prop: "ip_city",
        label: "城市",
        sortable: true,
        minWidth: 140,
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

// hooks 使用
const {
    search, // 搜索关键字
    pagination, // 分页数据
    updateCurrentPage, // 更新当前页
    updatePageSize, // 更新每页显示条数
    updateSearch, // 更新搜索关键字
    deleteRows, // 删除行
    updateQueryAndRouter,
} = useBaseTable<LoginLog, GetLoginLogsRequest, DeleteLoginLogByIDsRequest>(
    AdminSideMenu.LoginLog,
    getLoginLogsAPI,
    ResponseCode.GetLoginLogsSuccess,
    deleteLoginLogByIDsAPI,
    ResponseCode.LoginLogDeleteByIDsSuccess,
    queryParams,
)

// 执行搜索
const runSearch = () => {
    updateQueryAndRouter(true)
}

const deleteNum = ref(1)

const handleDeleteN = () => {
    deleteConfirmCommon(async () => {
        // 删除用户
        const deleteLoginLogByDayRequest: DeleteLoginLogByDayRequest = {
            days_before: deleteNum.value,
        }
        await deleteLoginLogByDayAPI(deleteLoginLogByDayRequest).then((res) => {
            if (res.data.code === ResponseCode.LoginLogDeleteByDaySuccess) {
                // 删除成功后重新获取用户列表
                runSearch()
                ShowMsgTip(ShowMsgTip.MsgType.success, res.data.msg, 3000)
            } else {
                // 显示错误信息
                const msg = handleErrInfo(res)
                ShowMsgTip(ShowMsgTip.MsgType.error, msg, 3000)
            }
        })
    })
}

// 在加载前将 params 解析回对应的响应式变量中
useParams(queryParams, search, pagination)
</script>

<style scoped lang="scss">
.delete-num {
    width: 150px;
    margin-right: 10px;
}
</style>
