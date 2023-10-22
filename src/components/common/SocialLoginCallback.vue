<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-10-19 14:12:55
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-10-21 18:47:57
 * @FilePath     : \blog-client\src\components\common\SocialLoginCallback.vue
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
import '@/assets/styleVariables.less'
import { onMounted, ref } from 'vue'
import type { Ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { useRoute } from 'vue-router'


const userStore = useUserStore()
const route = useRoute()

const loginByQQCallback = async () => {
  const code = new URLSearchParams(window.location.search).get('code')
  if (!code) { return }
  await userStore.loginByQQCallback(code)
}

const bindQQCallback = async () => {
  const code = new URLSearchParams(window.location.search).get('code')
  if (!code) { return }
  await userStore.bindQQCallback(code)
}

const loginByWeChatCallback = async () => {
  const code = new URLSearchParams(window.location.search).get('code')
  if (!code) { return }
  // await userStore.loginByQQ(code)
}

// 三方平台
const _platform: Ref<string> = ref("")


onMounted(async () => {
  if (route.path === '/social/qq/callback') {
    _platform.value = "QQ"
    await loginByQQCallback() // 等待 loginByQQCallback 执行完毕后，跳转到首页
  } else if (route.path === '/social/qq/bind/callback') {
    _platform.value = "QQ"
    await bindQQCallback() // 等待 bindQQCallback 执行完毕后，跳转到首页
  }
  else if (route.path === '/social/wechat/callback') {
    _platform.value = "微信"
    await loginByWeChatCallback()
  }
  window.location.href = '/'
});

</script>

<style scoped lang="less">
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
  border-top: 8px solid @secondary-color;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

.text {
  font-size: 18px;
  margin-top: 20px;
  color: @primary-color;
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


