/*
 * FilePath    : blog-client-nuxt\src\router\index.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 统一导出 (阶段 2)
 */

/*
 * 补充说明:
 * 计划 7.5: 只导出纯类型/常量, 不 re-export SPA router 实例,
 * 避免任何 `import { RouteNames } from "@/router"` 误载整张 SPA 路由表进入 SSR 入口
 */

export * from "./types"
export { routerPushByParams } from "./utils"
