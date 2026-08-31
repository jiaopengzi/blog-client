/*
 * FilePath    : blog-client-nuxt\src\utils\faviconSync.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : favicon.ico 镜像同步通知 (bug05 260831-01 重构)
 */

/*
 * 补充说明:
 * 后台保存站点配置(app-option)成功后调用, 通知 SSR 端按最新 favicon 配置同步 <public>/favicon.ico 镜像
 * (浏览器/外部工具按固定约定路径请求 /favicon.ico, 不读 HTML 的 <link rel="icon">).
 * 接口实现见 server/routes/internal/favicon-sync.post.ts (LoginAdmin 权限校验);
 * 服务启动时另有 server/plugins/favicon-sync.ts 自愈同步, 本调用只负责"保存后立即生效".
 */

import { useUserStore } from "@/stores/user"

/**
 * syncServerFaviconMirror 通知 SSR 端按最新 app-option 配置同步 favicon.ico 镜像.
 * @remarks 内部吞掉全部异常(仅 console.warn), 同步失败不影响保存结果;
 *          未登录(无 token)时静默跳过, 服务端也会拒绝无权限调用.
 * @returns 无返回值.
 */
export async function syncServerFaviconMirror(): Promise<void> {
    try {
        const token = useUserStore().accessToken
        if (!token) {
            return
        }

        // Authorization 前缀 "Bearer " 与请求层 buildHeaders 一致(后端校验标准 Bearer scheme);
        // 经 globalThis.$fetch 调用: 保持运行时语义且可被单测 vi.stubGlobal 拦截(与 ssrCache.ts 同做法)
        await globalThis.$fetch("/internal/favicon-sync", {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
        })
    } catch (err: unknown) {
        console.warn("[favicon-sync] 同步 favicon 镜像失败(不影响保存结果):", err)
    }
}
