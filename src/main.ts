/**
 * @Author       : jiaopengzi
 * @Date         : 2023-08-04 10:54:19
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-31 18:31:45
 * @FilePath     : \blog-client\src\main.ts
 * @Description  : 入口文件
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

import "element-plus/theme-chalk/dark/css-vars.css" // 引入element-plus的暗黑主题
import "@/assets/scss/main.scss" // 引入全局样式

import { createApp } from "vue" // 创建Vue实例
import { createPinia } from "pinia" // 状态管理
import { createHead } from "@unhead/vue" // 参考官方文档:https://unhead.unjs.io/setup/vue/installation
import App from "@/App.vue" // 根组件
import router from "@/router" // 路由
import Icon from "@/components/common/icons" // 引用自定义的全局图标
import { useGlobal } from "@/components/hooks/useGlobal" // 全局钩子
import { permissionDirective } from "@/utils/permissionRole" // 权限指令
import { consoleInfoFormat } from "@/version" // 控制台输出项目信息
import { devRun } from "@/dev" // 开发环境运行的函数

consoleInfoFormat() // 控制台输出项目信息

// 开发模式下
if (import.meta.env.MODE === "development") {
    devRun() // 开发环境运行的函数
    console.log("开发环境：", import.meta.env.VITE_MAX_NAVIGATOR_HARDWARE_CONCURRENCY)
}

// 生产模式下
// 如果环境变量为production，则移除console.log
if (import.meta.env.MODE === "production") {
    console.log("生产环境：", import.meta.env.VITE_MAX_NAVIGATOR_HARDWARE_CONCURRENCY)
}

const app = createApp(App)
const pinia = createPinia()

app.directive("permission", permissionDirective) // 注册全局权限指令

app.use(pinia) // 使用状态管理

app.use(router) // 使用路由

app.use(createHead()) // 参考官方文档:https://unhead.unjs.io/setup/vue/installation

/* eslint-disable vue/multi-word-component-names */
app.component("Icon", Icon) // 使用 'Icon' 作为全局组件名
app.mount("#app")

useGlobal() // 全局钩子
