<!--
 * FilePath    : blog-client\src\components\layout\account\index.vue
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

import UserInfoDropdown from "@/components/common/user-info-dropdown" // 导入 UserDropdown 组件
import { RouteNames } from "@/router"
import { useUserStore } from "@/stores/user"

defineOptions({ name: "HeaderAccount" })

const userStore = useUserStore()
const { isLogin } = storeToRefs(userStore)

onBeforeMount(() => {
    userStore.getUserInfoByToken()
})
</script>

<style scoped lang="scss">
.login {
    display: flex;
    align-items: center;
    text-align: center;
    font-size: 16px;
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
