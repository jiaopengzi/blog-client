<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-03-15 15:09:07
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-03-20 11:10:21
 * @FilePath     : \blog-client\src\views\admin\component\main\permission-role\index.vue
 * @Description  : 权限角色页面
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->
<template>
    <div class="container">
        <div class="btns">
            <el-button v-permission="PermissionNames.PermissionRole" type="primary" @click="debouncedUpdatePermission">
                更新权限
            </el-button>
        </div>
        <el-table :data="permissionsData" class="permission-table">
            <!-- 交叉表第一列 权限名称 -->
            <el-table-column prop="permissionDescription" label="权限" width="180"></el-table-column>

            <!-- 循环生成角色列 -->
            <el-table-column v-for="role in rolesList" :key="role.role_name" width="180">
                <template #header>
                    <div class="header-wrapper">
                        {{ role.description }}
                        <el-checkbox v-model="role.allSelected" @change="selectAll(role.role_name)"
                            :disabled="disabledRoleNames.includes(role.role_name)"></el-checkbox>
                    </div>
                </template>
                <template #default="{ row }">
                    <el-checkbox v-model="row[role.role_name]"
                        :disabled="disabledRoleNames.includes(role.role_name)"></el-checkbox>
                </template>
            </el-table-column>
        </el-table>

    </div>
</template>


<script lang="ts" setup>
import { ref, onBeforeMount, type Ref } from 'vue'
import { getRolesList, getPermissionList, PermissionNames } from '@/utils/permissionRole'
import type { Permission, Role, PermissionRow } from '@/views/admin/component/main/permission-role'
import { AadminSideMenu } from '@/views/admin/component/aside'
import { updateRolesAPI, type UpdateRolesRequest, type UpdateRoleRequest } from '@/api/permissionRole/updateRoles'
import { ResponseCode } from '@/api/responseCode'
import { ShowMsgTip } from '@/utils/message'
import { useUserStore } from '@/stores/user'
import { debounce } from "@/utils/debounce"


defineOptions({ name: AadminSideMenu.PermissionRole })


// 定义权限列表 包含权限名和权限描述
const permissionsList: Ref<Permission[]> = ref([])

// 禁用的角色名数组
const disabledRoleNames = ['Administrator']

// 定义角色列表和权限数据，使用 ref 使其为响应式数据
const rolesList: Ref<Role[]> = ref([])

// 定义权限数据
const permissionsData: Ref<PermissionRow[]> = ref([])


// 获取权限列表
const getPermissions = async () => {
    permissionsList.value = await getPermissionList()
}

// 根据权限名获取权限描述
function getPermissionDescription(permissionName: PermissionNames) {
    const permission = permissionsList.value.find(p => p.permission_name === permissionName)
    return permission ? permission.description : permissionName // 如果找不到描述，则返回权限名称
}


// 初始化权限表格
const initPermissionTable = async () => {
    const roles = await getRolesList()
    rolesList.value = roles.map((role: Role) => ({
        ...role,
        allSelected: false, // 初始化全选状态为 false
    }))

    // 初始化权限数据
    for (const permission in PermissionNames) {
        const rowData: PermissionRow = { permissionName: permission as PermissionNames, permissionDescription: getPermissionDescription(permission as PermissionNames) } as PermissionRow // 初始化每行权限数据
        rolesList.value.forEach((role: Role) => {
            // 根据角色的权限名数组判断是否拥有该权限
            rowData[role.role_name] = role.permission_names.includes(permission as PermissionNames)
        })
        permissionsData.value.push(rowData) // 将每行权限数据添加到权限数据数组中
    }
}


// 全选函数，根据角色名修改权限数据中对应的权限状态
function selectAll(roleName: string) {
    const role = rolesList.value.find((role: Role) => role.role_name === roleName)
    if (role) {
        permissionsData.value.forEach((row: PermissionRow) => {
            row[roleName] = role.allSelected ?? false
        })
    }
}

// 更新权限
const updatePermission = () => {
    // 用 permissionsData 拼接 UpdateRolesRequest 请求参数
    const updateRolesRequest: UpdateRolesRequest = {
        roles: rolesList.value.map((role: Role) => {
            const updateRoleRequest: UpdateRoleRequest = {
                role_name: role.role_name,
                permission_names: permissionsData.value.filter((row: PermissionRow) => row[role.role_name]).map((row: PermissionRow) => row.permissionName as PermissionNames)
            }
            return updateRoleRequest
        })
    }

    // 更新角色权限api
    updateRolesAPI(updateRolesRequest).then((res) => {

        if (res.data.code === ResponseCode.UpdateRoleSuccess) {
            // 更新用户信息
            const userStore = useUserStore()
            userStore.getUserInfoByToken()
            ShowMsgTip(ShowMsgTip.MsgType.success, res.data.msg, 2000)
            // 强制刷新页面 两秒后刷新
            // setTimeout(() => {
            //     location.reload()
            // }, 2000)
        } else {
            ShowMsgTip(ShowMsgTip.MsgType.warning, res.data.msg, 2000)
        }

    }).catch((err) => {
        ShowMsgTip(ShowMsgTip.MsgType.error, err, 2000)
    })
}

// 防抖更新权限 1秒内多次点击只执行一次
const debouncedUpdatePermission = debounce(updatePermission, 1000)

// 组件挂载后获取权限列表和初始化权限表格
onBeforeMount(async () => {
    await getPermissions()
    await initPermissionTable()
})

</script>
<style scoped lang="scss">
.container {
    margin: 10px;

    .btns {
        margin: 10px 0;
    }


    // 权限表格样式
    .permission-table {

        // 复选框样式
        .el-checkbox {
            display: flex;
            justify-content: center;
            align-items: center;
        }

        // 表头样式
        .header-wrapper {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
    }
}

.el-table {

    // 斑马纹样式
    :deep(.el-table__row:nth-child(odd)) {
        background-color: #f2f2f2;
    }
}
</style>