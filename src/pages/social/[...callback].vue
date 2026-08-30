<!--
 * FilePath    : blog-client-nuxt\src\pages\social\[...callback].vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 社交登录/绑定回调(CSR, 原 views/social-login-callback 视图已并入本页面)
-->

<!--
 * 补充说明:
 * 单页面覆盖 SPA 的 4 个回调路径: /social/qq/login/callback, /social/qq/bind/callback,
 * /social/wechat/login/callback, /social/wechat/bind/callback;
 * 视图内已按路径段还原 SPA 的 4 个 RouteNamesSocial 语义(保留原逻辑),
 * 保持原 CSR 语义: 整页模板位于 ClientOnly 内
-->

<script setup lang="ts">
definePageMeta({ layout: false })

// Nuxt 适配: useHead / useRoute / useRouter 为 Nuxt 自动导入(@unhead/vue, vue-router 非直接依赖)
import { computed, onMounted, ref } from "vue"

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

// Nuxt 适配: 单页面承载 4 个回调路径(/social/qq/login/callback 等),
// 由路径段还原 SPA 的 4 个 RouteNamesSocial 名称(与旧视图 route.name 语义一致)
const routeName = computed<RouteNamesSocial | "">(() => {
    const segs = Array.isArray(route.params.callback) ? route.params.callback : [String(route.params.callback ?? "")]
    if (segs.length !== 3 || segs[2] !== "callback") {
        return ""
    }

    const platform = segs[0] === "qq" ? "qq" : segs[0] === "wechat" ? "wechat" : ""
    const action = segs[1] === "login" ? "login" : segs[1] === "bind" ? "bind" : ""
    if (!platform || !action) {
        return ""
    }

    return `social-${platform}-${action}-callback` as RouteNamesSocial
})

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
    const currentRouteName = routeName.value
    const callbackInfo = currentRouteName ? socialCallbacks[currentRouteName] : undefined
    if (!callbackInfo) {
        router.push({ name: RouteNames.Home })
        return
    }

    const isLoginCallback = currentRouteName === RouteNames.SocialQQLoginCallback || currentRouteName === RouteNames.SocialWeChatLoginCallback
    loginOrBind.value = isLoginCallback ? "登录中" : "绑定中"

    const code = new URLSearchParams(window.location.search).get("code")

    if (code) {
        platformDisplay.value = callbackInfo.display

        // bugfix(260829 bug02): SPA 的 beforeEach(authMiddleware → initStores) 先于回调视图挂载完成,
        // 回调动作与 store 初始化天然串行; Nuxt 的 initStores 延迟到 onNuxtReady, 若回调动作先执行,
        // 会与 initStores 内 getUserInfoByToken 的空 token 刷新分支并发竞态——刷新失败的
        // $patch(空 store) 会抹掉回调刚写入的 token, 跳转用户中心后请求头 Authorization 为空、
        // 绑定状态不刷新. 这里先等待共享初始化完成再执行回调, 恢复 SPA 的串行时序
        const { getInitStoresPromise } = await import("@/stores/init")
        await getInitStoresPromise()

        await callbackInfo.action(code, callbackInfo.platform)
    }

    router.push({ name: callbackInfo.routeName })
})
</script>

<template>
    <ClientOnly>
        <div class="container">
            <div class="loader-social">{{ platformDisplay }}{{ loginOrBind }}, 请稍后!</div>
        </div>

        <FooterStatistics v-if="optionsStore.isShowFooterStatistics" />
    </ClientOnly>
</template>

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
