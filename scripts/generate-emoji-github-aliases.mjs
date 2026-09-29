/**
 * FilePath    : blog-client\scripts\generate-emoji-github-aliases.mjs
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 生成或校验 GitHub 风格 emoji alias 数据文件
 */

/**
 * 补充说明:
 * 1. 刷新 alias 文件: `pnpm generate:emoji-github-aliases`.
 * 2. 校验当前文件与生成结果是否一致: `pnpm check:emoji-github-aliases`.
 * 3. 该脚本依赖已安装的 `emoji.json` 与 `vue3-emoji-picker` 产物, 用于避免手工维护大表.
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs"
import { createRequire } from "node:module"
import { fileURLToPath } from "node:url"

const require = createRequire(import.meta.url)
const GENERATE_COMMAND = "pnpm generate:emoji-github-aliases"
const CHECK_COMMAND = "pnpm check:emoji-github-aliases"
const MIN_EXPECTED_ALIAS_COUNT = 1000
const REQUIRED_ALIAS_CODE_MAP = {
    smile: "1f604",
    thumbsup: "1f44d",
    broken_heart: "1f494",
    thinking_face: "1f914",
    zany_face: "1f92a",
}

/**
 * normalizeEmojiName 统一 emoji 名称比较键.
 * @param value 原始名称或 alias.
 * @returns 去除首尾空白并压缩空白后的名称键.
 */
function normalizeEmojiName(value) {
    return value.trim().toLowerCase().replace(/\s+/g, " ")
}

/**
 * normalizeEmojiCode 统一 Unicode 码位比较键.
 * @param value 原始 Unicode 码位.
 * @returns 转小写并将空格或下划线规范成连字符后的码位键.
 */
function normalizeEmojiCode(value) {
    return value
        .trim()
        .toLowerCase()
        .replace(/[\s_]+/g, "-")
}

/**
 * collectOfficialEmojiMaps 从 emoji.json 构建官方名称与字符索引.
 * 同一码位或名称存在文本态与 emoji 变体时, 优先保留长度更长的字符表示,
 * 以保证生成的 alias 文件尽量落到完整 emoji 变体.
 * @param emojiItems emoji.json 原始条目数组.
 * @returns 官方名称到字符, 以及码位到字符的索引表.
 */
function collectOfficialEmojiMaps(emojiItems) {
    const officialNameToEmoji = new Map()
    const codeToEmoji = new Map()

    emojiItems.forEach((item) => {
        const normalizedCode = normalizeEmojiCode(String(item.codes))
        const normalizedName = normalizeEmojiName(String(item.name))

        const currentEmojiByCode = codeToEmoji.get(normalizedCode)
        if (!currentEmojiByCode || currentEmojiByCode.length < item.char.length) {
            codeToEmoji.set(normalizedCode, item.char)
        }

        const currentEmojiByName = officialNameToEmoji.get(normalizedName)
        if (!currentEmojiByName || currentEmojiByName.length < item.char.length) {
            officialNameToEmoji.set(normalizedName, item.char)
        }
    })

    return {
        officialNameToEmoji,
        codeToEmoji,
    }
}

/**
 * extractGithubAliasEntries 从 vue3-emoji-picker 的 bundle 提取 GitHub 风格 alias.
 * 只保留 emoji.json 官方名称之外的 alias, 以免重复生成官方名称键.
 * @param pickerBundleText vue3-emoji-picker 打包产物文本.
 * @param officialNameToEmoji 官方名称到字符索引.
 * @param codeToEmoji Unicode 码位到字符索引.
 * @returns 已排序的 alias 到码位键值对数组.
 */
function extractGithubAliasEntries(pickerBundleText, officialNameToEmoji, codeToEmoji) {
    const aliasMap = new Map()
    const pickerEmojiPattern = /\{\s*n:\s*\[(.*?)\],\s*u:\s*"([^"]+)"(?:,\s*v:\s*\[(.*?)\])?\s*\}/gs

    for (const match of pickerBundleText.matchAll(pickerEmojiPattern)) {
        const names = Function(`"use strict"; return [${match[1]}];`)()
        const normalizedCode = normalizeEmojiCode(match[2])
        const emojiChar = codeToEmoji.get(normalizedCode)
        if (!emojiChar) {
            continue
        }

        const aliasCandidates = names.length > 1 ? names.slice(1) : names
        aliasCandidates.forEach((name) => {
            const normalizedName = normalizeEmojiName(String(name))
            if (officialNameToEmoji.get(normalizedName) === emojiChar) {
                return
            }

            if (!aliasMap.has(normalizedName)) {
                aliasMap.set(normalizedName, normalizedCode)
            }
        })
    }

    return [...aliasMap.entries()].toSorted((left, right) => left[0].localeCompare(right[0]))
}

/**
 * buildAliasFileContent 生成 alias 文件源码.
 * @param aliasEntries 已排序的 alias 到码位键值对数组.
 * @returns 可直接写入目标文件的 TypeScript 源码文本.
 */
function buildAliasFileContent(aliasEntries) {
    return [
        "/**",
        " * FilePath    : blog-client\\src\\utils\\emojiGithubAliases.ts",
        " * Author      : jiaopengzi",
        " * Blog        : https://jiaopengzi.com",
        " * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.",
        " * Description : GitHub 风格 emoji 短码到 Unicode 码位的映射表",
        " */",
        "",
        "// 该表提取自本地 vue3-emoji-picker 携带的 emoji-datasource 别名集;",
        "// 仅保留 emoji.json 官方名称之外的 GitHub 风格短码, 避免运行时依赖第三方 dist 内部结构.",
        `// 如需刷新该文件, 请执行: ${GENERATE_COMMAND}`,
        `// 如需校验该文件是否与当前依赖产物一致, 请执行: ${CHECK_COMMAND}`,
        "export const githubStyleEmojiAliasCodeMap = {",
        ...aliasEntries.map(([alias, code]) => `    ${JSON.stringify(alias)}: ${JSON.stringify(code)},`),
        "} as const",
        "",
    ].join("\n")
}

/**
 * assertAliasEntriesHealth 校验提取结果是否仍符合预期.
 * 未来若 vue3-emoji-picker 的 bundle 结构变化, 正则提取最容易悄悄退化为少量结果或缺关键 alias;
 * 这里用最低数量和若干哨兵 alias 双重校验, 尽早在 generate/check 阶段失败.
 * @param aliasEntries 已排序的 alias 到码位键值对数组.
 * @returns 无返回值; 失败时抛出 Error.
 */
function assertAliasEntriesHealth(aliasEntries) {
    if (aliasEntries.length < MIN_EXPECTED_ALIAS_COUNT) {
        throw new Error(
            `提取出的 GitHub emoji alias 数量异常: ${aliasEntries.length}. 预期至少 ${MIN_EXPECTED_ALIAS_COUNT}. 请检查 vue3-emoji-picker bundle 结构是否变化.`,
        )
    }

    const aliasCodeMap = Object.fromEntries(aliasEntries)
    Object.entries(REQUIRED_ALIAS_CODE_MAP).forEach(([alias, expectedCode]) => {
        if (aliasCodeMap[alias] !== expectedCode) {
            throw new Error(`关键 alias 校验失败: ${alias} => ${aliasCodeMap[alias] ?? "<missing>"}, 预期 ${expectedCode}.`)
        }
    })
}

/**
 * resolveScriptMode 解析脚本运行模式.
 * @param argv 命令行参数列表, 不含 node 与脚本路径本身.
 * @returns `generate`, `check` 或 `help`.
 */
function resolveScriptMode(argv) {
    if (argv.includes("--help") || argv.includes("-h")) {
        return "help"
    }

    if (argv.includes("--check")) {
        return "check"
    }

    return "generate"
}

/**
 * printUsage 输出脚本使用说明.
 * @returns 无返回值.
 */
function printUsage() {
    console.log(
        [
            "GitHub emoji alias 生成脚本用法:",
            `- 刷新文件: ${GENERATE_COMMAND}`,
            `- 快照校验: ${CHECK_COMMAND}`,
            "- 直接查看帮助: node ./scripts/generate-emoji-github-aliases.mjs --help",
        ].join("\n"),
    )
}

/**
 * formatSuccessMessage 生成 generate/check 成功时的人类可读输出.
 * @param mode 当前脚本模式.
 * @param aliasCount 本次提取到的 alias 数量.
 * @param outputFilePath 目标文件绝对路径.
 * @returns 适合直接输出到终端的人类可读多行文本.
 */
function formatSuccessMessage(mode, aliasCount, outputFilePath) {
    const title = mode === "check" ? "emoji GitHub alias 校验通过." : "emoji GitHub alias 已生成."
    const nextStepLine = mode === "check" ? `- 如需刷新文件: ${GENERATE_COMMAND}` : `- 如需执行快照校验: ${CHECK_COMMAND}`

    return [title, `- alias 数量: ${aliasCount}`, `- 目标文件: ${outputFilePath}`, nextStepLine].join("\n")
}

/**
 * formatFailureMessage 生成 generate/check 失败时的人类可读输出.
 * @param mode 当前脚本模式.
 * @param error 捕获到的原始错误对象.
 * @param outputFilePath 目标文件绝对路径.
 * @returns 适合直接输出到终端的人类可读多行文本.
 */
function formatFailureMessage(mode, error, outputFilePath) {
    const title = mode === "check" ? "emoji GitHub alias 校验失败." : "emoji GitHub alias 生成失败."

    if (mode === "check" && error instanceof Error && error.message === "OUTPUT_FILE_MISSING") {
        return [title, `- 原因: 目标文件不存在: ${outputFilePath}`, `- 处理: 请先执行 ${GENERATE_COMMAND}`].join("\n")
    }

    if (mode === "check" && error instanceof Error && error.message === "OUTPUT_FILE_STALE") {
        return [title, "- 原因: 当前文件与最新依赖产物生成结果不一致.", `- 处理: 请先执行 ${GENERATE_COMMAND}`].join("\n")
    }

    const reason = error instanceof Error ? error.message : String(error)
    return [title, `- 原因: ${reason}`].join("\n")
}

const mode = resolveScriptMode(process.argv.slice(2))

if (mode === "help") {
    printUsage()
} else {
    const outputFileUrl = new URL("../src/utils/emojiGithubAliases.ts", import.meta.url)
    const outputFilePath = fileURLToPath(outputFileUrl)

    try {
        const emojiJson = require("emoji.json")
        const pickerBundlePath = require.resolve("vue3-emoji-picker")
        const pickerBundleText = readFileSync(pickerBundlePath, "utf8")

        const { officialNameToEmoji, codeToEmoji } = collectOfficialEmojiMaps(emojiJson)
        const aliasEntries = extractGithubAliasEntries(pickerBundleText, officialNameToEmoji, codeToEmoji)
        assertAliasEntriesHealth(aliasEntries)

        const nextContent = buildAliasFileContent(aliasEntries)

        if (mode === "check") {
            if (!existsSync(outputFilePath)) {
                throw new Error("OUTPUT_FILE_MISSING")
            }

            const currentContent = readFileSync(outputFilePath, "utf8")
            if (currentContent !== nextContent) {
                throw new Error("OUTPUT_FILE_STALE")
            }
        } else {
            writeFileSync(outputFilePath, nextContent, "utf8")
        }

        console.log(formatSuccessMessage(mode, aliasEntries.length, outputFilePath))
    } catch (error) {
        console.error(formatFailureMessage(mode, error, outputFilePath))
        process.exitCode = 1
    }
}
