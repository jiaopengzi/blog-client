/**
 * @FilePath     : \blog-client\src\main.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 入口文件
 */

import "element-plus/theme-chalk/dark/css-vars.css" // 引入element-plus的暗黑主题
import "@/assets/scss/main.scss" // 引入全局样式

import { createHead } from "@unhead/vue/client" // 参考官方文档:https://unhead.unjs.io/docs/vue/head/guides/get-started/installation
import { createPinia } from "pinia" // 状态管理
import { createApp } from "vue" // 创建Vue实例

import App from "@/App.vue" // 根组件
import JIcon from "@/components/common/icons" // 引用自定义的全局图标
import { devRun } from "@/dev" // 开发环境运行的函数
import { router } from "@/router" // 路由
import { permissionDirective } from "@/utils/permissionDirective" // 权限指令
import { singleDblClickDirective } from "@/utils/singleDblClickDirective" // 权限指令
import { consoleInfoFormat } from "@/version" // 控制台输出项目信息

consoleInfoFormat() // 控制台输出项目信息

const app = createApp(App)
const pinia = createPinia()

app.directive("permission", permissionDirective) // 注册全局权限指令
app.directive("single-dbl-click", singleDblClickDirective) // 注册全局单击/双击指令

app.use(pinia) // 使用状态管理

app.use(router) // 使用路由

app.use(createHead()) // 参考官方文档:https://unhead.unjs.io/docs/vue/head/guides/get-started/installation

app.component("j-icon", JIcon) //  'j-icon' 作为全局组件
app.mount("#app")

// 开发模式下
if (import.meta.env.MODE === "development") {
    devRun() // 开发环境运行的函数
    console.info("开发环境：", import.meta.env.VITE_MAX_NAVIGATOR_HARDWARE_CONCURRENCY)
}

// 生产模式下
if (import.meta.env.MODE === "production") {
    console.info("生产环境：", import.meta.env.VITE_MAX_NAVIGATOR_HARDWARE_CONCURRENCY)
}
