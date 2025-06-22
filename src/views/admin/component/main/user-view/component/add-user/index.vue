<!--
 * @FilePath     : \blog-client\src\views\admin\component\main\user-view\component\add-user\index.vue
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
 * @Description  : 添加用户
-->

<template>
    <div class="add-user-page">
        <el-form
            :label-position="labelPosition"
            label-width="100px"
            ref="addUserFormRef"
            :model="addUserForm"
            :rules="rules"
            class="add-user-form"
            :size="formSize"
            status-icon
        >
            <el-form-item label="用户名" prop="userName">
                <el-input v-model="addUserForm.userName" />
            </el-form-item>

            <el-form-item label="邮箱" prop="email">
                <el-input v-model="addUserForm.email" />
            </el-form-item>

            <el-form-item label="密码" prop="password">
                <el-input class="generate-password" type="text" v-model="addUserForm.password" />
                <button type="button" class="btn-generate-password" @click="generatePasswordHandle">生成密码</button>
            </el-form-item>

            <el-form-item label="角色" prop="roleName">
                <el-select v-model="addUserForm.roleName" placeholder="选择用户角色">
                    <el-option v-for="item in props.roles" :key="item.role_name" :label="item.description" :value="item.role_name" />
                </el-select>
            </el-form-item>
            <el-form-item prop="isSendEmail">
                <el-checkbox v-model="addUserForm.isSendEmail" value="发送邮件" name="send_email">是否发送邮件到用户邮箱。</el-checkbox>
            </el-form-item>

            <div class="btn-submit">
                <el-form-item>
                    <el-button type="primary" :loading="btnLoading" @click="submitForm(addUserFormRef as FormInstance)">新增用户</el-button>
                </el-form-item>
            </div>
        </el-form>
    </div>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from "element-plus" // 需要全部安装 npm i element-plus -S
import { reactive, ref, toRef, useTemplateRef } from "vue"

import { type Role } from "@/api/permissionRole/role"
import { ResponseCode } from "@/api/response"
import type { AddUserRequest } from "@/api/user/addUser"
import { AddUserAPI } from "@/api/user/addUser"
import { useAccountFormValidation } from "@/components/hooks/useAccountFormValidation"
import { pollingGetStreamIDsStatus } from "@/utils/getStreamIDsStatus"
import { MessageUtil } from "@/utils/message"
import { generatePassword } from "@/utils/password"

import type { AddUserForm } from "./types"

defineOptions({ name: "AddUser" })

const emit = defineEmits<{
    (event: "add-user-status", value: boolean): void // 添加用户状态
}>()

// props
const props = defineProps<{
    roles: Role[] // 角色列表
}>()

// 表单label位置 top | left | right
const labelPosition = ref("left")

// 表单大小 '' | 'large' | 'default' | 'small'
const formSize = ref("large")

// 表单实例
const addUserFormRef = useTemplateRef<FormInstance>("addUserFormRef")

// 表单数据
const addUserForm = reactive<AddUserForm>({
    userName: "jiaopengzi",
    email: "jiaopengzi@qq.com",
    password: generatePassword(),
    roleName: "Subscriber",
    isSendEmail: false,
})

const userNameRef = toRef(addUserForm, "userName")
const emailRef = toRef(addUserForm, "email")
const passwordRef = toRef(addUserForm, "password")

// hooks
const { checkUserNameValidator, checkEmailValidator, createEmailRules, createPasswordRules, createUserNameRules } = useAccountFormValidation({
    FormUserName: userNameRef,
    FormEmail: emailRef,
    FormPassword: passwordRef,
})

const generatePasswordHandle = () => {
    addUserForm.password = generatePassword()
}

const rules = reactive<FormRules<AddUserForm>>({
    userName: createUserNameRules(checkUserNameValidator),
    email: createEmailRules(checkEmailValidator),
    password: createPasswordRules(),
})

const btnLoading = ref(false)

/**
 * @description: 提交表单
 * @param formEl 表单实例
 * @param fields 表单字段
 * @return  void
 */
const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return

    btnLoading.value = true

    await formEl.validate(async (valid) => {
        if (valid) {
            // 创建请求对象 加密内容
            const req: AddUserRequest = {
                user_name: addUserForm.userName,
                password: addUserForm.password,
                email: addUserForm.email,
                role_name: addUserForm.roleName,
                is_send_email: addUserForm.isSendEmail,
            }

            const { data } = await AddUserAPI(req)

            if (data.code === ResponseCode.UserAddUserSuccess) {
                // 轮询后端是否完成
                await pollingGetStreamIDsStatus(data.data.items)
                btnLoading.value = false

                // 添加成功提示
                emit("add-user-status", true)
                MessageUtil.success(data.msg, 6000)
            } else {
                btnLoading.value = false
                // 添加失败提示
                MessageUtil.error(data.msg, 0)
            }
        }
    })
}
</script>

<style lang="scss" scoped>
.add-user-page {
    display: flex;
    align-items: center;
}

.add-user-form {
    width: 400px;
}

.generate-password {
    flex: 5;
}

.btn-generate-password {
    flex: 2;
}

.btn-generate-password {
    width: 120px;
    margin-left: 10px;
    padding: 0 10px;
    height: 40px;
    line-height: 30px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: #fff;
    cursor: pointer;
    color: #333;
}

.btn-submit {
    text-align: center;
}

.btn-submit .el-form-item {
    display: inline-block;
}
</style>
