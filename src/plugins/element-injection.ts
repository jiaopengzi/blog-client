/*
 * FilePath    : blog-client-nuxt\src\plugins\element-injection.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : Element Plus SSR 注入兜底 (bug01 260826-03)
 */

/*
 * 补充说明:
 * ID_INJECTION_KEY / ZINDEX_INJECTION_KEY 原在 app.vue setup 内 provide,
 * 仅覆盖应用子树; 全局错误页(error.vue)独立于 app.vue 渲染, 其 SSR 同样会渲染
 * Element Plus 组件 (header/面包屑等), 缺少注入触发
 * "[IdInjection]/[ZIndexInjection] Looks like you are using server rendering" 报错。
 * 移到插件层对 vueApp 全局 provide, 应用与错误页两条渲染路径均受覆盖。
 */

import { ID_INJECTION_KEY, ZINDEX_INJECTION_KEY } from "element-plus"

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.provide(ID_INJECTION_KEY, { prefix: 0, current: 0 })
    nuxtApp.vueApp.provide(ZINDEX_INJECTION_KEY, { current: 0 })
})
