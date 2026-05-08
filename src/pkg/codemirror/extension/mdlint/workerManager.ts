/**
 * FilePath    : blog-client\src\pkg\codemirror\extension\mdlint\workerManager.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : Markdown lint Worker 生命周期管理
 */

import type { Diagnostic } from "@codemirror/lint"

import type { MarkdownLinterOptions } from "./types"

const WORKER_IDLE_TIMEOUT = 15_000

type PendingRequest = {
    resolve: (diagnostics: Diagnostic[]) => void
}

type WorkerState = {
    worker: Worker
    refCount: number
    nextRequestId: number
    pendingRequests: Map<number, PendingRequest>
    idleTimer: ReturnType<typeof setTimeout> | null
}

let sharedWorkerState: WorkerState | null = null

/**
 * createWorkerState 创建共享 worker 状态, 统一管理消息分发与待处理请求.
 * @returns 初始化完成的 worker 状态对象.
 */
function createWorkerState(): WorkerState {
    const worker = new Worker(new URL("./worker.ts", import.meta.url), { type: "module" })
    const state: WorkerState = {
        worker,
        refCount: 0,
        nextRequestId: 0,
        pendingRequests: new Map(),
        idleTimer: null,
    }

    worker.addEventListener("message", (event: MessageEvent) => {
        const messageId = event.data?.id
        if (typeof messageId !== "number") {
            return
        }

        const pending = state.pendingRequests.get(messageId)
        if (!pending) {
            return
        }

        state.pendingRequests.delete(messageId)
        pending.resolve(Array.isArray(event.data?.diagnostics) ? event.data.diagnostics : [])
    })

    worker.addEventListener("error", () => {
        settlePendingRequests(state, [])
        disposeWorkerState(state)
        if (sharedWorkerState === state) {
            sharedWorkerState = null
        }
    })

    return state
}

/**
 * settlePendingRequests 批量结束当前 worker 上挂起的请求, 避免 Promise 悬挂.
 * @param state worker 状态对象.
 * @param diagnostics 失败兜底时返回的诊断结果.
 */
function settlePendingRequests(state: WorkerState, diagnostics: Diagnostic[]) {
    for (const pending of state.pendingRequests.values()) {
        pending.resolve(diagnostics)
    }
    state.pendingRequests.clear()
}

/**
 * clearIdleTimer 清除空闲销毁定时器, 用于复用现有 worker.
 * @param state worker 状态对象.
 */
function clearIdleTimer(state: WorkerState) {
    if (state.idleTimer) {
        clearTimeout(state.idleTimer)
        state.idleTimer = null
    }
}

/**
 * disposeWorkerState 终止 worker 并释放当前状态上的挂起请求.
 * @param state worker 状态对象.
 */
function disposeWorkerState(state: WorkerState) {
    clearIdleTimer(state)
    settlePendingRequests(state, [])

    try {
        state.worker.terminate()
    } catch {
        /* ignore */
    }
}

/**
 * scheduleWorkerDispose 在最后一个编辑器释放后延迟销毁 worker, 减少短时间内反复创建.
 * @param state worker 状态对象.
 */
function scheduleWorkerDispose(state: WorkerState) {
    clearIdleTimer(state)
    state.idleTimer = setTimeout(() => {
        if (sharedWorkerState !== state || state.refCount > 0) {
            return
        }

        disposeWorkerState(state)
        sharedWorkerState = null
    }, WORKER_IDLE_TIMEOUT)
}

/**
 * getWorkerState 获取共享 worker 状态, 不存在时按需创建.
 * @returns 共享 worker 状态对象.
 */
function getWorkerState(): WorkerState {
    sharedWorkerState ??= createWorkerState()
    return sharedWorkerState
}

/**
 * acquireMarkdownLintWorker 获取共享 worker, 并增加使用引用计数.
 * @returns 可复用的 Markdown lint worker 实例.
 */
export function acquireMarkdownLintWorker(): Worker {
    const state = getWorkerState()
    state.refCount += 1
    clearIdleTimer(state)
    return state.worker
}

/**
 * releaseMarkdownLintWorker 释放一次 worker 使用引用, 空闲时延迟回收实例.
 */
export function releaseMarkdownLintWorker() {
    if (!sharedWorkerState) {
        return
    }

    sharedWorkerState.refCount = Math.max(0, sharedWorkerState.refCount - 1)
    if (sharedWorkerState.refCount === 0) {
        scheduleWorkerDispose(sharedWorkerState)
    }
}

/**
 * requestMarkdownLintByWorker 将文档内容发送给共享 worker 执行 lint.
 * @param text 当前 Markdown 文本.
 * @param options lint 配置项.
 * @returns worker 返回的诊断结果数组.
 */
export function requestMarkdownLintByWorker(text: string, options: MarkdownLinterOptions = {}): Promise<Diagnostic[]> {
    if (!sharedWorkerState) {
        return Promise.resolve([])
    }

    const state = sharedWorkerState
    const messageId = ++state.nextRequestId

    return new Promise<Diagnostic[]>((resolve) => {
        state.pendingRequests.set(messageId, { resolve })

        try {
            const safeOptions = { useWorker: options.useWorker, rules: options.rules }
            // oxlint-disable-next-line unicorn/require-post-message-target-origin
            state.worker.postMessage({ id: messageId, text, options: safeOptions })
        } catch {
            state.pendingRequests.delete(messageId)
            // 发送失败时直接回退为空结果, 避免阻塞编辑器交互.
            resolve([])
        }
    })
}

/**
 * resetMarkdownLintWorkerManagerForTest 重置共享 worker 管理器, 供单元测试隔离状态使用.
 */
export function resetMarkdownLintWorkerManagerForTest() {
    if (!sharedWorkerState) {
        return
    }

    disposeWorkerState(sharedWorkerState)
    sharedWorkerState = null
}
