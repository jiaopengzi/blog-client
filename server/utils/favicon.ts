/*
 * FilePath    : blog-client-nuxt\server\utils\favicon.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : favicon.ico 运行时镜像同步 (bug05 260831-01 重构: /favicon.ico 不再打包写死, 改为 app-option 配置的服务端镜像)
 */

/*
 * 补充说明:
 * 背景: /favicon.ico 是浏览器/外部工具(书签/RSS/搜索引擎)的固定约定路径, 不读 HTML 的 <link rel="icon">.
 * 本产品公开部署, favicon 由 admin 的 app-option 配置, 不能在 public/ 打包写死一份 demo 图标.
 * 方案(参照 server/routes/internal/cache-invalidate.post.ts 的做法):
 * - admin 保存 app-option 后经 /internal/favicon-sync 触发(LoginAdmin 鉴权), 服务端把配置的 favicon 拉取落盘为 <public>/favicon.ico;
 * - 服务启动时经 server/plugins/favicon-sync.ts 自愈同步一次(容器重建/镜像文件丢失场景);
 * - dev/preview 由 server/routes/favicon.ico.ts 兜底读取落盘文件(nitro 静态服务只认构建期清单, 运行时新写入
 *   .output/public 的文件不被服务, 实证见 .spa2nuxt/cache/bug-260831-01-debug-log.md);
 * - 生产由 nginx 拦截 /favicon.ico 直接服务容器内静态文件(nginx 是运行时实时读 root 目录, symlink 让
 *   node 写入目录与 nginx root 指向同一份, 见 Dockerfile 运行阶段说明).
 * bug02(260831-01 反馈第1轮): public 目录定位 / URL 规范化 / app-option 读取抽至 optionAsset.ts,
 * 与 logo.png 镜像(server/utils/logo.ts)共用, 本文件只保留 favicon 特有的落盘与服务路径逻辑.
 */

import fs from "node:fs/promises"
import path from "node:path"

import { normalizeOptionAssetUrl, readAppOptionAssetValue, resolveOptionPublicDir } from "./optionAsset"

// 镜像文件名固定为 favicon.ico(约定路径), 落盘目标永远是 <public>/favicon.ico, 无任何用户输入参与路径拼接
const MIRROR_FILE_NAME = "favicon.ico"

// favicon 内容上限(2MB): 正常站点图标远小于此, 超限视为异常配置拒绝落盘
const FAVICON_MAX_BYTES = 2 * 1024 * 1024

// 拉取超时(毫秒): 后端/图床无响应时快速失败, 不拖慢保存流程
const FAVICON_FETCH_TIMEOUT_MS = 5000

export interface FaviconSyncResult {
    ok: boolean
    action: "written" | "removed" | "failed"
    reason?: string
}

// normalizeFaviconUrl 保留既有导出名(favicon.test.ts 依赖), 实现共享自 optionAsset.normalizeOptionAssetUrl
export const normalizeFaviconUrl = normalizeOptionAssetUrl

let cachedMirrorPath: string | null | undefined

/**
 * resolveFaviconMirrorPath 解析 favicon 镜像落盘文件 的绝对路径(模块级缓存, 进程内首次解析后固定).
 * 目录定位候选链见 optionAsset.resolveOptionPublicDir; 本函数仅拼接固定文件名.
 * @returns 镜像文件绝对路径; 无法定位 public 目录时返回 null.
 */
export function resolveFaviconMirrorPath(): string | null {
    if (cachedMirrorPath !== undefined) {
        return cachedMirrorPath
    }
    const dir = resolveOptionPublicDir()
    cachedMirrorPath = dir ? path.join(dir, MIRROR_FILE_NAME) : null
    return cachedMirrorPath
}

/**
 * syncFaviconMirror 从后端 app-option 读取 favicon 配置并同步落盘镜像.
 * 有配置时拉取内容写入 <public>/favicon.ico; 配置为空时删除镜像文件(幂等).
 * @param apiBase 后端直连地址(runtimeConfig.apiBase, 调用方在 nitro 上下文中取).
 * @param publicBaseUrl 站点公网地址, 用于将本站上传资源直连到 apiBase.
 * @returns 同步结果(ok=false 时 reason 说明失败环节).
 */
export async function syncFaviconMirror(apiBase: string, publicBaseUrl = ""): Promise<FaviconSyncResult> {
    if (!apiBase) {
        return { ok: false, action: "failed", reason: "api-base-empty" }
    }

    const mirrorPath = resolveFaviconMirrorPath()
    if (!mirrorPath) {
        return { ok: false, action: "failed", reason: "mirror-dir-unresolved" }
    }

    // 读后端全量配置取 favicon 值(与 optionsStore.updateFromServer 同一接口)
    let faviconValue = ""
    try {
        faviconValue = await readAppOptionAssetValue(apiBase, "favicon", FAVICON_FETCH_TIMEOUT_MS)
    } catch (err) {
        return { ok: false, action: "failed", reason: `app-option-fetch-failed: ${err instanceof Error ? err.message : String(err)}` }
    }

    // 未配置 favicon: 删除镜像(不存在时也视为成功, 幂等)
    if (!faviconValue.trim()) {
        await fs.rm(mirrorPath, { force: true })
        return { ok: true, action: "removed" }
    }

    const targetUrl = normalizeOptionAssetUrl(faviconValue, apiBase, publicBaseUrl)
    if (!targetUrl) {
        return { ok: false, action: "failed", reason: "favicon-url-invalid(blocked-or-non-http)" }
    }

    // 拉取图标内容: 禁止重定向(redirect error 避免跟随到未校验目标), 超时快速失败
    let content: ArrayBuffer
    try {
        content = await $fetch(targetUrl, {
            responseType: "arrayBuffer",
            timeout: FAVICON_FETCH_TIMEOUT_MS,
            retry: 0,
            redirect: "error",
        })
    } catch (err) {
        return { ok: false, action: "failed", reason: `favicon-fetch-failed: ${err instanceof Error ? err.message : String(err)}` }
    }

    if (content.byteLength <= 0 || content.byteLength > FAVICON_MAX_BYTES) {
        return { ok: false, action: "failed", reason: `favicon-size-invalid(${content.byteLength}B)` }
    }

    await fs.writeFile(mirrorPath, Buffer.from(content))
    return { ok: true, action: "written" }
}
