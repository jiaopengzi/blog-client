/**
 * @Author       : jiaopengzi
 * @Date         : 2023-08-04 10:54:19
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-10-31 21:20:40
 * @FilePath     : \blog-client\src\main.ts
 * @Description  : 入口文件
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

import '@/assets/scss/main.scss'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createHead } from '@unhead/vue'
import App from '@/App.vue'
import router from '@/router'

import { useUserStore } from '@/stores/user'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.use(createHead()) //参考官方文档:https://unhead.unjs.io/setup/vue/installation
// app.use(ElementPlus)

// 路由准备就绪后挂载APP实例 先获取用户信息
router.isReady().then(async () => {
  const userStore = useUserStore()
  await userStore.getUserInfoByToken()

  app.mount('#app')
})
