<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-01-13 15:35:59
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-31 16:18:57
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
                <AdminAside
                    :default-active="defaultActive"
                    :class="collapseStatus ? 'aside-collapse' : 'aside-no-collapse'"
                    class="aside"
                    @collapse-status="handleCollapseStatus"
                    @select="handleSelect"
                />

                <el-main class="main">
                    <!-- 控制台警告：Component inside <Transition> renders non-element root node that cannot be animated. -->
                    <!-- 参考:https://stackoverflow.com/questions/65553121/vue-3-transition-renders-non-element-root-node-that-cannot-be-animated -->
                    <!-- 在组件外包裹一层 div,需要单独包括在子组件中，才能缓存,不能在这里包裹 -->
                    <router-view v-slot="{ Component }">
                        <transition>
                            <KeepAlive>
                                <component :is="Component" />
                            </KeepAlive>
                        </transition>
                    </router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>

    <div v-else>
        <Page404 />
    </div>
</template>

<script lang="ts" setup>
import { ref, onBeforeMount, useTemplateRef } from "vue"
import { useRouter } from "vue-router"

import { PermissionNames } from "@/utils/permissionRole"
import { useUserStore } from "@/stores/user"

import AdminHeader from "@/views/admin/component/header"
import AdminAside from "@/views/admin/component/aside"
import Page404 from "@/views/404"

defineOptions({ name: "AdminLayout" })

const router = useRouter()

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

const containerRef = useTemplateRef<HTMLElementRef | null>("containerRef")

// 折叠状态
const collapseStatus = ref(false)
const handleCollapseStatus = (isCollapse: boolean) => {
    collapseStatus.value = isCollapse
}

// 选择菜单项
const handleSelect = (index: string) => {
    if (userStore.getIsEditing) {
        return
    }

    router.push(index)
}

onBeforeMount(() => {
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
        background-color: var(--jpz-bg-color-page);
        .header {
            background-color: var(--jpz-bg-color);
            color: var(--jpz-text-color-primary);
            height: 80px;
            // border-bottom: 1px solid var(--jpz-border-color);
        }

        .content {
            // display: flex;
            height: calc(100vh - 80px);

            .aside {
                background-color: var(--jpz-bg-color-page);
                color: var(--jpz-text-color-primary);
                transition: width 0.3s;
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
            }
        }
    }
}
</style>
