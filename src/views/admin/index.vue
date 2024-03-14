<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-01-13 15:35:59
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-03-14 20:29:35
 * @FilePath     : \blog-client\src\views\admin\index.vue
 * @Description  : admin 页面
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->

<template>
    <div v-if="hasPermissionLoginAdmin" class="admin-layout">
        <el-container class="container">
            <el-header class="header" v-show="!isFullScreen">
                <AdminHeader />
            </el-header>
            <el-container ref="containerRef" class="content">

                <AdminAside class="aside" v-show="!isFullScreen" @select="handleSelect" />

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
import { ref, watch, onMounted, shallowRef, onBeforeMount } from 'vue'
import router from '@/router/index'
import AdminHeader from '@/views/admin/component/header'
import AdminAside from '@/views/admin/component/aside'
import { useEditorStore } from '@/stores/editor'
import { storeToRefs } from 'pinia'
import { components } from '@/views/admin'
import Dashboard from '@/views/admin/component/main/dashboard'
import NoPermission from '@/views/admin/component/main/no-permission'
import { adminMenuItemMapWithIndex, AadminSideMenu } from '@/views/admin/component/aside'
import { hasPermission, PermissionNames } from '@/utils/permissionRole'
import Page404 from '@/views/404'


interface HTMLElementRef extends HTMLElement {
    $el: HTMLElement;
}

defineOptions({ name: 'AdminLayout' })
const hasPermissionLoginAdmin = ref(false)


const updatePermissionLoginAdmin = async () => {
    await hasPermission(PermissionNames.LoginAdmin).then((res) => {
        hasPermissionLoginAdmin.value = res
    })
}

console.log("hasPermissionLoginAdmin", hasPermissionLoginAdmin)
const currentComponent = shallowRef(Dashboard) // 组件的响应式引用 使用 shallowRef 代替 ref，避免组件重复渲染
const editorStore = useEditorStore()
const { isFullScreen } = storeToRefs(editorStore)

const containerRef = ref<HTMLElementRef | null>(null);

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
        console.log("2", path)
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