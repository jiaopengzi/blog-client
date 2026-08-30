/*
 * FilePath    : blog-client-nuxt\src\plugins\init-stores.client.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : stores 初始化 (阶段 1 实现)
 */

/*
 * 补充说明:
 * 对应原项目 src/stores/init.ts 的 initStores() 全逻辑
 * (device/options/permissionRole/user + token 同步 + 权限预热);
 * 仅客户端执行, SSR 不触碰浏览器 API。
 *
 * @bugfix(260824 bug01): hydration mismatch
 *   原实现直接在插件体内 await initStores(), 而 Nuxt 客户端入口会先 await applyPlugins()
 *   再执行 vueApp.mount() (即水合)。插件体被阻塞期间, store 已带着异步取数结果
 *   (isLogin / options 等) 提前变化, 与服务端渲染的 HTML 不一致, 触发
 *   "Hydration node mismatch" (HeaderAccount login/avatar、LayoutFooter 图片 src 等)。
 *   修复: 不在插件体阻塞水合, 改为 onNuxtReady (app:suspense:resolve 之后, 即水合完成后)
 *   再执行 initStores(); 受保护路由 (auth/admin 守卫) 会通过 getInitStoresPromise() 共享
 *   同一初始化并在需要时提前触发。
 *
 * @bugfix(260824 build): INEFFECTIVE_DYNAMIC_IMPORT 警告
 *   本插件原静态导入 @/stores/init, 而 auth/admin 守卫动态导入同一模块,
 *   静态导入使 init.ts 进入主 chunk, 动态导入失效 ("will not move module into another chunk")。
 *   改为与本插件调用方一致: 动态导入 @/stores/init, 让 init.ts 可被独立拆 chunk。
 */

import { onNuxtReady } from "#imports"

export default defineNuxtPlugin(() => {
    // 水合完成后再初始化 store, 避免客户端首帧状态与服务端渲染不一致 (bug01)
    onNuxtReady(async () => {
        try {
            const { getInitStoresPromise } = await import("@/stores/init")
            await getInitStoresPromise()
        } catch (err) {
            // 初始化异常不阻塞渲染 (对应原项目 devRun 的容错语义)
            console.warn("initStores 执行异常(不影响渲染):", err)
        }
    })
})
