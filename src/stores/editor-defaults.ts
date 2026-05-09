/*
 * FilePath    : blog-client\src\stores\editor-defaults.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : markdown 编辑器插入默认值的存储与构建工具函数
 */

import { LocalStorageKey } from "@/stores/local"

// PowerBI 插入默认值
export interface PowerBiDefaults {
    maskcolor: string
}

export type VimKeyMappingContext = "normal" | "insert" | "visual"

// Vim 快捷键映射项
export interface VimKeyMapping {
    lhs: string
    rhs: string
    context?: VimKeyMappingContext
}

// Vim 默认值
export interface VimDefaults {
    enabled: boolean
    mappings: VimKeyMapping[]
}

// WechatCaptcha 插入默认值
export interface WechatCaptchaDefaults {
    name: string
    codeurl: string
}

// PowerBi 静态回退内容
const POWER_BI_FALLBACK_CONTENT = '<power-bi src="" maskcolor=""></power-bi>'

// Vim 默认用户映射为空, 表示保持原生 Vim 行为.
export const DEFAULT_VIM_MAPPINGS: ReadonlyArray<VimKeyMapping> = Object.freeze([])

// WechatCaptcha 静态回退前缀
const WECHAT_CAPTCHA_FALLBACK_PREFIX =
    '\n<wechat-captcha name="您的公众号名称" codeurl="您的公众号二维码链接" key="您在公众号回复用户的验证码" reply="用户需要在公众号回复获取验证码的内容">\n\n'

/**
 * cloneVimMappings 复制一份 Vim 映射数组, 避免共享引用被意外修改.
 * @param mappings - 待复制的映射数组.
 * @returns 新的映射数组.
 */
function cloneVimMappings(mappings: ReadonlyArray<VimKeyMapping>): VimKeyMapping[] {
    return mappings.map((mapping) => ({ lhs: mapping.lhs, rhs: mapping.rhs, ...(mapping.context ? { context: mapping.context } : {}) }))
}

/**
 * normalizeVimMappingContext 标准化单条 Vim 映射的上下文字段.
 * 仅校验上下文合法性, 旧数据缺省 context 时保持省略态以兼容历史存储.
 * @param context - 原始上下文值.
 * @returns 标准化后的上下文, 非法或缺省时返回 undefined.
 */
function normalizeVimMappingContext(context: string | undefined): VimKeyMappingContext | undefined {
    const trimmedContext = context?.trim()

    if (!trimmedContext) {
        return undefined
    }

    if (trimmedContext === "normal" || trimmedContext === "insert" || trimmedContext === "visual") {
        return trimmedContext
    }

    return undefined
}

/**
 * resolveVimMappingContext 为单条 Vim 映射解析最终上下文.
 * 新格式优先使用显式 context, 旧格式缺省时继续兼容 `<Esc>` => `insert` 的历史推断, 其他场景默认落到 `normal`.
 * @param mapping - 单条 Vim 映射.
 * @returns 最终上下文.
 */
function resolveVimMappingContext(mapping: Readonly<VimKeyMapping>): VimKeyMappingContext {
    const normalizedContext = normalizeVimMappingContext(mapping.context)

    if (normalizedContext) {
        return normalizedContext
    }

    return mapping.rhs.trim() === "<Esc>" ? "insert" : "normal"
}

/**
 * stringifyVimMappingLine 将单条 Vim 映射序列化为括号调用式文本.
 * @param mapping - 单条 Vim 映射.
 * @returns 序列化后的单行文本.
 */
function stringifyVimMappingLine(mapping: Readonly<VimKeyMapping>): string {
    const lhs = mapping.lhs.trim()
    const rhs = mapping.rhs.trim()
    const context = resolveVimMappingContext(mapping)
    const serializedArgs = [JSON.stringify(lhs), JSON.stringify(rhs), JSON.stringify(context)]

    return `(${serializedArgs.join(", ")})`
}

/**
 * parseTupleVimMappingLine 解析括号调用式的 Vim 映射文本.
 * @param line - 当前行文本.
 * @param lineNumber - 当前行号, 用于错误提示.
 * @returns 解析成功时返回映射对象, 非括号格式返回 null.
 * @throws 当括号格式不合法时抛出错误.
 */
function parseTupleVimMappingLine(line: string, lineNumber: number): VimKeyMapping | null {
    if (!line.startsWith("(") || !line.endsWith(")")) {
        return null
    }

    try {
        const parsedArgs = JSON.parse(`[${line.slice(1, -1)}]`) as unknown

        if (!Array.isArray(parsedArgs) || (parsedArgs.length !== 2 && parsedArgs.length !== 3)) {
            throw new Error("invalid tuple length")
        }

        const [lhs, rhs, context] = parsedArgs

        if (typeof lhs !== "string" || typeof rhs !== "string") {
            throw new Error("lhs or rhs must be string")
        }

        if (context !== undefined && context !== "normal" && context !== "insert" && context !== "visual") {
            throw new Error("invalid context")
        }

        return { lhs, rhs, ...(context ? { context } : {}) }
    } catch {
        throw new Error(`第 ${lineNumber} 行格式无效, 请使用 ("lhs", "rhs", "normal") 这类完整格式.`)
    }
}

/**
 * getDefaultVimDefaults 返回默认 Vim 配置对象.
 * 用户自定义映射默认为空, 表示保持原生 Vim 行为.
 * @param enabled - 是否默认开启 Vim 模式.
 * @returns VimDefaults 对象.
 */
export function getDefaultVimDefaults(enabled: boolean = false): VimDefaults {
    return {
        enabled,
        mappings: cloneVimMappings(DEFAULT_VIM_MAPPINGS),
    }
}

/**
 * normalizeVimMappings 标准化 Vim 映射数组.
 * 会去除空白键值, 并按 `context + lhs` 去重, 以最后一次输入为准.
 * @param mappings - 原始映射数组.
 * @returns 规整后的映射数组.
 */
export function normalizeVimMappings(mappings: ReadonlyArray<VimKeyMapping>): VimKeyMapping[] {
    const normalizedMappingMap = new Map<string, VimKeyMapping>()

    for (const mapping of mappings) {
        const lhs = mapping.lhs.trim()
        const rhs = mapping.rhs.trim()
        const context = normalizeVimMappingContext(mapping.context)
        const resolvedContext = resolveVimMappingContext({ lhs, rhs, ...(context ? { context } : {}) })

        if (!lhs || !rhs) {
            continue
        }

        normalizedMappingMap.set(`${resolvedContext}:${lhs}`, { lhs, rhs, context: resolvedContext })
    }

    return Array.from(normalizedMappingMap.values())
}

/**
 * buildVimMappingText 将映射数组转换为多行文本, 供设置表单回填.
 * @param mappings - Vim 映射数组.
 * @returns 多行文本.
 */
export function buildVimMappingText(mappings: ReadonlyArray<VimKeyMapping>): string {
    return mappings
        .map((mapping) => ({ lhs: mapping.lhs.trim(), rhs: mapping.rhs.trim(), context: mapping.context }))
        .filter((mapping) => Boolean(mapping.lhs) && Boolean(mapping.rhs))
        .map((mapping) => stringifyVimMappingLine(mapping))
        .join("\n")
}

/**
 * parseVimMappingText 将多行文本解析为 Vim 映射数组.
 * 推荐使用 `("lhs", "rhs", "normal")` 这类完整格式, 同时兼容旧的 `lhs rhs` 与 `lhs => rhs` 写法.
 * @param text - 表单中的多行文本.
 * @returns 解析后的映射数组.
 * @throws 当存在非法行格式时抛出错误.
 */
export function parseVimMappingText(text: string): VimKeyMapping[] {
    const lines = text.split(/\r?\n/)
    const mappings: VimKeyMapping[] = []

    for (const [index, line] of lines.entries()) {
        const trimmedLine = line.trim()

        if (!trimmedLine) {
            continue
        }

        const tupleMapping = parseTupleVimMappingLine(trimmedLine, index + 1)

        if (tupleMapping) {
            mappings.push(tupleMapping)
            continue
        }

        let lhs = ""
        let rhs = ""

        if (trimmedLine.includes("=>")) {
            const separatorIndex = trimmedLine.indexOf("=>")
            lhs = trimmedLine.slice(0, separatorIndex).trim()
            rhs = trimmedLine.slice(separatorIndex + 2).trim()
        } else {
            const segments = trimmedLine.split(/\s+/)
            lhs = segments.shift()?.trim() ?? ""
            rhs = segments.join(" ").trim()
        }

        if (!lhs || !rhs) {
            throw new Error(`第 ${index + 1} 行格式无效, 请使用 ("lhs", "rhs", "normal") 这类完整格式.`)
        }

        mappings.push({ lhs, rhs })
    }

    return normalizeVimMappings(mappings)
}

/**
 * saveVimDefaults 将 Vim 配置保存到 localStorage.
 * @param defaults - VimDefaults 对象.
 */
export function saveVimDefaults(defaults: VimDefaults): void {
    const sanitizedDefaults: VimDefaults = {
        enabled: defaults.enabled,
        mappings: normalizeVimMappings(defaults.mappings),
    }

    localStorage.setItem(LocalStorageKey.EditorDefaultsVim, JSON.stringify(sanitizedDefaults))
}

/**
 * 将 PowerBi 默认值保存到 localStorage.
 * @param defaults - PowerBiDefaults 对象
 */
export function savePowerBiDefaults(defaults: PowerBiDefaults): void {
    localStorage.setItem(LocalStorageKey.EditorDefaultsPowerBi, JSON.stringify(defaults))
}

/**
 * 将 WechatCaptcha 默认值保存到 localStorage.
 * @param defaults - WechatCaptchaDefaults 对象
 */
export function saveWechatCaptchaDefaults(defaults: WechatCaptchaDefaults): void {
    localStorage.setItem(LocalStorageKey.EditorDefaultsWechatCaptcha, JSON.stringify(defaults))
}

/**
 * 从 localStorage 读取 PowerBi 默认值.
 * @returns PowerBiDefaults 或 null(键不存在或解析失败时)
 */
export function loadPowerBiDefaults(): PowerBiDefaults | null {
    const raw = localStorage.getItem(LocalStorageKey.EditorDefaultsPowerBi)
    if (!raw) return null
    try {
        return JSON.parse(raw) as PowerBiDefaults
    } catch {
        return null
    }
}

/**
 * 从 localStorage 读取 Vim 默认值.
 * @returns VimDefaults 或 null(键不存在或解析失败时).
 */
export function loadVimDefaults(): VimDefaults | null {
    const raw = localStorage.getItem(LocalStorageKey.EditorDefaultsVim)
    if (!raw) return null

    try {
        const parsed = JSON.parse(raw) as Partial<VimDefaults>
        return {
            enabled: Boolean(parsed.enabled),
            mappings: normalizeVimMappings(Array.isArray(parsed.mappings) ? parsed.mappings : []),
        }
    } catch {
        return null
    }
}

/**
 * 从 localStorage 读取 WechatCaptcha 默认值.
 * @returns WechatCaptchaDefaults 或 null(键不存在或解析失败时)
 */
export function loadWechatCaptchaDefaults(): WechatCaptchaDefaults | null {
    const raw = localStorage.getItem(LocalStorageKey.EditorDefaultsWechatCaptcha)
    if (!raw) return null
    try {
        return JSON.parse(raw) as WechatCaptchaDefaults
    } catch {
        return null
    }
}

/**
 * 根据默认值构建 power-bi 自定义元素的插入内容字符串.
 * @param defaults - PowerBiDefaults 或 null
 * @returns 插入内容字符串
 */
export function buildPowerBiContent(defaults: PowerBiDefaults | null): string {
    if (defaults !== null) {
        return `<power-bi src="" maskcolor="${defaults.maskcolor}"></power-bi>`
    }
    return POWER_BI_FALLBACK_CONTENT
}

/**
 * 根据默认值构建 wechat-captcha 自定义元素的插入前缀字符串.
 * @param defaults - WechatCaptchaDefaults 或 null
 * @returns 插入前缀字符串
 */
export function buildWechatCaptchaPrefix(defaults: WechatCaptchaDefaults | null): string {
    if (defaults !== null) {
        return `\n<wechat-captcha name="${defaults.name}" codeurl="${defaults.codeurl}" key="您在公众号回复用户的验证码" reply="用户需要在公众号回复获取验证码的内容">\n\n`
    }
    return WECHAT_CAPTCHA_FALLBACK_PREFIX
}

/**
 * 清除 localStorage 中保存的 PowerBi 默认值.
 */
export function clearPowerBiDefaults(): void {
    localStorage.removeItem(LocalStorageKey.EditorDefaultsPowerBi)
}

/**
 * 清除 localStorage 中保存的 Vim 默认值.
 */
export function clearVimDefaults(): void {
    localStorage.removeItem(LocalStorageKey.EditorDefaultsVim)
}

/**
 * 清除 localStorage 中保存的 WechatCaptcha 默认值.
 */
export function clearWechatCaptchaDefaults(): void {
    localStorage.removeItem(LocalStorageKey.EditorDefaultsWechatCaptcha)
}
