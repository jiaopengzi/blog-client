<!--
 * @FilePath     : \blog-client\src\views\reset-password\index.vue
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
 * @Description  : 重置密码
-->

<template>
    <div class="reset-password-page">
        <!-- 滑动验证组件 -->
        <SlideVerify @on-success="sendCaptcha" />
        <div class="reset-card">
            <el-form
                :label-position="labelPosition"
                label-width="100px"
                ref="forgotPasswordFormRef"
                :model="forgotPasswordForm"
                :rules="rules"
                class="reset-form"
                :size="formSize"
                status-icon
                @submit.prevent="submitForm(forgotPasswordFormRef as FormInstance)"
            >
                <AccountFormHeader :router-link-to="{ name: RouteNames.Home }" title="密码重置" />

                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="forgotPasswordForm.email" clearable placeholder="请输入邮箱" />
                </el-form-item>

                <el-form-item label="验证码" prop="captcha">
                    <el-input class="email-code" v-model="forgotPasswordForm.captcha" clearable placeholder="请点击发送验证码后，输入验证码" />
                    <button class="btn-captcha" type="button" @click="openSlideVerify" :disabled="isCaptchaBtnDisabled">
                        {{ captchaBtnText }}
                    </button>
                </el-form-item>

                <el-form-item label="新密码" prop="password">
                    <el-input type="password" show-password v-model="forgotPasswordForm.password" clearable placeholder="请输入新密码" />
                </el-form-item>

                <el-form-item label="确认密码" prop="rePassword">
                    <el-input type="password" show-password v-model="forgotPasswordForm.rePassword" clearable placeholder="请再次输入新密码" />
                </el-form-item>

                <!-- 重置密码按钮, native-type="submit" 兼容 Enter 键 -->
                <el-form-item>
                    <el-button type="primary" native-type="submit" class="submit-btn">重置密码</el-button>
                </el-form-item>

                <AccountFormFooter :to="['home', 'login']" />
            </el-form>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useHead } from "@unhead/vue"
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
import { useCaptchaBtnStatus } from "@/components/hooks/useCaptchaBtnStatus"
import { RouteNames } from "@/router"
import { useOptionsStore } from "@/stores/options"
import { MessageUtil } from "@/utils/message"

import type { ResetPasswordForm } from "./types"

defineOptions({ name: "ResetPassword" })

useHead({
    title: "密码重置",
})

const router = useRouter()
const optionsStore = useOptionsStore()

// 表单label位置 top | left | right
const labelPosition = ref("top")

// 表单大小 '' | 'large' | 'default' | 'small'
const formSize = ref("default")

// 打开滑动验证
const openSlideVerify = async () => {
    // 如果没有开启滑动验证, 直接调用成功回调
    if (!optionsStore.slide_verify_enable) {
        await sendCaptcha()
        return
    }

    // 开启滑动验证
    optionsStore.openSlideVerify()
}

// 表单实例
const forgotPasswordFormRef = useTemplateRef<FormInstance>("forgotPasswordFormRef")

// 表单数据
const forgotPasswordForm = reactive<ResetPasswordForm>({
    email: "",
    captcha: "",
    password: "",
    rePassword: "",
    // email: "jiaopengzi@qq.com",
    // captcha: "123456",
    // password: "123QWEasd123",
    // rePassword: "123QWEasd123",
})

const emailRef = toRef(forgotPasswordForm, "email")
const passwordRef = toRef(forgotPasswordForm, "password")
const rePasswordRef = toRef(forgotPasswordForm, "rePassword")
const captchaRef = toRef(forgotPasswordForm, "captcha")

// hook 函数
const { checkSendCaptcha, rePasswordValidator, createCaptchaRules, createEmailRules, createPasswordRules, createRePasswordRules } = useAccountFormValidation({
    FormEmail: emailRef,
    FormPassword: passwordRef,
    FormRePassword: rePasswordRef,
    FormCaptcha: captchaRef,
})

const rules = reactive<FormRules<ResetPasswordForm>>({
    email: createEmailRules(),
    captcha: createCaptchaRules(),
    password: createPasswordRules(),
    rePassword: createRePasswordRules(rePasswordValidator),
})

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

// 验证码按钮状态
const { captchaBtnText, isCaptchaBtnDisabled, countdown } = useCaptchaBtnStatus()

// 发送邮箱验证码
const sendCaptcha = async () => {
    const emailResult = await forgotPasswordFormRef.value?.validateField("email").catch(() => false)
    if (!emailResult) {
        MessageUtil.error("请输入正确的邮箱地址。", 0)
        console.log("请输入邮箱")
        return
    }

    if (emailResult) {
        isCaptchaBtnDisabled.value = true // 按钮设置不能点击状态

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

        // 开始倒计时
        countdown()
    }
}
</script>

<style lang="scss" scoped>
// 重置密码页容器
.reset-password-page {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    width: 100vw;
    background-color: var(--jpz-bg-color-page);
}

// 卡片入场动画
.reset-card {
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
    .reset-form {
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
    .reset-form {
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
    .reset-form {
        width: 90vw;
        max-width: 380px;
        padding: 20px 16px;
        background-color: transparent;
        border: none;
        box-shadow: none;
    }
}

// 验证码输入框
.email-code {
    flex: 1;
}

// 验证码按钮
.btn-captcha {
    width: 120px;
    margin-left: 10px;
    padding: 0 10px;
    height: 32px;
    line-height: 32px;
    font-size: 13px;
    border: 1px solid var(--jpz-border-color-lighter);
    border-radius: 8px;
    background-color: var(--jpz-bg-color);
    cursor: pointer;
    color: var(--jpz-text-color-regular);
    transition: border-color 0.2s;

    &:hover:not(:disabled) {
        border-color: var(--jpz-border-color-hover);
    }
}

.btn-captcha:disabled {
    background-color: var(--jpz-bg-color);
    color: var(--jpz-text-color-disabled);
    cursor: not-allowed;
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
