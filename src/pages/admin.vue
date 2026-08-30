<!--
 * FilePath    : blog-client-nuxt\src\pages\admin.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : admin 后台父壳 (阶段 6: 完整 AdminLayout)
-->

<!--
 * 补充说明:
 * routeRules "/admin/**" ssr:false; /admin → /admin/dashboard 与登录守卫见
 * middleware/admin.global.ts; 内容/权限判定逻辑复刻 SPA views/admin/index.vue,
 * 子页由 pages/admin/[...slug].vue 按 adminMenuItemMapWithIndex 动态映射主视图
-->

<script setup lang="ts">
import { computed, onBeforeMount, ref, useTemplateRef, watch } from "vue"

import { adminMenuItemMapWithIndexMap } from "@/components/views/admin/component/aside"
import AdminAside from "@/components/views/admin/component/aside"
import AdminHeader from "@/components/views/admin/component/header"
import NoPermission from "@/components/views/admin/component/main/no-permission"
import NotFound from "@/components/views/not-found"
import { LocalStorageKey } from "@/stores/local"
import { PermissionNames } from "@/api/permissionRole/permissionNames"
import { useUserStore } from "@/stores/user"
import { MessageUtil } from "@/utils/message"

// 路由名与 SPA RouteNames.Admin ("admin") 对齐; admin 全屏区无默认布局
definePageMeta({ name: "admin", layout: false })

useHead({
    title: "后台管理",
})

const router = useRouter()
const route = useRoute()

const hasPermissionLoginAdmin = ref(false)
const noPermissionHeadTitle = ref("")
const noPermissionDisplay = ref("")

interface HTMLElementRef extends HTMLElement {
    $el: HTMLElement
}

const isLoading = ref(true)

const userStore = useUserStore()

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
    const menuItem = adminMenuItemMapWithIndexMap[index]
    if (!menuItem) {
        noPermissionHeadTitle.value = "后台管理"
        noPermissionDisplay.value = index
        return false
    }

    // 判断是否有权限
    const permission = menuItem.permissionName
    noPermissionHeadTitle.value = menuItem.text
    noPermissionDisplay.value = menuItem.text

    // 开发环境下提示未配置权限名称
    if (!permission) {
        console.warn(`菜单项 ${index} 未配置权限名称`)
        return false
    }

    if (permission && !userStore.hasPermission(permission)) {
        return false
    }

    return true
}

const hasPermissionContent = computed(() => updatePermission(route.path))

// 选择菜单项
const handleSelect = async (index: string) => {
    const canAccessTarget = updatePermission(index)
    if (!canAccessTarget) {
        MessageUtil.warning("没有权限")
    }

    await router.push({ path: index })
}

onBeforeMount(() => {
    updatePermissionLoginAdmin()
    // 拿到当前路由, 更新权限
    updatePermission(router.currentRoute.value.path)
})

watch(
    () => route.path,
    (newPath) => {
        updatePermission(newPath)
    },
    { immediate: true },
)
</script>

<template>
    <!-- 加载中, 防止页面失去响应提高用户体验 -->
    <div v-if="isLoading" v-loading="isLoading" element-loading-text="加载中..." class="loading"></div>

    <!-- 登录且有后台权限 → admin 布局（未知子路径由 pages/admin/[...slug].vue 抛 fatal 404 交全局错误页）;
         其余（未登录/无后台权限）→ 统一 404 视图 -->
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
                    <NuxtPage v-if="hasPermissionContent" />
                    <NoPermission v-if="!hasPermissionContent" :head-title="noPermissionHeadTitle" :path-display="noPermissionDisplay" />
                </el-main>
            </el-container>
        </el-container>
    </div>

    <div v-else>
        <NotFound />
    </div>
</template>

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
                overflow-x: hidden;
            }

            .main {
                background-color: var(--jpz-bg-color-page);

                // bug03(260826-03): padding 归零对齐 SPA 壳层 (其 .main 为 padding:0 + margin-left:200px)
                // 此前的 10px 16px 10px 10px 令内容区窄 26px, /admin/post-all 表格列 min-width 之和 (1700px)
                // 超出容器 (1668px) 触发 el-table 内部横向滚动条; 子视图卡片自带间距, 去掉壳层 padding 后
                // 1920 宽度下表格容器恢复 ≥1700px, 与 SPA 一致无横向滚动条
                padding: 0;
                overflow: auto;
            }
        }
    }
}
</style>
