<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-01-13 15:35:59
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-01-17 23:19:54
 * @FilePath     : \blog-client\src\views\admin\index.vue
 * @Description  : admin 页面
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->

<template>
    <div class="admin-layout">
        <el-container class="container">
            <el-header class="header" v-show="!isFullScreen">Header</el-header>
            <el-container ref="containerRef" class="content">

                <AdminAside class="aside" v-show="!isFullScreen" />

                <el-main class="main">
                    <EditorPost />
                </el-main>

            </el-container>
        </el-container>
    </div>
</template>
<script lang="ts" setup>
import AdminAside from '@/views/admin/component/aside'
import { EditorPost } from '@/components/editor/core'
import { useEditorStore } from '@/stores/editor'
import { storeToRefs } from 'pinia'
import { ref, watch, onMounted } from 'vue';

interface HTMLElementRef extends HTMLElement {
    $el: HTMLElement;
}

defineOptions({ name: 'AdminLayout' })

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
                background-color: red;
                color: #333;
                padding: 0;
                margin: 0;
            }
        }
    }

}
</style>