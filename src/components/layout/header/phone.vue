<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-01-11 22:31:43
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-17 09:56:08
 * @FilePath     : \blog-client\src\components\layout\header\phone.vue
 * @Description  : phone 头部
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->

<template>
    <transition name="slide-header">
        <header v-if="headerVisible">
            <ul class="header-main">
                <li>
                    <button type="button" class="btn-menu" @click="toggleNav">
                        <j-icon :name="IconKeys.Menu" custom-class="my-icon" />
                    </button>
                </li>
                <li>
                    <router-link :to="{ name: RouteNames.Home }" class="link">
                        <div class="logo">
                            <h2>
                                <img src="@/assets/img/logo-text-rounded-rectangle-200-52.png" :alt="RouteNames.Home" />
                            </h2>
                        </div>
                    </router-link>
                </li>

                <li>
                    <div class="search">
                        <j-icon :name="IconKeys.Search" custom-class="my-icon" />
                    </div>
                </li>
            </ul>
        </header>
    </transition>
    <div v-if="navVisible" class="nav-backdrop" @click="toggleNav"></div>
    <div
        class="side-nav"
        id="sideNav"
        :style="{
            transform: navVisible ? 'translateX(0)' : 'translateX(-100%)',
        }"
    >
        <!-- 侧边栏导航栏 -->
        <HeaderNav />
    </div>
</template>
<script setup lang="ts">
import type { Ref } from "vue"
import { ref } from "vue"

import { IconKeys } from "@/components/common/icons"
import type { ScrollData } from "@/components/hooks/useScroll"
import { useScrollActions } from "@/components/hooks/useScroll"
import HeaderNav from "@/components/layout/header-nav"
import { RouteNames } from "@/router"

defineOptions({ name: "HeaderPhone" })

const navVisible = ref(false) // 侧边导航栏是否可见
const headerVisible = ref(true) // 导航栏是否可见
// const headerHeight = 'calc(64 / 667 * 100vh)'

const toggleNav = () => {
    navVisible.value = !navVisible.value
}

/* ======================================== 滚动条事件 ======================================== */

const scrollUpAction = () => {
    navVisible.value = false // 隐藏侧边导航栏
    if (scrollData.value.speed > 100 || scrollData.value.position < 200) {
        // 速度大于100px/s 或者 滚动条位置小于200px
        headerVisible.value = true // 显示导航栏
    }
    // console.log(`===>Up, 位置：${scrollData.value.position.toFixed(2)}, 速度：${scrollData.value.speed.toFixed(2)} px/s`);
}

const scrollDownAction = () => {
    navVisible.value = false // 隐藏侧边导航栏
    headerVisible.value = false // 隐藏导航栏
    // console.log(`===>Down, 位置：${scrollData.value.position.toFixed(2)}, 速度：${scrollData.value.speed.toFixed(2)} px/s`)
}

const scrollData: Ref<ScrollData> = useScrollActions(scrollUpAction, scrollDownAction)
/* ======================================== 滚动条事件 ======================================== */
</script>

<style scoped lang="scss">
header {
    width: 100%;
    height: phone.$height-header;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    background-color: var(--jpz-bg-color);
}

.header-main {
    // border-bottom: 1px solid var(--jpz-border-color);
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100vw;
    height: phone.$height-header;
}

//透明遮罩
.nav-backdrop {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 997;
    background-color: var(--jpz-border-color);
    opacity: 0.5;
}

// 侧边导航栏
.side-nav {
    background-color: var(--jpz-bg-color);
    position: fixed;
    top: 0;
    // border: 1px solid var(--jpz-border-color);
    left: 0;
    z-index: 998;
    transition: transform 300ms ease-in-out;
    // box-shadow: 1px 0 5px rgba(0, 0, 0, 0.2);
    height: 100vh;
    width: 61.8vw;
}

// VUE3.0 transition 动画
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
    width: phone.$width-header-logo;
    height: phone.$height-header-logo;
}

.logo img {
    width: 100%;
    height: 100%;
}

li {
    list-style: none;
    padding: 5%;
}

.btn-menu {
    background-color: transparent;
    border: none;
    outline: none;
}

.my-icon {
    fill: var(--jpz-text-color-primary);
}
</style>
