<!--
 * @Author       : jiaopengzi
 * @Date         : 2025-01-13 15:37:17
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2025-01-13 16:38:49
 * @FilePath     : \blog-client\src\views\register-admin\index.vue
 * @Description  : 注册管理员
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
-->

<template>
    <div class="register-page">
        <el-form
            :label-position="labelPosition"
            label-width="100px"
            ref="registerFormRef"
            :model="registerForm"
            :rules="rules"
            class="register-form"
            :size="formSize"
            status-icon
        >
            <AccountFormHeader
                :a-tag="{ href: 'https://www.jiaopengzi.com', target: '_blank' }"
                title="注册管理员"
            />

            <el-form-item label="用户名" prop="userName">
                <el-input v-model="registerForm.userName" clearable />
            </el-form-item>

            <el-form-item label="邮箱" prop="email">
                <el-input v-model="registerForm.email" clearable />
            </el-form-item>

            <el-form-item label="密码" prop="password">
                <el-input type="password" show-password v-model="registerForm.password" clearable />
            </el-form-item>

            <el-form-item label="确认密码" prop="rePassword">
                <el-input
                    type="password"
                    show-password
                    v-model="registerForm.rePassword"
                    clearable
                />
            </el-form-item>

            <el-form-item prop="acceptedTerms">
                <el-checkbox
                    v-model="registerForm.acceptedTerms"
                    value="同意条款"
                    name="acceptedTerms"
                /><span class="i-agree">我已同意并接受：</span
                ><a class="i-agree-link" href="/">《服务条款》</a>
            </el-form-item>

            <div class="btn-submit">
                <el-form-item>
                    <el-button type="primary" @click="submitForm(registerFormRef as FormInstance)"
                        >注册</el-button
                    >
                    <el-button @click="resetForm(registerFormRef as FormInstance)">重置</el-button>
                </el-form-item>
            </div>
        </el-form>
    </div>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from "element-plus"
import { reactive, ref, toRef, useTemplateRef } from "vue"
import { useRouter } from "vue-router"

import { ResponseCode } from "@/api/response"
import { registerAdminAPI, type RegisterAdminRequest } from "@/api/user/registerAdmin"
import AccountFormHeader from "@/components/common/account-form-header"
import { useAccountFormValidation } from "@/components/hooks/useAccountFormValidation"
import { RouteNames } from "@/router"
import { MessageUtil } from "@/utils/message"

import type { RegisterForm } from "./types"

defineOptions({ name: "RegisterAdmin" })

const router = useRouter()

// 表单label位置 top | left | right
const labelPosition = ref("top")

// 表单大小 '' | 'large' | 'default' | 'small'
const formSize = ref("default")

// 表单实例
const registerFormRef = useTemplateRef<FormInstance>("registerFormRef")

// 表单数据
const registerForm = reactive<RegisterForm>({
    // userName: '',
    // email: '',
    // password: '',
    // rePassword: '',
    // acceptedTerms: [],
    userName: "jiaopengzi",
    email: "jiaopengzi@qq.com",
    password: "123QWEasd",
    rePassword: "123QWEasd",
    acceptedTerms: false,
})

const userNameRef = toRef(registerForm, "userName")
const emailRef = toRef(registerForm, "email")
const passwordRef = toRef(registerForm, "password")
const rePasswordRef = toRef(registerForm, "rePassword")
const acceptedTermsRef = toRef(registerForm, "acceptedTerms")

// hook 函数
const {
    checkUserNameValidator,
    checkEmailValidator,
    rePasswordValidator,
    acceptedTermsValidator,

    createAcceptedTermsRules,
    createEmailRules,
    createPasswordRules,
    createRePasswordRules,
    createUserNameRules,
} = useAccountFormValidation({
    FormUserName: userNameRef,
    FormEmail: emailRef,
    FormPassword: passwordRef,
    FormRePassword: rePasswordRef,
    FormAcceptedTerms: acceptedTermsRef,
})

const rules = reactive<FormRules<RegisterForm>>({
    userName: createUserNameRules(checkUserNameValidator),
    email: createEmailRules(checkEmailValidator),
    password: createPasswordRules(),
    rePassword: createRePasswordRules(rePasswordValidator),
    acceptedTerms: createAcceptedTermsRules(acceptedTermsValidator),
})

const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate(async (valid) => {
        if (valid) {
            // 创建请求对象
            const req: RegisterAdminRequest = {
                user_name: registerForm.userName,
                password: registerForm.password,
                re_password: registerForm.rePassword,
                email: registerForm.email,
            }

            const { data } = await registerAdminAPI(req)

            if (data.code === ResponseCode.UserRegisterSuccess) {
                // 显示注册成功提示
                MessageUtil.success(data.msg, 6000)

                setTimeout(() => {
                    router.push({ name: RouteNames.Login })
                }, 3000)
            } else {
                MessageUtil.error(data.msg, 0)
            }
        }
    })
}

// 重置表单
const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
}
</script>

<style lang="scss" scoped>
.register-page {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100vw;
    background-color: var(--jpz-bg-color-page);
}

@include respond-to("pc") {
    .register-form {
        width: 360px;
        border: 1px solid var(--jpz-border-color);
        border-radius: 5px;
        padding: 20px;
        box-shadow: var(--jpz-box-shadow-light);
        background-color: var(--jpz-bg-color);
    }
}

@include respond-to("pad") {
    .register-form {
        width: 360px;
        border: 1px solid var(--jpz-border-color);
        border-radius: 5px;
        padding: 20px;
        box-shadow: var(--jpz-box-shadow-light);
        background-color: var(--jpz-bg-color);
    }
}

@include respond-to("phone") {
    .register-form {
        width: 90vw;
        box-shadow: none;
        border: none;
        background-color: transparent;
    }
}

.i-agree {
    color: var(--jpz-text-color-primary);
}
.i-agree-link {
    color: var(--jpz-text-color-primary);
    text-decoration: underline;
}

.btn-submit {
    text-align: center;
    .el-form-item {
        display: inline-block;
    }
}

.btn-submit .el-form-item {
    display: inline-block;
}
</style>
