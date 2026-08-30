/*
 * FilePath    : blog-client-nuxt\src\router.options.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 用户级 vue-router 配置 (定制 scrollBehavior)
 */

/*
 * 补充说明:
 * Nuxt 4 约定用户级配置位于 <srcDir>/app/router.options.ts; 本项目 srcDir=src 且 srcDir≠rootDir,
 * dir.app 解析为 srcDir 本身 → 实际路径 <srcDir>/router.options.ts。
 *
 * @bugfix(260824 bug02): VUE_ROUTER_R0042 (hash 路由滚动选择器找不到元素)
 *   Nuxt 4 内置默认 scrollBehavior (pages/runtime/router.options.js) 在「同路径 hash 变化」时
 *   无条件返回 { el: to.hash } 尝试滚动到 hash 元素。user-info 页的 tab hash (#order/#comment 等)
 *   只是 URL 状态标记, DOM 中没有对应 id 元素 → vue-router 找不到元素报
 *   "Couldn't find element using selector \"#order\" returned by scrollBehavior" (R0042)。
 *   修复: 在默认 scrollBehavior 基础上 guard 缺失元素 —— to.hash 对应元素不存在时返回 false
 *   (不滚动、不报 R0042), 真实锚点 (如文章标题 #heading) 仍正常滚动。
 *
 * @bugfix(260826-03 bug02): hash 滚动瞬时跳变 (未复刻 SPA 的 smooth 滚动)
 *   同路径 hash 变化 (TOC 点击 → router.replace(hash)) 原返回 "auto" (瞬时) 滚动,
 *   与组件侧 scrollIntoView({behavior:"smooth"}) 竞争并立即覆盖, 表现为"一下就到"。
 *   修复: hash 滚动一律 "smooth" (含初始加载与跨页导航的 calculatePosition 分支);
 *   带锚点直链/刷新的"从顶部平滑滚入"由 pages/p/[id].vue 注入的 html[data-hash-smooth]
 *   (CSS scroll-behavior) 承接, 见 main.scss 同名规则。
 */

import { START_LOCATION, type RouteLocationNormalized, type RouteLocationNormalizedLoaded, type RouterScrollBehavior } from "vue-router"

import { useNuxtApp } from "#app/nuxt"
import { useRouter } from "#app/composables/router"

// 计算 hash 元素滚动位置补偿 (scroll-margin-top + 根元素 scroll-padding-top, 与内置默认一致)
const getHashElementScrollMarginTop = (selector: string): number => {
    try {
        const elem = document.querySelector(selector)
        if (elem) {
            return (
                (Number.parseFloat(getComputedStyle(elem).scrollMarginTop) || 0) +
                (Number.parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0)
            )
        }
    } catch {
        // 选择器非法时按 0 处理
    }
    return 0
}

// hash 元素是否存在 (不存在时 guard 掉滚动, 避免 VUE_ROUTER_R0042)
const isHashElementExists = (selector: string): boolean => {
    try {
        return !!document.querySelector(selector)
    } catch {
        return false
    }
}

// 计算滚动位置 (对齐 Nuxt 内置默认 _calculatePosition, 仅新增缺失元素 guard 与 smooth 行为)
const calculatePosition = (
    to: RouteLocationNormalized,
    from: RouteLocationNormalizedLoaded,
    savedPosition: Parameters<RouterScrollBehavior>[2],
): ReturnType<RouterScrollBehavior> => {
    if (savedPosition) {
        return savedPosition
    }

    if (to.hash) {
        // bug02: hash 仅作状态标记、DOM 无对应元素时跳过滚动, 避免 R0042
        if (!isHashElementExists(to.hash)) {
            return false
        }
        // bug02(260826-03): smooth 滚动复刻 SPA; 瞬时滚动会覆盖组件侧 smooth 定位造成"一下就到"
        return {
            el: to.hash,
            top: getHashElementScrollMarginTop(to.hash),
            behavior: "smooth",
        }
    }

    return {
        left: 0,
        top: 0,
    }
}

export default {
    scrollBehavior: ((to, from, savedPosition) => {
        const nuxtApp = useNuxtApp()
        const router = useRouter()

        // 同路径 hash 变化 (如 user-info tab 切换)
        if (to.path.replace(/\/$/, "") === from.path.replace(/\/$/, "")) {
            if (from.hash && !to.hash) {
                return savedPosition ?? { left: 0, top: 0 }
            }
            if (to.hash) {
                // bug02: hash 元素不存在时 guard, 避免 R0042
                if (!isHashElementExists(to.hash)) {
                    return false
                }
                // bug02(260826-03): smooth 滚动复刻 SPA (TOC 点击场景)
                return {
                    el: to.hash,
                    top: getHashElementScrollMarginTop(to.hash),
                    behavior: "smooth",
                }
            }
            return false
        }

        if ((typeof to.meta.scrollToTop === "function" ? to.meta.scrollToTop(to, from) : to.meta.scrollToTop) === false) {
            return false
        }

        if (from === START_LOCATION) {
            return calculatePosition(to, from, savedPosition)
        }

        // 跨页导航: 等页面加载完成后滚动 (与内置默认一致)
        return new Promise((resolve) => {
            const doScroll = () => {
                requestAnimationFrame(() => {
                    if (router.currentRoute.value.fullPath !== to.fullPath) {
                        resolve(false)
                        return
                    }
                    resolve(calculatePosition(to, from, savedPosition))
                })
            }
            nuxtApp.hooks.hookOnce("page:loading:end", () => {
                const transitionPromise = nuxtApp["~transitionPromise"]
                if (transitionPromise) transitionPromise.then(doScroll)
                else doScroll()
            })
        })
    }) as RouterScrollBehavior,
}
