/**
 * @Author       : jiaopengzi
 * @Date         : 2023-08-04 10:54:19
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-09-13 15:24:32
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
import Icon from '@/components/common/icons' // 引用自定义的全局图标
import { permissionDirective } from '@/utils/permissionRole'

import { consoleInfoFormat } from '@/version'
import { devRun } from '@/dev'

const app = createApp(App)

app.directive('permission', permissionDirective) // 注册全局权限指令

app.use(createPinia()) // 在APP创建之后，使用Pinia
app.use(router)

app.use(createHead()) // 参考官方文档:https://unhead.unjs.io/setup/vue/installation
// app.use(ElementPlus)

// 路由准备就绪后挂载APP实例 先获取用户信息
router.isReady().then(async () => {
  const userStore = useUserStore()
  await userStore.getUserInfoByToken()
  /* eslint-disable vue/multi-word-component-names */
  app.component('Icon', Icon) // 使用 'Icon' 作为全局组件名
  app.mount('#app')
})

consoleInfoFormat() // 控制台输出项目信息

if (import.meta.env.MODE === 'development') {
  devRun() // 开发环境运行的函数
  console.log('开发环境：', import.meta.env.VITE_MAX_NAVIGATOR_HARDWARE_CONCURRENCY)
}

// 生产模式下
// 如果环境变量为production，则移除console.log
if (import.meta.env.MODE === 'production') {
  console.log('生产环境：', import.meta.env.VITE_MAX_NAVIGATOR_HARDWARE_CONCURRENCY)
}
