/**
 * FilePath    : blog-client\src\pkg\mermaid\index.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : mermaid 图表装配层 — 惰性加载 / 容器渲染 / 主题联动 / 错误降级 (260917-01)
 */

/**
 * 补充说明:
 * 同步渲染管线 (src/pkg/marked) 只输出源码占位容器, 本模块在浏览器端把占位容器渲染为 SVG.
 * mermaid 体积大 (约 1MB+), 必须保持动态 import 独立异步 chunk, 且仅当页面存在 mermaid 块时才加载;
 * SSR 与测试环境的 Node 侧入口直接 no-op 返回.
 */

import { watch } from "vue"

import type { Mermaid } from "mermaid"

import { activeThemeSchemeState } from "@/theme/useTheme"
import type { ThemeScheme } from "@/theme/presets"

/** markdown 围栏代码块语言标识, 与 renderer.code 中的拦截分支保持一致 */
export const MERMAID_LANG = "mermaid"

/** 占位容器选择器, 供渲染与复制流水线共用 */
export const MERMAID_CONTAINER_SELECTOR = ".jpz-mermaid-container"

/** 源码 pre 的类名 */
export const MERMAID_SOURCE_CLASS = "jpz-mermaid-source"

/** SVG 挂载节点的类名 */
export const MERMAID_SVG_CLASS = "jpz-mermaid-svg"

/** 错误信息节点的类名 */
export const MERMAID_ERROR_CLASS = "jpz-mermaid-error"

/** 容器渲染状态: pending 未渲染 / rendering 渲染中 / rendered 已渲染 / error 源码错误 / empty 源码为空 */
export type MermaidContainerStatus = "pending" | "rendering" | "rendered" | "error" | "empty"

/** 渲染调度防抖时间, 单位毫秒; 编辑器连续输入时避免逐字符触发整批图表重渲染 */
const MERMAID_RENDER_DEBOUNCE_MS = 200

/** 复制截图上下安全边距, 单位 px; mermaid 外框偶有溢出笔画, 补边距避免被 snapdom 裁掉 */
export const MERMAID_CAPTURE_PADDING = { top: 8, bottom: 8, left: 8, right: 8 } as const

let mermaidInstance: Mermaid | null = null
let initializedTheme = ""
let mermaidLoadPromise: Promise<Mermaid> | null = null
let mermaidIdCounter = 0

// 每个渲染根容器独立的世代计数: 内容更新后旧一轮异步渲染结果必须丢弃, 防止竞态覆盖新 DOM
const renderGenerationMap = new WeakMap<HTMLElement, number>()

/**
 * @description: 按站点明暗 scheme 返回 mermaid 主题名.
 * @param scheme 站点主题 scheme.
 * @return mermaid 主题名.
 */
export function getMermaidThemeByScheme(scheme: ThemeScheme): "default" | "dark" {
    return scheme === "dark" ? "dark" : "default"
}

/**
 * @description: 惰性加载并初始化 mermaid 实例, 主题变化时重新 initialize.
 * @param theme 当前应使用的 mermaid 主题名.
 * @return 初始化完成的 mermaid 实例.
 * @throws 动态导入失败 (网络异常 / chunk 加载失败) 时向调用方抛出.
 */
async function loadMermaid(theme: "default" | "dark"): Promise<Mermaid> {
    if (mermaidInstance && initializedTheme === theme) {
        return mermaidInstance
    }

    if (!mermaidLoadPromise) {
        mermaidLoadPromise = import("mermaid").then((module) => {
            return module.default
        })
    }

    const mermaid = await mermaidLoadPromise

    // securityLevel 保持 strict: mermaid 对标签文本消毒, 与主站 DOMPurify 白名单策略一致
    mermaid.initialize({
        startOnLoad: false,
        securityLevel: "strict",
        darkMode: theme === "dark",
        theme,
    })

    mermaidInstance = mermaid
    initializedTheme = theme

    return mermaid
}

/**
 * @description: 读取容器状态标记.
 * @param container mermaid 占位容器.
 * @return 当前状态.
 */
export function getMermaidContainerStatus(container: HTMLElement): MermaidContainerStatus {
    return (container.dataset.mermaidStatus as MermaidContainerStatus | undefined) ?? "pending"
}

/**
 * @description: 将渲染失败信息写入容器, 并以源码 pre 降级展示.
 * @param container mermaid 占位容器.
 * @param message 面向用户的错误信息.
 * @return 无返回值.
 */
function setMermaidContainerError(container: HTMLElement, message: string): void {
    container.dataset.mermaidStatus = "error"

    let errorElement = container.querySelector(`:scope > .${MERMAID_ERROR_CLASS}`)
    if (!errorElement) {
        errorElement = document.createElement("div")
        errorElement.className = MERMAID_ERROR_CLASS
        const sourceElement = container.querySelector(`:scope > .${MERMAID_SOURCE_CLASS}`)
        container.insertBefore(errorElement, sourceElement ?? null)
    }

    // 用 textContent 写入, 错误信息可能包含用户源码片段, 避免二次注入
    errorElement.textContent = message
}

/**
 * @description: 清理 mermaid.render 失败时遗留在 body 的临时测量节点.
 * @param id 本次 render 使用的 svg id.
 * @return 无返回值.
 */
function removeMermaidRenderDebris(id: string): void {
    document.getElementById(`d${id}`)?.remove()
    document.getElementById(id)?.remove()
}

/**
 * @description: 渲染单个 mermaid 占位容器, 成功后把 SVG 注入挂载节点.
 * @param container mermaid 占位容器.
 * @param mermaid 已初始化的 mermaid 实例.
 * @param force true 表示对已渲染容器也强制重渲染 (主题切换场景).
 * @return 无返回值.
 */
async function renderSingleMermaidContainer(container: HTMLElement, mermaid: Mermaid, force: boolean): Promise<void> {
    const status = getMermaidContainerStatus(container)

    if ((status === "rendered" || status === "rendering") && !force) {
        return
    }

    const sourceElement = container.querySelector(`:scope > .${MERMAID_SOURCE_CLASS}`)
    const source = (sourceElement?.textContent ?? "").trim()

    if (!source) {
        container.dataset.mermaidStatus = "empty"
        return
    }

    const id = `jpz-mermaid-svg-${(mermaidIdCounter += 1)}`
    container.dataset.mermaidStatus = "rendering"

    try {
        const { svg } = await mermaid.render(id, source)

        let svgHolder = container.querySelector(`:scope > .${MERMAID_SVG_CLASS}`)
        if (!svgHolder) {
            svgHolder = document.createElement("div")
            svgHolder.className = MERMAID_SVG_CLASS
            container.appendChild(svgHolder)
        }

        // securityLevel: "strict" 下 mermaid 输出已消毒, 此处直接注入
        svgHolder.innerHTML = svg
        container.dataset.mermaidStatus = "rendered"
    } catch (error) {
        removeMermaidRenderDebris(id)
        console.error("mermaid 渲染失败", error)
        setMermaidContainerError(container, `mermaid 图表渲染失败: ${error instanceof Error ? error.message : String(error)}`)
    }
}

export interface RenderMermaidOptions {
    /** true 表示忽略已渲染状态强制重渲染, 用于主题切换 */
    force?: boolean
}

/**
 * @description: 渲染容器内全部 mermaid 占位容器 (含容器自身命中时).
 * @param container 预览根容器.
 * @param options 渲染选项.
 * @return 无返回值.
 * @remarks SSR / Node 环境 no-op; 同一容器的上一轮未完成渲染会被新一轮作废 (世代计数防竞态).
 */
export async function renderMermaidInContainer(container: HTMLElement, options: RenderMermaidOptions = {}): Promise<void> {
    if (typeof document === "undefined") {
        return
    }

    const containers = Array.from(container.querySelectorAll<HTMLElement>(MERMAID_CONTAINER_SELECTOR))
    if (container instanceof HTMLElement && container.matches(MERMAID_CONTAINER_SELECTOR)) {
        containers.unshift(container)
    }

    if (containers.length === 0) {
        return
    }

    const generation = (renderGenerationMap.get(container) ?? 0) + 1
    renderGenerationMap.set(container, generation)

    const theme = getMermaidThemeByScheme(activeThemeSchemeState.value)

    let mermaid: Mermaid
    try {
        mermaid = await loadMermaid(theme)
    } catch (error) {
        console.error("mermaid 加载失败", error)
        containers.forEach((element) => {
            setMermaidContainerError(element, "mermaid 模块加载失败，请检查网络后重试")
        })
        return
    }

    // 动态导入期间容器可能已被内容更新移除, 渲染前校验挂载状态
    if (renderGenerationMap.get(container) !== generation) {
        return
    }

    await Promise.all(
        containers.filter((element) => element.isConnected).map((element) => renderSingleMermaidContainer(element, mermaid, options.force === true)),
    )
}

/**
 * @description: mermaid 容器渲染调度 composable, 供预览类组件复用.
 * @remarks 内置 200ms 尾随防抖 (编辑器连续输入只触发一次批量渲染);
 *          订阅站点明暗 scheme, 主题切换时对已渲染容器强制重渲染; 仅可在组件 setup 中使用.
 * @param getElements 返回当前全部渲染目标容器的函数 (web 预览与微信离屏 staging 节点需同时渲染,
 *                    复制流水线从 staging 节点克隆, 未渲染则微信复制拿不到 SVG).
 * @return 调度函数, 传 true 强制重渲染.
 */
export function useMermaidRenderer(getElements: () => Array<HTMLElement | null>): { scheduleMermaidRender: (force?: boolean) => void } {
    let renderTimer: ReturnType<typeof setTimeout> | null = null

    const scheduleMermaidRender = (force = false): void => {
        if (typeof window === "undefined") {
            return
        }

        if (renderTimer) {
            clearTimeout(renderTimer)
        }

        renderTimer = setTimeout(() => {
            renderTimer = null
            for (const element of getElements()) {
                if (element) {
                    void renderMermaidInContainer(element, { force })
                }
            }
        }, MERMAID_RENDER_DEBOUNCE_MS)
    }

    watch(activeThemeSchemeState, () => {
        scheduleMermaidRender(true)
    })

    return { scheduleMermaidRender }
}
