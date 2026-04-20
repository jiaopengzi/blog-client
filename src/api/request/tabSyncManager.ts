/**
 * FilePath    : blog-client\src\api\request\tabSyncManager.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 跨标签 token 同步管理器
 */

/** BroadcastChannel 频道名称，同源下所有标签页共享同一频道 */
const AUTH_SYNC_CHANNEL_NAME = "auth_sync"

// 跨标签同步消息类型
export enum TabSyncMessageType {
    /** 某标签完成 refresh 后广播新 token，其余标签被动接收 */
    TOKEN_UPDATED = "TOKEN_UPDATED",
    /** 用户主动退出登录时广播，其余标签同步清除登录态 */
    TOKEN_CLEARED = "TOKEN_CLEARED",
    /** 新标签启动时主动请求其他标签共享 token（请求-响应模式） */
    REQUEST_TOKEN = "REQUEST_TOKEN",
    /** 已有 token 的标签回复请求（请求-响应模式） */
    RESPONSE_TOKEN = "RESPONSE_TOKEN",
}

interface TabSyncRequestMessage {
    type: TabSyncMessageType.REQUEST_TOKEN
    requestId: string
}

interface TabSyncResponseMessage {
    type: TabSyncMessageType.RESPONSE_TOKEN
    requestId: string
    token: string
}

interface TabSyncTokenUpdatedMessage {
    type: TabSyncMessageType.TOKEN_UPDATED
    token: string
}

interface TabSyncTokenClearedMessage {
    type: TabSyncMessageType.TOKEN_CLEARED
}

type TabSyncMessage = TabSyncRequestMessage | TabSyncResponseMessage | TabSyncTokenUpdatedMessage | TabSyncTokenClearedMessage

/**
 * @description: 负责在同一浏览器标签页之间同步 access token, 并提供静默更新能力以避免广播循环.
 * @returns {void}
 * @throws {void} 当前实现内部兜底处理异常, 不向外抛出.
 */
class TabSyncManager {
    private channel: BroadcastChannel | null = null

    /** requestId → resolve 回调；用于将异步 postMessage 响应映射回对应的 Promise */
    private pendingRequests = new Map<string, (token: string | null) => void>()

    /**
     * 静默写入深度计数器（非布尔值）。
     * 使用计数而非布尔，是因为理论上可能存在多个并发的静默写入（如快速连续收到两条 TOKEN_UPDATED），
     * 计数器在嵌套/重入场景下仍能正确判断"是否处于静默写入中"。
     */
    private silentUpdateDepth = 0

    constructor() {
        // SSR 环境守卫：Node.js 中无 window / BroadcastChannel
        if (typeof window === "undefined" || typeof BroadcastChannel === "undefined") {
            return
        }

        this.channel = new BroadcastChannel(AUTH_SYNC_CHANNEL_NAME)
        this.channel.addEventListener("message", (event: MessageEvent<TabSyncMessage>) => {
            void this.handleMessage(event.data)
        })
    }

    /**
     * @description: 判断当前环境是否支持 BroadcastChannel.
     * @returns {boolean} 支持时返回 true, 否则返回 false.
     * @throws {void} 无.
     */
    isSupported(): boolean {
        return !!this.channel
    }

    /**
     * @description: 广播 token 更新, 供其他标签页复用最新 access token.
     * @param {string} token 最新 access token.
     * @returns {void}
     * @throws {void} 无.
     */
    broadcastTokenUpdate(token: string): void {
        if (!token || !this.channel) return
        // oxlint-disable-next-line unicorn/require-post-message-target-origin -- BroadcastChannel.postMessage 无 targetOrigin 参数
        this.channel.postMessage({ type: TabSyncMessageType.TOKEN_UPDATED, token } satisfies TabSyncTokenUpdatedMessage)
    }

    /**
     * @description: 广播 token 清除事件, 让其他标签页同步退出登录态.
     * @returns {void}
     * @throws {void} 无.
     */
    broadcastTokenClear(): void {
        if (!this.channel) return
        // oxlint-disable-next-line unicorn/require-post-message-target-origin -- BroadcastChannel.postMessage 无 targetOrigin 参数
        this.channel.postMessage({ type: TabSyncMessageType.TOKEN_CLEARED } satisfies TabSyncTokenClearedMessage)
    }

    /**
     * @description: 向其他标签页请求 token, 在超时时间内返回首个收到的 token.
     * @param {number} timeoutMs 等待其他标签响应的超时时间, 单位毫秒.
     * @returns {Promise<string | null>} 收到 token 时返回 token, 否则返回 null.
     * @throws {void} 无.
     */
    requestTokenFromOtherTabs(timeoutMs: number = 200): Promise<string | null> {
        if (!this.channel) {
            return Promise.resolve(null)
        }

        const requestId = this.createRequestId()

        // 竞态模式：超时与响应谁先到达就 resolve 谁
        return new Promise((resolve) => {
            const timer = window.setTimeout(() => {
                this.pendingRequests.delete(requestId)
                resolve(null) // 超时未收到任何标签的响应，视为无可用 token
            }, timeoutMs)

            this.pendingRequests.set(requestId, (token) => {
                window.clearTimeout(timer)
                this.pendingRequests.delete(requestId)
                resolve(token) // 收到首个响应即完成，忽略后续重复响应
            })

            // oxlint-disable-next-line unicorn/require-post-message-target-origin -- BroadcastChannel.postMessage 无 targetOrigin 参数
            this.channel?.postMessage({ type: TabSyncMessageType.REQUEST_TOKEN, requestId } satisfies TabSyncRequestMessage)
        })
    }

    /**
     * @description: 以静默方式设置 token, 避免本地更新再次触发广播形成循环.
     * @param {string} token 需要写入 store 的 access token.
     * @returns {Promise<void>}
     * @throws {void} 无.
     */
    async setTokenSilently(token: string): Promise<void> {
        // 进入静默模式：depth+1 → store.setAccessToken 内的广播守卫生效 → depth-1
        this.silentUpdateDepth += 1

        try {
            // 动态导入避免 tabSyncManager ↔ userStore 循环依赖
            const { useUserStore } = await import("@/stores/user")
            useUserStore().setAccessToken(token)
        } finally {
            this.silentUpdateDepth = Math.max(0, this.silentUpdateDepth - 1)
        }
    }

    /**
     * @description: 判断当前 token 更新是否应跳过广播, 用于 store 写入时防止循环同步.
     * @returns {boolean} 需要跳过广播时返回 true.
     * @throws {void} 无.
     */
    shouldSkipBroadcast(): boolean {
        return this.silentUpdateDepth > 0
    }

    /**
     * @description: 处理其他标签发来的同步消息, 包括 token 请求、响应与广播更新.
     * @param {TabSyncMessage} message 收到的跨标签同步消息.
     * @returns {Promise<void>}
     * @throws {void} 无.
     */
    private async handleMessage(message: TabSyncMessage): Promise<void> {
        switch (message.type) {
            case TabSyncMessageType.REQUEST_TOKEN:
                await this.handleTokenRequest(message) // 其他标签来要 token → 响应
                return
            case TabSyncMessageType.RESPONSE_TOKEN:
                this.handleTokenResponse(message) // 收到其他标签给的 token → 唤醒等待中的 Promise
                return
            case TabSyncMessageType.TOKEN_UPDATED:
                await this.setTokenSilently(message.token) // 其他标签 refresh 成功 → 静默写入本标签
                return
            case TabSyncMessageType.TOKEN_CLEARED:
                await this.setTokenSilently("") // 其他标签退出登录 → 清空本标签 token
                return
        }
    }

    /**
     * @description: 响应其他标签的 token 请求, 仅在当前标签存在 token 时返回结果.
     * @param {TabSyncRequestMessage} message token 请求消息.
     * @returns {Promise<void>}
     * @throws {void} 无.
     */
    private async handleTokenRequest(message: TabSyncRequestMessage): Promise<void> {
        const token = await this.getCurrentAccessToken()
        if (!token || !this.channel) return

        /* oxlint-disable unicorn/require-post-message-target-origin -- BroadcastChannel.postMessage 无 targetOrigin 参数 */
        this.channel.postMessage({
            type: TabSyncMessageType.RESPONSE_TOKEN,
            requestId: message.requestId,
            token,
        } satisfies TabSyncResponseMessage)
        /* oxlint-enable unicorn/require-post-message-target-origin */
    }

    /**
     * @description: 处理其他标签返回的 token 响应, 唤醒对应的等待请求.
     * @param {TabSyncResponseMessage} message token 响应消息.
     * @returns {void}
     * @throws {void} 无.
     */
    private handleTokenResponse(message: TabSyncResponseMessage): void {
        const resolver = this.pendingRequests.get(message.requestId)
        resolver?.(message.token || null)
    }

    /**
     * @description: 延迟读取当前用户 store 中的 access token, 避免静态导入产生循环依赖.
     * @returns {Promise<string>} 当前 access token, 不存在时返回空字符串.
     * @throws {void} 无.
     */
    private async getCurrentAccessToken(): Promise<string> {
        const { useUserStore } = await import("@/stores/user")
        return useUserStore().accessToken || ""
    }

    /**
     * @description: 生成一次 token 请求的唯一标识, 用于匹配响应结果.
     * @returns {string} 请求唯一 ID.
     * @throws {void} 无.
     */
    private createRequestId(): string {
        return `${Date.now()}_${Math.random().toString(36).slice(2)}`
    }
}

/** 全局单例：所有模块共享同一个 BroadcastChannel 连接 */
export const tabSyncManager = new TabSyncManager()
