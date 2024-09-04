<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-01-13 15:35:59
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-09-04 21:32:04
 * @FilePath     : \blog-client\src\views\admin\index.vue
 * @Description  : admin 页面
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->

<template>
    <!-- 加载中 防止页面失去响应提高用户体验 -->
    <div v-if="isLoading" v-loading="isLoading" element-loading-text="加载中..." class="loading"></div>
    <div v-else-if="hasPermissionLoginAdmin" class="admin-layout">
        <el-container class="container">
            <el-header class="header" v-show="!isFullScreen">
                <AdminHeader />
            </el-header>
            <el-container ref="containerRef" class="content">

                <AdminAside :defaultActive="defaultActive" class="aside" v-show="!isFullScreen"
                    @select="handleSelect" />

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
import { ref, watch, onMounted, shallowRef, onBeforeMount, useTemplateRef, defineAsyncComponent } from 'vue'
import router from '@/router/index'
import { useEditorStore } from '@/stores/editor'
import { storeToRefs } from 'pinia'
import { components } from '@/views/admin'
import { adminMenuItemMapWithIndex, AadminSideMenu } from '@/views/admin/component/aside'
import { PermissionNames } from '@/utils/permissionRole'
import { useUserStore } from '@/stores/user'

// import AdminHeader from '@/views/admin/component/header'
// import AdminAside from '@/views/admin/component/aside'
// import Dashborad from '@/views/admin/component/main/dashborad'
// import NoPermission from '@/views/admin/component/main/no-permission'
// import Page404 from '@/views/404'
const AdminHeader = defineAsyncComponent(() => import('@/views/admin/component/header'))
const AdminAside = defineAsyncComponent(() => import('@/views/admin/component/aside'))
const Dashborad = defineAsyncComponent(() => import('@/views/admin/component/main/dashborad'))
const NoPermission = defineAsyncComponent(() => import('@/views/admin/component/main/no-permission'))
const Page404 = defineAsyncComponent(() => import('@/views/404'))

defineOptions({ name: 'AdminLayout' })
const hasPermissionLoginAdmin = ref(false)

// 定义 HTMLElementRef 类型 
interface HTMLElementRef extends HTMLElement {
    $el: HTMLElement;
}

// 添加 isLoading 变量
const isLoading = ref(true)

// 添加默认激活的菜单项
const defaultActive = ref("")

// 更新 PermissionLoginAdmin 
const updatePermissionLoginAdmin = () => {
    isLoading.value = true
    const userStore = useUserStore()
    if (userStore.hasPermission(PermissionNames.LoginAdmin)) {
        hasPermissionLoginAdmin.value = true
    }
    isLoading.value = false
}


const currentComponent = shallowRef(Dashborad) // 组件的响应式引用 使用 shallowRef 代替 ref，避免组件重复渲染
const editorStore = useEditorStore()
const { isFullScreen } = storeToRefs(editorStore)

const containerRef = useTemplateRef<HTMLElementRef | null>("containerRef");

const stopWatch = watch(isFullScreen, (newValue) => {
    if (containerRef.value) {
        if (newValue) {
            containerRef.value.$el.style.height = '100vh'
        } else {
            containerRef.value.$el.style.height = 'calc(100vh - 80px)'
        }
    }
})


const updateCurrentComponent = () => {
    // 从 url 中获取 path 更新当前组件 
    const path = router.currentRoute.value.path as string | undefined
    if (path === "/admin" || path === undefined) return

    if (path) {
        updateCurrentComponentByPath(path)
        // console.log("2", path)
    }
}




const handleSelect = (index: string) => {
    updateCurrentComponentByPath(index)
    console.log("1", index)
}

// 通过 path 更新当前组件
function updateCurrentComponentByPath(path: string): void {
    //通过 筛选 adminMenuItemMapWithIndex 中对象的 index 与 传入 index 相等的对象，获取对应的 key 值
    const key = Object.keys(adminMenuItemMapWithIndex).filter((key) => adminMenuItemMapWithIndex[key as AadminSideMenu].index === path)[0]
    if (!key) return
    defaultActive.value = path
    const userStore = useUserStore()
    const permission = adminMenuItemMapWithIndex[key as AadminSideMenu]?.permissionName
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

onMounted(() => {
    return () => { stopWatch() }
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