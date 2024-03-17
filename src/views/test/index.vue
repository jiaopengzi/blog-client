<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-01-12 10:19:24
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-03-17 15:44:51
 * @FilePath     : \blog-client\src\views\test\index.vue
 * @Description  : 显示用户信息下拉菜单
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->
<template>
  <el-table :data="permissionsData" class="permission-table" border>
    <el-table-column prop="permissionDescription" label="权限" width="180"></el-table-column>

    <el-table-column v-for="role in rolesList" :key="role.role_name" width="180">
      <template #header>
        <div class="header-wrapper">
          {{ role.description }}
          <el-checkbox v-model="role.allSelected" @change="selectAll(role.role_name)"
            :disabled="disabledRoleNames.includes(role.role_name)"></el-checkbox>
        </div>
      </template>
      <template #default="{ row }">
        <el-checkbox v-model="row[role.role_name]" :disabled="disabledRoleNames.includes(role.role_name)"></el-checkbox>
      </template>
    </el-table-column>
  </el-table>
</template>


<script lang="ts" setup>
import { ref, onMounted, type Ref } from 'vue'
import { getRolesList, getPermissionList, PermissionNames } from '@/utils/permissionRole'

// 定义角色接口
interface Role {
  role_name: string; // 角色名称
  permission_names: PermissionNames[]; // 权限名称数组
  description: string; // 角色描述
  allSelected?: boolean; // 是否全选，可选属性
}

// 定义权限接口
interface Permission {
  permission_name: PermissionNames; // 权限名称
  description: string; // 权限描述
}

// 定义权限行接口，权限名+角色名对应的权限状态
type PermissionRow = { permissionDescription: string } & { [roleName: string]: boolean }


// 定义权限列表 包含权限名和权限描述
const permissionsList: Ref<Permission[]> = ref([])

defineOptions({ name: 'TestC' })

const disabledRoleNames = ['Administrator'] // 禁用的角色名数组

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
    const rowData: PermissionRow = { permissionDescription: getPermissionDescription(permission as PermissionNames) }// 初始化每行权限数据
    rolesList.value.forEach((role: Role) => {
      // 根据角色的权限名数组判断是否拥有该权限
      rowData[role.role_name] = role.permission_names.includes(permission)
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

// 组件挂载后获取权限列表和初始化权限表格
onMounted(async () => {
  await getPermissions()
  await initPermissionTable()
  console.log('PermissionNames:', permissionsData.value)
})

</script>
<style scoped lang="scss">
// 权限表格样式
.permission-table {
  // 表格样式
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

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

.el-table {

  // 斑马纹样式
  :deep(.el-table__row:nth-child(odd)) {
    background-color: #f2f2f2;
  }
}
</style>