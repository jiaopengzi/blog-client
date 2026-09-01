/*
 * FilePath    : blog-client-nuxt\server\utils\logo.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : logo.png 运行时镜像同步 (bug02 260831-01 反馈第1轮: 页头 logo 统一走 /logo.png 稳定地址)
 */

/*
 * 补充说明:
 * 背景(bug02): 页头 logo 直接渲染 app-option 配置的原始 URL, SSR 取数失败窗口内 store 为空,
 * logo 回退 /demo-logo.svg, 客户端取数恢复后 src 再切换为配置值 —— 表现为 logo 闪换(两张图都进网络)
 * 且与 SSR HTML 不一致触发 hydration mismatch(首页 bug01 的组成之一).
 * 方案(参照 favicon.ico 镜像, bug05 260831-01):
 * - 服务端把配置的 logo 拉取落盘为 <public>/logo.png, 页头 logo 恒定渲染 /logo.png(不随 store 变化),
 *   SSR 与客户端水合首帧 src 一致, 无闪换; /demo-logo.svg 仅作为镜像缺失时的 <img> onerror 兜底;
 * - admin 保存 app-option 后经 /internal/logo-sync 触发(LoginAdmin 鉴权);
 * - 服务启动时经 server/plugins/logo-sync.ts 自愈同步一次(容器重建/镜像丢失场景);
 * - dev/preview 由 server/routes/logo.png.ts 兜底读取落盘文件(nitro 静态服务只认构建期清单);
 * - 生产由 nginx 精确规则拦截 /logo.png 直接服务容器内静态文件(与 /favicon.ico 同机制, 短缓存).
 * 注意: 镜像固定文件名 logo.png, 内容为配置 URL 的原始字节(通常为 png; 即便配置了 svg/jpg 也按
 * 原字节落盘, 浏览器按内容嗅探渲染, 与 favicon.ico 镜像同策略).
 */

import fs from "node:fs/promises"
import path from "node:path"

import { normalizeOptionAssetUrl, readAppOptionAssetValue, resolveOptionPublicDir } from "./optionAsset"

// 镜像文件名固定为 logo.png(约定路径), 落盘目标永远是 <public>/logo.png, 无任何用户输入参与路径拼接
const MIRROR_FILE_NAME = "logo.png"

// logo 内容上限(4MB): 站点 logo 远小于此, 超限视为异常配置拒绝落盘
const LOGO_MAX_BYTES = 4 * 1024 * 1024

// 拉取超时(毫秒): 后端/图床无响应时快速失败, 不拖慢保存流程
const LOGO_FETCH_TIMEOUT_MS = 5000

export interface LogoSyncResult {
    ok: boolean
    action: "written" | "removed" | "failed"
    reason?: string
}

let cachedMirrorPath: string | null | undefined

/**
 * resolveLogoMirrorPath 解析 logo 镜像落盘文件的绝对路径(模块级缓存, 进程内首次解析后固定).
 * 目录定位候选链见 optionAsset.resolveOptionPublicDir; 本函数仅拼接固定文件名.
 * @returns 镜像文件绝对路径; 无法定位 public 目录时返回 null.
 */
export function resolveLogoMirrorPath(): string | null {
    if (cachedMirrorPath !== undefined) {
        return cachedMirrorPath
    }
    const dir = resolveOptionPublicDir()
    cachedMirrorPath = dir ? path.join(dir, MIRROR_FILE_NAME) : null
    return cachedMirrorPath
}

/**
 * syncLogoMirror 从后端 app-option 读取 logo 配置并同步落盘镜像.
 * 有配置时拉取内容写入 <public>/logo.png; 配置为空时删除镜像文件(幂等).
 * @param apiBase 后端直连地址(runtimeConfig.apiBase, 调用方在 nitro 上下文中取).
 * @param publicBaseUrl 站点公网地址, 用于将本站上传资源直连到 apiBase.
 * @returns 同步结果(ok=false 时 reason 说明失败环节).
 */
export async function syncLogoMirror(apiBase: string, publicBaseUrl = ""): Promise<LogoSyncResult> {
    if (!apiBase) {
        return { ok: false, action: "failed", reason: "api-base-empty" }
    }

    const mirrorPath = resolveLogoMirrorPath()
    if (!mirrorPath) {
        return { ok: false, action: "failed", reason: "mirror-dir-unresolved" }
    }

    // 读后端全量配置取 logo 值(与 optionsStore.updateFromServer 同一接口)
    let logoValue = ""
    try {
        logoValue = await readAppOptionAssetValue(apiBase, "logo", LOGO_FETCH_TIMEOUT_MS)
    } catch (err) {
        return { ok: false, action: "failed", reason: `app-option-fetch-failed: ${err instanceof Error ? err.message : String(err)}` }
    }

    // 未配置 logo: 删除镜像(不存在时也视为成功, 幂等), 页头经 onerror 回退 /demo-logo.svg
    if (!logoValue.trim()) {
        await fs.rm(mirrorPath, { force: true })
        return { ok: true, action: "removed" }
    }

    const targetUrl = normalizeOptionAssetUrl(logoValue, apiBase, publicBaseUrl)
    if (!targetUrl) {
        return { ok: false, action: "failed", reason: "logo-url-invalid(blocked-or-non-http)" }
    }

    // 拉取 logo 内容: 禁止重定向(redirect error 避免跟随到未校验目标), 超时快速失败
    let content: ArrayBuffer
    try {
        content = await $fetch(targetUrl, {
            responseType: "arrayBuffer",
            timeout: LOGO_FETCH_TIMEOUT_MS,
            retry: 0,
            redirect: "error",
        })
    } catch (err) {
        return { ok: false, action: "failed", reason: `logo-fetch-failed: ${err instanceof Error ? err.message : String(err)}` }
    }

    if (content.byteLength <= 0 || content.byteLength > LOGO_MAX_BYTES) {
        return { ok: false, action: "failed", reason: `logo-size-invalid(${content.byteLength}B)` }
    }

    await fs.writeFile(mirrorPath, Buffer.from(content))
    return { ok: true, action: "written" }
}
