<!--
 * @Author       : jiaopengzi
 * @Date         : 2025-01-13 12:13:04
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2025-01-14 15:38:06
 * @FilePath     : \blog-client\src\components\common\account-form-footer\index.vue
 * @Description  : 账号相关表单底部
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
-->

<template>
    <div class="to">
        <template v-for="(link, index) in filteredLinks" :key="link.name">
            <router-link :to="{ name: link.routeName }" class="link">
                <span>{{ link.text }}</span>
            </router-link>
            <span v-if="index < filteredLinks.length - 1" class="separator">|</span>
        </template>
    </div>
</template>

<script lang="ts" setup>
import { RouteNames } from "@/router"

defineOptions({ name: "AccountFormFooter" })

type FooterToType = "home" | "login" | "register" | "resetPassword"

const { to } = defineProps<{
    to: FooterToType[]
}>()

const links = [
    { name: "home", routeName: RouteNames.Home, text: "首页" },
    { name: "login", routeName: RouteNames.Login, text: "登录" },
    { name: "register", routeName: RouteNames.Register, text: "注册" },
    { name: "resetPassword", routeName: RouteNames.ResetPassword, text: "忘记密码" },
]

const filteredLinks = links.filter((link) => to.includes(link.name as FooterToType))
</script>

<style lang="scss" scoped>
.to {
    text-align: center;
    margin-top: 20px;
}

.to span {
    color: var(--jpz-text-color-secondary);
}

.separator {
    margin: 0 10px;
    color: var(--jpz-text-color-secondary);
}
</style>
