<!--
 * FilePath    : blog-client-nuxt\src\components\common\logo-image\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 站点 logo 图片 (bug02 260831-01 反馈第1轮: 恒定渲染 /logo.png 运行时镜像, 镜像缺失回退 demo 图)
-->

<!--
 * 补充说明:
 * 页头/后台头部等多处渲染站点 logo, 统一封装本组件消除重复:
 * - src 恒定为 /logo.png(app-option logo 的服务端运行时镜像, server/utils/logo.ts 落盘),
 *   不读 store —— SSR 取数失败窗口内 store 为空也不会回退 demo 图, 水合首帧与 SSR HTML 一致, 无闪换;
 * - 镜像缺失(未配置 logo/同步失败)时 404, 经 onerror 一次性回退 /demo-logo.svg;
 * - 宽高等布局样式由使用方经 class 传入(单根属性透传合并), 本组件不自带尺寸约束;
 * - 经 :src 动态绑定绕过 vite transformAssetUrls 的构建期资源解析(镜像是运行时落盘产物, 构建期不存在).
 -->

<template>
    <img class="logo-image" :src="LOGO_MIRROR_SRC" alt="logo" @error="handleLogoError" />
</template>

<script setup lang="ts">
defineOptions({ name: "LogoImage" })

// logo 运行时镜像固定地址(server/utils/logo.ts 落盘), 与兜底图地址一并集中定义
const LOGO_MIRROR_SRC = "/logo.png"
const LOGO_FALLBACK_SRC = "/demo-logo.svg"

// 镜像缺失兜底: /logo.png 404(未配置 logo 或镜像同步失败)时切换 demo 图;
// 已是兜底地址时不再处理, 避免循环触发 error
const handleLogoError = (event: Event) => {
    const img = event.target as HTMLImageElement
    if (img.getAttribute("src") !== LOGO_FALLBACK_SRC) {
        img.src = LOGO_FALLBACK_SRC
    }
}
</script>
