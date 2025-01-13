<!-- eslint-disable vue/multi-word-component-names -->
<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-11-22 16:05:07
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2025-01-13 14:09:48
 * @FilePath     : \blog-client\src\views\reset-password\index.vue
 * @Description  : 重置密码
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved. 
-->

<template>
    <div class="reset-password-page">
        <!-- 添加滑动验证组件：SlideVerify -->
        <SlideVerify
            v-if="showSlideVerify"
            @on-close="closeSlideVerify"
            @on-success="sendCaptcha"
        ></SlideVerify>
        <el-form
            :label-position="labelPosition"
            label-width="100px"
            ref="forgotPasswordFormRef"
            :model="forgotPasswordForm"
            :rules="rules"
            class="forgotPassword-form"
            :size="formSize"
            status-icon
        >
            <AccountFormHeader :router-link-to="{ name: RouteNames.Home }" title="密码重置" />

            <el-form-item label="邮箱" prop="email">
                <el-input v-model="forgotPasswordForm.email" clearable />
            </el-form-item>

            <el-form-item label="验证码" prop="captcha">
                <el-input class="email-code" v-model="forgotPasswordForm.captcha" clearable />
                <button
                    class="btn-captcha"
                    type="button"
                    @click="openSlideVerify"
                    :disabled="btnCaptchaState.disabled"
                >
                    {{ captcha }}
                </button>
            </el-form-item>

            <el-form-item label="新密码" prop="password">
                <el-input
                    type="password"
                    show-password
                    v-model="forgotPasswordForm.password"
                    clearable
                />
            </el-form-item>

            <el-form-item label="确认密码" prop="rePassword">
                <el-input
                    type="password"
                    show-password
                    v-model="forgotPasswordForm.rePassword"
                    clearable
                />
            </el-form-item>

            <div class="btn-submit">
                <el-form-item>
                    <el-button
                        type="primary"
                        @click="submitForm(forgotPasswordFormRef as FormInstance)"
                        >重置密码</el-button
                    >
                </el-form-item>
            </div>
            <AccountFormFooter :to="['home', 'login']" />
        </el-form>
    </div>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from "element-plus" // 需要全部安装 npm i element-plus -S
import { reactive, ref, toRef, useTemplateRef } from "vue"
import { useRouter } from "vue-router"

import { CaptchaPurpose } from "@/api/common"
import { ResponseCode } from "@/api/response"
import type { ResetPasswordRequest } from "@/api/user/resetPassword"
import { resetPasswordAPI } from "@/api/user/resetPassword"
import AccountFormFooter from "@/components/common/account-form-footer"
import AccountFormHeader from "@/components/common/account-form-header"
import SlideVerify from "@/components/common/slide-verify"
import { useAccountFormValidation } from "@/components/hooks/useAccountFormValidation"
import { RouteNames } from "@/router"
import { MessageUtil } from "@/utils/message"

import type { ResetPasswordForm } from "./types"

// 定义组件名称
defineOptions({ name: "ResetPassword" })
const router = useRouter()

// 表单label位置 top | left | right
const labelPosition = ref("top")

// 表单大小 '' | 'large' | 'default' | 'small'
const formSize = ref("default")

// 表单实例
const forgotPasswordFormRef = useTemplateRef<FormInstance>("forgotPasswordFormRef")

// 表单数据
const forgotPasswordForm = reactive<ResetPasswordForm>({
    email: "jiaopengzi@qq.com",
    captcha: "123456",
    password: "123QWEasd123",
    rePassword: "123QWEasd123",
})

const emailRef = toRef(forgotPasswordForm, "email")
const passwordRef = toRef(forgotPasswordForm, "password")
const rePasswordRef = toRef(forgotPasswordForm, "rePassword")
const captchaRef = toRef(forgotPasswordForm, "captcha")

// hook 函数
const {
    checkSendCaptcha,
    checkEmailValidator,
    checkCaptchaValidatorFactory,
    rePasswordValidator,
    createCaptchaRules,
    createEmailRules,
    createPasswordRules,
    createRePasswordRules,
} = useAccountFormValidation({
    FormEmail: emailRef,
    FormPassword: passwordRef,
    FormRePassword: rePasswordRef,
    FormCaptcha: captchaRef,
})

const rules = reactive<FormRules<ResetPasswordForm>>({
    email: createEmailRules(checkEmailValidator),
    captcha: createCaptchaRules(checkCaptchaValidatorFactory(CaptchaPurpose.ResetPassword)),
    password: createPasswordRules(),
    rePassword: createRePasswordRules(rePasswordValidator),
})

/**
 * @description: 提交表单
 * @param formEl 表单实例
 * @param fields 表单字段
 * @return  void
 */
const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate(async (valid) => {
        if (valid) {
            // 创建请求对象 加密内容
            const req: ResetPasswordRequest = {
                captcha: forgotPasswordForm.captcha,
                password: forgotPasswordForm.password,
                re_password: forgotPasswordForm.rePassword,
                email: forgotPasswordForm.email,
            }

            const { data } = await resetPasswordAPI(req) // 将 resStr 转换为对象

            if (data.code === ResponseCode.UserResetPasswordSuccess) {
                // 显示注册成功提示
                MessageUtil.success(data.msg, 6000)

                // 跳转到登录页面
                setTimeout(() => {
                    router.push({ name: RouteNames.Login })
                }, 3000)
            } else {
                // 注册失败
                // console.log("注册失败");
                MessageUtil.error(data.msg, 0)
            }
            console.log("submit!")
        }
    })
}

// 添加 showSlideVerify 响应式变量
const showSlideVerify = ref(false)

// 显示滑块验证
const openSlideVerify = () => {
    // 显示滑块验证
    console.log("打开滑块验证")
    showSlideVerify.value = true
}

const captcha = ref("发送验证码")
const btnCaptchaState = reactive({ disabled: false })

// 发送邮箱验证码

const sendCaptcha = async () => {
    // 关闭滑块验证
    showSlideVerify.value = false

    const emailResult = await forgotPasswordFormRef.value?.validateField("email").catch(() => false)
    if (!emailResult) {
        MessageUtil.error("请输入正确的邮箱地址。", 0)
        console.log("请输入邮箱")
        return
    }

    if (emailResult) {
        btnCaptchaState.disabled = true // 按钮设置不能点击状态

        // 发送验证码
        checkSendCaptcha(forgotPasswordForm.email, CaptchaPurpose.ResetPassword)
            .then(() => {
                // 成功发送验证码
                MessageUtil.success("验证码已发送到邮箱。", 6000)
            })
            .catch((err: Error) => {
                // 错误提示
                MessageUtil.error(err.message, 0)
            })

        // 按钮设置不能点击状态
        let timer = 5
        captcha.value = `${timer}s后重新发送`
        const interval = setInterval(() => {
            timer--
            if (timer === 0) {
                clearInterval(interval)
                captcha.value = "发送验证码"
                btnCaptchaState.disabled = false // 启用按钮
            } else {
                captcha.value = `${timer}s后重新发送`
            }
        }, 1000)
    }
}

// 关闭滑块验证
const closeSlideVerify = () => {
    showSlideVerify.value = false
}
</script>

<style lang="scss" scoped>
.reset-password-page {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100vw;
    background-color: var(--jpz-bg-color-page);
}

@include respond-to("pc") {
    .forgotPassword-form {
        width: 360px;
        border: 1px solid var(--jpz-border-color);
        border-radius: 5px;
        padding: 20px;
        box-shadow: var(--jpz-box-shadow-light);
        background-color: var(--jpz-bg-color);
    }
}

@include respond-to("pad") {
    .forgotPassword-form {
        width: 360px;
        border: 1px solid var(--jpz-border-color);
        border-radius: 5px;
        padding: 20px;
        box-shadow: var(--jpz-box-shadow-light);
        background-color: var(--jpz-bg-color);
    }
}

@include respond-to("phone") {
    .forgotPassword-form {
        width: 90vw;
        box-shadow: none;
        border: none;
        background-color: transparent;
    }
}

.email-code {
    flex: 5;
}

.btn-captcha {
    flex: 2;
}

.btn-captcha {
    width: 120px;
    margin-left: 10px;
    padding: 0 10px;
    height: 30px;
    line-height: 30px;
    border: 1px solid var(--jpz-border-color);
    border-radius: 4px;
    background-color: var(--jpz-bg-color);
    cursor: pointer;
    color: var(--jpz-text-color-regular);
}

.btn-captcha:disabled {
    background-color: var(--jpz-bg-color);
    color: var(--jpz-text-color-disabled);
    cursor: not-allowed;
}

.btn-submit {
    text-align: center;
}

.btn-submit .el-form-item {
    display: inline-block;
}
</style>
