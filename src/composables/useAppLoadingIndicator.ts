/*
 * FilePath    : blog-client-nuxt\src\composables\useAppLoadingIndicator.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 全局顶部加载条控制器, 以 pending 计数统一管理路由加载与页面内 API 加载
 */

/*
 * 补充说明:
 * 内置 NuxtLoadingIndicator 一旦需要跨越页面内异步, 就不够可控, 后面直接走手动 pending 计数
 */

import { useNuxtApp } from "#imports"

import { shallowReadonly, shallowRef, type ShallowRef } from "vue"

const MAX_PROGRESS = 95
const HIDE_DELAY = 80
const RESET_DELAY = 120

interface AppLoadingIndicator {
    progress: Readonly<ShallowRef<number>>
    isLoading: Readonly<ShallowRef<boolean>>
    error: Readonly<ShallowRef<boolean>>
    pendingCount: Readonly<ShallowRef<number>>
    beginTask: () => void
    endTask: () => void
    fail: () => void
}

interface InternalAppLoadingIndicator extends AppLoadingIndicator {
    forceClearInternal: () => void
}

type NuxtAppWithAppLoadingIndicator = ReturnType<typeof useNuxtApp> & {
    appLoadingIndicatorInstance?: InternalAppLoadingIndicator
}

/**
 * 清理顶部加载条的隐藏与重置定时器, 避免新任务开始时沿用旧的收尾时序
 * @param hideTimeout 隐藏定时器句柄
 * @param resetTimeout 进度重置定时器句柄
 * @returns 无返回值
 */
function clearIndicatorTimeouts(hideTimeout: ReturnType<typeof setTimeout> | undefined, resetTimeout: ReturnType<typeof setTimeout> | undefined): void {
    if (!import.meta.client) {
        return
    }

    if (hideTimeout) {
        clearTimeout(hideTimeout)
    }

    if (resetTimeout) {
        clearTimeout(resetTimeout)
    }
}

/**
 * 停止顶部加载条的进度动画帧
 * @param rafId 当前动画帧句柄
 * @returns 无返回值
 */
function clearIndicatorAnimation(rafId: number | undefined): void {
    if (!import.meta.client || rafId === undefined) {
        return
    }

    cancelAnimationFrame(rafId)
}

/**
 * 创建全局顶部加载条控制器, 以 pending 计数统一管理路由加载与页面内 API 加载
 * @param nuxtApp 当前 Nuxt 应用实例
 * @returns 顶部加载条控制器
 */
function createAppLoadingIndicator(nuxtApp: NuxtAppWithAppLoadingIndicator): InternalAppLoadingIndicator {
    const progress = shallowRef(0)
    const isLoading = shallowRef(false)
    const error = shallowRef(false)
    const pendingCount = shallowRef(0)

    let rafId: number | undefined
    let hideTimeout: ReturnType<typeof setTimeout> | undefined
    let resetTimeout: ReturnType<typeof setTimeout> | undefined
    // 路由加载事件折叠态: Nuxt 的 page:loading:start 在 router beforeEach 中对每次导航尝试都触发
    // (重定向链如 /?post_category_slug=x -> /category/x 会连续触发两次 start), 而 page:loading:end
    // 仅在最终页面渲染完成时触发一次; 若直接按 pending 计数订阅会净 +1, 进度条永久卡在 95%。
    // 折叠为布尔态后重复的 start/end 均被忽略, 与官方 NuxtLoadingIndicator 的幂等 start/finish 语义对齐;
    // 首屏水合时 Suspense onResolve 产生的多余 end 同样被忽略, 不再误触 finish 闪一下 100%。
    let routeLoadingActive = false

    /**
     * 以缓进方式推进顶部加载条, 保持接近 Nuxt 默认条子的观感, 同时支持中途续跑
     * @returns 无返回值
     */
    const scheduleProgress = (): void => {
        if (!import.meta.client) {
            return
        }

        clearIndicatorAnimation(rafId)

        const step = () => {
            if (!isLoading.value) {
                rafId = undefined
                return
            }

            progress.value = Math.min(MAX_PROGRESS, progress.value + Math.max(0.35, (MAX_PROGRESS - progress.value) * 0.04))
            rafId = requestAnimationFrame(step)
        }

        rafId = requestAnimationFrame(step)
    }

    /**
     * 展示顶部加载条, 若当前已有任务在跑则仅续用现有进度, 不归零重启
     * @returns 无返回值
     */
    const show = (): void => {
        clearIndicatorTimeouts(hideTimeout, resetTimeout)
        hideTimeout = undefined
        resetTimeout = undefined
        error.value = false

        if (!isLoading.value) {
            if (progress.value <= 0 || progress.value >= 100) {
                progress.value = 0
            }
            isLoading.value = true
        }

        scheduleProgress()
    }

    /**
     * 在所有任务完成后结束顶部加载条, 先补满到 100, 再短暂延迟隐藏, 避免生硬闪断
     * @param isError 是否以错误态结束
     * @returns 无返回值
     */
    const finish = (isError: boolean = false): void => {
        clearIndicatorAnimation(rafId)
        rafId = undefined
        clearIndicatorTimeouts(hideTimeout, resetTimeout)
        hideTimeout = undefined
        resetTimeout = undefined

        error.value = isError
        progress.value = 100

        if (!import.meta.client) {
            isLoading.value = false
            progress.value = 0
            error.value = false
            return
        }

        hideTimeout = setTimeout(() => {
            isLoading.value = false
            hideTimeout = undefined

            resetTimeout = setTimeout(() => {
                progress.value = 0
                error.value = false
                resetTimeout = undefined
            }, RESET_DELAY)
        }, HIDE_DELAY)
    }

    /**
     * 开始一个加载任务, 仅在 pending 从 0 变为 1 时真正拉起顶部加载条
     * @returns 无返回值
     */
    const beginTask = (): void => {
        pendingCount.value += 1

        if (pendingCount.value === 1) {
            show()
        }
    }

    /**
     * 结束一个加载任务, 仅在所有任务都结束后才收起顶部加载条
     * @returns 无返回值
     */
    const endTask = (): void => {
        pendingCount.value = Math.max(0, pendingCount.value - 1)

        if (pendingCount.value === 0) {
            finish(false)
        }
    }

    /**
     * 以错误态强制结束所有加载任务, 用于全局渲染异常场景
     * @returns 无返回值
     */
    const fail = (): void => {
        // 错误态强制收尾时同步复位路由加载折叠态, 避免后续多余的 page:loading:end 覆盖错误收尾。
        routeLoadingActive = false
        pendingCount.value = 0
        finish(true)
    }

    /**
     * 立即清空顶部加载条状态, 供极端兜底场景使用
     * @returns 无返回值
     */
    const forceClear = (): void => {
        pendingCount.value = 0
        clearIndicatorAnimation(rafId)
        rafId = undefined
        clearIndicatorTimeouts(hideTimeout, resetTimeout)
        hideTimeout = undefined
        resetTimeout = undefined
        progress.value = 0
        isLoading.value = false
        error.value = false
    }

    if (import.meta.client) {
        // 路由加载经布尔态折叠后并入 pending 计数, 页面内 API 任务仍按计数并行, 互不干扰。
        nuxtApp.hook("page:loading:start", () => {
            if (routeLoadingActive) {
                return
            }
            routeLoadingActive = true
            beginTask()
        })
        nuxtApp.hook("page:loading:end", () => {
            if (!routeLoadingActive) {
                return
            }
            routeLoadingActive = false
            endTask()
        })
        nuxtApp.hook("vue:error", fail)
    }

    return {
        progress: shallowReadonly(progress),
        isLoading: shallowReadonly(isLoading),
        error: shallowReadonly(error),
        pendingCount: shallowReadonly(pendingCount),
        beginTask,
        endTask,
        fail,
        forceClearInternal: forceClear,
    }
}

/**
 * 获取全局顶部加载条控制器, 整个 Nuxt 应用只创建一个实例
 * @returns 全局顶部加载条控制器
 */
export function useAppLoadingIndicator(): AppLoadingIndicator {
    const nuxtApp = useNuxtApp() as NuxtAppWithAppLoadingIndicator

    if (!nuxtApp.appLoadingIndicatorInstance) {
        nuxtApp.appLoadingIndicatorInstance = createAppLoadingIndicator(nuxtApp)
    }

    return nuxtApp.appLoadingIndicatorInstance
}
