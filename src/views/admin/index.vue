<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-01-13 15:35:59
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-11-05 16:19:49
 * @FilePath     : \blog-client\src\views\admin\index.vue
 * @Description  : admin 页面
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->

<template>
    <!-- 加载中 防止页面失去响应提高用户体验 -->
    <div
        v-if="isLoading"
        v-loading="isLoading"
        element-loading-text="加载中..."
        class="loading"
    ></div>
    <div v-else-if="hasPermissionLoginAdmin" class="admin-layout">
        <el-container class="container">
            <el-header class="header">
                <AdminHeader />
            </el-header>
            <el-container ref="containerRef" class="content">
                <AdminAside :default-active="defaultActive" class="aside" @select="handleSelect" />

                <el-main class="main">
                    <component :is="currentComponent" />
                </el-main>
            </el-container>
        </el-container>
    </div>
    <div v-else>
        <Page404 />
    </div>
</template>
<script lang="ts" setup>
import { ref, shallowRef, onBeforeMount, useTemplateRef } from "vue"
import router from "@/router/index"
import { components } from "@/views/admin"
import { adminMenuItemMapWithIndex, AdminSideMenu } from "@/views/admin/component/aside"
import { PermissionNames } from "@/utils/permissionRole"
import { useUserStore } from "@/stores/user"

import AdminHeader from "@/views/admin/component/header"
import AdminAside from "@/views/admin/component/aside"
import Dashboard from "@/views/admin/component/main/dashboard"
import NoPermission from "@/views/admin/component/main/no-permission"
import Page404 from "@/views/404"

defineOptions({ name: "AdminLayout" })

const hasPermissionLoginAdmin = ref(false)

// 定义 HTMLElementRef 类型
interface HTMLElementRef extends HTMLElement {
    $el: HTMLElement
}

// 添加 isLoading 变量
const isLoading = ref(true)

// 添加默认激活的菜单项
const defaultActive = ref("")
const userStore = useUserStore()

// 更新 PermissionLoginAdmin
const updatePermissionLoginAdmin = () => {
    isLoading.value = true
    if (userStore.hasPermission(PermissionNames.LoginAdmin)) {
        hasPermissionLoginAdmin.value = true
    }
    isLoading.value = false
}

const currentComponent = shallowRef(Dashboard) // 组件的响应式引用 使用 shallowRef 代替 ref，避免组件重复渲染

const containerRef = useTemplateRef<HTMLElementRef | null>("containerRef")

// 更新当前组件
const updateCurrentComponent = () => {
    // 从 url 中获取 path 更新当前组件
    const path = router.currentRoute.value.path as string | undefined
    if (path === "/admin" || path === undefined) return

    if (path) {
        updateCurrentComponentByPath(path)
        console.log("2", path)
    }
}

// 选择菜单项
const handleSelect = (index: string) => {
    if (userStore.getIsEditing) {
        return
    }

    updateCurrentComponentByPath(index)
    console.log("1", index)
}

// 监听路由变化，主要在路由变化时更新当前组件
router.afterEach(() => {
    updateCurrentComponent()
})

// 通过 path 更新当前组件
const updateCurrentComponentByPath = (path: string): void => {
    //通过 筛选 adminMenuItemMapWithIndex 中对象的 index 与 传入 index 相等的对象，获取对应的 key 值
    const key = Object.keys(adminMenuItemMapWithIndex).filter(
        (key) => adminMenuItemMapWithIndex[key as AdminSideMenu].index === path,
    )[0]
    if (!key) return
    defaultActive.value = path
    const userStore = useUserStore()
    const permission = adminMenuItemMapWithIndex[key as AdminSideMenu]?.permissionName
    if (permission && !userStore.hasPermission(permission)) {
        currentComponent.value = NoPermission
        return
    }
    currentComponent.value = components[key as keyof typeof components]
}

onBeforeMount(() => {
    updateCurrentComponent()
    updatePermissionLoginAdmin()
})
</script>

<style scoped lang="scss">
.loading {
    height: 100vh;
    width: 100vw;
}

.admin-layout {
    width: 100vw;
    height: 100vh;

    .container {
        .header {
            background-color: #409eff;
            color: #fff;
            height: 80px;
        }

        .content {
            height: calc(100vh - 80px);

            .aside {
                background-color: #409eff;
                color: #fff;
            }

            .main {
                // background-color: red;
                color: #333;
                padding: 0;
                margin: 0;
            }
        }
    }
}
</style>
