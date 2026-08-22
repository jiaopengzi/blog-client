/**
 * FilePath    : blog-client\scripts\dns-prefetch.js
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 用于预取链接 package.json 中配置 新增 build-dns
 */

import fs from "fs"
import { glob } from "glob"
import { parse } from "node-html-parser"
import urlRegex from "url-regex-safe"
import { gzipSync } from "zlib"

// 获取外部链接的正则表达式
const urlPattern = /(https?:\/\/[^/]*)/i
const urls = new Set()

/**
 * 判断 hostname 是否属于本地或保留地址, 这些地址不应进入 dns-prefetch.
 * @param {string} hostname 主机名.
 * @returns {boolean} 返回 true 表示应被过滤.
 */
function isIgnoredHostname(hostname) {
    const normalizedHostname = hostname.trim().toLowerCase()

    if (!normalizedHostname) {
        return true
    }

    return ["localhost", "127.0.0.1", "0.0.0.0", "::1"].includes(normalizedHostname)
}

/**
 * 将匹配到的原始 URL 标准化为可用于 dns-prefetch 的 origin.
 * @param {string} rawUrl 原始匹配到的 URL 文本.
 * @returns {string | null} 返回可用 origin, 无效时返回 null.
 */
function normalizePrefetchOrigin(rawUrl) {
    const matchedOrigin = rawUrl.match(urlPattern)?.[1]
    if (!matchedOrigin) {
        return null
    }

    try {
        const parsedUrl = new URL(matchedOrigin)
        const { hostname, origin, protocol } = parsedUrl

        if (!["http:", "https:"].includes(protocol)) {
            return null
        }

        if (isIgnoredHostname(hostname)) {
            return null
        }

        // host 仅允许 ASCII 域名/IP/端口, 避免把示例文本和中文标点误当成域名.
        if (!/^[a-z0-9.-]+$/i.test(hostname)) {
            return null
        }

        if (!hostname.includes(".")) {
            return null
        }

        return origin
    } catch {
        return null
    }
}

// 遍历dist目录中的所有HTML、js、css文件
/**
 * 扫描 dist 产物中的 URL, 收集可用于 dns-prefetch 的外部 origin.
 * @returns {Promise<void>} 扫描完成后无返回值.
 */
async function searchDomain() {
    const files = await glob("dist/**/*.{html,css,js}")
    for (const file of files) {
        const source = fs.readFileSync(file, "utf-8")
        const matches = source.match(urlRegex({ strict: true }))
        if (matches) {
            matches.forEach((rawUrl) => {
                const origin = normalizePrefetchOrigin(rawUrl)
                if (origin) {
                    urls.add(origin)
                }
            })
        }
    }
}

// 检测 <head> 的缩进(通过第一个文本子节点的前导空白)
function detectIndent(headElement) {
    // 遍历子节点, 找第一个文本节点(且包含换行+空格)
    for (const child of headElement.childNodes) {
        if (child.nodeType === 3) {
            const text = child.textContent
            // 查找以换行开头 + 后续空格/制表符(典型缩进)
            const match = text.match(/\n(\s+)/)
            if (match) {
                return match[1] // 返回如 "        " 或 "\t\t"
            }
            // 如果没有换行, 尝试匹配行首空白(适用于单行 head)
            const leadingMatch = text.match(/^(\s+)/)
            if (leadingMatch) {
                return leadingMatch[1]
            }
        }
    }
    // 默认 4 个空格
    return "    "
}

// 在每个 HTML 文件的 <head> 开头插入 dns-prefetch 链接
/**
 * 将收集到的 origin 写入 HTML 的 head 中, 并同步生成 gzip 文件.
 * @returns {Promise<void>} 写入完成后无返回值.
 */
async function insertLinks() {
    const files = await glob("dist/**/*.html")

    for (const file of files) {
        const html = fs.readFileSync(file, "utf-8")
        const root = parse(html)
        const head = root.querySelector("head")

        if (!head || urls.size === 0) continue

        // 自动检测缩进
        const indent = detectIndent(head)

        // 生成带缩进的 prefetch 链接, 第一个前面额外添加换行
        const links = [...urls].map((url, i) => `${i === 0 ? "\n" : ""}${indent}<link rel="dns-prefetch" href="${url}" />`).join("\n")

        // 插入到 <head> 最开始
        head.insertAdjacentHTML("afterbegin", links + "\n")

        // // 插入到 <head> 结束前
        // head.insertAdjacentHTML("beforeend", links)

        // 写回原文件
        const updatedHtml = root.toString()
        fs.writeFileSync(file, updatedHtml)

        // 生成 .gz 压缩版本
        const contentBuffer = Buffer.from(updatedHtml, "utf-8")
        const compressed = gzipSync(contentBuffer, { level: 9 })
        fs.writeFileSync(`${file}.gz`, compressed)
    }
}

async function main() {
    await searchDomain()
    // 在<head>标签中添加预取链接
    await insertLinks()
}

main()
