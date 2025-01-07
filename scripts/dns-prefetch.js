/**
 * @FilePath     : \blog-client\scripts\dns-prefetch.js
 * @Description  : 度一袁老师的短视频，学习到的，用于预取链接 package.json 中配置 新增 build-dns
 */
import fs from "fs"
import { glob } from "glob"
// import path from 'path';
import { parse } from "node-html-parser"
import urlRegex from "url-regex"

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

async function insertLinks() {
    const files = await glob("dist/**/*.html")
    const links = [...urls].map((url) => `<link rel="dns-prefetch" href="${url}" />`).join("\n")

    for (const file of files) {
        const html = fs.readFileSync(file, "utf-8")
        const root = parse(html)
        const head = root.querySelector("head")
        head.insertAdjacentHTML("afterbegin", links)
        fs.writeFileSync(file, root.toString())
    }
}

async function main() {
    await searchDomain()
    // 在<head>标签中添加预取链接
    await insertLinks()
}

main()
