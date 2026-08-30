/*
 * FilePath    : blog-client-nuxt\src\composables\useDetailLoginRefresh.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Description : 详情页登录态复拉校准 (bug01 260829-08)
 */

/*
 * 补充说明:
 * SSR 取数不携带用户 token (请求层 buildHeaders 服务端直接返回), 文章/page 详情首屏必为匿名数据:
 * 已购用户会被 is_paid=false 的匿名数据覆盖, 付费内容仍显示为付费状态.
 * 本 composable 复用列表页 (post-list-view) 的"登录态隐藏式 CSR"机制:
 * - 匿名(本地无 login_hint): app.vue 内联脚本不加 data-list-pending 标记, SSR 详情从首帧起直接展示 (SEO 不受影响);
 * - 登录态(本地 login_hint=1): 内联脚本在首帧绘制前隐藏详情容器 (html[data-list-pending], 由页面 CSS 绑定),
 *   挂载后等待共享 initStores 恢复登录态, 再带 token 复拉详情 (refresh), 已购内容以登录态数据为准,
 *   完成后移除标记一次性展示; 提示标记过期(refresh 失败实际为匿名)时直接沿用 SSR 数据.
 */

import { onMounted } from "vue"

import { LocalStorageKey } from "@/stores/local"
import { useUserStore } from "@/stores/user"

/**
 * useDetailLoginRefresh 详情页登录态复拉: 登录态首屏以带 token 的客户端数据覆盖匿名 SSR 数据.
 * @param refresh - 页面 useAsyncData 的 refresh (客户端执行时请求层自动携带 token).
 * @returns 无返回值.
 */
export function useDetailLoginRefresh(refresh: () => Promise<void> | void) {
    // 登录态提示标记 (登录/refresh 成功时写入, 登出时清除; 与列表页同源, 见 stores/user.ts)
    // SSR 侧恒为 false, 水合期间客户端同步读取 (此时 localStorage 可用)
    const hasLoginHint = import.meta.client && typeof localStorage !== "undefined" && localStorage.getItem(LocalStorageKey.LoginHint) === "1"

    onMounted(async () => {
        // 匿名: 无标记, SSR 详情数据直接展示, 不做任何隐藏与复拉
        if (!hasLoginHint) {
            return
        }

        // 登录态: 等待共享 initStores 完成 (登录态经 refresh_token cookie 恢复; 已初始化则立即返回)
        try {
            const { getInitStoresPromise } = await import("@/stores/init")
            await getInitStoresPromise()
        } catch {
            // initStores 异常不阻塞详情展示 (与 init-stores.client 插件容错语义一致), 沿用 SSR 数据
        }

        try {
            if (useUserStore().isLogin) {
                // 带 token 复拉详情: 已购内容/私有内容以登录态为准 (postData prop 变化驱动 PostDetail 重应用)
                await refresh()
            }
        } finally {
            // 无论复拉成功与否都移除首屏隐藏标记, 展示详情 (失败时保留 SSR 匿名数据)
            document.documentElement.removeAttribute("data-list-pending")
        }
    })
}
