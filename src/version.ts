/*
 * FilePath    : blog-client-nuxt\src\version.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 提供版本信息与控制台输出
 */

/*
 * 补充说明:
 * 安全收敛(2026-08-28 决策): 版本细节最小暴露——gitTag 仅经 public/VERSION
 * 文件对外(外部探活/网关用), gitCommit/buildTime 不再进入客户端产物与
 * app.config/runtimeConfig(原 P1-7 的注入已回退); VersionInfo 仅保留
 * package.json 的静态元信息, 控制台横幅内容不变
 */

import pkg from "../package.json"

// Nuxt 适配: package.json 可能缺少 homepage/repository 字段(SPA 有), 缺省给空串
const pkgAny = pkg as Record<string, unknown> & { repository?: { url?: string } }

// 版本信息类型接口
export interface VersionInfo {
    name: string
    description: string
    author: string
    license: string
    homepage: string
    repository: string
}

// 获取版本信息函数
export function getVersionInfo(): VersionInfo {
    // 版本信息对象
    const versionInfo: VersionInfo = {
        name: pkg.name,
        description: pkg.description,
        author: pkg.author,
        license: pkg.license,
        homepage: (pkgAny.homepage as string) ?? "",
        repository: pkgAny.repository?.url ?? "",
    }

    return versionInfo
}

// 单次输出守卫: 对齐 SPA main.ts 的"应用启动只打印一次"语义
// Nuxt 下首页组件在路由切换(如详情页返回首页)时会重新挂载, onMounted 会再次触发;
// 模块级标记保证整个应用生命周期内只打印一次, 避免控制台重复输出
let consoleInfoLogged = false

// 控制台输出项目信息函数
export function consoleInfoFormat() {
    // 已打印过则跳过(保证全应用只输出一次)
    if (consoleInfoLogged) {
        return
    }
    consoleInfoLogged = true

    // 获取版本信息
    const info = getVersionInfo()

    // 定义样式
    const styleName = ["color: #1E2858; background-color:#c89828; font-size: 24px; font-weight: bold; border-radius: 4px;"] // name 样式

    // 根据 info 有多少字段 定义多少 style
    const count = Object.keys(info).length - 1 // 减去 name 字段
    const styleOther = Array(count).fill("font-size: 14px;")

    // 样式列表
    const styleList = [...styleName, ...styleOther]

    // 将 info 对象转换为数组
    const infoList = Object.entries(info)

    // 计算最长的字段名
    const longestKeyLength =
        infoList.reduce((acc, [key]) => {
            return Math.max(acc, key.length)
        }, 0) + 1

    // 通过 infoList 使用 padEnd() 填充空格以使冒号右对齐
    const logContent = infoList.reduce((acc, [key, value]) => {
        // 如果 key 是 name, 不拼接 key 和冒号
        if (key === "name") {
            return `${acc}%c${value}\n`
        }
        return `${acc}%c${key.padEnd(longestKeyLength)}: ${value}\n`
    }, "")

    console.info(logContent, ...styleList)
}
