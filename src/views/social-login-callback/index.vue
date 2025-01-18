<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-12-01 22:04:48
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2025-01-18 19:36:27
 * @FilePath     : \blog-client\src\views\social-login-callback\index.vue
 * @Description  : 三方登录回调页面
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->

<template>
    <div class="container">
        <div class="loader">{{ platformDisplay }}登录中, 请稍后!</div>
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
    { platform: SocialLoginType; display: string; action: (code: string, loginType: SocialLoginType) => Promise<void>; routeName: RouteNames }
> = {
    [RouteNames.SocialQQLoginCallback]: {
        platform: SocialLoginType.QQ,
        display: SocialLoginDisplay.QQ,
        action: userStore.socialLoginCallback,
        routeName: RouteNames.Home,
    },
    [RouteNames.SocialQQBindCallback]: {
        platform: SocialLoginType.QQ,
        display: SocialLoginDisplay.QQ,
        action: userStore.socialBindCallback,
        routeName: RouteNames.UserInfo,
    },
    [RouteNames.SocialWeChatLoginCallback]: {
        platform: SocialLoginType.WeChat,
        display: SocialLoginDisplay.WeChat,
        action: userStore.socialLoginCallback,
        routeName: RouteNames.Home,
    },
    [RouteNames.SocialWeChatBindCallback]: {
        platform: SocialLoginType.WeChat,
        display: SocialLoginDisplay.WeChat,
        action: userStore.socialBindCallback,
        routeName: RouteNames.UserInfo,
    },
}

onMounted(async () => {
    const routeName = route.name as RouteNamesSocial
    const callbackInfo = socialCallbacks[routeName]
    if (!callbackInfo) {
        router.push({ name: RouteNames.Home })
        return
    }

    const code = new URLSearchParams(window.location.search).get("code")

    if (code) {
        platformDisplay.value = callbackInfo.display
        await callbackInfo.action(code, callbackInfo.platform)
    }

    router.push({ name: callbackInfo.routeName })
})
</script>

<style scoped lang="scss">
.container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    flex-direction: column;
    background-color: var(--jpz-bg-color);
}

// 参考 https://css-loaders.com/classic/
.loader {
    width: fit-content;
    font-weight: bold;
    font-family: sans-serif;
    font-size: 30px;
    padding-bottom: 8px;
    background: linear-gradient(currentColor 0 0) 0 100%/0% 3px no-repeat;
    animation: l2 2s linear infinite;
    color: var(--jpz-color-primary);
}
.loader::after {
    content: "";
}
@keyframes l2 {
    to {
        background-size: 100% 3px;
    }
}
</style>
