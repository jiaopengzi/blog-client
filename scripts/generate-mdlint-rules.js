/**
 * FilePath    : blog-client\scripts\generate-mdlint-rules.js
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 生成 markdown lint 已知规则类型的脚本
 */

import * as fs from "fs"
import * as path from "path"
import { fileURLToPath } from "url"

const currentFilePath = fileURLToPath(import.meta.url)
const currentDirPath = path.dirname(currentFilePath)

// 规则文件目录路径, 用于读取各 rule 文件
const ruleDir = path.join(currentDirPath, "..", "src", "pkg", "codemirror", "extension", "mdlint", "rule")

// types 文件路径, 将在其中替换生成的已知规则类型块
const typesFile = path.join(currentDirPath, "..", "src", "pkg", "codemirror", "extension", "mdlint", "types.ts")

/**
 * 从规则文件内容中提取基本信息。
 *
 * 此函数查找导出的 `id` 常量, 并尝试从文件顶部的注释块或文件任意位置提取 Description 字段。
 *
 * @param {string} fileContent - 规则文件的 TypeScript 源代码内容。
 * @returns {{id: string|undefined, desc: string}} 返回包含规则 id 和描述的对象。
 */
function extractInfo(fileContent) {
    // 提取 export const id = '...' 的值
    const idMatch = fileContent.match(/export\s+const\s+id\s*=\s*["'`]([^"'`]+)["'`]/)

    // 先尝试从文件顶端的注释块中提取 Description: 后面的行
    let description = ""
    const commentBlockMatch = fileContent.match(/\/\*[\s\S]*?\*\//)
    if (commentBlockMatch) {
        const descMatch = commentBlockMatch[0].match(/Description\s*:\s*([^\r\n*]+)/i)
        if (descMatch) description = descMatch[1].trim()
    }

    // fallback: 尝试读取文件中任意位置的 Description 注释
    if (!description) {
        const anyDesc = fileContent.match(/Description\s*:\s*([^\r\n*]+)/i)
        if (anyDesc) description = anyDesc[1].trim()
    }

    // 返回提取的信息
    return { id: idMatch ? idMatch[1] : undefined, desc: description }
}

/**
 * 检测规则文件中 options 的类型定义。
 *
 * 该函数检查源代码内容, 查找内联 opts 类型、命名的 Options 类型、interface 定义或 defaultOptions 的回退。
 *
 * @param {string} fileContent - 规则文件的 TypeScript 源代码内容。
 * @returns {string} 用于规则 options 的 TypeScript 类型表达式。
 */
function detectOptionsType(fileContent) {
    if (!fileContent) return "Record<string, unknown>"

    // 尝试从 run 函数的参数中解析 opts 的内联类型: run(doc: ..., opts: { ... } = {})
    const runInlineMatch = fileContent.match(/export\s+function\s+run\s*\([^)]*?\bopts\s*:\s*({[\s\S]*?})\s*(?:=\s*{[\s\S]*?})?\s*(?:,|\))/m)
    if (runInlineMatch) {
        let t = runInlineMatch[1].replace(/\r?\n/gs, " ").replace(/\s+/g, " ").trim()
        t = t.replace(/\s*=\s*{[\s\S]*}$/, "")
        return t
    }

    // 尝试从 run 函数参数中解析命名类型: run(doc, opts: Options)
    const runNamedMatch = fileContent.match(/export\s+function\s+run\s*\([^)]*?\bopts\s*:\s*([A-Za-z0-9_]+)/m)
    if (runNamedMatch) {
        const typeName = runNamedMatch[1]
        // 查找同文件中对应的 type/interface 定义
        const typeDefMatch = fileContent.match(new RegExp(`(?:export\\s+)?type\\s+${typeName}\\s*=\\s*({[\\s\\S]*?})`, "m"))
        if (typeDefMatch) return typeDefMatch[1].replace(/\r?\n/gs, " ").replace(/\s+/g, " ").trim()
        const ifaceDefMatch = fileContent.match(new RegExp(`(?:export\\s+)?interface\\s+${typeName}\\s*({[\\s\\S]*?})`, "m"))
        if (ifaceDefMatch) return ifaceDefMatch[1].replace(/\r?\n/gs, " ").replace(/\s+/g, " ").trim()
    }

    // 先查找 export type Options = { ... }
    const typeMatch = fileContent.match(/export\s+type\s+Options\s*=\s*({[\s\S]*?})/m)
    if (typeMatch) {
        const t = typeMatch[1].replace(/\r?\n/gs, " ").replace(/\s+/g, " ").trim()
        return t
    }

    // 再查找 export interface Options { ... }
    const ifaceMatch = fileContent.match(/export\s+interface\s+Options\s*({[\s\S]*?})/m)
    if (ifaceMatch) {
        const t = ifaceMatch[1].replace(/\r?\n/gs, " ").replace(/\s+/g, " ").trim()
        return t
    }

    // 最后尝试查找 export const defaultOptions = { ... }
    const defaultMatch = fileContent.match(/export\s+const\s+defaultOptions\s*[:=]\s*({[\s\S]*?})/m)
    if (defaultMatch) {
        return "Record<string, unknown>"
    }

    return "Record<string, unknown>"
}

/**
 * 为规则信息对象构建 TypeScript 类型条目字符串。
 *
 * @param {{id: string|undefined, desc: string, content?: string}} info - 从规则文件提取的信息对象。
 * @returns {string} 要插入到生成类型块中的格式化条目; 如果未找到 id 则返回空字符串。
 */
function buildEntry(info) {
    const id = info.id
    const desc = (info.desc || "").replace(/\r?\n/g, " ")
    if (!id) return ""
    const typeStr = detectOptionsType(info.content)
    return `    /**\n     * ${id}: ${desc}\n     */\n    ${id}: ${typeStr}`
}

function main() {
    // 确保规则目录存在
    if (!fs.existsSync(ruleDir)) {
        console.error("rule dir not found:", ruleDir)
        process.exit(1)
    }

    // 读取规则目录下的所有 .ts 文件, 提取信息并排序
    const files = fs
        .readdirSync(ruleDir)
        .filter((f) => f.endsWith(".ts"))
        // oxlint-disable-next-line unicorn/no-array-sort
        .sort()
    const entries = files
        .map((f) => {
            const p = path.join(ruleDir, f)
            const content = fs.readFileSync(p, "utf8")
            const info = extractInfo(content)
            if (!info) return null
            info.content = content
            return info
        })
        .filter(Boolean)

    // 每个条目使用单个空行分隔, 避免累积多空行
    const generated = entries.map(buildEntry).filter(Boolean).join("\n\n")

    // 读取目标 types 文件的当前内容, 以便在标记区间内替换生成块
    const typesContent = fs.readFileSync(typesFile, "utf8")
    const startMarker = "// @generated-mdlint-rules-start"
    const endMarker = "// @generated-mdlint-rules-end"

    // 使用正则替换, 确保替换的是两个 marker 之间的全部内容
    // 匹配可能带缩进的两条 marker 行, 使用多行模式 (^ 和 $ 匹配行首/行尾)
    // 逐行查找 marker, 避免匹配注释中的示例(例如 `// @generated-mdlint-rules-start`)
    const eol = typesContent.indexOf("\r\n") !== -1 ? "\r\n" : "\n"
    const lines = typesContent.split(eol)
    const startLine = lines.findIndex((l) => l.trim() === startMarker)
    const endLine = lines.findIndex((l, i) => i > startLine && l.trim() === endMarker)
    if (startLine === -1 || endLine === -1) {
        console.error("Markers not found or malformed in types.ts")
        process.exit(1)
    }

    // 规范化生成块：统一为文件的 EOL、把超过两个空行合并为最多两个、并修剪首尾空白
    let normalized = generated.replace(/\r\n|\r|\n/g, eol)
    const multiBlankRegex = new RegExp(`(${eol}){3,}`, "g")
    normalized = normalized.replace(multiBlankRegex, eol + eol)

    // 仅去除首尾的空行(包括只含空白的空行), 保留首条规则自身的缩进
    const leadingBlankLines = new RegExp(`^(?:[ \t]*(?:\r\n|\r|\n))+`)
    const trailingBlankLines = new RegExp(`(?:[ \t]*(?:\r\n|\r|\n))+$`)
    normalized = normalized.replace(leadingBlankLines, "")
    normalized = normalized.replace(trailingBlankLines, "")
    const spacer = normalized ? eol + eol : ""

    // 计算字符索引以进行安全替换：保留 startMarker 行(含换行), 从 endMarker 行开始保留后半部分
    let charPos = 0
    let startSliceEnd = 0
    let endSliceStart = 0
    for (let i = 0; i < lines.length; i++) {
        const lineLen = lines[i].length
        const nextPos = charPos + lineLen + eol.length
        if (i === startLine) startSliceEnd = nextPos
        if (i === endLine) {
            endSliceStart = charPos
            break
        }
        charPos = nextPos
    }

    // 构建新的文件内容并写回文件
    const newContent = typesContent.slice(0, startSliceEnd) + (normalized ? normalized + spacer : "") + typesContent.slice(endSliceStart)
    fs.writeFileSync(typesFile, newContent, "utf8")
    console.log("Updated KnownRules in", typesFile)
}

main()
