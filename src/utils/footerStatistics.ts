/**
 * FilePath    : blog-client\src\utils\footerStatistics.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 页脚统计脚本控制
 */

import { loadScriptFromString } from "./script"

interface AnalyticsWindow extends Window {
    [key: string]: unknown
    dataLayer?: unknown
    gtag?: unknown
}

type AnalyticsGlobalPropertyName = "_hmt" | "dataLayer" | "gtag"
type AnalyticsQueuePropertyName = "_hmt" | "dataLayer"

const FOOTER_STATISTICS_SCRIPT_ATTRIBUTE = "data-footer-statistics-script"

let loadedFooterStatisticsCode = ""

/**
 * 判断当前路径是否属于 admin 路由.
 *
 * @param path 当前路由路径.
 * @returns 如果路径位于 /admin 下则返回 true, 否则返回 false.
 */
export const isAdminRoute = (path: string): boolean => {
    return path.startsWith("/admin")
}

/**
 * 在路由进入 admin 前预先禁用 Google Analytics, 避免 SPA 自动上报 page_view.
 *
 * @param scriptStr 统计脚本字符串.
 * @param path 即将进入的路由路径.
 * @returns void.
 */
export const blockFooterStatisticsForPath = (scriptStr: string | undefined, path: string): void => {
    if (!isAdminRoute(path)) {
        return
    }

    disableFooterStatisticsScript(scriptStr)
}

/**
 * 在公开页启用统计脚本, 并在重复进入同一脚本内容时避免重复加载.
 *
 * @param scriptStr 统计脚本字符串.
 * @returns Promise<void>.
 */
export const enableFooterStatisticsScript = async (scriptStr: string | undefined): Promise<void> => {
    if (!scriptStr) {
        disableFooterStatisticsScript(scriptStr)
        return
    }

    setGoogleAnalyticsDisableState(scriptStr, false)

    if (loadedFooterStatisticsCode === scriptStr) {
        return
    }

    cleanupFooterStatisticsScripts()
    const ok = await loadScriptFromString(scriptStr, {
        scriptAttributes: {
            [FOOTER_STATISTICS_SCRIPT_ATTRIBUTE]: "true",
        },
    })

    loadedFooterStatisticsCode = ok ? scriptStr : ""
    console.info("加载统计脚本:", ok ? "成功" : "失败")
}

/**
 * 禁用统计脚本并清理当前页面已注入的统计资源.
 *
 * @param scriptStr 统计脚本字符串.
 * @returns void.
 */
export const disableFooterStatisticsScript = (scriptStr: string | undefined): void => {
    setGoogleAnalyticsDisableState(scriptStr, true)
    cleanupFooterStatisticsScripts()
    loadedFooterStatisticsCode = ""
}

/**
 * 按当前路由同步页脚统计脚本, 公开页启用, admin 页禁用并清理.
 *
 * @param scriptStr 统计脚本字符串.
 * @param path 当前路由路径.
 * @returns Promise<void>.
 */
export const syncFooterStatisticsScriptForPath = async (scriptStr: string | undefined, path: string): Promise<void> => {
    if (!scriptStr || isAdminRoute(path)) {
        disableFooterStatisticsScript(scriptStr)
        return
    }

    await enableFooterStatisticsScript(scriptStr)
}

/**
 * 从统计脚本中提取 Google Analytics measurement id.
 *
 * @param scriptStr 统计脚本字符串.
 * @returns 提取后的 measurement id 列表.
 */
export const extractGoogleAnalyticsMeasurementIds = (scriptStr: string | undefined): string[] => {
    if (!scriptStr) {
        return []
    }

    const measurementIds = new Set<string>()
    const measurementIdRegex = /(?:gtag\/js\?id=|gtag\s*\(\s*["']config["']\s*,\s*["'])([A-Z]+-[A-Z0-9-]+)/g

    for (const match of scriptStr.matchAll(measurementIdRegex)) {
        const measurementId = match[1]
        if (measurementId) {
            measurementIds.add(measurementId)
        }
    }

    return Array.from(measurementIds)
}

/**
 * 清理当前页面已注入的统计脚本和相关全局变量.
 *
 * @returns void.
 */
function cleanupFooterStatisticsScripts(): void {
    document.querySelectorAll(`script[${FOOTER_STATISTICS_SCRIPT_ATTRIBUTE}="true"]`).forEach((scriptElement) => {
        scriptElement.remove()
    })

    const analyticsWindow = getAnalyticsWindow()

    resetAnalyticsQueue(analyticsWindow, "_hmt")
    resetAnalyticsQueue(analyticsWindow, "dataLayer")
    resetGoogleAnalyticsFunction(analyticsWindow)
}

/**
 * 安全重置统计队列, 避免第三方脚本在异步回调中访问到 undefined.push.
 *
 * 这里不再删除队列变量, 而是保留一个空数组占位. 这样即使外部 SDK 在脚本卸载后
 * 仍然尝试执行 push, 也不会因为队列不存在而抛错.
 *
 * @param analyticsWindow 允许动态属性访问的 window 包装对象.
 * @param propertyName 需要重置的队列属性名.
 * @returns void.
 */
function resetAnalyticsQueue(analyticsWindow: AnalyticsWindow, propertyName: AnalyticsQueuePropertyName): void {
    const currentValue = analyticsWindow[propertyName]

    if (Array.isArray(currentValue)) {
        currentValue.length = 0
        return
    }

    setAnalyticsGlobalProperty(analyticsWindow, propertyName, [])
}

/**
 * 重置 gtag 为可安全调用的占位函数, 避免异步回调读取到失效函数后报错.
 *
 * @param analyticsWindow 允许动态属性访问的 window 包装对象.
 * @returns void.
 */
function resetGoogleAnalyticsFunction(analyticsWindow: AnalyticsWindow): void {
    const currentValue = analyticsWindow.gtag

    if (typeof currentValue === "function") {
        setAnalyticsGlobalProperty(analyticsWindow, "gtag", (...args: unknown[]) => {
            const dataLayer = ensureAnalyticsQueue(analyticsWindow, "dataLayer")
            dataLayer.push(args)
        })
        return
    }

    setAnalyticsGlobalProperty(analyticsWindow, "gtag", (...args: unknown[]) => {
        const dataLayer = ensureAnalyticsQueue(analyticsWindow, "dataLayer")
        dataLayer.push(args)
    })
}

/**
 * 确保统计队列始终是可用数组.
 *
 * @param analyticsWindow 允许动态属性访问的 window 包装对象.
 * @param propertyName 统计队列属性名.
 * @returns 可用的统计队列数组.
 */
function ensureAnalyticsQueue(analyticsWindow: AnalyticsWindow, propertyName: AnalyticsQueuePropertyName): unknown[] {
    const currentValue = analyticsWindow[propertyName]

    if (Array.isArray(currentValue)) {
        return currentValue
    }

    const queue: unknown[] = []
    setAnalyticsGlobalProperty(analyticsWindow, propertyName, queue)
    return queue
}

/**
 * 安全设置统计相关全局变量.
 *
 * @param analyticsWindow 允许动态属性访问的 window 包装对象.
 * @param propertyName 需要设置的全局属性名.
 * @param propertyValue 需要写入的属性值.
 * @returns void.
 */
function setAnalyticsGlobalProperty(analyticsWindow: AnalyticsWindow, propertyName: AnalyticsGlobalPropertyName, propertyValue: unknown): void {
    const propertyDescriptor = Object.getOwnPropertyDescriptor(analyticsWindow, propertyName)

    try {
        if (!propertyDescriptor) {
            analyticsWindow[propertyName] = propertyValue
            return
        }

        if (propertyDescriptor.writable || propertyDescriptor.set) {
            analyticsWindow[propertyName] = propertyValue
            return
        }

        if (propertyDescriptor.configurable) {
            Object.defineProperty(analyticsWindow, propertyName, {
                configurable: true,
                writable: true,
                value: propertyValue,
            })
        }
    } catch (error) {
        console.warn(`设置统计全局变量失败: ${propertyName}`, error)
    }
}

/**
 * 设置 Google Analytics 的全局禁用标记.
 *
 * @param scriptStr 统计脚本字符串.
 * @param disabled 是否禁用 Google Analytics 上报.
 * @returns void.
 */
function setGoogleAnalyticsDisableState(scriptStr: string | undefined, disabled: boolean): void {
    const analyticsWindow = getAnalyticsWindow()

    for (const measurementId of extractGoogleAnalyticsMeasurementIds(scriptStr)) {
        analyticsWindow[`ga-disable-${measurementId}`] = disabled
    }
}

/**
 * 获取允许动态属性访问的 window 包装对象.
 *
 * @returns 带索引签名的 window 对象.
 */
function getAnalyticsWindow(): AnalyticsWindow {
    return window as unknown as AnalyticsWindow
}
