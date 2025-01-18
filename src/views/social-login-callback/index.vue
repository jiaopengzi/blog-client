<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-12-01 22:04:48
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2025-01-18 17:57:52
 * @FilePath     : \blog-client\src\views\social-login-callback\index.vue
 * @Description  : 三方登录回调页面
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->

<template>
    <div class="container">
        <div class="loader"></div>
        <p class="text">{{ platformDisplay }}登录中...</p>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue"
import { useRoute, useRouter } from "vue-router"

import { SocialLoginDisplay, SocialLoginType } from "@/api/common"
import { RouteNames, RouteNamesSocial } from "@/router"
import { useUserStore } from "@/stores/user"

defineOptions({ name: "SocialLoginCallback" })

const userStore = useUserStore()
const router = useRouter()
const route = useRoute()

const platformDisplay = ref("")

const socialCallbacks: Record<
    RouteNamesSocial,
    { platform: SocialLoginType; display: string; action: (code: string, loginType: SocialLoginType) => Promise<void> }
> = {
    [RouteNames.SocialQQLoginCallback]: {
        platform: SocialLoginType.QQ,
        display: SocialLoginDisplay.QQ,
        action: userStore.socialLoginCallback,
    },
    [RouteNames.SocialQQBindCallback]: {
        platform: SocialLoginType.QQ,
        display: SocialLoginDisplay.QQ,
        action: userStore.socialBindCallback,
    },
    [RouteNames.SocialWeChatLoginCallback]: {
        platform: SocialLoginType.WeChat,
        display: SocialLoginDisplay.WeChat,
        action: userStore.socialLoginCallback,
    },
    [RouteNames.SocialWeChatBindCallback]: {
        platform: SocialLoginType.WeChat,
        display: SocialLoginDisplay.WeChat,
        action: userStore.socialBindCallback,
    },
}

onMounted(async () => {
    const routeName = route.name as RouteNamesSocial
    const callbackInfo = socialCallbacks[routeName]

    if (callbackInfo) {
        const code = new URLSearchParams(window.location.search).get("code")
        if (code) {
            platformDisplay.value = callbackInfo.display
            await callbackInfo.action(code, callbackInfo.platform)
        }
    }

    router.push({ name: RouteNames.Home })
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
