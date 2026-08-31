/*
 * FilePath    : blog-client-nuxt\src\middleware\auth.global.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 用户区登录守卫 (复刻 SPA authMiddleware 全部分支语义)
 */

/*
 * 补充说明:
 * 1. 未登录访问 /user-info、/checkout → /login?redirect=<fullPath>
 * 2. 已登录未绑定邮箱且目标不是 /user-info → 弹绑定邮箱弹窗 + 警告 + 跳 /user-info
 * 3. 已登录访问 /login → 跳 redirect 参数或首页
 * userStore 在客户端分支内动态加载, 避免其依赖链进入 SSR 入口
 * bugfix(260824 bug01): initStores 已改为水合完成后 (onNuxtReady) 执行,
 * 守卫在检查 isLogin 前需等待共享初始化完成 (受保护页为纯 CSR, 无 SSR 内容可 mismatch)
 * bugfix(260829 bug01): 补齐 SPA authMiddleware 的未绑定邮箱拦截与已登录访问登录页分支;
 * 拦截分两态——initStores 已就绪时守卫内同步拦截 (客户端路由跳转, 含社交回调后的跳转,
 * 与 SPA beforeEach 串行语义一致); 未就绪时 (公开页整页首载) 不阻塞水合, 初始化完成后
 * 补检再跳转, 兼顾 SSR 首屏性能与 SPA 行为对齐
 * 注: SPA 对 requiresAuth 失败另有 isEditing 保护分支 (return false 阻断导航), 受保护页
 * (user-info/checkout) 不承载编辑器, 该分支实际不可达, 未迁移
 */

const REQUIRES_AUTH_PREFIXES = ["/user-info", "/checkout"]
const USER_INFO_PATH = "/user-info"
const LOGIN_PATH = "/login"
const SETUP_PATH = "/setup"

export default defineNuxtRouteMiddleware(async (to) => {
    if (!import.meta.client) {
        return
    }

    // bug01(260831-01 反馈第1轮): 在任何 await 之前捕获 nuxtApp —— 中间件内的 await 会丢失
    // unctx 上下文, 之后再 useNuxtApp 取不到实例; 水合状态用于下方延后 initStores 触发
    const nuxtApp = useNuxtApp()

    // SPA authMiddleware 对 setup 页直接放行
    if (to.path === SETUP_PATH) {
        return
    }

    const { getInitStoresPromise, isInitStoresReady } = await import("@/stores/init")
    const { MessageUtil } = await import("@/utils/message")
    const { useUserStore } = await import("@/stores/user")

    const userStore = useUserStore()

    const needsAuth = REQUIRES_AUTH_PREFIXES.some((prefix) => to.path === prefix || to.path.startsWith(`${prefix}/`))
    if (needsAuth) {
        await getInitStoresPromise()

        if (!userStore.isLogin) {
            return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`)
        }
    }

    /**
     * resolveBlockedTarget 按当前登录态解析拦截目标 (对齐 SPA authMiddleware 的第 2/3 分支).
     * @returns 需要跳转的路径; 无拦截返回 undefined.
     */
    const resolveBlockedTarget = (): string | undefined => {
        // 已登录未绑定邮箱: 除 /user-info 外一律强制先绑定邮箱
        if (userStore.isLogin && !userStore.isBindEmail && to.path !== USER_INFO_PATH) {
            void userStore.changeShowDialogBindEmail(true)
            MessageUtil.warning("请绑定邮箱！", 6000)
            return USER_INFO_PATH
        }

        // 已登录访问登录页: 跳 redirect 参数或首页
        if (userStore.isLogin && to.path === LOGIN_PATH) {
            const redirectQuery = to.query.redirect
            return (typeof redirectQuery === "string" && redirectQuery) || "/"
        }

        return undefined
    }

    if (isInitStoresReady()) {
        // 初始化已就绪: 守卫内同步拦截
        const blockedTarget = resolveBlockedTarget()
        if (blockedTarget !== undefined) {
            return navigateTo(blockedTarget)
        }
        return
    }

    // 初始化未就绪 (公开页整页首载): 不阻塞水合, 初始化完成后补检;
    // 用户已离开目标页则跳过, 由后续导航的就绪态守卫同步拦截;
    // 初始化失败的告警已由 init-stores.client 插件统一输出, 这里静默跳过补检
    // bug01(260831-01 反馈第1轮): 首载水合中延后触发 —— SSR 直连后端失败时 optionsStore 为空,
    // initStores 的回源填充若发生在水合中途, 客户端首帧(导航/页脚)与 SSR HTML 不一致,
    // 触发 "Hydration completed but contains mismatches."; 水合完成后(app:suspense:resolve)
    // 再触发, 与 init-stores.client 插件共享同一初始化 Promise, 补检语义不变
    const router = useRouter()
    const startInitAndRecheck = () => {
        void getInitStoresPromise()
            .then(() => {
                if (router.currentRoute.value.path !== to.path) {
                    return
                }
                const blockedTarget = resolveBlockedTarget()
                if (blockedTarget !== undefined) {
                    void router.push(blockedTarget)
                }
            })
            .catch(() => {})
    }
    if (nuxtApp.isHydrating) {
        // 对齐 onNuxtReady 的实现语义(水合完成 + 空闲回调), 用已捕获的 nuxtApp 引用避免 await 后上下文丢失
        nuxtApp.hooks.hookOnce("app:suspense:resolve", () => {
            requestIdleCallback(() => startInitAndRecheck())
        })
    } else {
        requestIdleCallback(() => startInitAndRecheck())
    }
})
