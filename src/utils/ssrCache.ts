/*
 * FilePath    : blog-client-nuxt\src\utils\ssrCache.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : SSR 渲染缓存失效通知 (feature01 260829-08)
 */

/*
 * 补充说明:
 * 后台修改站点配置(app-option/app-nav)或文章/自定义页(新增/编辑/删除)成功后调用,
 * 通知 SSR 端清空 swr 渲染缓存, 下次请求按新数据重新 SSR, 避免缓存窗口期内前后台内容不一致.
 * 接口实现见 server/routes/internal/cache-invalidate.post.ts (LoginAdmin 权限校验).
 */

import { useUserStore } from "@/stores/user"

/**
 * invalidateSsrRenderCache 通知 SSR 端清空 swr 渲染缓存.
 * @remarks 内部吞掉全部异常(仅 console.warn), 缓存失效失败不影响保存结果;
 *          未登录(无 token)时静默跳过, 服务端也会拒绝无权限调用.
 * @returns 无返回值.
 */
export async function invalidateSsrRenderCache(): Promise<void> {
    try {
        const token = useUserStore().accessToken
        if (!token) {
            return
        }

        // Authorization 前缀 "Bearer " 与请求层 buildHeaders 一致(后端校验标准 Bearer scheme);
        // 经 globalThis.$fetch 调用: Nuxt vite 链会把裸 $fetch 转换为 ofetch 静态导入,
        // 显式全局引用保持运行时语义且可被单测 vi.stubGlobal 拦截
        await globalThis.$fetch("/internal/cache-invalidate", {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
        })
    } catch (err: unknown) {
        console.warn("[ssr-cache] 清除 SSR 渲染缓存失败(不影响保存结果):", err)
    }
}
