<!--
 * FilePath    : blog-client-nuxt\src\components\layout\account\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 账号相关
-->

<template>
    <div class="account">
        <div class="login" v-if="!isLogin">
            <router-link :to="{ name: RouteNames.Login }">
                <span class="login-text">登录</span>
            </router-link>
            <span class="login-text separator">/</span>
            <router-link :to="{ name: RouteNames.Register }">
                <span class="login-text">注册</span>
            </router-link>
        </div>
        <div class="avatar" v-if="isLogin">
            <UserInfoDropdown />
        </div>
    </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia"
import { onBeforeMount } from "vue"

import UserInfoDropdown from "@/components/common/user-info-dropdown"
import { RouteNames } from "@/router"
import { useUserStore } from "@/stores/user"

defineOptions({ name: "HeaderAccount" })

const userStore = useUserStore()
const { isLogin } = storeToRefs(userStore)

onBeforeMount(async () => {
    // Nuxt 迁移适配(bugfix 260825-02 bug01): SPA 由 auth 中间件在首帧渲染前 await initStores,
    // 账号组件挂载时登录态已就绪; Nuxt 为修复 hydration mismatch 将 initStores 推迟到水合完成后
    // (onNuxtReady). 若此处直接调用 getUserInfoByToken, 会先于 initStores 的角色列表加载完成执行,
    // 此时 user info 无法组装登录态(依赖角色列表), 反而把刚刷新出的 access token 清空, 随后
    // initStores 再次刷新并重复请求(access-token-refresh-web 与 user/info 各发两次), 头像闪烁
    // 改为等待共享 initStores Promise, 与 SPA 语义一致: 单次刷新流程, 登录态在角色列表加载完成后一次成型
    try {
        const { getInitStoresPromise } = await import("@/stores/init")
        await getInitStoresPromise()
    } catch {
        // initStores 异常时保持未登录渲染, 不阻塞页面(与 init-stores.client 插件容错语义一致)
    }
})
</script>

<style scoped lang="scss">
.login {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    font-size: 16px;
    width: 100px;
}

.login-text {
    color: var(--jpz-text-color-primary);
}

.separator {
    margin: 0 4px;
}

.account {
    @include respond-to("pc") {
        margin: 0;
    }

    @include respond-to("pad") {
        margin-right: 10px;
    }

    @include respond-to("phone") {
        margin-right: 10px;
    }
}
</style>
