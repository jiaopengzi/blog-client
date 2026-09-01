<!--
 * FilePath    : blog-client-nuxt\src\components\common\logo-image\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 站点 logo 图片 (bug01 260901-01 反馈第2轮: 镜像请求按配置版本化, 避免 app-option 保存后命中旧缓存)
-->

<!--
 * 补充说明:
 * 页头/后台头部等多处渲染站点 logo, 统一封装本组件消除重复:
 * - src 始终指向 /logo.png(app-option logo 的服务端运行时镜像, server/utils/logo.ts 落盘),
 *   查询参数只由配置值计算版本: 配置变更后绕过旧浏览器缓存, 不直接暴露/切换至远端原图;
 *   SSR 取数失败窗口内 store 为空时仍请求同一镜像路径, 水合首帧与 SSR HTML 一致, 无闪换;
 * - 镜像缺失(未配置 logo/同步失败)时 404, 经 onerror 一次性回退 /demo-logo.svg;
 * - 宽高等布局样式由使用方经 class 传入(单根属性透传合并), 本组件不自带尺寸约束;
 * - 经 :src 动态绑定绕过 vite transformAssetUrls 的构建期资源解析(镜像是运行时落盘产物, 构建期不存在).
 -->

<template>
    <img class="logo-image" :src="logoMirrorSrc" :alt="alt" @error="handleLogoError" />
</template>

<script setup lang="ts">
import { computed } from "vue"

import { useOptionsStore } from "@/stores/options"

defineOptions({ name: "LogoImage" })

const { alt = "logo" } = defineProps<{
    /** logo 图片的替代文本. */
    alt?: string
}>()

// logo 运行时镜像固定地址(server/utils/logo.ts 落盘), 与兜底图地址一并集中定义
const LOGO_MIRROR_SRC = "/logo.png"
const LOGO_FALLBACK_SRC = "/demo-logo.svg"

const optionsStore = useOptionsStore()

/**
 * getLogoCacheVersion 从 logo 配置值生成稳定的非加密版本号.
 * @param logo 配置中的 logo 原始 URL.
 * @returns 用于镜像请求查询参数的短版本号.
 */
function getLogoCacheVersion(logo: string): string {
    let hash = 2166136261
    for (let index = 0; index < logo.length; index += 1) {
        hash = Math.imul(hash ^ logo.charCodeAt(index), 16777619)
    }
    return (hash >>> 0).toString(36)
}

// 镜像内容由服务器维护, 配置值只作为缓存版本. 保存新 URL 后请求地址变化, 不会命中旧 logo.png 缓存.
const logoMirrorSrc = computed(() => {
    const logo = optionsStore.app_options.logo?.value ?? ""
    return `${LOGO_MIRROR_SRC}?v=${getLogoCacheVersion(logo)}`
})

// 镜像缺失兜底: /logo.png 404(未配置 logo 或镜像同步失败)时切换 demo 图;
// 已是兜底地址时不再处理, 避免循环触发 error
const handleLogoError = (event: Event) => {
    const img = event.target as HTMLImageElement
    if (img.getAttribute("src") !== LOGO_FALLBACK_SRC) {
        img.src = LOGO_FALLBACK_SRC
    }
}
</script>
