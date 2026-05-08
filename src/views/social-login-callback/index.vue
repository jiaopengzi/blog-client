<!--
 * @FilePath     : \blog-client\src\views\social-login-callback\index.vue
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
 * @Description  : 社交登录回调页面
-->

<template>
    <div class="container">
        <div class="loader-social">{{ platformDisplay }}{{ loginOrBind }}, 请稍后!</div>
    </div>

    <FooterStatistics v-if="optionsStore.isShowFooterStatistics" />
</template>

<script lang="ts" setup>
import { useHead } from "@unhead/vue"
import { onMounted, ref } from "vue"
import { useRoute, useRouter } from "vue-router"

import { SocialLoginDisplay, SocialLoginType } from "@/api/common"
import FooterStatistics from "@/components/layout/footer-statistics"
import { RouteNames, RouteNamesSocial } from "@/router"
import { useOptionsStore } from "@/stores/options"
import { useUserStore } from "@/stores/user"

defineOptions({ name: "SocialLoginCallback" })

useHead({
    title: "社交登录回调",
})

const userStore = useUserStore()
const router = useRouter()
const route = useRoute()
const optionsStore = useOptionsStore()

const platformDisplay = ref("")
const loginOrBind = ref("登录中")

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

    const LoginList = [RouteNames.SocialQQLoginCallback, RouteNames.SocialWeChatLoginCallback]
    loginOrBind.value = LoginList.includes(routeName) ? "登录中" : "绑定中"

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
    width: 100vw;
    height: 100vh;
    flex-direction: column;
    background-color: var(--jpz-bg-color);
}

// 参考 https://css-loaders.com/classic/
.loader-social {
    width: fit-content;
    font-weight: bold;
    // font-family: sans-serif;
    font-size: 30px;
    padding-bottom: 8px;
    background: linear-gradient(currentColor 0 0) 0 100%/0% 3px no-repeat;
    animation: l2 2s linear infinite;
    color: var(--jpz-color-primary);
}
.loader-social::after {
    content: "";
}
@keyframes l2 {
    to {
        background-size: 100% 3px;
    }
}
</style>
