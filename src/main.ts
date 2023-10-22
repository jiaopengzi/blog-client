/**
 * @Author       : jiaopengzi
 * @Date         : 2023-08-04 10:54:19
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-10-22 10:48:25
 * @FilePath     : \blog-client\src\main.ts
 * @Description  : 入口文件
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

import './assets/main.less'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import { useUserStore } from '@/stores/user'

const app = createApp(App)

app.use(createPinia())
app.use(router)
// app.use(ElementPlus)

// 路由准备就绪后挂载APP实例 先获取用户信息
router.isReady().then(async () => {
  const userStore = useUserStore()
  await userStore.getUserInfoByToken()

  app.mount('#app')
})
