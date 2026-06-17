/*
 * FilePath    : blog-client\src\pkg\codemirror\extension\vim.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : vim 插件
 */

import { Compartment } from "@codemirror/state"
import { Vim, vim } from "@replit/codemirror-vim"

import type { VimKeyMapping } from "@/stores/editor-defaults"
import { copyText } from "@/utils/clipboard"
import type { VimClipboardBridgeDefinition, VimClipboardMappingKind, VimMappingContext, VimRegister, VimRegisterController } from "./types"

export { Vim, vim } from "@replit/codemirror-vim"
export const vimModeCompartment = new Compartment()

let isVimClipboardActionReady = false

type NormalizedClipboardMapping = {
    lhs: string
    rhs: string
    context: VimMappingContext
}

type MirroredClipboardState = {
    text: string | null
    linewise: boolean
    blockwise: boolean
}

const mirroredClipboardState: MirroredClipboardState = {
    text: null,
    linewise: false,
    blockwise: false,
}

let lastSystemClipboardReadText: string | null = null
let shouldMirrorDefaultRegisterToClipboard = false
let activeClipboardPasteBridges: VimClipboardBridgeDefinition[] = []

/**
 * normalizeClipboardWriteText 规范化写入系统剪贴板的文本.
 * linewise yank 仍需保留 Vim 的行级语义, 但系统剪贴板中不应额外附带结尾换行.
 * @param text - 原始待写入文本.
 * @param linewise - 当前写入是否为 Vim 行级复制.
 * @returns 实际写入系统剪贴板的文本.
 */
function normalizeClipboardWriteText(text: string, linewise: boolean): string {
    if (!linewise) {
        return text
    }

    return text.endsWith("\n") ? text.slice(0, -1) : text
}

/**
 * normalizeClipboardMappings 规范化 Vim 映射数组, 便于统一识别剪贴板 bridge 信号.
 * @param mappings - 用户自定义 Vim 映射数组.
 * @returns 去空白后的标准化映射列表.
 */
function normalizeClipboardMappings(mappings: ReadonlyArray<VimKeyMapping>): NormalizedClipboardMapping[] {
    return mappings
        .map((mapping) => ({
            lhs: mapping.lhs.trim(),
            rhs: mapping.rhs.trim(),
            context: mapping.context ?? "normal",
        }))
        .filter((mapping) => Boolean(mapping.lhs) && Boolean(mapping.rhs))
}

/**
 * isClipboardBridgeMapping 判断当前映射是否显式开启了系统剪贴板 bridge.
 * @param mapping - 已标准化的 Vim 映射项.
 * @returns 命中 `"+` 相关 bridge 时返回 true.
 */
function isClipboardBridgeMapping(mapping: Readonly<NormalizedClipboardMapping>): boolean {
    return Boolean(getVimClipboardMappingKind(mapping))
}

/**
 * getDefaultVimClipboardBridges 根据用户映射推导当前应启用的系统剪贴板桥接列表.
 * 默认情况下保持原生 Vim 行为; 仅当用户显式声明了 `"+` 相关映射时, 才启用项目侧 bridge.
 * `y` / `d` / `c` 的系统剪贴板同步由寄存器包装统一处理, 这里仅负责把 `p` / `P` 落到原生 `"+p` / `"+P` 语义.
 * @param mappings - 用户自定义 Vim 映射数组.
 * @returns 需要启用的默认桥接定义数组.
 */
export function getDefaultVimClipboardBridges(mappings: ReadonlyArray<VimKeyMapping>): VimClipboardBridgeDefinition[] {
    const normalizedMappings = normalizeClipboardMappings(mappings)

    const bridges: VimClipboardBridgeDefinition[] = []
    let hasExplicitPasteAfterBridge = false
    let hasExplicitPasteBeforeBridge = false
    const mappingKeySet = new Set(normalizedMappings.map((mapping) => `${mapping.context}:${mapping.lhs}`))

    // 仅把显式 `"+p` / `"+P` 翻译成项目侧 bridge, 其它 y/d/c 同步由寄存器包装统一处理.
    for (const mapping of normalizedMappings) {
        const specialMappingKind = getVimClipboardMappingKind(mapping)

        if (!specialMappingKind) {
            continue
        }

        if (specialMappingKind === "clipboard-paste-after") {
            hasExplicitPasteAfterBridge = true
            bridges.push({
                lhs: mapping.lhs,
                context: mapping.context === "visual" ? "visual" : "normal",
                action: "clipboardPasteAfter",
                conflictLhs: mapping.lhs,
            })
            continue
        }

        if (specialMappingKind === "clipboard-paste-before") {
            hasExplicitPasteBeforeBridge = true
            bridges.push({
                lhs: mapping.lhs,
                context: mapping.context === "visual" ? "visual" : "normal",
                action: "clipboardPasteBefore",
                conflictLhs: mapping.lhs,
            })
        }
    }

    // normal `p` / `P` 开启系统剪贴板 bridge 后, visual 同键位也应复用相同语义, 除非用户显式覆盖了 visual 映射.
    if (hasExplicitPasteAfterBridge && !mappingKeySet.has("visual:p")) {
        bridges.push({ lhs: "p", context: "visual", action: "clipboardPasteAfter" })
    }

    if (hasExplicitPasteBeforeBridge && !mappingKeySet.has("visual:P")) {
        bridges.push({ lhs: "P", context: "visual", action: "clipboardPasteBefore" })
    }

    return bridges
}

/**
 * getVimClipboardMappingKind 识别需要翻译为桥接命令的系统剪贴板映射.
 * `@replit/codemirror-vim` 无法稳定通过普通 `Vim.map` 处理 `"+` 相关映射, 这里在用户显式声明时转成项目侧桥接.
 * @param mapping - 当前用户映射项.
 * @returns 特殊映射类型, 非桥接映射则返回 null.
 */
function getVimClipboardMappingKind(mapping: Readonly<{ rhs: string }>): VimClipboardMappingKind | null {
    const normalizedRhs = mapping.rhs.replace(/\s+/g, "")

    if (normalizedRhs === '"+yy' || normalizedRhs === '"+Y') {
        return "clipboard-line-yank"
    }

    if (normalizedRhs === '"+p') {
        return "clipboard-paste-after"
    }

    if (normalizedRhs === '"+P') {
        return "clipboard-paste-before"
    }

    if (normalizedRhs === '"+y') {
        return "clipboard-selection-yank"
    }

    return null
}

/**
 * inferUserMappingContext 推断用户映射应注册到的 Vim 上下文.
 * 新配置优先使用显式 context, 旧配置缺少 context 时继续兼容 `<Esc>` => `insert` 的历史推断.
 * @param mapping - 当前用户映射项.
 * @returns 推断出的 Vim 上下文.
 */
function inferUserMappingContext(mapping: Readonly<VimKeyMapping>): VimMappingContext {
    if (mapping.context) {
        return mapping.context
    }

    return mapping.rhs.trim() === "<Esc>" ? "insert" : "normal"
}

/**
 * getVimRegisterController 获取 codemirror-vim 的寄存器控制器.
 * 这里复用三方库内部现有寄存器写入逻辑, 避免重写默认 yank 行为。
 * @returns Vim 寄存器控制器.
 */
function getVimRegisterController(): VimRegisterController {
    const getGlobalState = (Vim as unknown as { [key: string]: unknown })["getVimGlobalState_"] as () => {
        registerController: VimRegisterController
    }

    return getGlobalState().registerController
}

/**
 * inferExternalClipboardLinewise 推断外部系统剪贴板文本应使用的 linewise 语义.
 * 当文本命中项目自己镜像出去的内容时, 复用本地寄存器元数据; 否则仅在文本以换行结尾时视为 linewise.
 * @param text - 当前从系统剪贴板读到的文本.
 * @param fallbackLinewise - `+` 寄存器当前保存的 linewise 元数据.
 * @returns 当前 paste 应采用的 linewise 标记.
 */
function inferExternalClipboardLinewise(text: string | null, fallbackLinewise: boolean): boolean {
    if (typeof text !== "string") {
        return fallbackLinewise
    }

    if (mirroredClipboardState.text !== null && text === mirroredClipboardState.text) {
        return mirroredClipboardState.linewise
    }

    return text.endsWith("\n")
}

/**
 * inferExternalClipboardBlockwise 推断外部系统剪贴板文本应使用的 blockwise 语义.
 * 外部纯文本默认不视为 blockwise, 只有命中项目本地镜像时才复用寄存器里的 blockwise 元数据.
 * @param text - 当前从系统剪贴板读到的文本.
 * @param fallbackBlockwise - `+` 寄存器当前保存的 blockwise 元数据.
 * @returns 当前 paste 应采用的 blockwise 标记.
 */
function inferExternalClipboardBlockwise(text: string | null, fallbackBlockwise: boolean): boolean {
    if (typeof text !== "string") {
        return fallbackBlockwise
    }

    if (mirroredClipboardState.text !== null && text === mirroredClipboardState.text) {
        return mirroredClipboardState.blockwise
    }

    return false
}

/**
 * patchClipboardRegisterMetadata 为 `+` 寄存器补一层动态元数据读取.
 * 原生 paste 读取系统剪贴板文本时仍会复用寄存器上的 linewise/blockwise 标志, 这里需要在外部剪贴板变更后按文本重新推断.
 * @param register - `+` 寄存器实例.
 * @returns 无返回值.
 */
function patchClipboardRegisterMetadata(register: VimRegister): void {
    const marker = "__blogClientClipboardRegisterPatched__"
    const registerWithMarker = register as VimRegister & { [key: string]: unknown }

    if (registerWithMarker[marker]) {
        return
    }

    let storedLinewise = register.linewise
    let storedBlockwise = register.blockwise

    Object.defineProperty(register, "linewise", {
        configurable: true,
        get() {
            return inferExternalClipboardLinewise(lastSystemClipboardReadText, storedLinewise)
        },
        set(value: boolean) {
            storedLinewise = value
        },
    })

    Object.defineProperty(register, "blockwise", {
        configurable: true,
        get() {
            return inferExternalClipboardBlockwise(lastSystemClipboardReadText, storedBlockwise)
        },
        set(value: boolean) {
            storedBlockwise = value
        },
    })

    registerWithMarker[marker] = true
}

/**
 * ensureClipboardReadTrackingReady 包装系统剪贴板读取, 记录最近一次 paste 读到的文本.
 * 原生 `paste` action 不会向项目层暴露读取结果, 这里做最小追踪以便修正 `+` 寄存器元数据.
 * @returns 无返回值.
 */
function ensureClipboardReadTrackingReady(): void {
    if (typeof navigator === "undefined" || !navigator.clipboard?.readText) {
        return
    }

    const clipboard = navigator.clipboard as Clipboard & { [key: string]: unknown; readText: () => Promise<string> }
    const marker = "__blogClientClipboardReadTracked__"

    if (clipboard[marker]) {
        return
    }

    const originalReadText = clipboard.readText.bind(clipboard)

    Object.defineProperty(clipboard, "readText", {
        configurable: true,
        value: async () => {
            const text = await originalReadText()
            lastSystemClipboardReadText = text
            return text
        },
    })

    clipboard[marker] = true
}

/**
 * restoreClipboardPasteBridges 恢复当前生效的 paste bridge 映射.
 * `p` / `P` 的项目侧 action 在回放原生 `"+p` 时需要临时撤掉自己, 回放结束后再恢复.
 * @param bridges - 需要恢复的 bridge 列表.
 * @returns 无返回值.
 */
function restoreClipboardPasteBridges(bridges: ReadonlyArray<VimClipboardBridgeDefinition>): void {
    for (const bridge of bridges) {
        Vim.mapCommand(bridge.lhs, "action", bridge.action, bridge.actionArgs ?? {}, { context: bridge.context })
    }
}

/**
 * withTemporaryClipboardPasteReadBridge 在一次原生 `"+p` 回放期间临时修正 `readText` 返回值.
 * 对于项目自己镜像出去的 linewise 内容, 系统剪贴板里会去掉结尾换行; 但原生 paste 在 linewise 场景仍要求读到带换行的文本.
 * @param callback - 需要在临时 read bridge 下执行的操作.
 * @returns callback 的返回值.
 */
function withTemporaryClipboardPasteReadBridge<T>(callback: () => T): T {
    if (typeof navigator === "undefined" || !navigator.clipboard?.readText) {
        return callback()
    }

    const clipboard = navigator.clipboard as Clipboard & { readText: () => Promise<string> }
    const originalReadText = clipboard.readText.bind(clipboard)

    Object.defineProperty(clipboard, "readText", {
        configurable: true,
        value: async () => {
            const text = await originalReadText()
            lastSystemClipboardReadText = text

            if (mirroredClipboardState.linewise && mirroredClipboardState.text !== null && text === mirroredClipboardState.text && !text.endsWith("\n")) {
                return `${text}\n`
            }

            return text
        },
    })

    try {
        return callback()
    } finally {
        Object.defineProperty(clipboard, "readText", {
            configurable: true,
            value: originalReadText,
        })
    }
}

/**
 * replayClipboardPasteThroughDefault 临时撤掉项目侧 bridge, 回放一遍原生 `"+p` / `"+P` 键序.
 * 直接回放原生键序可以避免重写第三方 paste 实现, 同时让系统剪贴板读取与视觉模式粘贴继续沿用原库行为.
 * @param cm - 当前 Vim 编辑器实例.
 * @param pasteKey - 需要回放的原生粘贴按键.
 * @returns 无返回值.
 */
function replayClipboardPasteThroughDefault(cm: Parameters<typeof Vim.handleKey>[0], pasteKey: "p" | "P"): void {
    const bridgesToRestore = activeClipboardPasteBridges.filter((bridge) => bridge.lhs === pasteKey)

    for (const bridge of bridgesToRestore) {
        Vim.unmap(bridge.lhs, bridge.context)
    }

    try {
        withTemporaryClipboardPasteReadBridge(() => {
            Vim.handleKey(cm, '"', "user")
            Vim.handleKey(cm, "+", "user")
            Vim.handleKey(cm, pasteKey, "user")
        })
    } finally {
        restoreClipboardPasteBridges(bridgesToRestore)
    }
}

/**
 * getRestorableActiveElement 获取当前可恢复焦点的活动元素.
 * fallback 复制和粘贴都会临时把焦点切到隐藏 textarea, 结束后必须恢复给编辑器.
 * @returns 当前可恢复焦点的 HTMLElement, 不可恢复时返回 null.
 */
function getRestorableActiveElement(): HTMLElement | null {
    if (typeof document === "undefined") {
        return null
    }

    const activeElement = document.activeElement

    if (!(activeElement instanceof HTMLElement)) {
        return null
    }

    return typeof activeElement.focus === "function" ? activeElement : null
}

/**
 * writeTextToSystemClipboard 将文本写入系统剪贴板, 并记录本地镜像与行级语义.
 * @param text - 需要写入的文本.
 * @param linewise - 当前文本是否按 Vim 行级复制处理.
 * @returns 无返回值.
 */
async function writeTextToSystemClipboard(text: string, linewise: boolean): Promise<void> {
    const clipboardText = normalizeClipboardWriteText(text, linewise)
    mirroredClipboardState.text = clipboardText
    mirroredClipboardState.linewise = linewise
    lastSystemClipboardReadText = clipboardText
    await copyText(clipboardText, { restoreFocusElement: getRestorableActiveElement() })
}

/**
 * ensureVimClipboardActionsRegistered 初始化项目侧 Vim 剪贴板 bridge.
 * 这里不重写 paste, 只补两层运行时包装: 一层统一镜像默认 y/d/c 到 `+` 寄存器, 一层修正原生 `paste("+")` 读取系统剪贴板后的元数据.
 * @returns 无返回值.
 */
function ensureVimClipboardActionsRegistered(): void {
    ensureClipboardReadTrackingReady()

    if (isVimClipboardActionReady) {
        return
    }

    const registerController = getVimRegisterController()
    const plusRegister = registerController.getRegister("+")
    const originalPushText = registerController.pushText.bind(registerController)

    patchClipboardRegisterMetadata(plusRegister)

    Vim.defineAction("clipboardPasteAfter", (cm: Parameters<typeof Vim.handleKey>[0]) => {
        replayClipboardPasteThroughDefault(cm, "p")
    })

    Vim.defineAction("clipboardPasteBefore", (cm: Parameters<typeof Vim.handleKey>[0]) => {
        replayClipboardPasteThroughDefault(cm, "P")
    })

    registerController.pushText = (registerName, operator, text, linewise, blockwise) => {
        originalPushText(registerName, operator, text, linewise, blockwise)

        if (!shouldMirrorDefaultRegisterToClipboard) {
            return
        }

        if (registerName && registerName !== '"') {
            return
        }

        if (operator !== "yank" && operator !== "delete" && operator !== "change") {
            return
        }

        const mirroredText = linewise && !text.endsWith("\n") ? `${text}\n` : text
        plusRegister.setText(mirroredText, linewise, blockwise)
        mirroredClipboardState.blockwise = Boolean(blockwise)
        void writeTextToSystemClipboard(mirroredText, Boolean(linewise))
    }

    isVimClipboardActionReady = true
}

/**
 * createVimExtension 创建项目统一使用的 Vim 扩展.
 * `@replit/codemirror-vim` 在 `status: true` 时会提前创建 statusPanel, 但此时 `view.cm` 仍可能未初始化.
 * 这里统一关闭该内置状态栏分支, 保留 Vim 核心能力.
 * @returns Vim 扩展数组.
 */
export function createVimExtension() {
    ensureVimClipboardActionsRegistered()
    return vim()
}

/**
 * applyVimMappings 将当前用户映射和系统剪贴板桥接一次性重建到 Vim 全局 keymap 中.
 * 默认保留原生 Vim 行为; 仅当用户显式配置 `"+` 相关映射时, 才启用项目侧桥接。
 * @param mappings - 需要应用的 Vim 映射数组.
 * @returns 无返回值.
 */
export function applyVimMappings(mappings: ReadonlyArray<VimKeyMapping>): void {
    ensureVimClipboardActionsRegistered()
    const normalizedMappings = normalizeClipboardMappings(mappings)

    shouldMirrorDefaultRegisterToClipboard = normalizedMappings.some((mapping) => isClipboardBridgeMapping(mapping))
    activeClipboardPasteBridges = getDefaultVimClipboardBridges(mappings)
    Vim.mapclear("normal")
    Vim.mapclear("insert")
    Vim.mapclear("visual")
    Vim.mapclear("operatorPending")

    // 普通用户映射继续走原生 `Vim.map`, 仅把 `"+` 相关映射留给 bridge 层统一处理.
    for (const mapping of mappings) {
        const lhs = mapping.lhs.trim()
        const rhs = mapping.rhs.trim()

        if (!lhs || !rhs) {
            continue
        }

        const specialMappingKind = getVimClipboardMappingKind(mapping)

        if (specialMappingKind) {
            continue
        }

        Vim.map(lhs, rhs, inferUserMappingContext(mapping))
    }

    // bridge 统一在普通映射之后注册, 便于把显式 clipboard 语义收口到项目侧 action.
    for (const bridge of activeClipboardPasteBridges) {
        Vim.mapCommand(bridge.lhs, "action", bridge.action, bridge.actionArgs, { context: bridge.context })
    }
}
