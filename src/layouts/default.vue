<!--
 * FilePath    : blog-client\src\layouts\default.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 根级默认布局 (阶段 4 终版: header/侧栏/footer 常驻, 页面仅提供内容; 侧栏客户端按设备加载; 260925-05: UP 回顶 z 抬至浮动目录之上且沉浸时隐藏)
-->

<!--
 * 补充说明:
 * 按 Nuxt 布局机制, 跨页导航 (如详情→首页、热门A→B) 布局组件不重挂载,
 * 侧栏数据不再被重复渲染/清空; 搜索由 Search 组件内部直接导航 /s/:keyword
 * (bugfix 260918-01 bug02), 原 provide/inject 关键字数据流已移除
-->

<template>
    <div class="page">
        <LayoutHeader :is-show-search="isShowSearch" />

        <div class="content">
            <!-- 面包屑 -->
            <JBreadcrumb />

            <!-- 正文内容 (页面内容经默认插槽注入) -->
            <el-container class="container-main">
                <el-main>
                    <slot />
                </el-main>

                <!-- 侧栏仅在水合后按真实窗口类型加载, 避免 SSR 默认 PC 为 PAD/PHONE 请求不可见数据. -->
                <LayoutAside v-if="isAsideClientReady" />
            </el-container>
        </div>

        <LayoutFooter />
    </div>

    <el-backtop :bottom="100" class="backtop-container">
        <div class="backtop">UP</div>
    </el-backtop>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia"
import { onMounted, ref } from "vue"

import JBreadcrumb from "@/components/common/breadcrumb"
import LayoutAside from "@/components/layout/aside/layout-aside.vue"
import LayoutFooter from "@/components/layout/footer"
import LayoutHeader from "@/components/layout/header"
import { useSiteOptions } from "@/composables/useSiteOptions"
import { useStatusStore } from "@/stores/status"

defineOptions({ name: "DefaultLayout" })

// 站点配置 SSR 预填充 (页头 Logo/导航依赖, 布局层在渲染前完成, SSR 与客户端一致)
await useSiteOptions()

const statusStore = useStatusStore()
const { isShowSearch } = storeToRefs(statusStore)
const isAsideClientReady = ref(false)

onMounted(() => {
    isAsideClientReady.value = true
})
</script>

<style scoped lang="scss">
// 返回顶部容器
.backtop-container {
    // 位置参考 main.scss 中的 z-index 管理
    // 260925-05: 1000→1002, 需高于浮动目录面板(1001), 展开的长目录不再遮挡 UP 按钮; 仍低于 el-overlay(2000) 与 message(3000)
    z-index: 1002;

    .backtop {
        height: 100%;
        width: 100%;
        text-align: center;
        line-height: 40px;
        color: var(--jpz-color-primary);
    }
}

// 260925-05: 网页全屏 (沉浸阅读/编辑器全屏) 时隐藏布局级 UP — 沉浸层(1000)内有专属 immersive-backtop,
// 且抬高 z-index 后若不隐藏, 按钮(1002)会浮于沉浸层之上; body 类由 useWebFullscreen 进出时切换
.web-fullscreen-active .backtop-container {
    display: none;
}

.content {
    display: flex;
    flex-direction: column;
    background-color: var(--jpz-bg-color-page);
}

@include respond-to("pc") {
    .content {
        width: pc.$width-page-main;
    }

    .container-main {
        display: flex;
        align-items: flex-start;
    }

    .el-main {
        padding-left: 0px;
        padding-top: 0px;
    }
}

@include respond-to("pad") {
    .content {
        width: pad.$width-page;
    }

    .el-main {
        padding-left: 0;
        padding-top: 0;
        padding-right: 0;
        padding-bottom: 10px;
    }
}

@include respond-to("phone") {
    .content {
        width: 100vw;
    }

    .el-main {
        padding-left: 0;
        padding-top: 0;
        padding-right: 0;
        padding-bottom: 10px;
    }
}
</style>
