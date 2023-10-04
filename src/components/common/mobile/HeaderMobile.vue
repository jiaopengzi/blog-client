<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-08-04 10:54:19
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-10-04 15:36:51
 * @FilePath     : \blog-client\src\components\common\mobile\HeaderMobile.vue
 * @Description  : 头部 移动端
 * @blog         : https://jiaopengzi.com
 * Copyright (c) 2023 by jiaopengzi, All Rights Reserved. 
-->


<template>
  <transition name="slide-header">
    <header class="header" v-if="headerVisible" :style="{ height: `@height-header-mobile`, width: '100vw' }">
      <ul class="header-main">
        <li>
          <button class="btn-menu" @click="toggleNav">
            <span class="iconfont icon-menu"></span>
          </button>
        </li>
        <li>
          <div class="logo">
            <h1>
              <img src="@/assets/img/logo-text-rounded-rectangle-200-52.png" alt="/" />
            </h1>
          </div>
        </li>

        <li>
          <div class="search">
            <span class="iconfont icon-search"></span>
          </div>
        </li>
      </ul>
    </header>
  </transition>
  <div v-if="navVisible" class="nav-backdrop" @click="toggleNav"></div>
  <div class="side-nav" id="sideNav" :style="{
    transform: navVisible ? 'translateX(0)' : 'translateX(-100%)',
    height: `100vh`,
    width: '61.8vw',
  }">
    <!-- :style="{ transform: navVisible ? 'translateX(0)' : 'translateX(-100%)', height: `calc(100vh - ${headerHeight})`, width: '61.8vw' }"> -->
    <!-- 侧边栏导航栏 -->
    <HeaderMobileNav />
  </div>
</template>
<script setup lang="ts">
// 引用图标
import '@/components/icons/iconfont.css'
import HeaderMobileNav from './HeaderMobileNav.vue'
import { ref } from 'vue'

import type { Ref } from 'vue'
import type { ScrollData } from '@/hooks/useScroll.types'
import { useScrollActions } from '@/hooks/useScrollActions'


const navVisible = ref(false) // 侧边导航栏是否可见
const headerVisible = ref(true) // 导航栏是否可见
// const headerHeight = 'calc(64 / 667 * 100vh)'

const toggleNav = () => {
  navVisible.value = !navVisible.value
}

// ======================================== 滚动条事件 ========================================

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
  // console.log(`===>Down, 位置：${scrollData.value.position.toFixed(2)}, 速度：${scrollData.value.speed.toFixed(2)} px/s`);
}

const scrollData: Ref<ScrollData> = useScrollActions(scrollUpAction, scrollDownAction)
// ======================================== 滚动条事件 ========================================


</script>

<style scoped lang="less">
@media screen and (max-width: @width-page-main-pc) {

  /* 透明遮罩 */
  .nav-backdrop {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 997;
    background-color: rgba(0, 0, 0, 0.1);
  }

  /* 侧边导航栏*/
  .side-nav {
    background: rgba(255, 255, 255, 0.97);
    position: fixed;
    top: 0;
    border: #ddd 1px solid;
    left: 0;
    z-index: 998;
    transition: transform 300ms ease-in-out;
    box-shadow: 1px 0 5px rgba(0, 0, 0, 0.2);
  }

  header {
    width: 100%;
    /* 更改此处 */
    height: @height-header-mobile;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
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

  .header-main {
    border-bottom: 2px solid #ebebeb;
    background-color: #fefefe;
    display: flex;
    justify-content: space-between;
    /* 修改此处使logo居中 */
    align-items: center;
    width: 100vw;
    height: @height-header-mobile;
  }

  .logo {
    width: @width-header-logo-mobile;
    /* 让logo居中 */
    height: @height-header-logo-mobile;
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
}
</style>
