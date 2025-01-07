<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-01-11 22:31:47
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-17 09:55:50
 * @FilePath     : \blog-client\src\components\layout\header\pc.vue
 * @Description  : pc 头部
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->

<template>
    <transition name="slide-header">
        <header
            class="header"
            v-if="headerVisible"
            :style="{ height: `$height-header-pc`, width: '$width-header-pc' }"
        >
            <div class="header-main">
                <div class="logo">
                    <h1>
                        <img
                            src="@/assets/img/logo-text-rounded-rectangle-200-52.png"
                            :alt="routeObj.home.path"
                        />
                    </h1>
                </div>

                <HeaderNav />

                <div class="search">
                    <el-input
                        v-model="searchAll"
                        style="width: 240px"
                        size="large"
                        placeholder="搜索"
                    >
                        <!-- suffix插槽 -->
                        <template #suffix>
                            <Icon :name="IconKeys.Search" custom-class="search-icon" />
                        </template>
                    </el-input>
                </div>

                <div class="switch">
                    <SwitchGroup :switch-items="themeSwitch" @update-status="updateStatus" />
                </div>

                <div class="login" v-if="!isLogin">
                    <router-link :to="routeObj.login.path" class="link">
                        <span class="login-text">登录</span>
                    </router-link>
                    <span class="login-text separator">/</span>
                    <router-link :to="routeObj.register.path" class="link">
                        <span class="login-text">注册</span>
                    </router-link>
                </div>
                <div class="avatar" v-if="isLogin">
                    <UserInfoDropdown />
                </div>
            </div>
        </header>
    </transition>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia"
import { onBeforeMount, type Ref, ref } from "vue"

import { IconKeys } from "@/components/common/icons"
import SwitchGroup from "@/components/common/switch-group"
import UserInfoDropdown from "@/components/common/user-info-dropdown" // 导入 UserDropdown 组件
import type { ScrollData } from "@/components/hooks/useScroll"
import { useScrollActions } from "@/components/hooks/useScroll"
import { useTheme } from "@/components/hooks/useTheme"
import HeaderNav from "@/components/layout/header-nav"
import { routeObj } from "@/router/routeAll"
import { useUserStore } from "@/stores/user"

defineOptions({ name: "HeaderPC" })

// 主题切换
const { themeSwitch, updateStatus } = useTheme()

const headerVisible = ref(true) // 导航栏是否可见

const searchAll = ref("")

// ======================================== 滚动条事件 ========================================

const scrollUpAction = () => {
    if (scrollData.value.speed > 100 || scrollData.value.position < 200) {
        // 速度大于100px/s 或者 滚动条位置小于200px
        headerVisible.value = true // 显示导航栏
    }
}

const scrollDownAction = () => {
    if (scrollData.value.speed > 100 && scrollData.value.position > 400) {
        headerVisible.value = false // 隐藏导航栏
        // console.log(`===>Down, 位置：${scrollData.value.position.toFixed(2)}, 速度：${scrollData.value.speed.toFixed(2)} px/s`);
    }
}

const scrollData: Ref<ScrollData> = useScrollActions(scrollUpAction, scrollDownAction)
// ======================================== 滚动条事件 ========================================
// 状态是否登录

const userStore = useUserStore()
const { isLogin } = storeToRefs(userStore)

onBeforeMount(() => {
    // 组件挂载前
    // 通过本地信息 获取用户信息
    userStore.getUserInfoByToken()
})
</script>

<style scoped lang="scss">
header {
    width: pc.$width-header;
    height: pc.$height-header;
    position: fixed;
    top: 0;
    left: 0;
    // 可选：如果需要头部在其他元素上方显示，可以设置一个较高的 z-index 值
    // z-index: 999;
    background-color: var(--jpz-bg-color);
    // border-bottom: 1px solid var(--jpz-border-color);
}

.header-main {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: pc.$width-page-main;
    height: pc.$height-header;
    // 居中减去滚动条宽度
    margin-left: calc((pc.$width-page - pc.$width-page-main - pc.$scrollbar-y-width) / 2);
    margin-right: calc((pc.$width-page - pc.$width-page-main - pc.$scrollbar-y-width) / 2);
}

.slide-header-enter-active {
    transition: all 0.6s ease-out;
}

.slide-header-enter-from,
.slide-header-leave-to {
    transform: translateY(-100%);
    transition: all 0.6s ease-out;
    opacity: 0;
}

.logo {
    width: pc.$width-header-logo;
    height: pc.$height-header-logo;
}

.logo img {
    width: 100%;
    height: 100%;
}

.search-icon {
    font-size: 20px;
    fill: var(--jpz-text-color-primary);
}

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
</style>
