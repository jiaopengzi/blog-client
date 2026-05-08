<!--
 * @FilePath     : \blog-client\src\views\register-admin\index.vue
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
 * @Description  : 注册管理员
-->

<template>
    <div class="register-page">
        <div class="register-card">
            <el-form
                :label-position="labelPosition"
                label-width="100px"
                ref="registerFormRef"
                :model="registerForm"
                :rules="rules"
                class="register-form"
                :size="formSize"
                status-icon
                @submit.prevent="submitForm(registerFormRef as FormInstance)"
            >
                <AccountFormHeader :a-tag="{ href: 'https://www.jiaopengzi.com', target: '_blank' }" title="注册管理员" />

                <el-form-item label="管理员用户名" prop="userName">
                    <el-input v-model="registerForm.userName" clearable placeholder="请输入管理员用户名" />
                </el-form-item>

                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="registerForm.email" clearable placeholder="请输入邮箱" />
                </el-form-item>

                <el-form-item label="密码" prop="password">
                    <el-input type="password" show-password v-model="registerForm.password" clearable placeholder="请输入密码" />
                </el-form-item>

                <el-form-item label="确认密码" prop="rePassword">
                    <el-input type="password" show-password v-model="registerForm.rePassword" clearable placeholder="再次输入密码" />
                </el-form-item>

                <!-- 注册按钮, native-type="submit" 兼容 Enter 键提交 -->
                <el-form-item>
                    <el-button type="primary" native-type="submit" class="submit-btn">注册</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>

    <FooterStatistics v-if="optionsStore.isShowFooterStatistics" />
</template>

<script lang="ts" setup>
import { useHead } from "@unhead/vue"
import type { FormInstance, FormRules } from "element-plus"
import { reactive, ref, toRef, useTemplateRef } from "vue"
import { useRouter } from "vue-router"

import { ResponseCode } from "@/api/response"
import { registerAdminAPI, type RegisterAdminRequest } from "@/api/user/registerAdmin"
import AccountFormHeader from "@/components/common/account-form-header"
import FooterStatistics from "@/components/layout/footer-statistics"
import { useAccountFormValidation } from "@/components/hooks/useAccountFormValidation"
import { RouteNames } from "@/router"
import { useOptionsStore } from "@/stores/options"
import { MessageUtil } from "@/utils/message"

import type { RegisterForm } from "./types"

defineOptions({ name: "RegisterAdmin" })

useHead({
    title: "注册管理员",
})

const router = useRouter()
const optionsStore = useOptionsStore()

// 表单label位置 top | left | right
const labelPosition = ref("top")

// 表单大小 '' | 'large' | 'default' | 'small'
const formSize = ref("default")

// 表单实例
const registerFormRef = useTemplateRef<FormInstance>("registerFormRef")

// 表单数据
const registerForm = reactive<RegisterForm>({
    userName: "",
    email: "",
    password: "",
    rePassword: "",
    // userName: "jiaopengzi",
    // email: "jiaopengzi@qq.com",
    // password: "123QWEasd",
    // rePassword: "123QWEasd",
})

const userNameRef = toRef(registerForm, "userName")
const emailRef = toRef(registerForm, "email")
const passwordRef = toRef(registerForm, "password")
const rePasswordRef = toRef(registerForm, "rePassword")

// hook 函数
const { checkUserNameValidator, checkEmailValidator, rePasswordValidator, createEmailRules, createPasswordRules, createRePasswordRules, createUserNameRules } =
    useAccountFormValidation({
        FormUserName: userNameRef,
        FormEmail: emailRef,
        FormPassword: passwordRef,
        FormRePassword: rePasswordRef,
    })

const rules = reactive<FormRules<RegisterForm>>({
    userName: createUserNameRules(checkUserNameValidator),
    email: createEmailRules(checkEmailValidator),
    password: createPasswordRules(),
    rePassword: createRePasswordRules(rePasswordValidator),
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
</script>

<style lang="scss" scoped>
// 注册管理员页容器
.register-page {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    width: 100vw;
    background-color: var(--jpz-bg-color-page);
}

// 卡片入场动画
.register-card {
    animation: fadeIn 0.35s ease-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

// PC 端
@include respond-to("pc") {
    .register-form {
        width: 380px;
        border: 1px solid var(--jpz-border-color-lighter);
        border-radius: 12px;
        padding: 36px 32px 24px;
        box-shadow: 0 4px 24px rgba(0, 0, 0, 0.05);
        background-color: var(--jpz-bg-color);
    }
}

// Pad 端
@include respond-to("pad") {
    .register-form {
        width: 380px;
        border: 1px solid var(--jpz-border-color-lighter);
        border-radius: 12px;
        padding: 36px 32px 24px;
        box-shadow: 0 4px 24px rgba(0, 0, 0, 0.05);
        background-color: var(--jpz-bg-color);
    }
}

// Phone 端
@include respond-to("phone") {
    .register-form {
        width: 90vw;
        max-width: 380px;
        padding: 20px 16px;
        background-color: transparent;
        border: none;
        box-shadow: none;
    }
}

// 提交按钮: 全宽, 圆润
.submit-btn {
    width: 100%;
    height: 40px;
    font-size: 15px;
    border-radius: 8px;
    letter-spacing: 2px;
}
</style>
