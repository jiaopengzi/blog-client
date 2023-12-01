<!-- eslint-disable vue/multi-word-component-names -->
<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-11-22 16:05:07
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-11-22 16:06:47
 * @FilePath     : \blog-client\src\views\SocialLoginCallbackView.vue
 * @Description  : 三方登录回调跳转页面
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved. 
-->

<template>
  <div class="container">
    <div class="loader"></div>
    <p class="text">{{ _platform }}登录中...</p>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import type { Ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { useRoute } from 'vue-router'
import { routeObj } from '@/router/routeAll'
import { social } from '@/api/responseCode'

const userStore = useUserStore()
const route = useRoute()

const loginByQQCallback = async () => {
  const code = new URLSearchParams(window.location.search).get('code')
  if (!code) {
    return
  }
  await userStore.loginByQQCallback(code)
}

const bindQQCallback = async () => {
  const code = new URLSearchParams(window.location.search).get('code')
  if (!code) {
    return
  }
  await userStore.bindQQCallback(code)
}

const loginByWeChatCallback = async () => {
  const code = new URLSearchParams(window.location.search).get('code')
  if (!code) {
    return
  }
  await userStore.loginByWeChatCallback(code)
}

const bindWeChatCallback = async () => {
  const code = new URLSearchParams(window.location.search).get('code')
  if (!code) {
    return
  }
  await userStore.bindWeChatCallback(code)
}

// 三方平台
const _platform: Ref<string> = ref('')

onMounted(async () => {
  console.log(route.path)
  if (route.path === routeObj.socialQQLoginCallback.path) {
    _platform.value = social.QQDisplay
    await loginByQQCallback() // 等待 loginByQQCallback 执行完毕后，跳转到首页
  } else if (route.path === routeObj.socialQQBindCallback.path) {
    _platform.value = social.QQDisplay
    await bindQQCallback() // 等待 bindQQCallback 执行完毕后，跳转到首页
  } else if (route.path === routeObj.sociaWeChatLoginCallback.path) {
    _platform.value = social.WeChatDisplay
    await loginByWeChatCallback() // 等待 loginByWeChatCallback 执行完毕后，跳转到首页
  } else if (route.path === routeObj.socialWeChatBindCallback.path) {
    _platform.value = social.WeChatDisplay
    await bindWeChatCallback()
  }
  window.location.href = routeObj.home.path
})
</script>

<style scoped lang="scss">
.container {
  display: flex;
  align-items: center;
  justify-content: center;
  /* height: 100vh; */
  flex-direction: column;
  background-color: #f5f6fa;
}

.loader {
  border: 8px solid #f3f3f3;
  border-top: 8px solid light.$secondary-color;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

.text {
  font-size: 18px;
  margin-top: 20px;
  color: light.$primary-color;
  // 加粗
  font-weight: 700;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>

@/router/routeAll
