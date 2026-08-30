/*
 * FilePath    : blog-client-nuxt\src\plugins\payload-hygiene.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : SSR payload 瘦身: 剔除客户端 hydration 不需要的 pinia store (bugfix 260825-03)
 */

/*
 * 补充说明:
 * @pinia/nuxt 在 app:rendered 钩子中把全部 SSR 期间创建的 store 快照写入
 * nuxtApp.payload.pinia. 本插件 (注册于模块插件之后) 在同一钩子中删除以下 store:
 * - user:     SSR 永不登录 (公开页 SSR 直出未登录态), 序列化的只是空骨架 (约 800B),
 *             客户端由 store 默认状态起步 + initStores 客户端拉取, 无 hydration 差异.
 * - status:   SSR 写入的详情态由页面 setup 的 immediate watch 在客户端水合时同步重放
 *             (p/[id].vue 的 setPostDetail), 首帧渲染前状态一致; 其余页面 SSR 均为默认态,
 *             与客户端默认状态相同, 无需注水.
 * - options.navList: 公开端只消费 navObj (页头菜单); navList (含禁用项) 仅后台导航管理使用,
 *             后台页为空时自取全量 (见 app-nav/index.vue), 无需随公开页注水.
 * 注意 1: breadcrumb 必须保留注水 —— 全局错误页 (error.vue 复用 views/not-found) 在
 *             SSR 会写出并渲染面包屑内容, 客户端水合首帧需与服务端 HTML 一致,
 *             删除会引起 hydration mismatch; 体积仅少量数组元素.
 * 注意 2: device 必须保留 —— SSR 恒为 pc/1920, 手机端客户端若按真实宽度计算首帧
 *             会与 SSR HTML 的 pc 分支不一致, 产生 hydration mismatch.
 */

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.hook("app:rendered", () => {
        // 仅服务端: 客户端无 payload 序列化环节, 且删除后 pinia 已按默认状态完成水合
        if (!import.meta.server) {
            return
        }

        const payload = nuxtApp.payload as { pinia?: Record<string, unknown> }
        const pinia = payload.pinia
        if (!pinia) {
            return
        }

        // 客户端 hydration 不需要的 store: 删除后客户端按各自 store 的默认状态创建,
        // 与 SSR 渲染使用的状态一致(见文件头说明), 不会产生 hydration mismatch.
        // breadcrumb 不在删除之列: 错误页 SSR 会渲染面包屑内容, 需随 payload 注水(见文件头注意 1).
        delete pinia.user
        delete pinia.status

        // 公开端不消费 navList(仅后台导航管理使用), 剔除避免与 navObj 重复注水;
        // 后台导航管理页在列表为空时经 optionsStore.update(true) 自取全量.
        // bugfix(260827 app-nav 报错): @pinia/nuxt 客户端水合是按 payload 快照整体替换 store state,
        // 若 delete 掉 navList 键, 水合后的 state 将永久缺失该键 → storeToRefs 解构得到 undefined →
        // app-nav 渲染期 navList.value 抛 "Cannot read properties of undefined (reading 'value')"
        // 改为置空数组: 键保留 (体积可忽略), 后台页检测空列表自取全量, 公开端渲染消费 navObj 不受影响.
        const options = pinia.options as { navList?: unknown } | undefined
        if (options) {
            options.navList = []
        }
    })
})
