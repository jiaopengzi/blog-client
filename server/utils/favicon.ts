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
 */

import { existsSync } from "node:fs"
import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

// 镜像文件名固定为 favicon.ico(约定路径), 落盘目标永远是 <public>/favicon.ico, 无任何用户输入参与路径拼接
const MIRROR_FILE_NAME = "favicon.ico"

// public 目录的存在性标记文件(仓库自带, dev/build 产物中均存在), 用于把探测候选收敛到真实 public 目录
const PUBLIC_DIR_MARKER = "demo-logo.svg"

// favicon 内容上限(2MB): 正常站点图标远小于此, 超限视为异常配置拒绝落盘
const FAVICON_MAX_BYTES = 2 * 1024 * 1024

// 拉取超时(毫秒): 后端/图床无响应时快速失败, 不拖慢保存流程
const FAVICON_FETCH_TIMEOUT_MS = 5000

export interface FaviconSyncResult {
    ok: boolean
    action: "written" | "removed" | "failed"
    reason?: string
}

/**
 * isPrivateOrReservedHost 判断主机名是否落在环回/链路本地/私有/保留段(SSRF 防护, 260831-01 收紧).
 * 阻断清单: 环回(本机服务)、169.254.0.0/16(链路本地, 含云元数据 169.254.169.254)、
 * RFC1918 私有段(10/8, 172.16/12, 192.168/16)与保留地址(0.0.0.0, ::).
 * 唯一例外: hostname 与 apiBase 同源的请求不经本函数(部署方配置的后端自身, 私网 apiBase 是合法形态,
 * 且 SSR 层全部数据本就来自该地址), 见 normalizeFaviconUrl.
 * @param hostname URL 解析出的 hostname(小写).
 * @returns true 表示命中阻断段.
 */
function isPrivateOrReservedHost(hostname: string): boolean {
    return (
        hostname === "localhost" ||
        hostname === "0.0.0.0" ||
        hostname === "::" ||
        hostname === "::1" ||
        hostname === "[::1]" ||
        hostname.startsWith("127.") ||
        hostname.startsWith("169.254.") ||
        hostname.startsWith("10.") ||
        /^172\.(1[6-9]|2\d|3[01])\./.test(hostname) ||
        hostname.startsWith("192.168.")
    )
}

/**
 * normalizeFaviconUrl 把 app-option 配置的 favicon 值规范化为可安全请求的绝对地址(导出供单测).
 * 相对路径(/api/v1/uploads/...)拼 apiBase(后端自身, 部署方控制, 不走 SSRF 校验);
 * 绝对 URL 要求 http/https 协议, 且 hostname 与 apiBase 同源(后端自身)或为非私网/非保留地址.
 * @param raw app-option 的 favicon.value.
 * @param apiBase 后端直连地址(runtimeConfig.apiBase).
 * @returns 规范化后的绝对 URL; 不合法时返回 null.
 */
export function normalizeFaviconUrl(raw: string, apiBase: string): string | null {
    const value = raw.trim()
    if (!value) {
        return null
    }

    // 相对路径: 后端上传资源的常见形态, 拼后端直连地址(受信来源, 私网 apiBase 是合法部署形态);
    // 仅接受以 "/" 开头的站内路径——其他非 http(s) scheme 的值(file:///、javascript: 等)直接拒绝,
    // 避免被拼接成畸形 URL 透传到请求层
    if (!/^https?:\/\//i.test(value)) {
        if (!value.startsWith("/")) {
            return null
        }
        return `${apiBase.replace(/\/+$/, "")}${value}`
    }

    // 绝对 URL: 协议白名单 + 主机校验(260831-01 收紧)——
    // hostname 与 apiBase 同源(后端自身, 私网 apiBase 是合法部署形态)放行;
    // 其余主机落在环回/链路本地/私有/保留段的拒绝(SSRF 防护, 见 isPrivateOrReservedHost)
    try {
        const parsed = new URL(value)
        if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
            return null
        }
        const apiHost = new URL(apiBase).hostname.toLowerCase()
        const host = parsed.hostname.toLowerCase()
        if (host !== apiHost && isPrivateOrReservedHost(host)) {
            return null
        }
        return parsed.toString()
    } catch {
        return null
    }
}

/**
 * resolveFaviconMirrorPath 解析 favicon 镜像落盘文件 的绝对路径(模块级缓存, 进程内首次解析后固定).
 * 候选链(按序探测, 全部失败返回 null):
 * 1. 环境变量 NUXT_FAVICON_MIRROR_DIR 显式覆盖(特殊部署布局的逃生口);
 * 2. 相对本源码文件的 ../../public(dev 态: server/utils/favicon.ts -> <root>/public);
 * 3. 相对 node 入口脚本 process.argv[1] 的 ../public(生产态: .output/server/index.mjs -> .output/public,
 *    Docker 内该路径是指向 nginx html 目录的 symlink, node 写入与 nginx 服务同一份文件).
 * 每个候选用"目录存在且含 PUBLIC_DIR_MARKER"收敛, 避免误写任意目录.
 * @returns 镜像文件绝对路径; 无法定位 public 目录时返回 null.
 */
/**
 * safeFileURLToPath 容错版 fileURLToPath.
 * build 态 rolldown 会把 new URL("../../public", import.meta.url) 重写为基址丢失的 file URL
 * (如 file:///public), Windows 下 fileURLToPath 对其抛 ERR_INVALID_FILE_URL_PATH;
 * 解析失败的候选直接跳过(返回 null), 由候选链的后续项(如 argv[1] 推导)接管.
 * @param url 待转换的 file URL.
 * @returns 绝对路径; 无法转换时返回 null.
 */
function safeFileURLToPath(url: URL): string | null {
    try {
        return fileURLToPath(url)
    } catch {
        return null
    }
}

let cachedMirrorPath: string | null | undefined

export function resolveFaviconMirrorPath(): string | null {
    if (cachedMirrorPath !== undefined) {
        return cachedMirrorPath
    }

    const candidates: string[] = []
    if (process.env.NUXT_FAVICON_MIRROR_DIR) {
        candidates.push(process.env.NUXT_FAVICON_MIRROR_DIR)
    }
    // import.meta.url: dev 态是源码文件位置; build 态被 rolldown 重写后可能解析失败(见 safeFileURLToPath),
    // 失败候选跳过, 由 marker 校验兜底
    const devRelative = safeFileURLToPath(new URL("../../public", import.meta.url))
    if (devRelative) {
        candidates.push(devRelative)
    }
    if (process.argv[1]) {
        candidates.push(path.resolve(path.dirname(process.argv[1]), "../public"))
    }

    const matchedDir = candidates.find((dir) => existsSync(path.join(dir, PUBLIC_DIR_MARKER)))
    cachedMirrorPath = matchedDir ? path.join(matchedDir, MIRROR_FILE_NAME) : null
    return cachedMirrorPath
}

/**
 * syncFaviconMirror 从后端 app-option 读取 favicon 配置并同步落盘镜像.
 * 有配置时拉取内容写入 <public>/favicon.ico; 配置为空时删除镜像文件(幂等).
 * @param apiBase 后端直连地址(runtimeConfig.apiBase, 调用方在 nitro 上下文中取).
 * @returns 同步结果(ok=false 时 reason 说明失败环节).
 */
export async function syncFaviconMirror(apiBase: string): Promise<FaviconSyncResult> {
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
        const res = await $fetch<{ code: number; data?: { favicon?: { value?: string } } }>(`${apiBase}/api/v1/setting/get-app-option`, {
            method: "GET",
            timeout: FAVICON_FETCH_TIMEOUT_MS,
            retry: 0,
        })
        faviconValue = res.data?.favicon?.value ?? ""
    } catch (err) {
        return { ok: false, action: "failed", reason: `app-option-fetch-failed: ${err instanceof Error ? err.message : String(err)}` }
    }

    // 未配置 favicon: 删除镜像(不存在时也视为成功, 幂等)
    if (!faviconValue.trim()) {
        await fs.rm(mirrorPath, { force: true })
        return { ok: true, action: "removed" }
    }

    const targetUrl = normalizeFaviconUrl(faviconValue, apiBase)
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
