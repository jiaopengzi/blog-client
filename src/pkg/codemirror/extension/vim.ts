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
import type {
    VimActionArgs,
    VimClipboardBridgeDefinition,
    VimClipboardMappingKind,
    VimClipboardState,
    VimCm,
    VimCursorPosition,
    VimMappingContext,
    VimRegisterController,
    VimSelectionRange,
} from "./types"

export { Vim, vim } from "@replit/codemirror-vim"
export const vimModeCompartment = new Compartment()

let vimClipboardState: VimClipboardState = {
    text: "",
    linewise: false,
}
let isVimClipboardActionReady = false
let shouldUseClipboardRegisterForNextYank = false
let hasWarnedClipboardMirrorFallback = false

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
 * syncVimClipboardState 根据外部读取结果同步本地剪贴板镜像状态.
 * 当读取值与最近一次镜像一致时, 复用现有 linewise 标记; 否则按文本末尾换行推断新的行级语义.
 * @param text - 刚从外部读取到的剪贴板文本.
 * @returns 无返回值.
 */
function syncVimClipboardState(text: string): void {
    vimClipboardState = {
        text,
        linewise: text === vimClipboardState.text ? vimClipboardState.linewise : text.endsWith("\n"),
    }
}

/**
 * warnClipboardMirrorFallbackOnce 在无法读取真实系统剪贴板时输出一次告警.
 * HTTP 非 localhost 等场景下, 浏览器可能拒绝 clipboard read, 此时只能回退到最近一次镜像值.
 * @returns 无返回值.
 */
function warnClipboardMirrorFallbackOnce(): void {
    if (hasWarnedClipboardMirrorFallback) {
        return
    }

    console.warn("Vim clipboard read fallback: browser denied system clipboard access, using the latest local clipboard mirror instead.")
    hasWarnedClipboardMirrorFallback = true
}

/**
 * tryReadTextFromClipboardItems 尝试通过 navigator.clipboard.read() 读取纯文本.
 * 某些浏览器环境中 readText 会失败, 但 read() 仍可返回 text/plain ClipboardItem.
 * @returns 成功时返回纯文本, 否则返回 null.
 */
async function tryReadTextFromClipboardItems(): Promise<string | null> {
    if (typeof navigator === "undefined" || !navigator.clipboard?.read) {
        return null
    }

    const clipboardItems = Array.from(await navigator.clipboard.read())
    const plainTextItem = clipboardItems.find((clipboardItem) => clipboardItem.types.includes("text/plain"))

    if (!plainTextItem) {
        return null
    }

    const blob = await plainTextItem.getType("text/plain")
    return blob.text()
}

/**
 * getDefaultVimClipboardBridges 根据用户映射推导当前应启用的系统剪贴板桥接列表.
 * 默认情况下保持原生 Vim 行为; 仅当用户显式声明了 `"+` 相关映射时, 才启用对应桥接.
 * 当任意系统剪贴板映射被显式启用且用户未覆盖 `y` 时, 额外补上 visual `y` 的系统剪贴板桥接.
 * @param mappings - 用户自定义 Vim 映射数组.
 * @returns 需要启用的默认桥接定义数组.
 */
export function getDefaultVimClipboardBridges(mappings: ReadonlyArray<VimKeyMapping>): VimClipboardBridgeDefinition[] {
    const normalizedMappings = mappings
        .map((mapping) => ({ lhs: mapping.lhs.trim(), rhs: mapping.rhs.trim(), context: mapping.context ?? "normal" }))
        .filter((mapping) => Boolean(mapping.lhs) && Boolean(mapping.rhs))

    const bridges: VimClipboardBridgeDefinition[] = []
    let hasExplicitClipboardBridge = false
    let hasExplicitVisualYBridge = false
    const mappingKeySet = new Set(normalizedMappings.map((mapping) => `${mapping.context}:${mapping.lhs}`))

    // 先扫描用户显式声明的 `"+` 映射, 仅把这些映射翻译成项目侧 bridge.
    for (const mapping of normalizedMappings) {
        const specialMappingKind = getVimClipboardMappingKind(mapping)

        if (!specialMappingKind) {
            continue
        }

        hasExplicitClipboardBridge = true

        if (specialMappingKind === "clipboard-line-yank") {
            bridges.push({ lhs: mapping.lhs, context: "normal", action: "clipboardYankLine", conflictLhs: mapping.lhs })
            continue
        }

        if (specialMappingKind === "clipboard-paste-after") {
            bridges.push({ lhs: mapping.lhs, context: "normal", action: "clipboardPasteAfter", conflictLhs: mapping.lhs })
            continue
        }

        if (specialMappingKind === "clipboard-paste-before") {
            bridges.push({ lhs: mapping.lhs, context: "normal", action: "clipboardPasteBefore", conflictLhs: mapping.lhs })
            continue
        }

        hasExplicitVisualYBridge = true
        bridges.push({ lhs: mapping.lhs, context: "visual", action: "clipboardYankSelection", conflictLhs: mapping.lhs })
    }

    // 当用户开启了系统剪贴板 bridge, 但未单独覆盖 visual `y` 时, 自动补齐最符合预期的 visual 复制行为.
    if (hasExplicitClipboardBridge && !hasExplicitVisualYBridge && !mappingKeySet.has("visual:y")) {
        bridges.push({ lhs: "y", context: "visual", action: "clipboardYankSelection" })
    }

    return bridges
}

/**
 * getVimClipboardMappingKind 识别需要翻译为桥接命令的系统剪贴板映射.
 * `@replit/codemirror-vim` 无法稳定通过普通 `Vim.map` 处理 `"+` 相关映射, 这里在用户显式声明时转成项目侧桥接.
 * @param mapping - 当前用户映射项.
 * @returns 特殊映射类型, 非桥接映射则返回 null.
 */
function getVimClipboardMappingKind(mapping: Readonly<VimKeyMapping>): VimClipboardMappingKind | null {
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
 * restoreElementFocus 将焦点恢复到先前的活动元素.
 * @param element - 需要恢复焦点的元素.
 * @returns 无返回值.
 */
function restoreElementFocus(element: HTMLElement | null): void {
    if (!element?.isConnected) {
        return
    }

    element.focus()
}

/**
 * writeTextToSystemClipboard 将文本写入系统剪贴板, 并记录本地镜像与行级语义.
 * @param text - 需要写入的文本.
 * @param linewise - 当前文本是否按 Vim 行级复制处理.
 * @returns 无返回值.
 */
async function writeTextToSystemClipboard(text: string, linewise: boolean): Promise<void> {
    const clipboardText = normalizeClipboardWriteText(text, linewise)
    vimClipboardState = { text: clipboardText, linewise }
    await copyText(clipboardText, { restoreFocusElement: getRestorableActiveElement() })
}

/**
 * readTextFromSystemClipboard 读取系统剪贴板文本.
 * 优先读取现代 API, 失败后尝试 execCommand, 最后回退到最近一次成功写入的镜像值.
 * @returns 读取到的文本.
 */
async function readTextFromSystemClipboard(): Promise<string> {
    try {
        if (typeof navigator !== "undefined" && navigator.clipboard?.readText) {
            const text = await navigator.clipboard.readText()
            syncVimClipboardState(text)
            return text
        }
    } catch {
        // 忽略当前分支错误, 继续尝试更宽松的浏览器读取方式.
    }

    try {
        const text = await tryReadTextFromClipboardItems()

        if (text !== null) {
            syncVimClipboardState(text)
            return text
        }
    } catch {
        // 忽略当前分支错误, 继续回退到更旧的 paste 读取方案.
    }

    try {
        if (typeof document !== "undefined") {
            const previousActiveElement = getRestorableActiveElement()
            const textArea = document.createElement("textarea")
            textArea.style.position = "fixed"
            textArea.style.left = "-9999px"
            textArea.style.top = "-9999px"
            document.body.appendChild(textArea)
            textArea.focus()
            textArea.select()

            const success = document.execCommand("paste")
            const text = textArea.value
            document.body.removeChild(textArea)
            restoreElementFocus(previousActiveElement)

            if (success) {
                syncVimClipboardState(text)
                return text
            }
        }
    } catch {
        // 忽略当前分支错误, 最后回退到最近一次成功写入的本地镜像值.
    }

    warnClipboardMirrorFallbackOnce()
    return vimClipboardState.text
}

/**
 * compareCursorPosition 比较两个光标位置的先后顺序.
 * @param left - 左侧光标位置.
 * @param right - 右侧光标位置.
 * @returns 小于 0 表示 left 更靠前, 大于 0 表示 right 更靠前, 等于 0 表示相同.
 */
function compareCursorPosition(left: VimCursorPosition, right: VimCursorPosition): number {
    if (left.line !== right.line) {
        return left.line - right.line
    }

    return left.ch - right.ch
}

/**
 * findEarlierCursorPosition 返回两个位置中更靠前的一个.
 * @param left - 左侧光标位置.
 * @param right - 右侧光标位置.
 * @returns 更靠前的光标位置.
 */
function findEarlierCursorPosition(left: VimCursorPosition, right: VimCursorPosition): VimCursorPosition {
    return compareCursorPosition(left, right) <= 0 ? left : right
}

/**
 * exitVisualModeForBridge 通过最小类型断言退出 visual 模式.
 * 三方库未导出更窄的运行时类型, 这里仅在默认 visual `y` 桥接完成后复用其既有退出逻辑.
 * @param cm - Vim 适配后的编辑器实例.
 * @returns 无返回值.
 */
function exitVisualModeForBridge(cm: VimCm): void {
    const exitVisualMode = Vim.exitVisualMode as unknown as (target: VimCm, shouldClear: boolean) => void
    exitVisualMode(cm, false)
}

/**
 * findFirstNonWhitespaceCharacter 返回一行文本中第一个非空白字符的位置.
 * @param lineText - 当前行文本.
 * @returns 光标应落到的列号.
 */
function findFirstNonWhitespaceCharacter(lineText: string): number {
    const matched = lineText.match(/^\s*/)
    return matched?.[0]?.length ?? 0
}

/**
 * buildLinewiseClipboardText 构建行级复制写入系统剪贴板的文本.
 * @param cm - Vim 适配后的编辑器实例.
 * @param repeat - 复制行数.
 * @returns 行级复制文本, 会以换行结尾.
 */
function buildLinewiseClipboardText(cm: VimCm, repeat: number): string {
    const currentLine = cm.getCursor().line
    const lastLine = Math.min(cm.lastLine(), currentLine + Math.max(1, repeat) - 1)
    const lines: string[] = []

    for (let line = currentLine; line <= lastLine; line += 1) {
        lines.push(cm.getLine(line))
    }

    return `${lines.join("\n")}\n`
}

/**
 * pasteClipboardTextAtCursor 将剪贴板文本按 Vim 语义插入当前光标处.
 * 这里只处理普通模式下的 after 场景, 满足默认 `p` 的使用路径.
 * @param cm - Vim 适配后的编辑器实例.
 * @param text - 剪贴板文本.
 * @param after - 是否在当前光标后方粘贴.
 * @param repeat - 粘贴次数.
 * @returns 无返回值.
 */
function pasteClipboardTextAtCursor(cm: VimCm, text: string, after: boolean, repeat: number): void {
    const isLinewise = text === vimClipboardState.text && vimClipboardState.linewise

    if (!text && !isLinewise) {
        return
    }

    const safeRepeat = Math.max(1, repeat)
    const currentCursor = cm.getCursor()
    const cursor = { line: currentCursor.line, ch: currentCursor.ch }

    let insertText = safeRepeat > 1 ? Array(safeRepeat + 1).join(text) : text

    // 行级粘贴需要模拟 Vim 的整行插入语义, 不能直接按字符流替换.
    if (isLinewise) {
        if (after) {
            insertText = `\n${insertText.replace(/\n$/, "")}`
            cursor.ch = cm.getLine(cursor.line).length
            cm.replaceRange(insertText, cursor)
            const insertedLine = Math.min(cursor.line + 1, cm.lastLine())
            cm.setCursor(insertedLine, findFirstNonWhitespaceCharacter(cm.getLine(insertedLine)))
            return
        }

        cursor.ch = 0
        cm.replaceRange(insertText, cursor)
        cm.setCursor(cursor.line, findFirstNonWhitespaceCharacter(cm.getLine(cursor.line)))
        return
    }

    cursor.ch += after ? 1 : 0
    cm.replaceRange(insertText, cursor)

    if (!/\n/.test(insertText)) {
        cm.setCursor(cursor.line, cursor.ch + insertText.length - (after ? 1 : 0))
        return
    }

    cm.setCursor(cursor.line, cursor.ch)
}

/**
 * ensureVimClipboardActionsRegistered 注册项目侧最小系统剪贴板 action.
 * 这里只兜底默认的 `yy`, `p`, visual `y`, 其他用户映射继续走原生 `Vim.map`.
 * @returns 无返回值.
 */
function ensureVimClipboardActionsRegistered(): void {
    if (isVimClipboardActionReady) {
        return
    }

    // `yy` 最终会走 operatorPending -> yank operator, 这里先用一个 motion 标记下一次 yank 应切到 `+` 寄存器.
    Vim.defineMotion("clipboardLinewiseYankMotion", (_cm: VimCm, head: VimCursorPosition, motionArgs: VimActionArgs) => {
        shouldUseClipboardRegisterForNextYank = true
        return {
            line: head.line + Math.max(1, motionArgs.repeat ?? 1) - 1,
            ch: Infinity,
        }
    })

    // 复用 codemirror-vim 自己的寄存器写入逻辑, 只在命中 `+` 寄存器时额外同步到系统剪贴板.
    Vim.defineOperator("yank", (cm: VimCm, args: VimActionArgs, ranges: VimSelectionRange[], oldAnchor: VimCursorPosition) => {
        const vimState = cm.state.vim
        const text = cm.getSelection()
        const registerName = shouldUseClipboardRegisterForNextYank ? "+" : (args.registerName ?? undefined)
        const endPos = vimState?.visualMode && vimState.sel ? findEarlierCursorPosition(vimState.sel.anchor, vimState.sel.head) : oldAnchor

        shouldUseClipboardRegisterForNextYank = false

        if (registerName === "+") {
            getVimRegisterController().pushText(undefined, "yank", text, args.linewise, vimState?.visualBlock)
            void writeTextToSystemClipboard(text, Boolean(args.linewise))
        } else {
            getVimRegisterController().pushText(registerName, "yank", text, args.linewise, vimState?.visualBlock)
        }

        return vimState?.visualMode && ranges[0] ? findEarlierCursorPosition(ranges[0].head, ranges[0].anchor) : endPos
    })

    // `yy` 这种整行复制不会自然落到 visual selection, 因此单独提供一条 linewise action.
    Vim.defineAction("clipboardYankLine", (cm: VimCm, actionArgs: VimActionArgs) => {
        const text = buildLinewiseClipboardText(cm, actionArgs.repeat ?? 1)
        void writeTextToSystemClipboard(text, true)
    })

    // `p` / `P` 都先读系统剪贴板, 再交给统一的 Vim 粘贴语义处理函数落地.
    Vim.defineAction("clipboardPasteAfter", (cm: VimCm, actionArgs: VimActionArgs) => {
        void readTextFromSystemClipboard().then((text) => {
            pasteClipboardTextAtCursor(cm, text, true, actionArgs.repeat ?? 1)
        })
    })

    Vim.defineAction("clipboardPasteBefore", (cm: VimCm, actionArgs: VimActionArgs) => {
        void readTextFromSystemClipboard().then((text) => {
            pasteClipboardTextAtCursor(cm, text, false, actionArgs.repeat ?? 1)
        })
    })

    // visual `y` 复制后需要主动退出 visual 模式并恢复光标, 才能贴近 Vim 用户的实际预期.
    Vim.defineAction("clipboardYankSelection", (cm: VimCm) => {
        const text = cm.getSelection()
        const selection = cm.state.vim?.sel

        if (!text) {
            return
        }

        void writeTextToSystemClipboard(text, false)
        exitVisualModeForBridge(cm)

        if (selection?.anchor && selection.head) {
            const cursor = findEarlierCursorPosition(selection.anchor, selection.head)
            cm.setCursor(cursor.line, cursor.ch)
        }
    })

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
    for (const bridge of getDefaultVimClipboardBridges(mappings)) {
        if (bridge.context === "normal" && bridge.lhs === "yy") {
            Vim.mapCommand("y", "motion", "clipboardLinewiseYankMotion", { linewise: true }, { context: "operatorPending" })
            continue
        }

        if (bridge.context === "normal" && bridge.action === "clipboardPasteBefore") {
            Vim.mapCommand(bridge.lhs, "action", "clipboardPasteBefore", {}, { context: bridge.context })
            continue
        }

        Vim.mapCommand(bridge.lhs, "action", bridge.action, {}, { context: bridge.context })
    }
}
