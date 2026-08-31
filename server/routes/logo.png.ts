/*
 * FilePath    : blog-client-nuxt\server\routes\logo.png.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : GET /logo.png 兜底读取镜像文件 (bug02 260831-01 反馈第1轮)
 */

/*
 * 补充说明:
 * public/ 不打包静态 logo.png(公开部署产品, logo 依赖 app-option 配置),
 * /logo.png 由 server/utils/logo.ts 落盘的镜像文件提供(页头 logo 恒定渲染该路径, 见 logo 组件):
 * - dev: nitro dev 的静态服务实时读 public 目录, 镜像写入后可能被静态命中, 否则落到本 handler;
 * - preview/node 直连: nitro 静态服务只认构建期清单(运行时新写入 .output/public 的文件 404, 已实证),
 *   一律由本 handler 读盘返回;
 * - 生产: nginx 以精确规则拦截 /logo.png 实时读容器静态目录(root 与 node 落盘目录经 symlink 同一份),
 *   本 handler 不会被命中, 仅作为无 nginx 层部署形态的兜底.
 * 镜像缺失(未配置 logo / 同步失败, 如后端直连不可达的部署故障窗口)时回退服务同目录的
 * demo-logo.svg 内容(Content-Type 按实际内容给 image/svg+xml, <img> 按类型渲染与扩展名无关),
 * 保证 /logo.png 恒可用的同时不向浏览器控制台输出 404 噪音.
 * 缓存给短周期(1h public): 镜像内容随 admin 配置变化, 不适合长 immutable.
 */

import { createError, defineEventHandler, setResponseHeader } from "h3"
import { readFile } from "node:fs/promises"
import path from "node:path"

import { resolveOptionPublicDir } from "../utils/optionAsset"
import { resolveLogoMirrorPath } from "../utils/logo"

export default defineEventHandler(async (event) => {
    const mirrorPath = resolveLogoMirrorPath()
    if (mirrorPath) {
        try {
            const content = await readFile(mirrorPath)
            setResponseHeader(event, "Content-Type", "image/png")
            setResponseHeader(event, "Cache-Control", "public, max-age=3600")
            return content
        } catch {
            // 镜像文件不存在: 落到下方 demo 兜底
        }
    }

    // 兜底: 服务仓库自带的 demo-logo.svg(与页头 <img> 的 onerror 回退同源, 避免浏览器控制台 404 噪音)
    const publicDir = resolveOptionPublicDir()
    if (publicDir) {
        try {
            const content = await readFile(path.join(publicDir, "demo-logo.svg"))
            setResponseHeader(event, "Content-Type", "image/svg+xml")
            setResponseHeader(event, "Cache-Control", "public, max-age=3600")
            return content
        } catch {
            // 连兜底图都读不到(异常部署形态): 404
        }
    }

    throw createError({ statusCode: 404, message: "logo.png not found" })
})
