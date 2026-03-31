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
import urlRegex from "url-regex"
import { gzipSync } from "zlib"

// 获取外部链接的正则表达式
const urlPattern = /(https?:\/\/[^/]*)/i
const urls = new Set()

// 遍历dist目录中的所有HTML、js、css文件
async function searchDomain() {
    const files = await glob("dist/**/*.{html,css,js}")
    for (const file of files) {
        const source = fs.readFileSync(file, "utf-8")
        const matches = source.match(urlRegex({ strict: true }))
        if (matches) {
            matches.forEach((url) => {
                const match = url.match(urlPattern)
                if (match && match[1]) {
                    urls.add(match[1])
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
