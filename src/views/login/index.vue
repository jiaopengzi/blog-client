<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-11-22 16:05:07
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2025-01-18 17:31:13
 * @FilePath     : \blog-client\src\views\login\index.vue
 * @Description  : 登录
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved. 
-->

<template>
    <div class="login-page">
        <!-- 添加滑动验证组件：SlideVerify -->
        <SlideVerify v-if="showSlideVerify" @on-close="closeSlideVerify" @on-success="login"></SlideVerify>
        <el-form
            :label-position="labelPosition"
            label-width="100px"
            ref="loginFormRef"
            :model="loginForm"
            :rules="rules"
            class="login-form"
            :size="formSize"
            status-icon
        >
            <AccountFormHeader :router-link-to="{ name: RouteNames.Home }" title="账号登录" />

            <el-form-item label="用户名/邮箱" prop="loginName">
                <el-input v-model="loginForm.loginName" placeholder="请输入用户名或邮箱" clearable />
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input type="password" v-model="loginForm.password" placeholder="大小写字母 + 数字, 长度:6-64" show-password clearable />
            </el-form-item>
            <div class="btn-submit">
                <el-form-item>
                    <el-button type="primary" @click="openSlideVerify">登录</el-button>
                </el-form-item>
            </div>
            <div class="social">
                <button type="button" class="social-btn" @click="loginByWeChat">
                    <Icon :name="IconKeys.Wechat" custom-class="iconfont icon-wechat" />
                </button>
                <button type="button" class="social-btn" @click="loginByQQ">
                    <Icon :name="IconKeys.Qq" custom-class="iconfont icon-qq" />
                </button>
            </div>
            <AccountFormFooter :to="['home', 'register', 'resetPassword']" />
        </el-form>
    </div>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from "element-plus" // 需要全部安装 npm i element-plus -S
import { reactive, ref, toRef, useTemplateRef } from "vue"
import type { RouteLocationRaw } from "vue-router"
import { useRouter } from "vue-router"

import { SocialLoginType } from "@/api/common"
import AccountFormFooter from "@/components/common/account-form-footer"
import AccountFormHeader from "@/components/common/account-form-header"
import { IconKeys } from "@/components/common/icons"
import SlideVerify from "@/components/common/slide-verify"
import { useAccountFormValidation } from "@/components/hooks/useAccountFormValidation"
import { RouteNames } from "@/router"
import { useUserStore } from "@/stores/user"

import type { LoginForm } from "./types"

// eslint-disable-next-line vue/multi-word-component-names
defineOptions({ name: "Login" })
const router = useRouter()
// 表单label位置 top | left | right
const labelPosition = ref("top")

// 表单大小 '' | 'large' | 'default' | 'small'
const formSize = ref("default")

// 表单实例
const loginFormRef = useTemplateRef<FormInstance>("loginFormRef")

// 表单数据
const loginForm = reactive<LoginForm>({
    loginName: "jiaopengzi@qq.com",
    password: "123QWEasd",
})

// 表单数据动态绑定
const loginNameRef = toRef(loginForm, "loginName")

// hook 函数
const { checkLoginNameValidator, createLoginNameRules, createPasswordRules } = useAccountFormValidation({ FormUserName: loginNameRef })

const rules = reactive<FormRules<LoginForm>>({
    loginName: createLoginNameRules(checkLoginNameValidator),
    password: createPasswordRules(),
})

const userStore = useUserStore()

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

// 添加 showSlideVerify 响应式变量
const showSlideVerify = ref(false)

const openSlideVerify = () => {
    showSlideVerify.value = true // 显示滑块验证
}

const closeSlideVerify = () => {
    showSlideVerify.value = false // 关闭滑块验证
}

const login = () => {
    // 关闭滑块验证
    showSlideVerify.value = false
    submitForm(loginFormRef.value as FormInstance)
    // console.log('登录')
}

const loginByWeChat = async (event: Event) => {
    event.preventDefault() // 阻止默认行为
    await userStore.socialLogin(SocialLoginType.WeChat)
}

const loginByQQ = async (event: Event) => {
    event.preventDefault() // 阻止默认行为
    await userStore.socialLogin(SocialLoginType.QQ)
}
</script>

<style lang="scss" scoped>
.login-page {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100vw;
    background-color: var(--jpz-bg-color-page);
}

@include respond-to("pc") {
    .login-form {
        width: 360px;
        border: 1px solid var(--jpz-border-color);
        border-radius: 5px;
        padding: 20px;
        box-shadow: var(--jpz-box-shadow-light);
        background-color: var(--jpz-bg-color);
    }
}

@include respond-to("pad") {
    .login-form {
        width: 360px;
        border: 1px solid var(--jpz-border-color);
        border-radius: 5px;
        padding: 20px;
        box-shadow: var(--jpz-box-shadow-light);
        background-color: var(--jpz-bg-color);
    }
}

@include respond-to("phone") {
    .login-form {
        width: 90vw;
        box-shadow: none;
        border: none;
        background-color: transparent;
    }
}

.email-code {
    flex: 5;
}

.btn-submit {
    text-align: center;
}

.btn-submit .el-form-item {
    display: inline-block;
}

.social {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
}

.social-btn {
    border: none;
    background-color: transparent;
    cursor: pointer;
    outline: none;
    margin-right: 10px;
}

.iconfont {
    font-size: 3em;
}

.icon-wechat {
    fill: #1aad19;
}

.icon-qq {
    fill: #1296db;
}
</style>
