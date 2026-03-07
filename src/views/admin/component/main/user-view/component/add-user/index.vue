<!--
 * @FilePath     : \blog-client\src\views\admin\component\main\user-view\component\add-user\index.vue
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
 * @Description  : 添加用户
-->

<template>
    <div class="add-user-page user-form-page">
        <el-form
            :label-position="labelPosition"
            label-width="100px"
            ref="addUserFormRef"
            :model="addUserForm"
            :rules="rules"
            class="add-user-form user-form-shell"
            :size="formSize"
            status-icon
        >
            <div class="form-intro">
                <div>
                    <p class="eyebrow">USER CREATE</p>
                    <h2 class="form-title">新增用户</h2>
                </div>
                <div class="intro-mark">New</div>
            </div>

            <el-form-item label="用户名" prop="userName">
                <el-input v-model="addUserForm.userName" />
            </el-form-item>

            <el-form-item label="邮箱" prop="email">
                <el-input v-model="addUserForm.email" />
            </el-form-item>

            <el-form-item label="密码" prop="password">
                <div class="field-inline">
                    <el-input class="generate-password" type="text" v-model="addUserForm.password" />
                    <button type="button" class="btn-generate-password" @click="generatePasswordHandle">生成密码</button>
                </div>
            </el-form-item>

            <el-form-item label="角色" prop="roleName">
                <el-select v-model="addUserForm.roleName" placeholder="选择用户角色">
                    <el-option v-for="item in props.roles" :key="item.role_name" :label="item.description" :value="item.role_name" />
                </el-select>
            </el-form-item>

            <el-form-item prop="isSendEmail" class="form-checkbox-item">
                <el-checkbox v-model="addUserForm.isSendEmail" value="发送邮件" name="send_email">是否发送邮件到用户邮箱。</el-checkbox>
            </el-form-item>

            <div class="form-actions">
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
    // userName: "jiaopengzi",
    // email: "jiaopengzi@qq.com",
    userName: "username",
    email: "user@example.com",
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

    const valid = await formEl
        .validate()
        .then(() => true)
        .catch(() => false)

    if (!valid) {
        btnLoading.value = false
        return
    }

    try {
        // 创建请求对象 加密内容
        const req: AddUserRequest = {
            user_name: addUserForm.userName,
            password: addUserForm.password,
            email: addUserForm.email,
            role_name: addUserForm.roleName,
            is_send_email: addUserForm.isSendEmail,
        }

        const { data } = await AddUserAPI(req)

        if (data.code === ResponseCode.UserAddSuccess) {
            // 保证有数据且包含 stream_items 字段才进行轮询
            if (data.data && data.data.stream_items) {
                await pollingGetStreamIDsStatus(data.data.stream_items)
            }

            // 添加成功提示
            emit("add-user-status", true)
            MessageUtil.success(data.msg, 6000)
            return
        }

        // 添加失败提示
        MessageUtil.error(data.msg, 0)
    } catch {
        MessageUtil.error("新增用户失败, 请稍后重试", 3000)
    } finally {
        btnLoading.value = false
    }
}
</script>

<style lang="scss" scoped>
.user-form-page {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding: 8px 0;
}

.user-form-shell {
    width: min(560px, 100%);
    padding: 28px;
    border-radius: 28px;
    border: 1px solid color-mix(in srgb, var(--jpz-color-primary) 14%, var(--el-border-color));
    background:
        linear-gradient(135deg, color-mix(in srgb, var(--jpz-color-primary) 5%, transparent), transparent 42%),
        linear-gradient(180deg, color-mix(in srgb, var(--el-bg-color-overlay) 96%, transparent), var(--el-bg-color));
    box-shadow:
        0 20px 48px rgb(15 23 42 / 8%),
        inset 0 1px 0 rgb(255 255 255 / 18%);
}

.form-intro {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 24px;
}

.eyebrow {
    margin: 0 0 10px;
    font-size: 12px;
    letter-spacing: 0.16em;
    color: var(--jpz-text-color-secondary);
}

.form-title {
    margin: 0 0 10px;
    font-size: 32px;
    line-height: 1.1;
    color: var(--jpz-text-color-primary);
}

.intro-mark {
    flex: 0 0 auto;
    min-width: 68px;
    padding: 10px 14px;
    border-radius: 16px;
    border: 1px solid color-mix(in srgb, var(--jpz-color-primary) 18%, var(--el-border-color));
    background: color-mix(in srgb, var(--jpz-color-primary) 8%, transparent);
    color: var(--jpz-color-primary);
    font-size: 13px;
    font-weight: 700;
    text-align: center;
}

.field-inline {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
}

.generate-password {
    flex: 1;
}

.btn-generate-password {
    flex: 0 0 auto;
    min-width: 112px;
    height: 40px;
    padding: 0 14px;
    border: 1px solid color-mix(in srgb, var(--jpz-color-primary) 18%, var(--el-border-color));
    border-radius: 14px;
    background: color-mix(in srgb, var(--jpz-color-primary) 8%, var(--el-bg-color));
    color: var(--jpz-color-primary);
    cursor: pointer;
    transition:
        transform 0.2s ease,
        border-color 0.2s ease,
        background-color 0.2s ease;

    &:hover {
        transform: translateY(-1px);
        border-color: color-mix(in srgb, var(--jpz-color-primary) 32%, var(--el-border-color));
        background: color-mix(in srgb, var(--jpz-color-primary) 12%, var(--el-bg-color));
    }
}

.form-checkbox-item {
    margin-bottom: 8px;
}

.form-actions {
    margin-top: 22px;
    display: flex;
    justify-content: center;
}

:deep(.el-form-item) {
    margin-bottom: 18px;
}

:deep(.el-form-item__label) {
    color: var(--jpz-text-color-primary);
    font-weight: 600;
}

:deep(.el-input__wrapper),
:deep(.el-select__wrapper),
:deep(.el-textarea__inner) {
    border-radius: 14px;
    box-shadow: 0 0 0 1px color-mix(in srgb, var(--el-border-color) 92%, transparent) inset;
    background: color-mix(in srgb, var(--el-bg-color-overlay) 96%, transparent);
}

:deep(.el-checkbox) {
    white-space: normal;
    line-height: 1.7;
}

.form-actions :deep(.el-form-item) {
    margin-bottom: 0;
}

.form-actions :deep(.el-form-item__content) {
    margin-left: 0 !important;
    width: 100%;
    justify-content: center;
}
</style>
