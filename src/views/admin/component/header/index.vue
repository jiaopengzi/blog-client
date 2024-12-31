<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-01-25 14:29:36
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-31 16:53:42
 * @FilePath     : \blog-client\src\views\admin\component\header\index.vue
 * @Description  : 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->

<template>
    <header>
        <div class="left">
            <el-button class="btn-logo" @click="goHome">
                <img
                    src="@/assets/img/logo-text-rounded-rectangle-200-52.png"
                    alt="routeObj.home.path"
            /></el-button>
        </div>

        <div class="right">
            <div class="theme-switch">
                <SwitchGroup :switch-items="themeSwitch" @update-status="updateStatus" />
            </div>

            <div class="avatar" v-if="isLogin">
                <UserInfoDropdown :is-hidden-admin="true" />
            </div>
        </div>
    </header>
</template>
<script setup lang="ts">
import { useRouter } from "vue-router"
import { routeObj } from "@/router/routeAll"
import { storeToRefs } from "pinia"
import { useUserStore } from "@/stores/user"
import { useTheme } from "@/components/hooks/useTheme"
import UserInfoDropdown from "@/components/common/user-info-dropdown"
import SwitchGroup from "@/components/common/switch-group"
defineOptions({ name: "AdminHeader" })
const userStore = useUserStore()
const { isLogin } = storeToRefs(userStore)
// 主题切换
const { themeSwitch, updateStatus } = useTheme()
const router = useRouter()

// 跳转到用户中心
const goHome = () => {
    router.push(routeObj.home.path)
}
</script>
<style scoped lang="scss">
header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;

    .btn-logo {
        padding: 0;
        border: none;
        background-color: transparent;
        img {
            width: 200px;
            height: 52px;
        }
    }

    .right {
        display: flex;
        align-items: center;
        .theme-switch {
            margin-right: 20px;
        }
        .avatar {
            margin-right: 20px;
        }
    }
}
</style>
