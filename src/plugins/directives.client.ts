/*
 * FilePath    : blog-client-nuxt\src\plugins\directives.client.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 仅客户端全局指令注册 (阶段 0)
 */

/*
 * 补充说明:
 * 对应原项目 main.ts 中的客户端指令注册
 */

import { permissionDirective } from "@/utils/permissionDirective"
import { singleDblClickDirective } from "@/utils/singleDblClickDirective"

export default defineNuxtPlugin((nuxtApp) => {
    // 全局单击/双击指令
    nuxtApp.vueApp.directive("single-dbl-click", singleDblClickDirective)

    // 阶段 6: 权限指令 (无权限移除元素)
    nuxtApp.vueApp.directive("permission", permissionDirective)
})
