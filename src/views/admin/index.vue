<!--
 * @FilePath     : \blog-client\src\views\admin\index.vue
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
 * @Description  : 后台管理页面 
-->

<template>
    <!-- 加载中 防止页面失去响应提高用户体验 -->
    <div v-if="isLoading" v-loading="isLoading" element-loading-text="加载中..." class="loading"></div>

    <div v-else-if="hasPermissionLoginAdmin" class="admin-layout">
        <el-container class="container">
            <el-header class="header">
                <AdminHeader />
            </el-header>
            <el-container ref="containerRef" class="content">
                <AdminAside
                    :default-active="$route.path"
                    :class="collapseStatus ? 'aside-collapse' : 'aside-no-collapse'"
                    :is-collapse="collapseStatus"
                    class="aside"
                    @collapse-status="handleCollapseStatus"
                    @select="handleSelect"
                />

                <el-main class="main">
                    <!-- 控制台警告：Component inside <Transition> renders non-element root node that cannot be animated. -->
                    <!-- 参考:https://stackoverflow.com/questions/65553121/vue-3-transition-renders-non-element-root-node-that-cannot-be-animated -->
                    <!-- 在组件外包裹一层 div, 需要单独包括在子组件中, 才能缓存, 不能在这里包裹 -->

                    <router-view v-if="hasPermissionContent" />
                    <NoPermission v-if="!hasPermissionContent" :head-title="noPermissionHeadTitle" :path-display="noPermissionDisplay" />

                    <!-- TODO 是否启用 KeepAlive 待后续思考 -->
                    <!-- <router-view v-slot="{ Component, route }">
                        <KeepAlive :exclude="[RouteNames.PostWrite]">
                            <component :is="Component" :key="route.path" />
                        </KeepAlive>
                    </router-view> -->

                    <!-- <router-view v-slot="{ Component }">
                        <transition name="admin-main">
                            <KeepAlive :exclude="[RouteNames.PostWrite]">
                                <component :is="Component" :key="route.fullPath" />
                            </KeepAlive>
                        </transition>
                    </router-view> -->
                </el-main>
            </el-container>
        </el-container>
    </div>

    <div v-else>
        <Page404 />
    </div>
</template>

<script lang="ts" setup>
import { useHead } from "@unhead/vue"
import { onBeforeMount, ref, useTemplateRef } from "vue"
import { useRouter } from "vue-router"

import { LocalStorageKey } from "@/stores/local"
import { PermissionNames } from "@/stores/permissionRole"
import { useUserStore } from "@/stores/user"
import { MessageUtil } from "@/utils/message"
import Page404 from "@/views/404"
import AdminAside from "@/views/admin/component/aside"
import AdminHeader from "@/views/admin/component/header"
import NoPermission from "@/views/admin/component/main/no-permission"

import { adminMenuItemMapWithIndexMap } from "./component/aside"

defineOptions({ name: "AdminLayout" })

useHead({
    title: "后台管理",
})

const router = useRouter()

const hasPermissionLoginAdmin = ref(false)
const hasPermissionContent = ref(false)
const noPermissionHeadTitle = ref("")
const noPermissionDisplay = ref("")

// 定义 HTMLElementRef 类型
interface HTMLElementRef extends HTMLElement {
    $el: HTMLElement
}

// 添加 isLoading 变量
const isLoading = ref(true)

const userStore = useUserStore()

// 更新 PermissionLoginAdmin
const updatePermissionLoginAdmin = () => {
    isLoading.value = true
    if (userStore.hasPermission(PermissionNames.LoginAdmin)) {
        hasPermissionLoginAdmin.value = true
    }
    isLoading.value = false
}

const containerRef = useTemplateRef<HTMLElementRef | null>("containerRef")

// 折叠状态
const savedIsCollapse = localStorage.getItem(LocalStorageKey.IsCollapse)
const collapseStatus = ref(savedIsCollapse !== null ? savedIsCollapse === "true" : false)
const handleCollapseStatus = (isCollapse: boolean) => {
    collapseStatus.value = isCollapse

    localStorage.setItem(LocalStorageKey.IsCollapse, isCollapse.toString())
}

// 更新权限并跳转
const updatePermission = (index: string) => {
    // 判断是否有权限
    const permission = adminMenuItemMapWithIndexMap[index]!.permissionName
    noPermissionHeadTitle.value = adminMenuItemMapWithIndexMap[index]!.text
    noPermissionDisplay.value = adminMenuItemMapWithIndexMap[index]!.text

    // 开发环境下提示未配置权限名称
    if (!permission) {
        console.warn(`菜单项 ${index} 未配置权限名称`)
        hasPermissionContent.value = false
    }

    // 跳转到没有权限页面
    if (permission && !userStore.hasPermission(permission)) {
        MessageUtil.warning("没有权限")
        hasPermissionContent.value = false
    } else {
        hasPermissionContent.value = true
    }
}

// 选择菜单项
const handleSelect = (index: string) => {
    updatePermission(index)
    router.push({ path: index })
}

onBeforeMount(() => {
    updatePermissionLoginAdmin()
    // 拿到当前路由, 更新权限
    updatePermission(router.currentRoute.value.path)
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
        background-color: var(--jpz-bg-color-page);
        .header {
            background-color: var(--jpz-bg-color);
            color: var(--jpz-text-color-primary);
            height: 80px;
        }

        .content {
            height: calc(100vh - 80px);

            .aside {
                position: fixed; // 固定位置
                top: 80px; // 确保在 header 下面
                left: 0; // 贴在左侧
                background-color: var(--jpz-bg-color-page);
                color: var(--jpz-text-color-primary);
                transition: width 0.3s;
                height: calc(100vh - 80px); // 确保高度覆盖整个页面
            }

            .aside-no-collapse {
                width: 200px;
            }

            .aside-collapse {
                width: 64px;
            }

            .main {
                flex: 1; // 占据剩余空间
                color: var(--jpz-text-color-primary);
                padding: 0;
                margin: 0;
                margin-left: 200px; // 确保主内容不覆盖侧边栏
                transition: margin-left 0.3s;
            }

            .aside-collapse + .main {
                margin-left: 64px; // 当侧边栏折叠时调整主内容的左边距
            }
        }
    }
}

// .admin-main-enter-active,
// .admin-main-leave-active {
//     transition: opacity 0.3s ease;
// }

// .admin-main-enter-from,
// .admin-main-leave-to {
//     opacity: 0;
// }
</style>
