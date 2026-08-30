/*
 * FilePath    : blog-client-nuxt\src\plugins\directives.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 双端全局指令/组件注册 (阶段 0)
 */

/*
 * 补充说明:
 * 对应原项目 main.ts 中的注册; permission 指令依赖 stores, 阶段 6 迁移
 */

import JIcon from "@/components/common/icons/index.vue"
import { stableHtmlDirective } from "@/utils/stableHtmlDirective"

export default defineNuxtPlugin((nuxtApp) => {
    // 稳定 HTML 指令 (v-stable-html, 禁止 v-html)
    nuxtApp.vueApp.directive("stable-html", stableHtmlDirective)

    // 全局图标组件
    nuxtApp.vueApp.component("j-icon", JIcon)
})
