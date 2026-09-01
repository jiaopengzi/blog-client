<!--
 * FilePath    : blog-client-nuxt\src\components\common\logo-image\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 站点 logo 图片 (bug01 260901-01 反馈第3轮: 回退 SPA 的 app-option 直接渲染方案)
-->

<!--
 * 补充说明:
 * 页头/后台头部等多处渲染站点 logo, 统一封装本组件消除重复:
 * - src 直接读取 app-option logo 配置, 与 SPA 保持一致; 配置保存后 store 刷新即切换至新 URL,
 *   浏览器按新 URL 请求资源, 不依赖服务端镜像同步与静态缓存失效;
 * - 未配置 logo 时回退 /demo-logo.svg;
 * - 宽高等布局样式由使用方经 class 传入(单根属性透传合并), 本组件不自带尺寸约束;
 * - 经 :src 动态绑定绕过 vite transformAssetUrls 的构建期资源解析(镜像是运行时落盘产物, 构建期不存在).
 -->

<template>
    <img class="logo-image" :src="logoSrc" :alt="alt" />
</template>

<script setup lang="ts">
import { computed } from "vue"

import { useOptionsStore } from "@/stores/options"

defineOptions({ name: "LogoImage" })

const { alt = "logo" } = defineProps<{
    /** logo 图片的替代文本. */
    alt?: string
}>()

const LOGO_FALLBACK_SRC = "/demo-logo.svg"

const optionsStore = useOptionsStore()

// 与 SPA 对齐: 直接使用后端配置的 URL, 配置缺失时回退打包内的默认图.
const logoSrc = computed(() => optionsStore.getLogo || LOGO_FALLBACK_SRC)
</script>
