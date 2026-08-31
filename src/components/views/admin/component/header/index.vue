<!--
 * FilePath    : blog-client-nuxt\src\components\views\admin\component\header\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 管理后台头部
-->

<template>
    <header>
        <div class="left">
            <el-button class="btn-logo" @click="goHome">
                <!-- bug02(260831-01 反馈第1轮): 经 LogoImage 统一渲染 /logo.png 运行时镜像;
                     原 '../demo-logo.svg' 相对路径在深层级路由下会解析错位, 已由组件内绝对路径兜底 -->
                <LogoImage />
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
import LogoImage from "@/components/common/logo-image"
import { useTheme } from "@/theme/useTheme"
import { RouteNames } from "@/router"
import { useUserStore } from "@/stores/user"

defineOptions({ name: "AdminHeader" })

const userStore = useUserStore()

const { isLogin } = storeToRefs(userStore)

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
