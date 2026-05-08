<!--
 * @FilePath     : \blog-client\src\views\register\index.vue
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
 * @Description  : 注册
-->

<template>
    <div class="register-page">
        <!-- 滑动验证组件 -->
        <SlideVerify @on-success="sendCaptcha" />
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
                <AccountFormHeader :router-link-to="{ name: RouteNames.Home }" title="账号注册" />

                <el-form-item label="用户名" prop="userName">
                    <el-input v-model="registerForm.userName" clearable placeholder="请输入用户名" />
                </el-form-item>

                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="registerForm.email" clearable placeholder="请输入邮箱" />
                </el-form-item>

                <el-form-item label="验证码" prop="captcha">
                    <el-input class="email-code" v-model="registerForm.captcha" clearable placeholder="请点击发送验证码后，输入验证码" />
                    <button class="btn-captcha" type="button" @click="openSlideVerify" :disabled="isCaptchaBtnDisabled">
                        {{ captchaBtnText }}
                    </button>
                </el-form-item>

                <el-form-item label="密码" prop="password">
                    <el-input type="password" show-password v-model="registerForm.password" clearable placeholder="请输入密码" />
                </el-form-item>

                <el-form-item label="确认密码" prop="rePassword">
                    <el-input type="password" show-password v-model="registerForm.rePassword" clearable placeholder="请再次输入密码" />
                </el-form-item>

                <el-form-item prop="acceptedTerms">
                    <!-- 需要管理员提前创建页面 /page/terms 内容 -->
                    <el-checkbox v-model="registerForm.acceptedTerms" value="同意条款" name="acceptedTerms" /><span class="i-agree">我已同意并接受：</span
                    ><a class="i-agree-link" href="/page/terms" target="blank">《服务条款》</a>
                </el-form-item>

                <!-- 注册按钮, native-type="submit" 兼容 Enter 键提交 -->
                <el-form-item>
                    <el-button type="primary" native-type="submit" class="submit-btn">注册</el-button>
                </el-form-item>

                <AccountFormFooter :to="['home', 'login']" />
            </el-form>
        </div>
    </div>

    <FooterStatistics v-if="optionsStore.isShowFooterStatistics" />
</template>

<script lang="ts" setup>
import { useHead } from "@unhead/vue"
import type { FormInstance, FormRules } from "element-plus" // 需要全部安装 npm i element-plus -S
import { reactive, ref, toRef, useTemplateRef } from "vue"
import { useRouter } from "vue-router"

import { CaptchaPurpose } from "@/api/common"
import { ResponseCode } from "@/api/response"
import type { RegisterRequest } from "@/api/user/register"
import { registerAPI } from "@/api/user/register"
import AccountFormFooter from "@/components/common/account-form-footer"
import AccountFormHeader from "@/components/common/account-form-header"
import SlideVerify from "@/components/common/slide-verify"
import FooterStatistics from "@/components/layout/footer-statistics"
import { useAccountFormValidation } from "@/components/hooks/useAccountFormValidation"
import { useCaptchaBtnStatus } from "@/components/hooks/useCaptchaBtnStatus"
import { RouteNames } from "@/router"
import { useOptionsStore } from "@/stores/options"
import { MessageUtil } from "@/utils/message"

import type { RegisterForm } from "./types"

defineOptions({ name: "AppRegister" })

useHead({
    title: "注册",
})

const router = useRouter()
const optionsStore = useOptionsStore()

// 打开滑动验证
const openSlideVerify = async () => {
    // 如果没有开启滑动验证, 直接调用成功回调
    if (!optionsStore.slide_verify_enable || optionsStore.slide_verify_imgs.length === 0) {
        await sendCaptcha()
        return
    }

    // 开启滑动验证
    optionsStore.openSlideVerify()
}

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
    captcha: "",
    password: "",
    rePassword: "",
    acceptedTerms: false,
    // userName: "jiaopengzi",
    // email: "jiaopengzi@qq.com",
    // captcha: "123456",
    // password: "123QWEasd",
    // rePassword: "123QWEasd",
    // acceptedTerms: false,
})

const userNameRef = toRef(registerForm, "userName")
const emailRef = toRef(registerForm, "email")
const passwordRef = toRef(registerForm, "password")
const rePasswordRef = toRef(registerForm, "rePassword")
const captchaRef = toRef(registerForm, "captcha")
const acceptedTermsRef = toRef(registerForm, "acceptedTerms")

// hook 函数
const {
    checkSendCaptcha,
    checkUserNameValidator,
    checkEmailValidator,
    rePasswordValidator,
    acceptedTermsValidator,

    createAcceptedTermsRules,
    createCaptchaRules,
    createEmailRules,
    createPasswordRules,
    createRePasswordRules,
    createUserNameRules,
} = useAccountFormValidation({
    FormUserName: userNameRef,
    FormEmail: emailRef,
    FormPassword: passwordRef,
    FormRePassword: rePasswordRef,
    FormCaptcha: captchaRef,
    FormAcceptedTerms: acceptedTermsRef,
})

const rules = reactive<FormRules<RegisterForm>>({
    userName: createUserNameRules(checkUserNameValidator),
    email: createEmailRules(checkEmailValidator),
    captcha: createCaptchaRules(),
    password: createPasswordRules(),
    rePassword: createRePasswordRules(rePasswordValidator),
    acceptedTerms: createAcceptedTermsRules(acceptedTermsValidator),
})

const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate(async (valid) => {
        if (valid) {
            // 创建请求对象 加密内容
            const req: RegisterRequest = {
                captcha: registerForm.captcha,
                user_name: registerForm.userName,
                password: registerForm.password,
                re_password: registerForm.rePassword,
                email: registerForm.email,
            }

            console.log("req:", req)
            const { data } = await registerAPI(req)

            if (data.code === ResponseCode.UserRegisterSuccess) {
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
    // 手动触发 FormInstance 的校验，校验 userName 和 email 字段
    const userNameResult = await registerFormRef.value?.validateField("userName").catch(() => false)
    if (!userNameResult) {
        MessageUtil.error("请输入正确的用户名。", 0)
        return
    }

    const emailResult = await registerFormRef.value?.validateField("email").catch(() => false)
    if (!emailResult) {
        MessageUtil.error("请输入正确的邮箱地址。", 0)
        console.log("请输入邮箱")
        return
    }

    if (userNameResult && emailResult) {
        isCaptchaBtnDisabled.value = true // 按钮设置不能点击状态

        // 发送验证码
        checkSendCaptcha(registerForm.email, CaptchaPurpose.Register)
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
// 注册页容器
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

// 条款
.i-agree {
    color: var(--jpz-text-color-primary);
}

.i-agree-link {
    color: var(--jpz-text-color-primary);
    text-decoration: underline;
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
