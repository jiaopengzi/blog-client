/*
 * FilePath    : blog-client-nuxt\src\plugins\element-injection.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : Element Plus SSR 注入兜底与命令式弹窗上下文对齐 (bug01 260826-03 / 260903-02)
 */

/*
 * 补充说明:
 * ID_INJECTION_KEY / ZINDEX_INJECTION_KEY 原在 app.vue setup 内 provide,
 * 仅覆盖应用子树; 全局错误页(error.vue)独立于 app.vue 渲染, 其 SSR 同样会渲染
 * Element Plus 组件 (header/面包屑等), 缺少注入触发
 * "[IdInjection]/[ZIndexInjection] Looks like you are using server rendering" 报错。
 * 移到插件层对 vueApp 全局 provide, 应用与错误页两条渲染路径均受覆盖。
 */

import { ElMessageBox, ID_INJECTION_KEY, ZINDEX_INJECTION_KEY } from "element-plus"

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.provide(ID_INJECTION_KEY, { prefix: 0, current: 0 })
    nuxtApp.vueApp.provide(ZINDEX_INJECTION_KEY, { current: 0 })

    // bug01(260903-02): 命令式 ElMessageBox 经独立 render() 挂载, 默认不带 appContext,
    // inject 不到上方 provide 的 ZINDEX_INJECTION_KEY, 与组件树内的 ElDialog 各持一套
    // z-index 计数器 —— ElDialog 已打开时 MessageBox 算出的 z-index 可能不高于 Dialog,
    // 确认框被遮在后面无法点击 (计费中心重置证书弹窗内确认框复现).
    // 挂回 vueApp 的 appContext 后两者共享同一计数器, 后弹出者 z-index 恒递增, 不再互相遮盖.
    ElMessageBox._context = nuxtApp.vueApp._context
})
