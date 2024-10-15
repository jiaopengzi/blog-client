<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-06-28 16:56:39
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-10-15 08:57:45
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
    @update-current-page="updateCurrentPage"
    @update-page-size="updatePageSize"
    @update-page-sizes="updatePageSizes"
    @delete-rows="deleteRows"
    @update-search="updateSearch"
    @update-selection="updateSelection"
  >
    <template #btns>
      <el-input-number class="delete-num" v-model="deleteNum" :min="0" :max="10000000" />
      <el-button type="danger" @click="handleDeleteN"> 删除 n 天前记录 </el-button>
    </template>
  </BaseTable>
</template>

<script lang="ts" setup>
import { ref, reactive, onBeforeMount, watch } from 'vue'
import type { Pagination } from '@/components/common'
import type { TableData, TableColumn } from '@/components/common/base-table'
import { debounce } from 'throttle-debounce'
import { AdminSideMenu } from '@/views/admin/component/aside'
import {
  getLoginLogsAPI,
  emptyLoginLogs,
  type GetLoginLogsRequest,
  type LoginLog
} from '@/api/loginLog/getLoginLogs'
import { ResponseCode } from '@/api/responseCode'
import router from '@/router/index'
import {
  DeleteLoginLogByDayAPI,
  type DeleteLoginLogByDayRequest
} from '@/api/loginLog/deleteLoginLogByDay'
import {
  DeleteLoginLogByIDsAPI,
  type DeleteLoginLogByIDsRequest
} from '@/api/loginLog/deleteLoginLogByIds'
import { ShowMsgTip } from '@/utils/message'
import { handleConfirmCommon } from '@/utils/confirm'

import BaseTable from '@/components/common/base-table'

defineOptions({ name: AdminSideMenu.LoginLog })

const cols: TableColumn[] = reactive([
  {
    prop: 'id',
    label: 'ID',
    sortable: true,
    width: 80,
    align: 'center'
  },
  {
    prop: 'created_at',
    label: '登录时间',
    sortable: true,
    width: 180,
    align: 'center'
  },
  {
    prop: 'user_id',
    label: '用户ID',
    sortable: true,
    width: 180,
    align: 'center'
  },
  {
    prop: 'user_name',
    label: '用户名',
    sortable: true,
    width: 150,
    align: 'center'
  },
  {
    prop: 'ip_address',
    label: 'ip地址',
    sortable: true,
    width: 180,
    align: 'center'
  },
  {
    prop: 'ip_country',
    label: '国家',
    sortable: true,
    width: 180,
    align: 'center'
  },
  {
    prop: 'ip_region_name',
    label: '地区',
    sortable: true,
    width: 140,
    align: 'center'
  },
  {
    prop: 'ip_city',
    label: '城市',
    sortable: true,
    width: 140,
    align: 'center'
  },
  {
    prop: 'platform',
    label: '平台',
    sortable: true,
    width: 100,
    align: 'center'
  },
  {
    prop: 'login_type',
    label: '登录类型',
    sortable: true,
    width: 100,
    align: 'center'
  }
])

const pagination = ref<Pagination<LoginLog>>({
  total: 0,
  current_page: 1,
  page_size: 10,
  page_count: 1,
  page_sizes: [10, 20, 50, 100],
  records: []
})

const search = ref('')
const deleteNum = ref(1)

const handleDeleteN = () => {
  handleConfirmCommon(async () => {
    // 删除用户
    const deleteLoginLogByDayRequest: DeleteLoginLogByDayRequest = {
      days_before: deleteNum.value
    }
    await DeleteLoginLogByDayAPI(deleteLoginLogByDayRequest).then((res) => {
      if (res.data.code === ResponseCode.LoginLogDeleteByDaySuccess) {
        // 删除成功后重新获取用户列表
        getLoginLogsPaginate({
          current_page: pagination.value.current_page,
          page_size: pagination.value.page_size,
          key_word: search.value
        })
        ShowMsgTip(ShowMsgTip.MsgType.success, res.data.msg, 3000)
      } else {
        // 显示错误信息
        ShowMsgTip(ShowMsgTip.MsgType.error, res.data.msg, 3000)
      }
    })
  })
}

const updateCurrentPage = async (val: number) => {
  pagination.value.current_page = val
  routerPush(pagination.value.page_size, val, search.value)
  console.log('01============', val)
}

const updatePageSize = async (val: number) => {
  pagination.value.page_size = val
  routerPush(val, pagination.value.current_page, search.value)
  console.log('02============', val)
}

const updatePageSizes = (val: any) => {
  // pagination.value.page_size = val
  console.log('03============', val)
}

const deleteRows = async (rows: TableData[]) => {
  // 将 rows 中的id 组成新的 list
  const ids = rows.flatMap((item) => ('id' in item ? item.id.toString() : []))
  // 将 ids 转换为 DeleteLoginLogByIDsRequest
  const deleteLoginLogByIDsRequest: DeleteLoginLogByIDsRequest = { id_list: ids }

  // 删除用户
  await DeleteLoginLogByIDsAPI(deleteLoginLogByIDsRequest).then((res) => {
    if (res.data.code === ResponseCode.LoginLogDeleteByIDsSuccess) {
      // 删除成功后重新获取用户列表
      getLoginLogsPaginate({
        current_page: pagination.value.current_page,
        page_size: pagination.value.page_size,
        key_word: search.value
      })
      ShowMsgTip(ShowMsgTip.MsgType.success, res.data.msg, 3000)
    } else {
      // 显示错误信息
      ShowMsgTip(ShowMsgTip.MsgType.error, res.data.msg, 3000)
    }
  })
}

const updateSearch = debounce(500, async (val: string) => {
  search.value = val
  routerPush(pagination.value.page_size, pagination.value.current_page, val)
  console.log('07============', val)
})

watch(search, (newVal) => {
  console.log('08============', newVal)
})

const updateSelection = (rows: TableData[]) => {
  console.log('18============', rows)
}

// 获取分页用户
async function getLoginLogsPaginate(getLoginLogsRequest: GetLoginLogsRequest) {
  // 如果 key_word 为空 则不传 key_word
  if (!getLoginLogsRequest.key_word) {
    delete getLoginLogsRequest.key_word
  }

  // 获取用户列表
  await getLoginLogsAPI(getLoginLogsRequest).then((res) => {
    if (res.data.code === ResponseCode.GetLoginLogsSuccess) {
      pagination.value = res.data.data
      console.log('11============', pagination.value)
    } else {
      pagination.value = emptyLoginLogs()
    }
  })
}

// 路由跳转
function routerPush(pageSize: number, currentPage: number, searchStr: string) {
  // 当搜索关键字为空时
  if (!searchStr) {
    router.push({
      name: AdminSideMenu.LoginLog,
      query: {
        'page-size': pageSize,
        'current-page': currentPage
      }
    })
    return
  }

  // 当搜索关键字不为空
  router.push({
    name: AdminSideMenu.LoginLog,
    query: {
      'page-size': pageSize,
      'current-page': currentPage,
      search: searchStr
    }
  })
  return
}

// 从路由中query中获取值
function getValueFromQuery() {
  pagination.value.page_size = Number(router.currentRoute.value.query['page-size']) || 10
  pagination.value.current_page = Number(router.currentRoute.value.query['current-page']) || 1
  search.value = (router.currentRoute.value.query['search'] as string) || ''
  console.log('12============', search.value)
}

onBeforeMount(async () => {
  console.log('13============')
  getValueFromQuery()
  await getLoginLogsPaginate({
    current_page: pagination.value.current_page,
    page_size: pagination.value.page_size,
    key_word: search.value
  })
})
</script>

<style scoped lang="scss">
.delete-num {
  width: 150px;
  margin-right: 10px;
}

.icon-upload-filled {
  font-size: 6em;
  fill: $primary-color;
}

:deep(.el-upload-list) {
  li {
    // 上下边距
    margin: 30px 0;
    padding: 0;
  }
}

.dialog-title {
  font-size: 20px;
  font-weight: 700;
}

.el-upload__text {
  // font-size: 16px;
  font-weight: 500;
}

.el-upload__tip_title {
  margin: 10px 0;
}

.user-count-by-role {
  margin-top: 10px;
  display: flex;
  align-items: center;

  .el-button {
    position: relative;
    // 背景透明
    background-color: transparent;
    // 无边框
    border: none;

    &.active {
      font-weight: bold;
      color: $primary-color;
    }

    &::after {
      content: '';
      position: absolute;
      right: -8px;
      top: 50%;
      transform: translateY(-50%);
      height: 61.8%;
      border-right: 1px solid $primary-color;
    }

    &:last-child::after {
      display: none;
    }
  }
}

.dialog-add,
.dialog-edit {
  width: 100%;
  // 浮动 水平居中
  display: flex;
  justify-content: center;
}
</style>
