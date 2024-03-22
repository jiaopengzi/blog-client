<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-03-20 13:58:49
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-03-22 16:24:46
 * @FilePath     : \blog-client\src\views\admin\component\main\user-all\index.vue
 * @Description  : 所有用户页面
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->

<template>
    <BaseTable :pagination="pagination" :table-column="cols" :dialog-visible="dialogVisible" :is-show-delete-all="false"
        @update-current-page="updateCurrentPage" @update-page-size="updatePageSize" @update-page-sizes="updatePageSizes"
        @edit-row="editRow" @delete-row="deleteRow" @delete-rows="deleteRows" @update-search="updateSearch"
        @update-selection="updateSelection" @update-dialog-visible="updateDialogVisible">

        <template #btns>
            <el-button type="primary" @click="handleAdd">
                新增
            </el-button>
        </template>

        <template #add-item-title>
            <span class="dialog-title">新增用户</span>
        </template>

        <template #add-item>
            <div>编辑人员</div>
        </template>
    </BaseTable>
</template>

<script lang="ts" setup>
import { ref, reactive, onBeforeMount } from 'vue'
import BaseTable from '@/components/common/base-table'
import type { Pagination } from '@/components/common'
import type { TableData, TableColumn } from '@/components/common/base-table'
import { debounce } from '@/utils/debounce'
import { AadminSideMenu } from '@/views/admin/component/aside'
import { type User } from '@/api/user/getUsers'
import { getUsersByJosn, emptyUsers, type GetUsersRequest } from '@/api/user/getUsers'
import { ResponseCode } from '@/api/responseCode'

// eslint-disable-next-line vue/multi-word-component-names
defineOptions({ name: AadminSideMenu.UserAll })


const cols: TableColumn[] = reactive([

    {
        prop: 'id',
        label: 'ID',
        sortable: true,
        width: 180,
        align: 'center',
    },
    {
        prop: 'img',
        label: '头像',
        width: 100,
        align: 'center',
        isImg: true,
    },
    {
        prop: 'user_name',
        label: '用户名',
        sortable: true,
        width: 150,
        align: 'center',
    },
    {
        prop: 'user_display_name',
        label: '昵称',
        sortable: true,
        width: 200,
        align: 'center',
    },
    {
        prop: 'user_email',
        label: '邮箱',
        sortable: true,
        width: 200,
        align: 'center',
    },
    {
        prop: 'role',
        label: '角色',
        sortable: true,
        width: 150,
        align: 'center',
    },
    {
        prop: 'user_status',
        label: '状态',
        sortable: true,
        width: 100,
        align: 'center',
    },
    {
        prop: 'post',
        label: '文章',
        sortable: true,
        width: 100,
        align: 'center',
    },
    {
        prop: 'created_at',
        label: '注册时间',
        sortable: true,
        width: 200,
        align: 'center',
    },

])

const pagination = ref<Pagination<User>>({
    total: 0,
    current_page: 1,
    page_size: 10,
    page_count: 1,
    page_sizes: [10, 20, 50, 100],
    records: [],
})

const search = ref('')

const dialogVisible = ref(false)

const handleAdd = () => {
    dialogVisible.value = !dialogVisible.value
}

const updateCurrentPage = async (val: number) => {
    pagination.value.current_page = val
    await getList({ current_page: val, page_size: pagination.value.page_size })
    console.log("1", val)
}

const updatePageSize = async (val: number) => {
    pagination.value.page_size = val
    await getList({ current_page: pagination.value.current_page, page_size: val })
    console.log("2", val)
    console.log("23", pagination.value)
}

const updatePageSizes = (val: any) => {
    // pagination.value.page_size = val
    console.log("22", val)
}


const editRow = (index: number, row: TableData) => {
    console.log("3", index, row)
}

const deleteRow = (index: number, row: TableData) => {
    console.log("4", index, row)
}

const deleteRows = (rows: TableData[]) => {
    console.log("5", rows)
}

const updateSearch = debounce(async (val: string) => {
    search.value = val
    await getList({ current_page: pagination.value.current_page, page_size: pagination.value.page_size, key_word: val })
    console.log("6", val)
}, 500)

const updateSelection = (rows: TableData[]) => {
    console.log("7", rows)
}

// 关闭上传对话框时清空上传文件列表
const updateDialogVisible = (val: boolean) => {
    if (!val) {
        dialogVisible.value = val
    }
}

// 获取用户列表
async function getList(getUsersRequest: GetUsersRequest = { current_page: 1, page_size: 10 }) {
    await getUsersByJosn(getUsersRequest).then((res) => {
        console.log("res.data.code==========>", res.data.code)
        if (res.data.code === ResponseCode.UserGetAllSuccess) {
            pagination.value = res.data.data
        } else {
            pagination.value = emptyUsers()
        }
    })
}


onBeforeMount(async () => {
    await getList() // 获取默认用户列表
})


</script>

<style scoped lang="scss">
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
</style>