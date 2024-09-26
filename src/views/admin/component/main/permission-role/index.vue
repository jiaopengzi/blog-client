<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-03-15 15:09:07
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-09-26 20:15:46
 * @FilePath     : \blog-client\src\views\admin\component\main\permission-role\index.vue
 * @Description  : 权限角色页面
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->
<template>
    <div class="container">
        <div class="btns">
            <el-button v-permission="PermissionNames.PermissionRole" type="primary" @click="updatePermission">
                更新权限
            </el-button>
        </div>
        <el-table :data="permissionsData" class="permission-table">
            <!-- 交叉表第一列 权限名称 -->
            <el-table-column prop="permissionDescription" label="权限" width="180"></el-table-column>

            <!-- 循环生成角色列 -->
            <el-table-column v-for="role in rolesList" :key="role.role_name" width="200">
                <template #header>
                    <div class="header-wrapper">
                        {{ role.description }}
                        <el-checkbox v-model="role.allSelected" @change="selectAll(role.role_name)"
                            :disabled="disabledRoleNames.includes(role.role_name)"></el-checkbox>
                    </div>
                </template>
                <template #default="{ row }">
                    <div class="cell" :class="{ 'show-edit': row[role.role_name] }">
                        <el-checkbox class="cell-checkbox" v-model="row[role.role_name]"
                            :disabled="disabledRoleNames.includes(role.role_name)"></el-checkbox>
                        <el-button type="primary" class="cell-edit" v-if="!disabledRoleNames.includes(role.role_name)"
                            @click="handleCellEditClick(row.permissionName, role.role_name)">编辑</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <!-- 弹窗 edit -->
    <el-dialog v-model="editItemDialogVisibleStatus" @close="editItemHandleDialogClose" width="30%">
        <template #header>
            <h3>编辑</h3>
        </template>
        <template #default>
            <el-form :rules="rules" :label-position="labelPosition" label-width="100px" ref="permissionRoleFormRef"
                :model="permissionRoleForm" class="permission-role-form" :size="formSize" status-icon>
                <el-form-item label="权限名称">
                    <el-input v-model.trim="permissionRoleForm.permission_name" disabled />
                </el-form-item>

                <el-form-item label="角色名称">
                    <el-input v-model.trim="permissionRoleForm.role_name" disabled />
                </el-form-item>
                <el-form-item label="限制次数说明">
                    <h4>-1表示不限制，0表示不开放，大于0表示限制对应限制次数.</h4>
                </el-form-item>
                <el-form-item label="限制次数" prop="limit_count">
                    <el-input type="number" v-model="permissionRoleForm.limit_count" />
                </el-form-item>
                <el-form-item label="限制次数选项">
                    <div class="multi-btn">
                        <el-button class="multi-btn-item" size="default" v-for="count in limitCountList" :key="count"
                            type="primary" @click="handleInsertLimitCount(count)">{{
                                count
                            }}</el-button>
                    </div>

                </el-form-item>

                <el-form-item label="限制时长-秒" prop="limit_period">
                    <el-input type="number" v-model="permissionRoleForm.limit_period" />
                </el-form-item>


                <el-form-item label="限制时长选项">
                    <div class="multi-btn">
                        <el-button class="multi-btn-item" size="default" width="100px"
                            v-for="item in Object.values(LimitPeriod).filter(value => typeof value !== 'number')"
                            :key="item" type="primary"
                            @click="handleInsertLimitPeriod(item as keyof typeof LimitPeriod)">{{
                                item
                            }}</el-button>
                    </div>
                </el-form-item>


                <div class="save-delete">
                    <el-button size="default" type="primary"
                        @click="submitUpsertForm(permissionRoleFormRef as FormInstance)">保存</el-button>
                    <el-button size="default" type="danger"
                        @click="submitDeleteForm(permissionRoleFormRef as FormInstance)">删除</el-button>
                </div>
            </el-form>
        </template>
    </el-dialog>
</template>


<script lang="ts" setup>
import { ref, onBeforeMount, reactive, useTemplateRef, type Ref } from 'vue'
import { getRolesList, getPermissionList, PermissionNames } from '@/utils/permissionRole'
import type { FormInstance, FormRules } from 'element-plus' // 需要全部安装 npm i element-plus -S
import type { Permission, Role, PermissionRow } from '@/views/admin/component/main/permission-role'
import { AadminSideMenu } from '@/views/admin/component/aside'
import { updateRolesAPI, type UpdateRolesRequest, type UpdateRoleRequest } from '@/api/permissionRole/updateRoles'
import { ResponseCode } from '@/api/responseCode'
import { ShowMsgTip } from '@/utils/message'
import { useUserStore } from '@/stores/user'
import { debounce } from 'throttle-debounce'
import { type PermissionRole, LimitPeriod } from '@/views/admin/component/main/permission-role'
import { upsertPermissionRoleAPI, type UpsertPermissionRoleRequest } from '@/api/permissionRole/upsertPermissionRole'
import { deletePermissionRoleAPI, type DeletePermissionRoleRequest } from '@/api/permissionRole/deletePermissionRole'
import { getPermissionRoleAPI, type GetPermissionRoleRequest } from '@/api/permissionRole/getPermissionRole'


defineOptions({ name: AadminSideMenu.PermissionRole })


// 定义权限列表 包含权限名和权限描述
const permissionsList: Ref<Permission[]> = ref([])

// 禁用的角色名数组
const disabledRoleNames = ['Administrator']

// 定义角色列表和权限数据，使用 ref 使其为响应式数据
const rolesList: Ref<Role[]> = ref([])

// 定义权限数据
const permissionsData: Ref<PermissionRow[]> = ref([])

const editItemDialogVisibleStatus = ref(false) // 对话框状态

// 关闭对话框
const editItemHandleDialogClose = () => {
    editItemDialogVisibleStatus.value = false
}

// 编辑单元格点击事件
const handleCellEditClick = async (permissionName: string, roleName: string) => {
    editItemDialogVisibleStatus.value = true
    // 更新 permissionRoleForm 数据
    permissionRoleForm.permission_name = permissionName as PermissionNames
    permissionRoleForm.role_name = roleName
    // 设置 limt_count 和 limit_period 默认值
    permissionRoleForm.limit_count = 0
    permissionRoleForm.limit_period = 600

    // 更新权限角色信息
    await updatePermissionRole(permissionName, roleName)
}

// 编辑单元格点击事件
const updatePermissionRole = async (permissionName: string, roleName: string) => {
    // 获取权限角色信息
    const req: GetPermissionRoleRequest = {
        permission_name: permissionName as PermissionNames,
        role_name: roleName
    }

    // 从后端获取权限角色信息
    await getPermissionRoleAPI(req).then((res) => {
        if (res.data.code === ResponseCode.GetPermissionRoleSuccess) {
            const permissionRole = res.data.data
            permissionRoleForm.limit_count = permissionRole.limit_count
            permissionRoleForm.limit_period = permissionRole.limit_period
        }
    })

}

// 表单label位置 top | left | right
const labelPosition = ref('left')
// 表单大小 '' | 'large' | 'default' | 'small'
const formSize = ref('large')

// 表单实例
const permissionRoleFormRef = useTemplateRef<FormInstance>("permissionRoleFormRef")

// 表单数据
const permissionRoleForm = reactive<PermissionRole>({
    permission_name: PermissionNames.AddMedia, //权限名称
    role_name: "",// 角色名称
    limit_count: 0,// 限制次数 -1表示不限制，0表示不开放, >0表示次数
    limit_period: 600,// 限制时间段 例如 1h, 1d, 1w, 1m, 1y
})

const handleInsertLimitPeriod = (key: keyof typeof LimitPeriod) => {
    permissionRoleForm.limit_period = LimitPeriod[key]
}

// 限制次数选项
const limitCountList = [10, 20, 50, 100, 200, 500, 1000]

// 插入限制次数
const handleInsertLimitCount = (count: number) => {
    permissionRoleForm.limit_count = count
}


/**
   * @description: 大约等于 -1 的整数 Validator (el-form-item 需要绑定对应的prop才能触发校验)
   * @param rule 校验规则
   * @param value 对应输入框的值
   * @param callback 回调函数
   */
function validateIntegerAroundMinusOne(
    rule: any,
    value: string,
    callback: (error?: string | Error | undefined) => void,
): void {
    // 正整数或者-1
    if (!/^-1$|^[0-9]\d*$/.test(value)) {
        callback(new Error('请输入大约等于 -1 整数'))
    } else {
        callback()
    }
}

/**
   * @description: 正整数 Validator (el-form-item 需要绑定对应的prop才能触发校验)
   * @param rule 校验规则
   * @param value 对应输入框的值
   * @param callback 回调函数
   */
function validatePositiveInteger(
    rule: any,
    value: string,
    callback: (error?: string | Error | undefined) => void,
): void {
    if (!/^[1-9]\d*$/.test(value)) {
        callback(new Error('请输入正整数'))
    } else {
        callback()
    }
}

/**
 * @description: 表单校验规则
 * @return  FormRules<PermissionRole> 表单校验规则 trigger: 'blur' 表示失去焦点时校验 'change' 表示值改变时校验
 */
const rules = reactive<FormRules<PermissionRole>>({
    limit_count: [
        { required: true, message: '限制次数为正整数', trigger: 'blur' },
        // 用户查重
        { validator: validateIntegerAroundMinusOne, trigger: 'blur' },
    ],
    limit_period: [
        { required: true, message: '限制周期为正整数(秒数)', trigger: 'blur' },
        // 邮箱查重
        { validator: validatePositiveInteger, trigger: 'blur' },
    ],
})

// 提交更新表单
const submitUpsertForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    try {
        await formEl.validate(async (valid) => {
            if (valid) {
                const req: UpsertPermissionRoleRequest = {
                    permission_name: permissionRoleForm.permission_name,
                    role_name: permissionRoleForm.role_name,
                    limit_count: Number(permissionRoleForm.limit_count),
                    limit_period: Number(permissionRoleForm.limit_period)
                }

                const { data } = await upsertPermissionRoleAPI(req)

                if (data.code === ResponseCode.UpsertPermissionRoleSuccess) {
                    // 添加成功提示
                    ShowMsgTip(ShowMsgTip.MsgType.success, data.msg, 6000)

                } else {
                    // 错误提示
                    const errorMsg = () => {
                        const errorData = data.data
                        if (errorData.limit_count) {
                            return errorData.limit_count
                        }
                        if (errorData.limit_period) {
                            return errorData.limit_period
                        }
                        return data.msg
                    }

                    ShowMsgTip(ShowMsgTip.MsgType.error, errorMsg(), 0)
                }
            }
        })
    } catch (error) {
        return
    }
}

// 提交删除表单
const submitDeleteForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    try {
        await formEl.validate(async (valid) => {
            if (valid) {
                // 创建请求对象 加密内容
                const req: DeletePermissionRoleRequest = {
                    permission_name: permissionRoleForm.permission_name,
                    role_name: permissionRoleForm.role_name,
                }

                const { data } = await deletePermissionRoleAPI(req)

                if (data.code === ResponseCode.DeletePermissionRoleSuccess) {
                    // 将 limt_count 和 limit_period 设置为 0
                    permissionRoleForm.limit_count = 0
                    permissionRoleForm.limit_period = 600
                    // 添加成功提示
                    ShowMsgTip(ShowMsgTip.MsgType.success, data.msg, 6000)

                } else {
                    // 添加失败提示
                    ShowMsgTip(ShowMsgTip.MsgType.error, data.msg, 0)
                }
            }
        })
    } catch (error) {
        return
    }
}

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

// 更新权限  防抖更新权限 1秒内多次点击只执行一次
const updatePermission = debounce(1000, () => {
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
})



// 组件挂载后获取权限列表和初始化权限表格
onBeforeMount(async () => {
    await getPermissions()
    await initPermissionTable()
})

</script>
<style scoped lang="scss">
h3 {
    font-size: 16px;
    font-weight: 700;
    margin: 0;
}

h4 {
    font-weight: 700;
}

.container {
    margin: 10px;

    .btns {
        margin: 10px 0;
    }

    // 权限表格样式
    .permission-table {

        // 表头样式
        .header-wrapper {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }

        // 单元格样式
        .cell {
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;

            .cell-checkbox {
                position: relative;
                z-index: 1;
            }

            .cell-edit {
                margin-left: 5px;
                font-size: 12px;
                padding: 0 5px;
                opacity: 0;
                transition: opacity 0.3s ease;
                position: absolute;
                left: 100px;
                white-space: nowrap;
            }

            // 鼠标悬浮时 且 复选框选中时 显示编辑按钮
            &.show-edit:hover .cell-edit {
                opacity: 1;
            }
        }
    }
}

.save-delete {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
}

.multi-btn {
    //   多行按钮
    display: flex;
    flex-wrap: wrap; // 换行
}

.multi-btn-item {
    margin: 5px;
    width: 50px; // 固定宽度
}

.el-table {

    // 斑马纹样式
    :deep(.el-table__row:nth-child(odd)) {
        background-color: #f2f2f2;
    }
}
</style>