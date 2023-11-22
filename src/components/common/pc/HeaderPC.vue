<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-11-22 17:36:53
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-11-22 17:53:59
 * @FilePath     : \blog-client\src\components\common\pc\HeaderPC.vue
 * @Description  : 头部 PC端
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved. 
-->
<template>
  <transition name="slide-header">
    <header class="header" v-if="headerVisible" :style="{ height: `@height-header-pc`, width: '@width-header-pc' }">
      <div class="header-mian">
        <div class="logo header-item">
          <h1>
            <img src="@/assets/img/logo-text-rounded-rectangle-200-52.png" :alt="routeObj.home.path" />
          </h1>
        </div>

        <HeaderPCNav class="header-item" />
        <div class="search header-item">
          <input type="text" placeholder="搜索" />
          <Icon name="search" customClass="search-icon" />
        </div>

        <div class="login header-item" v-if="!isLogin">
          <router-link :to="routeObj.login.path" class="link">
            <span>登录</span>
          </router-link>
          <span>/</span>
          <router-link :to="routeObj.register.path" class="link">
            <span>注册</span>
          </router-link>
        </div>
        <div class="avatar header-item" v-if="isLogin">
          <UserDropdown />
        </div>
      </div>
    </header>
  </transition>
</template>

<script setup lang="ts">
import HeaderPCNav from '@/components/common/pc/HeaderNavPC.vue'
import { ref, onBeforeMount } from 'vue'

import type { Ref } from 'vue'
import type { ScrollData } from '@/hooks/useScroll.types'
import { useScrollActions } from '@/hooks/useScrollActions'
import UserDropdown from '@/components/common/pc/UserDropdownPC.vue' // 导入 UserDropdown 组件
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import { routeObj } from '@/router/routeAll'

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
// 状态是否登录

const userStore = useUserStore()
let { isLogin } = storeToRefs(userStore)

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
  /* 将头部固定在屏幕顶部 */
  position: fixed;
  /* 设置头部距离顶部的距离为0 */
  top: 0;
  /* 设置头部距离左侧的距离为0 */
  left: 0;
  /* 可选：如果需要头部在其他元素上方显示，可以设置一个较高的 z-index 值 */
  z-index: 999;
  background-color: light.$background-color-header;
  border-bottom: 2px solid #ebebeb;
}

.header-mian {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: pc.$width-page-main;
  height: pc.$height-header;
  margin-left: calc((pc.$width-page - pc.$width-page-main - pc.$scrollbar-y-width) / 2); // 居中减去滚动条宽度
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

.search {
  display: flex;
  align-items: center;
  position: relative;
  width: pc.$width-header-search;
  height: pc.$height-header-search;
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

.search-icon {
  position: absolute;
  right: 5px;
  top: 0;
  width: 24px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  fill: #888;
}

.login {
  display: flex;
  align-items: center;
  // width: @width-header-login-pc;
  // height: @height-header-login-pc;
  // line-height: @height-header-login-pc;
  text-align: center;
  font-size: 16px;
  color: #888;
}
</style>
@/router/routeAll
