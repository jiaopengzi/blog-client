<!--
 * FilePath    : blog-client-nuxt\src\pages\user\[username].vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 用户公开主页(原 views/user-public-profile 视图已并入本页面; SSR 404 语义来自原 pages 包装)
-->

<!--
 * 补充说明:
 * 对应 SPA /:username 路由; SSR 仅做存在性校验(404 语义), 视图 UI 位于 ClientOnly 内保持 CSR 渲染;
 * 视图私有子组件已迁至 src/components/views/user-public-profile/.
 * 260828-4: 路由由 /:username 迁至 /user/:username(评论 @提及链接统一为
 * /user/<username>); 旧链 /:username 的 301 见 server/middleware/legacy-redirect.ts
 * 与 middleware/legacy.global.ts
-->

<script setup lang="ts">
import { ResponseCode } from "@/api/response"
import { getUserPublicInfoByUserNameAPI, type UserPublicInfo } from "@/api/user/getUserPublicInfoByUserName"
import UserPublicProfile from "@/components/views/user-public-profile"
import { useStatusStore } from "@/stores/status"
import { RegexPatterns } from "@/utils/regexPatterns"

// P1-8(nuxt4-good): 站壳由命名布局 bare-shell 承接(替代 layout:false + 手工拼装);
// 用户主页不显示页头搜索框, 经 statusStore.isShowSearch 控制布局内 header 显隐
// 面包屑由中间件 user-breadcrumb 在渲染前就位(布局子树先于页面 setup 渲染,
// 在 setup 内设置会导致 SSR HTML 缺该项 → hydration mismatch)
definePageMeta({ layout: "bare-shell", name: "user-public-profile", middleware: "user-breadcrumb" })

defineOptions({ name: "PageUserPublicProfile" })

const route = useRoute()
const statusStore = useStatusStore()

const username = computed(() => String(route.params.username ?? ""))

// 用户主页语义: 页头不显示搜索框(对齐 SPA 的 :is-show-search="false"); 同步赋值保证 SSR 布局首帧即生效
statusStore.isShowSearch = false

useHead({
    title: () => `${username.value} 的主页 | 焦棚子`,
})

// 404 统一出口: 渲染 error.vue(站内 404 视图) 且地址栏 URL 保持不变
// bug02(260830-02): 用 showError 而非 throw createError —— throw 只在 SSR 硬导航时由渲染管线
// 接管并渲染错误页, 客户端软导航 (router.push) 抛出的错误无人接管, 结果是空白页 + 控制台
// "Unhandled error during execution of setup function"; showError 双端一致地切换到错误页
function showNotFound(message: string): void {
    showError(createError({ statusCode: 404, message }))
}

// 静态资源前缀(如 /_nuxt)不进入用户查询, 直接 404(避免预览/生产环境资源请求落到用户主页语义)
// bugfix(260825-02 bug04): 不使用 fatal: true, 普通 404 让 Nuxt 按已处理错误渲染错误页,
// 避免 nitro 在终端输出 "[request error] [fatal]" 噪音(资源目录路径请求属正常 404 场景).
if (username.value.startsWith("_")) {
    showNotFound("页面不存在")
}

// SSR: 用户存在性校验(404 语义)
const { data: profile, pending } = await useAsyncData<UserPublicInfo | null>(`user-profile-${username.value}`, async () => {
    const res = await getUserPublicInfoByUserNameAPI({ user_name: username.value })
    if (res.data.code !== ResponseCode.UserPublicInfoGetSuccess) {
        return null
    }

    return res.data.data
})

// 用户不存在 → 404
// 同上(260825-02 bug04 约定): 不加 fatal: true. nitropack 的 defaultHandler 以
// `error.unhandled || error.fatal` 判定 isSensitive, 命中即 console.error 输出
// "[request error] [fatal]" 堆栈; 用户名不存在属正常 404 场景, 不该按敏感错误打日志.
if (!pending.value && (profile.value === null || profile.value === undefined)) {
    showNotFound("用户不存在")
}

// ===== 以下为原 views/user-public-profile/index.vue 视图逻辑(等价移植, 行为不变)=====

const isValidUsername = RegexPatterns.UserName.test(username.value)

// 用户名格式非法 → 404, 并避免进入后续的用户资料请求流程(ClientOnly 内不挂载资料视图)
// bug02(260830-02): SPA 的 catch-all 为 /:pathMatch(.*)*, /<非法用户名> 不命中任何具名路由而落到
// 404 视图; Nuxt 的 catch-all 是 pages/[...slug].vue(/:slug(.*)*), 但 /user/:username 优先级更高,
// 按 name + pathMatch 替换时 pathMatch 不是该路由形参会被丢弃 → 解析成 "/"(跳回首页),
// 改成 slug 也只会重新进入本页. 故统一走 showError: 渲染 error.vue 的 404 视图, URL 保持不变
if (!isValidUsername) {
    showNotFound("用户不存在")
}

// 视图标题(原视图 useHead, 仅客户端注册): 旧架构中视图位于 ClientOnly 异步组件内,
// 其 useHead 只在客户端生效(SSR 标题为页面包装的 "主页 | 焦棚子"); 等价移植后加
// import.meta.client 守卫, 保持与迁移前一致的双端标题行为
if (import.meta.client) {
    useHead({
        title: `${username.value} - 用户信息`,
    })
}
</script>

<template>
    <!-- P1-8(nuxt4-good): 站壳由命名布局 bare-shell 承接(header/面包屑/footer, SSR 直出);
         用户主页内容保持 ClientOnly 纯 CSR(与 SPA 一致, 视图含编辑器等浏览器依赖链) -->
    <ClientOnly>
        <UserPublicProfile />
    </ClientOnly>
</template>
