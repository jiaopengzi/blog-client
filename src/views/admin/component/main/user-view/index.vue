<!--
 * @FilePath     : \blog-client\src\views\admin\component\main\user-view\index.vue
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
 * @Description  : 所有用户列表
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
                <!-- v-for 循环 userCountGroupByRole生成 按钮 -->
                <div class="category-group">
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
                    <EditUser :roles="roles" :edit-user-data="editUserByAdminForm" @edit-user-status="editStatus" />
                </div>
            </template>
        </BaseTable>
    </section>
</template>

<script lang="ts" setup>
import { onBeforeMount, reactive, ref } from "vue"

import { type Role } from "@/api/permissionRole/role"
import { type QueryParamsRecord } from "@/api/request"
import { ResponseCode } from "@/api/response"
import { deleteUserAPI, type DeleteUserRequest } from "@/api/user/deleteUser"
import { getUserCountGroupByRoleAPI, type UserCountGroupByRole } from "@/api/user/getUserCountGroupByRole"
import { type User } from "@/api/user/getUsers"
import { getUsersAPI, type GetUsersRequest } from "@/api/user/getUsers"
import type { TableColumn, TableData } from "@/components/common/base-table"
import BaseTable from "@/components/common/base-table"
import { useBaseTable } from "@/components/hooks/useBaseTable"
import { useParams } from "@/components/hooks/useParams"
import { RouteNames } from "@/router"
import { formatTime } from "@/utils/dateTime"
import { getRolesList } from "@/utils/permissionRole"
import AddUser from "@/views/admin/component/main/user-view/component/add-user"
import { type EditUserByAdminForm } from "@/views/admin/component/main/user-view/component/edit-user"
import EditUser from "@/views/admin/component/main/user-view/component/edit-user"

defineOptions({ name: RouteNames.UserView })

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

// 字符串类型的 key
const stringKeys: StringKeys<GetUsersRequest>[] = ["role_name", "key_word"]

// 数字类型的 key
const numberKeys: NumberKeys<GetUsersRequest>[] = ["current_page", "page_size"]

// 不需要请求的参数
const noRequestKeys: QueryParamsRecord<queryKey> = { [queryKey.RoleName]: AllRoleName }

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

        if ("Time" in row.disable_expires_at && "Valid" in row.disable_expires_at && row.disable_expires_at.Valid === true) {
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
    updateRouterPush, // 更新查询参数和路由
    updatePaginate,
} = useBaseTable<User, GetUsersRequest, DeleteUserRequest>(
    RouteNames.UserView,
    getUsersAPI,
    ResponseCode.UserGetAllSuccess,
    deleteUserAPI,
    ResponseCode.DeleteUserSuccess,
    queryParams,
    { stringKeys, numberKeys, noRequestKeys },
)

// 更新数据
const updateData = async () => {
    updateRouterPush()
    await updatePaginate()
}

// 执行搜索
const runSearch = async () => {
    await updateData()
}

const handleUserCountByRole = async (role: string) => {
    activeRole.value = role
    // 添加路由跳转
    Object.assign(queryParams, {
        [queryKey.RoleName]: role,
        [queryKey.KeyWord]: search.value,
    })

    await updateData()
}

// 在加载前将 params 解析回对应的响应式变量中
useParams(queryParams, search, pagination)

onBeforeMount(async () => {
    await getRoles()
    await getUserCountGroupByRole()

    const { role_name } = queryParams

    if (role_name) {
        activeRole.value = role_name
    }
})
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
