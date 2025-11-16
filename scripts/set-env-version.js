/*
 * FilePath    : blog-client\scripts\set-env.js
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 根据 git 信息生成环境变量文件
 */

import { execSync } from "child_process"
import fs from "fs"

// 获取 git tag
// 关键步骤：执行 git 命令读取 tag 列表、按语义化版本号筛选最近形如 1.2.3 0.1.2-beta+251113 格式的 tag
const getGitTag = () => {
    try {
        // 执行 shell 命令获取所有 tag, 并按版本排序(最近的在前)
        const out = execSync("git describe --tags --abbrev=0", { encoding: "utf-8" }).trim()

        // console.log("============>out", out)

        if (!out) return "dev"

        // 参考: https://semver.org/lang/zh-CN/
        // 语义化版本号正则 tag(形如 1.2.3 0.1.2-beta+251113)
        // 将输出按行分割、去空并寻找符合语义化版本号格式的 tag
        const tags = out
            .split(/\r?\n/)
            .map((s) => s.trim())
            .filter(Boolean)
        const semverTag = tags.find((t) =>
            /(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-(?:0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*)(?:\.(?:0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*))*)?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/.test(
                t,
            ),
        )

        // console.log("semver 版本号===>", semverTag)

        // 若找到符合的 tag 则返回, 否则返回默认标识
        return semverTag ?? "dev"
    } catch {
        // 出错(如不在 git 仓库)时返回默认标识
        return "dev"
    }
}

// 获取 git commit
// 关键步骤：获取当前 HEAD 的 commit hash, 失败时返回默认值
const getGitCommit = () => {
    try {
        // git rev-parse HEAD 返回当前提交的完整 hash
        return execSync("git rev-parse HEAD", { encoding: "utf-8" }).trim()
    } catch {
        return "dev"
    }
}

// 获取当前时间
// 关键步骤：格式化为 "YYYY-MM-DD HH:mm:ss ±HH:MM"(含时区偏移)
const getBuildTime = () => {
    // 生成当前本地时间各字段
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, "0")
    const day = String(now.getDate()).padStart(2, "0")
    const hours = String(now.getHours()).padStart(2, "0")
    const minutes = String(now.getMinutes()).padStart(2, "0")
    const seconds = String(now.getSeconds()).padStart(2, "0")

    // 计算时区偏移(分钟), 并转换为 ±HH:MM 格式
    const timezoneOffset = -now.getTimezoneOffset()
    const offsetHours = String(Math.floor(Math.abs(timezoneOffset) / 60)).padStart(2, "0")
    const offsetMinutes = String(Math.abs(timezoneOffset) % 60).padStart(2, "0")

    const timezoneSign = timezoneOffset >= 0 ? "+" : "-"
    const timezone = `${timezoneSign}${offsetHours}:${offsetMinutes}`

    // 返回最终格式：YYYY-MM-DD HH:mm:ss ±HH:MM
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} ${timezone}`
}

// 保存 .env.production 文件：如果不存在则创建, 存在则追加新键并覆盖已存在键的值
// 关键步骤：读取现有文件、用正则匹配并替换已存在的键、追加缺失的键、确保以单个换行结尾
const saveEnvFile = (envPath) => {
    const gitTag = getGitTag()
    const gitCommit = getGitCommit()
    const buildTime = getBuildTime()

    const entries = {
        VITE_GIT_TAG: `'${gitTag}'`,
        VITE_GIT_COMMIT: `'${gitCommit}'`,
        VITE_BUILD_TIME: `'${buildTime}'`,
    }

    if (fs.existsSync(envPath)) {
        // 读取现有 .env.production 内容
        const raw = fs.readFileSync(envPath, "utf-8")
        const lines = raw.split(/\r?\n/)

        // 替换已有的键：遍历每行, 用正则检测是否以 key 开头(允许可选的 export 前缀), 若匹配则替换为新的 key=val
        const updated = lines.map((line) => {
            for (const [key, val] of Object.entries(entries)) {
                // 正则说明：允许前导空白, 允许 "export " 前缀, 然后是 key 和等号
                const re = new RegExp(`^\\s*(?:export\\s+)?${key}\\s*=`)
                if (re.test(line)) {
                    return `${key}=${val}` // 覆盖为新的值, 去掉 export 和多余空白
                }
            }
            return line
        })

        // 追加缺失的键：检查每个目标键在更新后的内容中是否存在, 若不存在则追加一行
        for (const [key, val] of Object.entries(entries)) {
            const exists = updated.some((l) => new RegExp(`^\\s*(?:export\\s+)?${key}\\s*=`).test(l))
            if (!exists) updated.push(`${key}=${val}`)
        }

        // 确保文件以单个换行结束：去掉末尾空白再加一个换行
        const newContent = updated.join("\n").replace(/\s+$/g, "") + "\n"
        fs.writeFileSync(envPath, newContent, "utf-8")
    } else {
        // 若文件不存在则创建, 按固定格式写入三行环境变量
        const envContent =
            `
VITE_GIT_TAG=${gitTag}
VITE_GIT_COMMIT=${gitCommit}
VITE_BUILD_TIME=${buildTime}
`.trim() + "\n"
        fs.writeFileSync(envPath, envContent, "utf-8")
    }
}

// 生成产物版本文件
const generateVersionFile = (envPath) => {
    const gitTag = getGitTag()
    // 将 gitTag 写入指定文件
    fs.writeFileSync(envPath, gitTag, "utf-8")
}

// 保存到 .env.development 和 .env.production 文件
saveEnvFile(".env.development")
saveEnvFile(".env.production")

// 生成版本文件到 public/version.txt
generateVersionFile("public/VERSION")
