/*
 * FilePath    : blog-client-nuxt\src\plugins\dev.client.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 开发环境客户端插件(对应 SPA main.ts 的 devRun 调用)
 */

/*
 * 补充说明:
 * 仅 dev 模式执行; devRun 校验 iconMap 与权限枚举(控制台提示便于调试)
 */

import { devRun } from "@/dev"

export default defineNuxtPlugin(() => {
    if (import.meta.dev) {
        devRun().catch((err) => console.warn("devRun 执行异常(不影响运行):", err))
    }
})
