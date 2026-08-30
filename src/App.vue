<!--
 * FilePath    : blog-client-nuxt\src\app.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : Nuxt 根组件(站点自定义 CSS 直出 + 顶部加载条 + 布局挂载)
-->

<!--
 * 补充说明:
 * 站点自定义样式(custom_style_css, 后端配置)经 useHead 响应式注入:
 * SSR 直出 <style>, 客户端 store 刷新后原位更新(对齐 SPA 保存即生效);
 * 主题预设样式(theme-preset-style)由运行时追加 head 末尾, 优先级保持最后
-->

<template>
    <el-config-provider :locale="zhCn">
        <!-- 顶部加载条常驻根层, 由共享 pending 计数统一驱动路由切换与页面内异步请求 -->
        <div class="app-loading-indicator" :class="appLoadingIndicatorClasses" :style="appLoadingIndicatorStyle" />

        <!-- 根级布局: layouts/default.vue(header/侧栏/footer 常驻, 页面仅提供内容, 避免跨页导航重复渲染) -->
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
    </el-config-provider>
</template>

<script setup lang="ts">
import zhCn from "element-plus/es/locale/lang/zh-cn"

import { useResizeObserver } from "@vueuse/core"
import { storeToRefs } from "pinia"
import { computed, watch } from "vue"

import { useAppLoadingIndicator } from "@/composables/useAppLoadingIndicator"
import { useDeviceStore } from "@/stores/device"
import { useOptionsStore } from "@/stores/options"
import { buildCustomCss } from "@/utils/style"
import { getThemePreset } from "@/theme/presets"
import { buildThemePresetStyleContent } from "@/theme/runtime"
import { activeThemeSchemeState, activeThemePresetState } from "@/theme/useTheme"

// Element Plus 的 ID/ZIndex 注入已上移到 plugins/element-injection.ts(对 vueApp 全局 provide):
// 错误页(error.vue)独立于本组件渲染, 其 SSR 渲染 Element Plus 组件时也需要这两个注入(bug01 260826-03)

const appLoadingIndicator = useAppLoadingIndicator()

// 反馈第 2 轮: 窗口尺寸变化时同步 device store——等价 SPA App.vue 的 useResizeObserver(appRef)
// 缺失时 device 停留在初始判定(宽窗口=PC), 缩放窗口后头部导航不切换手机布局、
// 列表 meta 的三端展示策略(post-item-main 仅 PC/PAD 附加评论/点赞/收藏)也不会随宽度重算
// 根组件观察 body(随窗口伸缩), 生命周期与应用一致, 无需 stop
if (import.meta.client) {
    const deviceStore = useDeviceStore()
    useResizeObserver(document.body, () => {
        deviceStore.updateDevice()
        deviceStore.updateWindowWidth()
    })
}

// 顶部加载条样式跟随共享进度与错误状态更新, 保持全局唯一视觉出口
const appLoadingIndicatorStyle = computed(() => {
    return {
        width: `${appLoadingIndicator.progress.value}%`,
    }
})

// 顶部加载条类名仅承载显隐与错误态, 其开始/结束时机由共享 pending 计数控制
const appLoadingIndicatorClasses = computed(() => {
    return {
        "app-loading-indicator--visible": appLoadingIndicator.isLoading.value,
        "app-loading-indicator--error": appLoadingIndicator.error.value,
    }
})

// SSR 默认 light 主题壳; 客户端 theme.client.ts 插件按 localStorage 预设覆盖(避免 FOUC 前由插件先行执行)
// class 使用响应式 scheme(activeThemeSchemeState): 静态 "light" 会在客户端水合时被 unhead
// 重新写回 documentElement, 与运行时主题类叠加成 "dark light", 导致 html.light 规则在暗色下误命中
// (线上旧站暗色下仅为 "dark")。响应式取值保证水合与主题切换后 class 始终与运行时一致
useHead({
    htmlAttrs: {
        class: () => activeThemeSchemeState.value,
    },
    // feature01(反馈第 1 轮): 仅登录态(本地 login_hint=1)时在首帧绘制前给 documentElement 加 data-list-pending 标记
    // 列表页 SSR 首屏为匿名态数据, 登录态用户水合后重拉会产生可见的列表重排抖动;
    // 匿名用户不加标记, SSR 列表直接展示(无任何动画), 登录态用户经 CSS 隐藏 + 骨架屏走 CSR
    // 该内联脚本在 HTML 解析期同步执行(先于 body 渲染与首帧绘制); SSR HTML 仍含完整列表供 SEO 收录
    // bug01(260829-08): 文章详情页(/p/**)与自定义页(/page/**)复用同一标记——SSR 详情同为匿名数据
    // (已购内容误显付费态), 登录态首屏经 CSS 隐藏 + 骨架屏, useDetailLoginRefresh 复拉后移除标记展示
    script: [
        {
            innerHTML: 'try{if(localStorage.getItem("login_hint")==="1"){document.documentElement.setAttribute("data-list-pending","true")}}catch(e){}',
        },
        // bug02(260826-03): 带锚点直链/刷新 /p/* 时, 在 HTML 解析期(早于首帧; URL fragment 不达
        // 服务端, 只能在此感知)启动 rAF 钉顶循环: 浏览器原生锚点跳转是程序化滚动, overflow 锁不住,
        // 每帧 scrollTo(0,0) 在绘制前撤销跳转, 页面稳定停留在顶部; pages/p/[id].vue 挂载后置
        // jpzHashPin=false 停止钉顶并平滑滚入目标锚点。4s 兜底自动停: 客户端 JS 异常时页面仍可滚动
        {
            innerHTML:
                "try{if(/^\\/p\\//.test(location.pathname)&&location.hash){window.jpzHashPin=true;var t=Date.now();(function f(){if(!window.jpzHashPin||Date.now()-t>4000){window.jpzHashPin=false;return}window.scrollTo(0,0);requestAnimationFrame(f)})()}}catch(e){}",
        },
    ],
})

// 主题预设样式 + 站点自定义 CSS: 均经 useHead 响应式注入, 且保持与 SPA 线上一致的注入顺序 ——
// 主题预设在前、自定义 CSS 在后(两者选择器同特异度, DOM 顺序决定优先级, 后者覆盖前者,
// 自定义 CSS 里配置的主题色如 --jpz-color-primary 因此能生效; 260828 bug: 此前运行时把
// theme-preset-style appendChild 到 head 末尾反超了自定义 CSS, API 配置的主题色全被预设盖掉)
// - SSR: 两个 <style> 均直出(swr 缓存页同样携带), 顺序固化在 HTML 中;
// - 客户端: theme-preset-style 带 id, 运行时 applyThemePresetToDocument 经 getElementById
//   原位更新(不再 appendChild 追加到末尾, 顺序不漂移); 自定义 CSS 在 store 刷新
//   (initStores 强制回源 / admin 保存后的 update(true))后由响应式 getter 原位更新
const optionsStore = useOptionsStore()
const { custom_style_css } = storeToRefs(optionsStore)

useHead({
    style: [
        {
            key: "theme-preset-style",
            id: "theme-preset-style",
            textContent: () => buildThemePresetStyleContent(getThemePreset(activeThemePresetState.value)),
        },
        {
            key: "custom-style-css",
            textContent: () => buildCustomCss(custom_style_css.value),
        },
    ],
})
</script>

<style scoped lang="scss">
.app-loading-indicator {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999999;
    height: 4px;
    width: 0;
    opacity: 0;
    pointer-events: none;
    background: var(--jpz-color-primary);
    box-shadow: 0 0 14px color-mix(in srgb, var(--jpz-color-primary) 40%, transparent);
    transition:
        width 0.1s linear,
        opacity 0.2s ease;
    will-change: width, opacity;
}

.app-loading-indicator--visible {
    opacity: 1;
}

.app-loading-indicator--error {
    background: var(--el-color-danger);
    box-shadow: 0 0 14px color-mix(in srgb, var(--el-color-danger) 40%, transparent);
}
</style>
