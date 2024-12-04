<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-03-20 13:58:49
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-04 21:37:20
 * @FilePath     : \blog-client\src\views\admin\component\main\user-view\index.vue
 * @Description  : 所有用户页面
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->

<template>
    <BaseTable
        :pagination="pagination"
        :table-column="cols"
        :add-item-dialog-visible="addItemDialogVisible"
        :edit-item-dialog-visible="editItemDialogVisible"
        :is-show-delete-all="true"
        :is-show-search="true"
        :search-str="search"
        :is-show-edit="true"
        @update-current-page="updateCurrentPage"
        @update-page-size="updatePageSize"
        @edit-row="editRow"
        @delete-rows="deleteRows"
        @update-search="updateSearch"
        @run-search="runSearch"
        @update-selection="updateSelection"
        @add-item-update-dialog-visible="addItemUpdateDialogVisible"
        @edit-item-update-dialog-visible="editItemUpdateDialogVisible"
    >
        <template #btns>
            <el-button type="primary" @click="toggleAddDialog"> 新增 </el-button>
        </template>
        <template #category>
            <!-- v-for 循环 userCountGroupByRole生成 按钮 -->
            <div class="category">
                <el-button
                    v-for="item in userCountGroupByRole"
                    :key="item.role_name"
                    :class="{ active: item.role_name === activeRole }"
                    @click="handleUserCountByRole(item.role_name)"
                >
                    {{ roleDisplay(item.role_name) }} ({{ item.user_count }})
                </el-button>
            </div>
        </template>

        <!-- 新增弹窗 -->
        <template #add-item-title>
            <span class="dialog-title">新增用户</span>
        </template>

        <template #add-item>
            <div class="dialog-add">
                <AddUser :roles="roles" @add-user-status="addStatus" />
            </div>
        </template>

        <!-- 编辑弹窗 -->
        <template #edit-item-title>
            <span class="dialog-title">编辑用户</span>
        </template>

        <template #edit-item>
            <div class="dialog-edit">
                <EditUser
                    :roles="roles"
                    :edit-user-data="editUserByAdminForm"
                    @edit-user-status="editStatus"
                />
            </div>
        </template>
    </BaseTable>
</template>

<script lang="ts" setup>
import { ref, watch, reactive, onBeforeMount } from "vue"
import type { TableData, TableColumn } from "@/components/common/base-table"
import { AdminSideMenu } from "@/views/admin/component/aside"
import { type User } from "@/api/user/getUsers"
import { getUsersAPI, type GetUsersRequest } from "@/api/user/getUsers"
import {
    getUserCountGroupByRoleAPI,
    type UserCountGroupByRole,
} from "@/api/user/getUserCountGroupByRole"
import { getRolesList } from "@/utils/permissionRole"
import { type Role } from "@/api/permissionRole/role"
import { ResponseCode } from "@/api/responseCode"
import { deleteUserAPI, type DeleteUserRequest } from "@/api/user/deleteUser"
import { type EditUserByAdminForm } from "@/views/admin/component/main/user-view/component/edit-user"
import { formatTime } from "@/utils/dateTime"
import { useGetData } from "@/components/hooks/useGetData"
import { useBaseTable, type QueryRecord, type Options } from "@/components/hooks/useBaseTable"

import BaseTable from "@/components/common/base-table"
import AddUser from "@/views/admin/component/main/user-view/component/add-user"
import EditUser from "@/views/admin/component/main/user-view/component/edit-user"

defineOptions({ name: AdminSideMenu.UserView })

const cols: TableColumn[] = reactive([
    {
        prop: "id",
        label: "ID",
        sortable: true,
        minWidth: 180,
        align: "center",
    },
    {
        prop: "img",
        label: "头像",
        minWidth: 100,
        align: "center",
        isImg: true,
    },
    {
        prop: "user_name",
        label: "用户名",
        sortable: true,
        minWidth: 150,
        align: "center",
    },
    {
        prop: "user_display_name",
        label: "昵称",
        sortable: true,
        minWidth: 180,
        align: "center",
    },
    {
        prop: "user_email",
        label: "邮箱",
        sortable: true,
        minWidth: 180,
        align: "center",
    },
    {
        prop: "role",
        label: "角色",
        sortable: true,
        minWidth: 140,
        align: "center",
    },
    {
        prop: "disable_expires_at",
        label: "禁用到期时间",
        sortable: true,
        minWidth: 180,
        align: "center",
        isTest: true,
        formatter: (row: TableData) => getDisableExpiresTime(row),
    },
    {
        prop: "post",
        label: "文章",
        sortable: true,
        minWidth: 80,
        align: "center",
    },
    {
        prop: "created_at",
        label: "注册时间",
        sortable: true,
        minWidth: 180,
        align: "center",
    },
])

const AllRoleName = "AllRole"
const activeRole = ref(AllRoleName)

// url query key
enum queryKey {
    RoleName = "role_name",
    KeyWord = "key_word",
}

// 查询参数
const queryParams: GetUsersRequest = reactive({} as GetUsersRequest)

// 不需要请求的参数
const noRequest: QueryRecord<queryKey> = { [queryKey.RoleName]: AllRoleName }

const getDisableExpiresTime = (row: TableData) => {
    if ("disable_expires_at" in row) {
        // 如果 disable_expires_at 为 null 则返回 '永久'
        if (row.disable_expires_at === null) {
            return "未禁用"
        }

        // 如果 disable_expires_at 为 Valid 为 false 则返回 ''
        if ("Valid" in row.disable_expires_at && row.disable_expires_at.Valid === false) {
            return "未禁用"
        }

        if ("Time" in row.disable_expires_at && row.disable_expires_at.Time !== null) {
            // 获取当前时间
            const now = new Date()
            // 获取禁用过期时间
            const disableExpiresAt = new Date(row.disable_expires_at.Time)
            // 如果禁用过期时间小于当前时间则返回 '已过期'
            if (disableExpiresAt < now) {
                return "未禁用"
            }
            return formatTime(row.disable_expires_at.Time.toString())
        }
    }
}

// 需要编辑的用户ID
const editUserByAdminForm = reactive<EditUserByAdminForm>({
    editUserID: "",
    userName: "",
    email: "",
    disableExpiresAt: {
        Time: null,
        Valid: false,
    },
    password: "",
    roleName: "",
    nickName: "",
    sex: "男",
    description: "",
})

const editRow = (index: number, row: TableData) => {
    console.log("04============", index, row)
    // 断言 row 中有 user_name ts 不会报错
    if ("disable_expires_at" in row) {
        // 如果 disable_expires_at 为 null 则返回 '永久'
        if (row.disable_expires_at === null) {
            editUserByAdminForm.disableExpiresAt = {
                Time: null,
                Valid: false,
            }

            editUserByAdminForm.editUserID = row.id.toString()
            editUserByAdminForm.userName = row.user_name
            editUserByAdminForm.email = row.user_email
            editUserByAdminForm.password = ""
            editUserByAdminForm.nickName = row.user_display_name
            editUserByAdminForm.roleName = row.role
            return
        }

        // 如果 disable_expires_at 为 Valid 为 false 则返回 ''
        if ("Valid" in row.disable_expires_at && row.disable_expires_at.Valid === false) {
            editUserByAdminForm.disableExpiresAt = {
                Time: null,
                Valid: false,
            }
            editUserByAdminForm.editUserID = row.id.toString()
            editUserByAdminForm.userName = row.user_name
            editUserByAdminForm.email = row.user_email
            editUserByAdminForm.password = ""
            editUserByAdminForm.nickName = row.user_display_name
            editUserByAdminForm.roleName = row.role
            return
        }

        if (
            "Time" in row.disable_expires_at &&
            "Valid" in row.disable_expires_at &&
            row.disable_expires_at.Valid === true
        ) {
            editUserByAdminForm.disableExpiresAt = {
                Time: row.disable_expires_at.Time,
                Valid: row.disable_expires_at.Valid,
            }
            editUserByAdminForm.editUserID = row.id.toString()
            editUserByAdminForm.userName = row.user_name
            editUserByAdminForm.email = row.user_email
            editUserByAdminForm.password = ""
            editUserByAdminForm.nickName = row.user_display_name
            editUserByAdminForm.roleName = row.role
        }
    }
    toggleEditDialog()
}

const updateSelection = (rows: TableData[]) => {
    console.log("18============", rows)
}

// 用户角色列表
const userCountGroupByRole = ref<UserCountGroupByRole[]>([])

// 获取角色列表
const roles = ref<Role[]>([]) // 不包含全部角色
const rolesALL = ref<Role[]>([]) // 包含全部角色

async function getRoles() {
    await getRolesList().then((res) => {
        const newRole = { role_name: AllRoleName, permission_names: [], description: "全部" }
        roles.value = res.roles
        rolesALL.value = [newRole, ...res.roles]
    })
}

// 获取用户列表
async function getUserCountGroupByRole() {
    await getUserCountGroupByRoleAPI().then((res) => {
        if (res.data.code === ResponseCode.GetUserCountGroupByRolesSuccess) {
            const rolesALL = res.data.data
            const total = rolesALL.reduce((prev, cur) => {
                return prev + cur.user_count
            }, 0)
            const newRole = { role_name: AllRoleName, user_count: total }
            userCountGroupByRole.value = [newRole, ...rolesALL]
        }
    })
}

//  根据角色名称获取角色描述
function roleDisplay(role: string) {
    const roleObj = rolesALL.value.find((item) => item.role_name === role)
    return roleObj ? roleObj.description : role
}

const handleUserCountByRole = async (role: string) => {
    activeRole.value = role
    // 添加路由跳转
    Object.assign(queryParams, {
        [queryKey.RoleName]: role,
        [queryKey.KeyWord]: search.value,
    })
}

const options: Options<GetUsersRequest> = {
    queryParams,
    noRequest,
}

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
    runSearch, // 执行搜索
    addStatus, // 添加状态
    editStatus, // 编辑状态
    addItemUpdateDialogVisible, // 新增对话框
    editItemUpdateDialogVisible, // 编辑对话框
    deleteRows, // 删除行
} = useBaseTable<User, GetUsersRequest, DeleteUserRequest>(
    AdminSideMenu.UserView,
    getUsersAPI,
    ResponseCode.UserGetAllSuccess,
    deleteUserAPI,
    ResponseCode.DeleteUserSuccess,
    options,
)
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

.category {
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
            content: "";
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
