<!--
 * @FilePath     : \blog-client\src\views\login\index.vue
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
 * @Description  : 登录
-->

<template>
    <div class="login-page">
        <!-- 滑动验证组件 -->
        <SlideVerify @on-success="login" />
        <div class="login-card">
            <el-form
                :label-position="labelPosition"
                label-width="100px"
                ref="loginFormRef"
                :model="loginForm"
                :rules="rules"
                class="login-form"
                :size="formSize"
                status-icon
                @submit.prevent="openSlideVerify"
            >
                <AccountFormHeader :router-link-to="{ name: RouteNames.Home }" title="账号登录" />

                <el-form-item label="用户名/邮箱" prop="loginName">
                    <el-input v-model="loginForm.loginName" placeholder="请输入用户名或邮箱" clearable />
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="loginForm.password" placeholder="大小写字母 + 数字, 长度:6-64" show-password clearable />
                </el-form-item>

                <!-- 登录按钮, native-type="submit" 兼容 Enter 键提交 -->
                <el-form-item>
                    <el-button type="primary" native-type="submit" class="login-btn">登录</el-button>
                </el-form-item>

                <!-- 社交登录 -->
                <template v-if="socialLoginStatus.qq || socialLoginStatus.wechat">
                    <div class="social-divider">
                        <span class="divider-text">社交登录</span>
                    </div>
                    <div class="social">
                        <el-button v-if="socialLoginStatus.qq" class="social-btn" @click="loginByWeChat">
                            <j-icon :name="IconKeys.Wechat" custom-class="iconfont icon-wechat" />
                        </el-button>
                        <el-button v-if="socialLoginStatus.wechat" class="social-btn" @click="loginByQQ">
                            <j-icon :name="IconKeys.Qq" custom-class="iconfont icon-qq" />
                        </el-button>
                    </div>
                </template>

                <AccountFormFooter :to="['home', 'register', 'resetPassword']" />
            </el-form>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useHead } from "@unhead/vue"
import type { FormInstance, FormRules } from "element-plus" // 需要全部安装 npm i element-plus -S
import { onBeforeMount, reactive, ref, toRef, useTemplateRef } from "vue"
import type { RouteLocationRaw } from "vue-router"
import { useRouter } from "vue-router"

import { SocialLoginType } from "@/api/common"
import { handleResErr, ResponseCode } from "@/api/response"
import { getSocialLoginStatusAPI, type GetSocialLoginStatusResponse } from "@/api/setting/getSocialLoginStatus"
import AccountFormFooter from "@/components/common/account-form-footer"
import AccountFormHeader from "@/components/common/account-form-header"
import { IconKeys } from "@/components/common/icons"
import SlideVerify from "@/components/common/slide-verify"
import { useAccountFormValidation } from "@/components/hooks/useAccountFormValidation"
import { RouteNames } from "@/router"
import { useOptionsStore } from "@/stores/options"
import { useUserStore } from "@/stores/user"
import { MessageUtil } from "@/utils/message"

import type { LoginForm } from "./types"

defineOptions({ name: "AppLogin" })

useHead({
    title: "登录",
})

const router = useRouter()
const userStore = useUserStore()
const optionsStore = useOptionsStore()

// 表单label位置 top | left | right
const labelPosition = ref("top")

// 表单大小 '' | 'large' | 'default' | 'small'
const formSize = ref("default")

// 打开滑动验证
const openSlideVerify = async () => {
    // 如果没有开启滑动验证, 直接调用成功回调
    if (!optionsStore.slide_verify_enable) {
        await login()
        return
    }

    // 开启滑动验证
    optionsStore.openSlideVerify()
}

// 表单实例
const loginFormRef = useTemplateRef<FormInstance>("loginFormRef")

// 表单数据
const loginForm = reactive<LoginForm>({
    loginName: "",
    password: "",
    // loginName: "jiaopengzi@qq.com",
    // password: "123QWEasd",
})

// 获取社交登录状态
const socialLoginStatus = ref<GetSocialLoginStatusResponse>({
    qq: false,
    wechat: false,
})

// 表单数据动态绑定
const loginNameRef = toRef(loginForm, "loginName")

// hook 函数
const { checkLoginNameValidator, createLoginNameRules, createPasswordRules } = useAccountFormValidation({ FormUserName: loginNameRef })

const rules = reactive<FormRules<LoginForm>>({
    loginName: createLoginNameRules(checkLoginNameValidator),
    password: createPasswordRules(),
})

const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate(async (valid) => {
        if (valid) {
            await userStore.login(loginForm.loginName, loginForm.password) // 登录
            if (userStore.getIsLogin) {
                // 从 url 中获取 redirect 参数，如果没有就默认跳转到首页
                const redirectPath = router.currentRoute.value.query.redirect as string | undefined
                if (redirectPath) {
                    // 使用 URL 对象来分离路径和查询参数
                    const url = new URL(redirectPath, window.location.origin) // 传入完整的 url
                    const path = url.pathname // 路径
                    const queryParams = Object.fromEntries(url.searchParams.entries()) // 查询参数

                    // 创建路由对象
                    const routeLocation: RouteLocationRaw = {
                        path: path,
                        query: queryParams,
                    }

                    router.push(routeLocation) // 跳转到指定页面
                } else {
                    router.push({ name: RouteNames.Home })
                }
            }
        }
    })
}

const login = async () => {
    await submitForm(loginFormRef.value as FormInstance)
}

const loginByWeChat = async () => {
    await userStore.socialLogin(SocialLoginType.WeChat)
}

const loginByQQ = async () => {
    await userStore.socialLogin(SocialLoginType.QQ)
}

onBeforeMount(async () => {
    // 获取社交登录状态
    const res = await getSocialLoginStatusAPI()
    if (res.data.code === ResponseCode.GetSocialLoginStatusSuccess) {
        socialLoginStatus.value = res.data.data
    } else {
        MessageUtil.error(handleResErr(res), 10000)
    }
})
</script>

<style lang="scss" scoped>
// 登录页容器
.login-page {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    width: 100vw;
    background-color: var(--jpz-bg-color-page);
}

// 卡片入场动画
.login-card {
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
    .login-form {
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
    .login-form {
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
    .login-form {
        width: 90vw;
        max-width: 380px;
        padding: 20px 16px;
        background-color: transparent;
        border: none;
        box-shadow: none;
    }
}

// 登录按钮: 全宽, 圆润
.login-btn {
    width: 100%;
    height: 40px;
    font-size: 15px;
    border-radius: 8px;
    letter-spacing: 2px;
}

// 社交登录分割线
.social-divider {
    display: flex;
    align-items: center;
    margin: 4px 0 16px;

    &::before,
    &::after {
        content: "";
        flex: 1;
        height: 1px;
        background-color: var(--jpz-border-color-lighter);
    }

    .divider-text {
        padding: 0 16px;
        font-size: 12px;
        color: var(--jpz-text-color-placeholder);
        white-space: nowrap;
    }
}

// 社交登录
.social {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;
}

// 社交按钮: 圆形图标按钮
.social-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: 1px solid var(--jpz-border-color-lighter);
    background-color: transparent;
    padding: 0;
    cursor: pointer;
    transition:
        border-color 0.2s,
        box-shadow 0.2s;

    &:hover {
        border-color: var(--jpz-border-color-hover);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    }
}

// 图标
.iconfont {
    font-size: 1.5em;
}

.icon-wechat {
    fill: #1aad19;
}

.icon-qq {
    fill: #1296db;
}
</style>
