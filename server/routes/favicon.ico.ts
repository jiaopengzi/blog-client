/*
 * FilePath    : blog-client-nuxt\server\routes\favicon.ico.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : GET /favicon.ico 兜底读取镜像文件 (bug05 260831-01 重构)
 */

/*
 * 补充说明:
 * public/ 不再打包静态 favicon.ico(公开部署产品, favicon 依赖 app-option 配置),
 * /favicon.ico 由 server/utils/favicon.ts 落盘的镜像文件提供:
 * - dev: nitro dev 的静态服务实时读 public 目录, 镜像写入后可能被静态命中, 否则落到本 handler;
 * - preview/node 直连: nitro 静态服务只认构建期清单(运行时新写入 .output/public 的文件 404, 已实证),
 *   一律由本 handler 读盘返回;
 * - 生产: nginx 以精确规则拦截 /favicon.ico 实时读容器静态目录(root 与 node 落盘目录经 symlink 同一份),
 *   本 handler 不会被命中, 仅作为无 nginx 层部署形态的兜底.
 * 缓存给短周期(1h public): 镜像内容随 admin 配置变化, 不适合长 immutable.
 */

import { createError, defineEventHandler, setResponseHeader } from "h3"
import { readFile } from "node:fs/promises"

import { resolveFaviconMirrorPath } from "../utils/favicon"

export default defineEventHandler(async (event) => {
    const mirrorPath = resolveFaviconMirrorPath()
    if (!mirrorPath) {
        throw createError({ statusCode: 404, message: "favicon.ico not configured" })
    }

    try {
        const content = await readFile(mirrorPath)
        setResponseHeader(event, "Content-Type", "image/vnd.microsoft.icon")
        setResponseHeader(event, "Cache-Control", "public, max-age=3600")
        return content
    } catch {
        // 镜像文件不存在(未配置 favicon 或同步失败): 404, 浏览器回退默认图标
        throw createError({ statusCode: 404, message: "favicon.ico not found" })
    }
})
