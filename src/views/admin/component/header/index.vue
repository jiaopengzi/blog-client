<!--
 * @FilePath     : \blog-client\src\views\admin\component\header\index.vue
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
 * @Description  : 管理后台头部 
-->

<template>
    <header>
        <div class="left">
            <el-button class="btn-logo" @click="goHome">
                <img :src="logo || '../demo-logo.svg'" alt="logo" />
            </el-button>
        </div>

        <div class="right">
            <div class="theme-switch">
                <ThemePresetSelector :model-value="activeThemePreset" :presets="themePresetOptions" @update:model-value="selectThemePreset" />
            </div>

            <div class="avatar" v-if="isLogin">
                <UserInfoDropdown :is-hidden-admin="true" />
            </div>
        </div>
    </header>
</template>
<script setup lang="ts">
import { storeToRefs } from "pinia"
import { useRouter } from "vue-router"

import ThemePresetSelector from "@/theme/preset-selector"
import UserInfoDropdown from "@/components/common/user-info-dropdown"
import { useTheme } from "@/theme/useTheme"
import { RouteNames } from "@/router"
import { useOptionsStore } from "@/stores/options"
import { useUserStore } from "@/stores/user"

defineOptions({ name: "AdminHeader" })

const userStore = useUserStore()
const optionsStore = useOptionsStore()

const { isLogin } = storeToRefs(userStore)
const logo = optionsStore.getLogo

const { activeThemePreset, selectThemePreset, themePresetOptions } = useTheme()
const router = useRouter()

// 跳转到用户中心
const goHome = () => {
    router.push({ name: RouteNames.Home })
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
            width: auto;
            height: pc.$height-header-logo;
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
