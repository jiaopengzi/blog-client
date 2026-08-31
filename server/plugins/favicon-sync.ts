/*
 * FilePath    : blog-client-nuxt\server\plugins\favicon-sync.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 启动时自愈同步 favicon.ico 镜像 (bug05 260831-01 重构)
 */

/*
 * 补充说明:
 * 服务启动时按后端 app-option 配置同步一次 <public>/favicon.ico, 覆盖两类场景:
 * - 容器重建/镜像文件丢失(Docker 内镜像写在容器可写层, 不随镜像分发);
 * - 首次部署(admin 尚未保存过配置, 无 internal 接口触发记录).
 * 刻意不阻塞启动(异步执行, void): 后端不可达时仅 warn 一条日志, 不影响 SSR 服务可用性
 * (与线上 bug01~04 的教训一致: 启动链路上的外部依赖失败不应放大为整站不可用).
 */

import { syncFaviconMirror } from "../utils/favicon"

export default defineNitroPlugin(() => {
    const { apiBase } = useRuntimeConfig()
    if (!apiBase) {
        return
    }

    void syncFaviconMirror(apiBase)
        .then((result) => {
            if (result.ok) {
                console.log(`[favicon-sync] 启动镜像同步完成: ${result.action}`)
            } else {
                console.warn(`[favicon-sync] 启动镜像同步失败(不影响服务): ${result.reason ?? "unknown"}`)
            }
        })
        .catch((err: unknown) => {
            // 兜底防御: 同步链路上任何未预期异常(如路径解析错误)都不允许变成 unhandledRejection
            console.warn("[favicon-sync] 启动镜像同步异常(不影响服务):", err)
        })
})
