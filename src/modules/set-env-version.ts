/*
 * FilePath    : blog-client-nuxt\src\modules\set-env-version.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 本地模块: 启动时生成 public/VERSION (由原 scripts/set-env-version.js 前置脚本迁入)
 */

/*
 * 补充说明:
 * Windows 下 pnpm 以 shell 拼接多进程 (node xxx && nuxi dev) 时, Ctrl+C 的信号分发
 * 异常会导致终端卡死; 迁入 Nuxt 生命周期后 pnpm dev 只启动单一 nuxi 进程
 * 模块 setup 在构建/开发服务器启动前执行, 与原先"前置脚本跑完再启动 nuxi"时序等价
 * (build 场景早于 nitro 对 public/ 的产物拷贝)
 * 安全收敛 (2026-08-28 决策): 版本细节最小暴露——仅输出 git tag 到 public/VERSION
 * (外部探活用); gitCommit/buildTime 不再注入任何客户端可见通道
 * (app.config 注入已回退, 原 .env NUXT_PUBLIC_GIT_* 静态行亦已移除)
 */

import { execSync } from "node:child_process"
import fs from "node:fs"
import { isAbsolute, join } from "node:path"

import { defineNuxtModule } from "nuxt/kit"

/**
 * 读取最近一次语义化版本格式的 git tag.
 * 执行 git 命令读取 tag (git describe --tags --abbrev=0), 按语义化版本号筛选
 * 形如 1.2.3 / 0.1.2-beta+251113 的 tag (兼容小写 v 前缀); 失败 (如不在 git 仓库) 回退 "dev".
 * @returns 语义化版本 tag 或 "dev".
 */
const getGitTag = (): string => {
    try {
        const out = execSync("git describe --tags --abbrev=0", { encoding: "utf-8", stdio: ["pipe", "pipe", "pipe"] }).trim()

        if (!out) {
            return "dev"
        }

        // 参考: https://semver.org/lang/zh-CN/
        const tags = out
            .split(/\r?\n/)
            .map((s) => s.trim())
            .filter(Boolean)
        const semverTag = tags.find((t) =>
            /^v?(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-(?:0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*)(?:\.(?:0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*))*)?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/.test(
                t,
            ),
        )

        return semverTag ?? "dev"
    } catch {
        return "dev"
    }
}

export default defineNuxtModule({
    meta: {
        name: "set-env-version",
    },
    setup(_options, nuxt) {
        // 控制台不输出版本信息, 避免被针对 (与原脚本一致)
        // Nuxt 4 的 dir.public 已归一化为绝对路径 (Windows 下 join 会把它当相对路径拼出
        // "盘符:\...\盘符:\..." 的非法路径), 相对形态时再按 rootDir 拼接
        const publicDir = isAbsolute(nuxt.options.dir.public) ? nuxt.options.dir.public : join(nuxt.options.rootDir, nuxt.options.dir.public)
        fs.writeFileSync(join(publicDir, "VERSION"), getGitTag(), "utf-8")
    },
})
