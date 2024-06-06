<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-03-20 13:58:49
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-06-06 17:48:22
 * @FilePath     : \blog-client\src\views\admin\component\main\user-all\index.vue
 * @Description  : 所有用户页面
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->

<template>
    <BaseTable :pagination="pagination" :table-column="cols" :dialog-visible="dialogVisible" :is-show-delete-all="false"
        :search-str="search" @update-current-page="updateCurrentPage" @update-page-size="updatePageSize"
        @update-page-sizes="updatePageSizes" @edit-row="editRow" @delete-row="deleteRow" @delete-rows="deleteRows"
        @update-search="updateSearch" @update-selection="updateSelection" @update-dialog-visible="updateDialogVisible">

        <template #btns>
            <el-button type="primary" @click="handleAdd">
                新增
            </el-button>
            <!-- v-for 循环 userCountGroupByRole生成 按钮 -->
            <div class="user-count-by-role">
                <el-button v-for="item in userCountGroupByRole" :key="item.role_name"
                    :class="{ active: item.role_name === activeRole }" @click="handleUserCountByRole(item.role_name)">
                    {{ roleDisplay(item.role_name) }} ({{ item.user_count }})
                </el-button>
            </div>

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
import { ref, reactive, onBeforeMount, watch } from 'vue'
import BaseTable from '@/components/common/base-table'
import type { Pagination } from '@/components/common'
import type { TableData, TableColumn } from '@/components/common/base-table'
import { debounce } from '@/utils/debounce'
import { AadminSideMenu } from '@/views/admin/component/aside'
import { type User } from '@/api/user/getUsers'
import { getUsersByJosn, emptyUsers, type GetUsersRequest, } from '@/api/user/getUsers'
import { getUserCountGroupByRoleByJosn, type UserCountGroupByRole } from '@/api/user/getUserCountGroupByRole'
import { getRolesByJson, type Role } from '@/api/permissionRole/role'
import { ResponseCode } from '@/api/responseCode'
import router from '@/router/index'


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
const AllRoleName = 'AllRole'
const activeRole = ref(AllRoleName)

const handleAdd = () => {
    dialogVisible.value = !dialogVisible.value
    // dialogVisible.value = true
    console.log("00============", dialogVisible.value)
}

const updateCurrentPage = async (val: number) => {
    pagination.value.current_page = val
    routerPush(pagination.value.page_size, val, activeRole.value, search.value)
    console.log("01============", val)
}

const updatePageSize = async (val: number) => {
    pagination.value.page_size = val
    routerPush(val, pagination.value.current_page, activeRole.value, search.value)
    console.log("02============", val)

}

const updatePageSizes = (val: any) => {
    // pagination.value.page_size = val
    console.log("03============", val)
}


const editRow = (index: number, row: TableData) => {
    console.log("04============", index, row)
}

const deleteRow = (index: number, row: TableData) => {
    console.log("05============", index, row)
}

const deleteRows = (rows: TableData[]) => {
    console.log("06============", rows)
}

const updateSearch = debounce(async (val: string) => {
    search.value = val
    routerPush(pagination.value.page_size, pagination.value.current_page, activeRole.value, val)
    console.log("07============", val)

}, 500)

watch(search, (newVal) => {
    console.log("08============", newVal)
})

const updateSelection = (rows: TableData[]) => {
    console.log("18============", rows)
}

// 关闭上传对话框时清空上传文件列表
const updateDialogVisible = (val: boolean) => {
    console.log("09============", val)
    dialogVisible.value = val
    // if (!val) {
    //     dialogVisible.value = val
    // }
}

// 获取分页用户
async function getUserPaginate(getUsersRequest: GetUsersRequest) {
    // 如果 role_name 为 AllRoleName 则不传 role_name
    if (getUsersRequest.role_name === AllRoleName) {
        delete getUsersRequest.role_name
    }
    // 如果 key_word 为空 则不传 key_word
    if (!getUsersRequest.key_word) {
        delete getUsersRequest.key_word
    }

    // 获取用户列表
    await getUsersByJosn(getUsersRequest).then((res) => {
        if (res.data.code === ResponseCode.UserGetAllSuccess) {
            pagination.value = res.data.data
        } else {
            pagination.value = emptyUsers()
        }
    })
}

// 用户角色列表
const userCountGroupByRole = ref<UserCountGroupByRole[]>([])


// 获取角色列表
const Roles = ref<Role[]>([])

async function getRoles() {
    await getRolesByJson().then((res) => {
        if (res.data.code === ResponseCode.GetRoleSuccess) {
            const newRole = { role_name: AllRoleName, permission_names: [], description: '全部' }
            Roles.value = [newRole, ...res.data.data]

        }
    })
}


// 获取用户列表
async function getUserCountGroupByRole() {
    await getUserCountGroupByRoleByJosn().then((res) => {
        if (res.data.code === ResponseCode.GetUserCountGroupByRolesSuccess) {
            const roles = res.data.data
            const total = roles.reduce((prev, cur) => {
                return prev + cur.user_count
            }, 0)
            const newRole = { role_name: AllRoleName, user_count: total }
            userCountGroupByRole.value = [newRole, ...roles]
        }
    })
}


//  根据角色名称获取角色描述
function roleDisplay(role: string) {
    const roleObj = Roles.value.find((item) => item.role_name === role)
    return roleObj ? roleObj.description : role
}

const handleUserCountByRole = async (role: string) => {
    activeRole.value = role
    // 添加路由跳转
    console.log("10============")
    routerPush(pagination.value.page_size, pagination.value.current_page, role, search.value)
}


// 路由跳转
function routerPush(pageSize: number, currentPage: number, roleName: string, searchStr: string) {

    // 当搜索关键字为空时，roleName 为 AllRoleName 则跳转到全部用户页面
    if (!searchStr && roleName === AllRoleName) {
        router.push({
            name: AadminSideMenu.UserAll,
            query: {
                'page-size': pageSize,
                'current-page': currentPage,
            }
        })
        return
    }

    // 当搜索关键字为空时，roleName 不为 AllRoleName 则跳转到指定角色页面
    if (!searchStr) {
        router.push({
            name: AadminSideMenu.UserAll,
            query: {
                'page-size': pageSize,
                'current-page': currentPage,
                'role-name': roleName,
            }
        })
        return
    }

    // 当搜索关键字不为空时，roleName 为 AllRoleName 则跳转到全部用户页面关键字搜索
    if (roleName === AllRoleName) {
        router.push({
            name: AadminSideMenu.UserAll,
            query: {
                'page-size': pageSize,
                'current-page': currentPage,
                'search': searchStr,
            }
        })
        return
    }

    // 当搜索关键字不为空时，roleName 不为 AllRoleName 则跳转到指定角色页面关键字搜索
    router.push({
        name: AadminSideMenu.UserAll,
        query: {
            'page-size': pageSize,
            'current-page': currentPage,
            'role-name': roleName,
            'search': searchStr,
        }
    })

}


// 从路由中query中获取值
function getValueFromQuery() {
    pagination.value.page_size = Number(router.currentRoute.value.query['page-size']) || 10
    pagination.value.current_page = Number(router.currentRoute.value.query['current-page']) || 1
    activeRole.value = router.currentRoute.value.query['role-name'] as string || AllRoleName
    search.value = router.currentRoute.value.query['search'] as string || ''
    console.log("12============", search.value)
}



onBeforeMount(async () => {
    console.log("13============")
    getValueFromQuery()
    await getRoles() // 获取角色列表
    await getUserCountGroupByRole() // 按照角色获取用户数量
    await getUserPaginate({ role_name: activeRole.value, current_page: pagination.value.current_page, page_size: pagination.value.page_size, key_word: search.value })
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
</style>