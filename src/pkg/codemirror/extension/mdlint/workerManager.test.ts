/**
 * FilePath    : blog-client\src\pkg\codemirror\extension\mdlint\workerManager.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 测试 MarkdownLint Worker 管理器
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { acquireMarkdownLintWorker, releaseMarkdownLintWorker, requestMarkdownLintByWorker, resetMarkdownLintWorkerManagerForTest } from "./workerManager"

type WorkerListener = (event: { data?: unknown }) => void

class MockWorker {
    public readonly addEventListener = vi.fn((type: string, listener: WorkerListener) => {
        const listeners = this.listeners.get(type) ?? new Set<WorkerListener>()
        listeners.add(listener)
        this.listeners.set(type, listeners)
    })

    public readonly removeEventListener = vi.fn((type: string, listener: WorkerListener) => {
        this.listeners.get(type)?.delete(listener)
    })

    public readonly postMessage = vi.fn((message: { id: number }) => {
        Promise.resolve().then(() => {
            this.emit("message", {
                data: {
                    id: message.id,
                    diagnostics: [{ from: 0, to: 0, severity: "warning", message: "mock", source: "rule001" }],
                },
            })
        })
    })

    public readonly terminate = vi.fn()

    private readonly listeners = new Map<string, Set<WorkerListener>>()

    /**
     * emit 向指定事件类型广播模拟消息.
     * @param type 事件类型.
     * @param event 事件载荷.
     */
    emit(type: string, event: { data?: unknown }) {
        for (const listener of this.listeners.get(type) ?? []) {
            listener(event)
        }
    }
}

describe("workerManager", () => {
    const workerInstances: MockWorker[] = []

    beforeEach(() => {
        workerInstances.length = 0
        vi.useFakeTimers()
        vi.stubGlobal(
            "Worker",
            class extends MockWorker {
                constructor() {
                    super()
                    workerInstances.push(this)
                }
            } as unknown as typeof Worker,
        )
    })

    afterEach(() => {
        resetMarkdownLintWorkerManagerForTest()
        vi.unstubAllGlobals()
        vi.useRealTimers()
        vi.restoreAllMocks()
    })

    it("应在多个调用方之间复用同一个 worker 实例", () => {
        const workerA = acquireMarkdownLintWorker()
        const workerB = acquireMarkdownLintWorker()

        expect(workerA).toBe(workerB)
        expect(workerInstances).toHaveLength(1)
    })

    it("应通过共享 worker 返回诊断结果", async () => {
        acquireMarkdownLintWorker()

        const diagnostics = await requestMarkdownLintByWorker("# 标题", {
            useWorker: true,
            rules: { rule002: false, rule003: false },
        })

        expect(diagnostics).toHaveLength(1)
        expect(diagnostics[0]?.message).toBe("mock")
        expect(workerInstances[0]?.postMessage).toHaveBeenCalledTimes(1)
    })

    it("应在空闲超时后释放共享 worker", () => {
        acquireMarkdownLintWorker()
        acquireMarkdownLintWorker()

        releaseMarkdownLintWorker()
        expect(workerInstances[0]?.terminate).not.toHaveBeenCalled()

        releaseMarkdownLintWorker()
        vi.advanceTimersByTime(15_000)

        expect(workerInstances[0]?.terminate).toHaveBeenCalledTimes(1)
    })
})
