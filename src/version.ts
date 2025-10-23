/**
 * @FilePath     : \blog-client\src\version.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 版本信息
 */

import pkg from "../package.json"

// 版本信息类型接口
export interface VersionInfo {
    name: string
    version: string
    description: string
    author: string
    license: string
    homepage: string
    repository: string
    commit: string
    buildTime: string
}

// 获取版本信息函数
export function getVersionInfo(): VersionInfo {
    // 版本信息对象
    const versionInfo: VersionInfo = {
        name: pkg.name,
        version: import.meta.env.VITE_GIT_TAG,
        description: pkg.description,
        author: pkg.author,
        license: pkg.license,
        homepage: pkg.homepage,
        repository: pkg.repository.url,
        commit: import.meta.env.VITE_GIT_COMMIT,
        buildTime: import.meta.env.VITE_BUILD_TIME,
    }

    return versionInfo
}

// 控制台输出项目信息函数
export function consoleInfoFormat() {
    // 获取版本信息
    const info = getVersionInfo()

    // 定义样式
    const styleName = ["color: #1E2858; background-color:#c89828; font-size: 24px; font-weight: bold; border-radius: 4px;"] // name 样式

    // 根据 info 有多少字段 定义多少 style
    const count = Object.keys(info).length - 1 // 减去 name 字段
    const styleOther = Array(count).fill("font-size: 14px;")

    // 样式列表
    const styleList = [...styleName, ...styleOther]

    // 将 info 对象转换为数组 计算最长的字段名
    const infoList = Object.entries(info)

    // 计算最长的字段名
    const longestKeyLength =
        infoList.reduce((acc, [key]) => {
            return Math.max(acc, key.length)
        }, 0) + 1

    // 通过 infoList 使用 padEnd() 方法填充空格以使冒号右对齐
    const logContent = infoList.reduce((acc, [key, value]) => {
        // 如果key是name 不拼接Key 和冒号
        if (key === "name") {
            return `${acc}%c${value}\n`
        }
        return `${acc}%c${key.padEnd(longestKeyLength)}: ${value}\n`
    }, "")

    console.info(logContent, ...styleList)
}
