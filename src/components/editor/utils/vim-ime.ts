/*
 * FilePath    : blog-client-nuxt\src\components\editor\utils\vim-ime.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : Vim 模式与本地输入法服务联动
 */

/**
 * vim-ime 负责把编辑器内的 Vim 模式切换翻译为本地输入法服务请求.
 */

import { DEFAULT_VIM_IME_PORT } from "@/stores/editor-defaults"

export type VimModeName = "normal" | "insert" | "visual" | "replace" | "cmd"

export interface VimModeChangeEvent {
    mode?: string
    subMode?: string
}

export interface NotifyVimModeChangeOptions {
    modeBefore: VimModeName
    modeAfter: VimModeName
    port: number
    force?: boolean
}

const VIM_IME_API_HOST = "127.0.0.1"
const VIM_IME_API_PATH = "/ime"
const VIM_IME_REQUEST_TIMEOUT = 800
const unavailableVimImeEndpointSet = new Set<string>()
const warnedUnavailableVimImeEndpointSet = new Set<string>()

/**
 * resolveVimModeName 将 codemirror-vim 的模式对象收敛为服务端支持的模式名称.
 * 当前编辑器仅依赖 normal, insert, visual, replace; 其他异常值一律兜底到 normal.
 * @param modeObj - codemirror-vim 发出的模式对象.
 * @returns 标准化后的 Vim 模式名.
 */
export function resolveVimModeName(modeObj: VimModeChangeEvent | null | undefined): VimModeName {
    const mode = modeObj?.mode

    if (mode === "insert" || mode === "visual" || mode === "replace" || mode === "cmd") {
        return mode
    }

    return "normal"
}

/**
 * buildVimImeEndpoint 构建本地输入法服务地址.
 * @param port - 输入法服务端口.
 * @returns 完整的 HTTP 接口地址.
 */
export function buildVimImeEndpoint(port: number): string {
    return `http://${VIM_IME_API_HOST}:${port}${VIM_IME_API_PATH}`
}

/**
 * markVimImeEndpointUnavailable 将当前端点标记为不可用, 并仅在首次失败时输出一次友好提示.
 * 同一端口的服务一旦确认不存在, 当前页面生命周期内后续模式切换将直接忽略.
 * 本地输入法服务为可选组件, 未运行属于预期场景(不是报错), 提示文案说明用途与建议.
 * @param endpoint - 当前输入法服务地址.
 * @returns 无返回值.
 */
function markVimImeEndpointUnavailable(endpoint: string): void {
    unavailableVimImeEndpointSet.add(endpoint)

    if (warnedUnavailableVimImeEndpointSet.has(endpoint)) {
        return
    }

    warnedUnavailableVimImeEndpointSet.add(endpoint)
    console.warn(
        `未检测到本地 Vim 输入法服务(${endpoint}), 本页将跳过 Vim 模式的输入法联动(属正常现象); 如需编辑器 Vim 模式自动切换输入法, 请先启动本地 blog-vim-ime 服务.`,
    )
}

/**
 * shouldIgnoreVimImeRequest 判断当前端点是否已经确认不可用.
 * @param endpoint - 当前输入法服务地址.
 * @returns true 表示应跳过请求.
 */
function shouldIgnoreVimImeRequest(endpoint: string): boolean {
    return unavailableVimImeEndpointSet.has(endpoint)
}

/**
 * notifyVimModeChange 将 Vim 模式切换异步通知给本地输入法服务.
 * 本地服务已支持 CORS, 这里直接发送 JSON 请求; 当前服务仅根据 mode-after 决定最终输入法状态, mode-before 仅保留给日志或兼容用途.
 * 若端口上不存在服务, 则在首次失败后缓存为不可用并忽略后续请求.
 * @param options - 模式切换与端口配置; force 为 true 时, 即使前后模式相同也会强制通知一次.
 * @returns Promise, 请求完成后结束.
 */
export async function notifyVimModeChange(options: NotifyVimModeChangeOptions): Promise<void> {
    const { modeBefore, modeAfter, port, force = false } = options

    if (!force && modeBefore === modeAfter) {
        return
    }

    const endpoint = buildVimImeEndpoint(port || DEFAULT_VIM_IME_PORT)

    if (shouldIgnoreVimImeRequest(endpoint)) {
        return
    }

    const controller = new AbortController()
    const timeoutId = globalThis.setTimeout(() => controller.abort(), VIM_IME_REQUEST_TIMEOUT)

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            keepalive: true,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "mode-before": modeBefore,
                "mode-after": modeAfter,
            }),
            signal: controller.signal,
        })

        if (!response.ok) {
            console.warn(`Vim IME hook request failed with status ${response.status}.`)
        }
    } catch {
        markVimImeEndpointUnavailable(endpoint)
    } finally {
        globalThis.clearTimeout(timeoutId)
    }
}

/**
 * syncVimModeWithIme 按当前 Vim 模式主动校准一次本地输入法状态.
 * 进入 Vim 控制流时, 即使模式没有发生变化, 也需要强制通知一次, 纠正外部输入法与编辑器状态不一致的问题.
 * @param mode - 当前 Vim 模式.
 * @param port - 输入法服务端口.
 * @returns Promise, 请求完成后结束.
 */
export async function syncVimModeWithIme(mode: VimModeName, port: number): Promise<void> {
    await notifyVimModeChange({
        modeBefore: mode,
        modeAfter: mode,
        port,
        force: true,
    })
}
