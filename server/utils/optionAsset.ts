/*
 * FilePath    : blog-client-nuxt\server\utils\optionAsset.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : app-option 静态资产镜像共享工具 (bug02 260831-01: favicon/logo 镜像共用)
 */

/*
 * 补充说明:
 * 从 server/utils/favicon.ts 抽离的公共部分, 供 favicon.ico 与 logo.png 两类运行时镜像复用:
 * - public 目录定位(候选链 + marker 收敛);
 * - 配置值 URL 规范化(SSRF 防护: 协议白名单 + 私网/保留段阻断, apiBase 同源例外);
 * - 后端 app-option 配置读取.
 * 镜像各自的落盘/删除/路由服务逻辑见 favicon.ts / logo.ts.
 */

import { existsSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

// public 目录的存在性标记文件(仓库自带, dev/build 产物中均存在), 用于把探测候选收敛到真实 public 目录
export const PUBLIC_DIR_MARKER = "demo-logo.svg"

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

let cachedPublicDir: string | null | undefined

/**
 * resolveOptionPublicDir 解析 app-option 镜像落盘的 public 目录绝对路径(模块级缓存, 进程内首次解析后固定).
 * 候选链(按序探测, 全部失败返回 null):
 * 1. 环境变量 NUXT_FAVICON_MIRROR_DIR 显式覆盖(特殊部署布局的逃生口, 沿用 favicon 镜像既定变量名);
 * 2. 相对本源码文件的 ../../public(dev 态: server/utils/optionAsset.ts -> <root>/public);
 * 3. 相对 node 入口脚本 process.argv[1] 的 ../public(生产态: .output/server/index.mjs -> .output/public,
 *    Docker 内该路径是指向 nginx html 目录的 symlink, node 写入与 nginx 服务同一份文件).
 * 每个候选用"目录存在且含 PUBLIC_DIR_MARKER"收敛, 避免误写任意目录.
 * @returns public 目录绝对路径; 无法定位时返回 null.
 */
export function resolveOptionPublicDir(): string | null {
    if (cachedPublicDir !== undefined) {
        return cachedPublicDir
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

    cachedPublicDir = candidates.find((dir) => existsSync(path.join(dir, PUBLIC_DIR_MARKER))) ?? null
    return cachedPublicDir
}

/**
 * isPrivateOrReservedHost 判断主机名是否落在环回/链路本地/私有/保留段(SSRF 防护).
 * 阻断清单: 环回(本机服务)、169.254.0.0/16(链路本地, 含云元数据 169.254.169.254)、
 * RFC1918 私有段(10/8, 172.16/12, 192.168/16)与保留地址(0.0.0.0, ::).
 * 唯一例外: hostname 与 apiBase 同源的请求不经本函数(部署方配置的后端自身, 私网 apiBase 是合法形态,
 * 且 SSR 层全部数据本就来自该地址), 见 normalizeOptionAssetUrl.
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
 * normalizeOptionAssetUrl 把 app-option 配置的静态资产值(favicon/logo)规范化为可安全请求的绝对地址.
 * 相对路径(/api/v1/uploads/...)拼 apiBase(后端自身, 部署方控制, 不走 SSRF 校验);
 * 绝对 URL 要求 http/https 协议, 且 hostname 与 apiBase 同源(后端自身)或为非私网/非保留地址.
 * @param raw app-option 中资产键的 value.
 * @param apiBase 后端直连地址(runtimeConfig.apiBase).
 * @returns 规范化后的绝对 URL; 不合法时返回 null.
 */
export function normalizeOptionAssetUrl(raw: string, apiBase: string): string | null {
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

    // 绝对 URL: 协议白名单 + 主机校验——hostname 与 apiBase 同源(后端自身, 私网 apiBase 是合法部署形态)放行;
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
 * readAppOptionAssetValue 从后端全量配置中读取指定资产键的 value(与 optionsStore.updateFromServer 同一接口).
 * @param apiBase 后端直连地址(runtimeConfig.apiBase).
 * @param key app-option 中的资产键名(如 favicon / logo).
 * @param timeoutMs 拉取超时毫秒数.
 * @returns 资产 value(未配置/接口异常时返回空字符串, 异常不抛出由调用方决策).
 */
export async function readAppOptionAssetValue(apiBase: string, key: string, timeoutMs: number): Promise<string> {
    const res = await $fetch<{ code: number; data?: Record<string, { value?: string } | undefined> }>(`${apiBase}/api/v1/setting/get-app-option`, {
        method: "GET",
        timeout: timeoutMs,
        retry: 0,
    })
    return res.data?.[key]?.value ?? ""
}
