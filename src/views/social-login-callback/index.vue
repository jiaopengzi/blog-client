<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-12-01 22:04:48
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-11 16:46:59
 * @FilePath     : \blog-client\src\views\social-login-callback\index.vue
 * @Description  : 三方登录回调页面
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->

<template>
    <div class="container">
        <div class="loader"></div>
        <p class="text">{{ _platform }}登录中...</p>
    </div>
</template>

<script lang="ts" setup>
import type { Ref } from "vue"
import { onMounted, ref } from "vue"
import { useRoute, useRouter } from "vue-router"

import { Social } from "@/api/common"
import { routeObj } from "@/router/routeAll"
import { useUserStore } from "@/stores/user"

defineOptions({ name: "SocialLoginCallback" })

const userStore = useUserStore()
const router = useRouter()
const route = useRoute()

const loginByQQCallback = async () => {
    const code = new URLSearchParams(window.location.search).get("code")
    if (!code) {
        return
    }
    await userStore.loginByQQCallback(code)
}

const bindQQCallback = async () => {
    const code = new URLSearchParams(window.location.search).get("code")
    if (!code) {
        return
    }
    await userStore.bindQQCallback(code)
}

const loginByWeChatCallback = async () => {
    const code = new URLSearchParams(window.location.search).get("code")
    if (!code) {
        return
    }
    await userStore.loginByWeChatCallback(code)
}

const bindWeChatCallback = async () => {
    const code = new URLSearchParams(window.location.search).get("code")
    if (!code) {
        return
    }
    await userStore.bindWeChatCallback(code)
}

// 三方平台
const _platform: Ref<string> = ref("")

onMounted(async () => {
    console.log(route.path)
    if (route.path === routeObj.socialQQLoginCallback.path) {
        _platform.value = Social.QQDisplay
        await loginByQQCallback() // 等待 loginByQQCallback 执行完毕后，跳转到首页
    } else if (route.path === routeObj.socialQQBindCallback.path) {
        _platform.value = Social.QQDisplay
        await bindQQCallback() // 等待 bindQQCallback 执行完毕后，跳转到首页
    } else if (route.path === routeObj.socialWeChatLoginCallback.path) {
        _platform.value = Social.WeChatDisplay
        await loginByWeChatCallback() // 等待 loginByWeChatCallback 执行完毕后，跳转到首页
    } else if (route.path === routeObj.socialWeChatBindCallback.path) {
        _platform.value = Social.WeChatDisplay
        await bindWeChatCallback()
    }

    router.push({ path: routeObj.home.path })

    // window.location.href = routeObj.home.path
})
</script>

<style scoped lang="scss">
.container {
    display: flex;
    align-items: center;
    justify-content: center;
    // height: 100vh;
    flex-direction: column;
    background-color: var(--jpz-bg-color);
}

.loader {
    border: 1px solid var(--jpz-border-color);
    border-top: 8px solid var(--jpz-color-secondary);
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
}

.text {
    font-size: 18px;
    margin-top: 20px;
    color: var(--jpz-color-primary);
    // 加粗
    font-weight: 700;
}

// 动画
@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>
