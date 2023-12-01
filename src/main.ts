/* eslint-disable vue/multi-word-component-names */
/**
 * @Author       : jiaopengzi
 * @Date         : 2023-08-04 10:54:19
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-12-01 15:27:53
 * @FilePath     : \blog-client\src\main.ts
 * @Description  : 入口文件
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

import '@/assets/scss/main.scss'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createHead } from '@unhead/vue' //seo head
import App from '@/App.vue'
import router from '@/router'
import { useUserStore } from '@/stores/user'
import Icon from '@/components/common/icons/Icon.vue'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.use(createHead()) //参考官方文档:https://unhead.unjs.io/setup/vue/installation
// app.use(ElementPlus)

// 路由准备就绪后挂载APP实例 先获取用户信息
router.isReady().then(async () => {
  const userStore = useUserStore()
  await userStore.getUserInfoByToken()
  app.component('Icon', Icon) // 使用 'Icon' 作为全局组件名
  app.mount('#app')
})
