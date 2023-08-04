<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-08-04 10:54:19
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-08-04 20:46:36
 * @FilePath     : \blog-client\src\components\common\pc\HeaderPC.vue
 * @Description  : 头部 PC端
 * @blog         : https://jiaopengzi.com
 * Copyright (c) 2023 by jiaopengzi, All Rights Reserved. 
-->


<template>
  <transition name="slide-header">
    <header class="header" v-if="headerVisible" :style="{ height: `@height-header-pc`, width: '@width-header-pc' }">
      <div class="header-mian">
        <div class="logo">
          <h1>
            <img src="@/assets/img/logo-text-rounded-rectangle-200-52.png" alt="/" />
          </h1>
        </div>

        <HeaderPCNav />
        <div class="search">
          <input type="text" placeholder="搜索" />
          <span class="iconfont icon-search"></span>
        </div>

        <div class="login">
          <router-link to="/login" class="link">
            <span>登录</span>
          </router-link>
          <span>/</span>
          <router-link to="/register" class="link">
            <span>注册</span>
          </router-link>
        </div>
      </div>
    </header>
  </transition>
</template>

<script setup lang="ts">
// 引用图标
import '@/components/icons/iconfont.css'

import HeaderPCNav from './HeaderPCNav.vue'
import { ref } from 'vue'

import type { Ref } from 'vue'
import type { ScrollData } from '@/hooks/useScroll.types'
import { useScrollActions } from '@/hooks/useScrollActions'

const headerVisible = ref(true) // 导航栏是否可见

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
  }
}

const scrollData: Ref<ScrollData> = useScrollActions(scrollUpAction, scrollDownAction)
// ======================================== 滚动条事件 ========================================
</script>

<style scoped lang="less">
header {
  width: @width-header-pc;
  height: @height-header-pc;
  /* 将头部固定在屏幕顶部 */
  position: fixed;
  /* 设置头部距离顶部的距离为0 */
  top: 0;
  /* 设置头部距离左侧的距离为0 */
  left: 0;
  /* 可选：如果需要头部在其他元素上方显示，可以设置一个较高的 z-index 值 */
  z-index: 999;
  background-color: @background-color-header;
  border-bottom: 2px solid #ebebeb;
}

.header-mian {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: @width-page-main-pc;
  height: @height-header-pc;
  margin: 0 auto;
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
  width: @width-header-logo-pc;
  height: @height-header-logo-pc;
}

.logo img {
  width: 100%;
  height: 100%;
}

.search {
  display: flex;
  align-items: center;
  position: relative;
  width: @width-header-search-pc;
  height: @height-header-search-pc;
  background-color: #f5f5f5;
}

.search input {
  width: 75%;
  height: 100%;
  padding: 0 10px;
  border: none;
  outline: none;
  background-color: transparent;
}

.login {
  width: @width-header-login-pc;
  height: @height-header-login-pc;
  line-height: @height-header-login-pc;
  text-align: center;
  font-size: 16px;
  color: #888;
}
</style>
