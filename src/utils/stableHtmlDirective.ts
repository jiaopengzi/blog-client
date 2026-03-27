/*
 * FilePath    : blog-client\src\utils\stableHtmlDirective.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 自定义指令，增量更新 innerHTML 时保留已稳定的 DOM 节点，避免重建造成的闪烁。
 */

import type { Directive } from "vue"

/**
 * @description: 收集容器内所有已成功加载的 img 元素，以绝对 src 为键分组存储。
 * complete && naturalWidth > 0 是判断图片已成功加载的标准（加载失败时 naturalWidth 为 0）。
 */
export function collectLoadedImages(el: HTMLElement): Map<string, HTMLImageElement[]> {
    const savedImages = new Map<string, HTMLImageElement[]>()
    el.querySelectorAll("img").forEach((img) => {
        const imgEl = img as HTMLImageElement
        if (imgEl.complete && imgEl.naturalWidth > 0 && imgEl.src) {
            const list = savedImages.get(imgEl.src)
            if (list) {
                list.push(imgEl)
            } else {
                savedImages.set(imgEl.src, [imgEl])
            }
        }
    })
    return savedImages
}

/**
 * @description: 同步新旧 img 元素的属性，保持已保存 img 元素的其他属性与最新 DOM 一致。
 * 在恢复已加载图片时，确保保存的 img 元素能够获取最新的非 src 属性（如 alt、class 等），
 * 同时移除新 DOM 中已不存在的属性，保证属性状态完全同步。
 * @param savedImg - 已保存的 img 元素（即将恢复到 DOM 中的元素）
 * @param newImg - 新的 img 元素（从更新后的 HTML 中解析出的元素）
 */
export function syncImgAttributes(savedImg: HTMLImageElement, newImg: HTMLImageElement): void {
    // 将新 img 的非 src 属性同步到保存的元素上（alt、class 等可能随 markdown 变化）
    Array.from(newImg.attributes).forEach((attr) => {
        if (attr.name !== "src") {
            savedImg.setAttribute(attr.name, attr.value)
        }
    })
    // 移除保存元素上已不存在于新 img 的属性（src 除外）
    Array.from(savedImg.attributes).forEach((attr) => {
        if (attr.name !== "src" && !newImg.hasAttribute(attr.name)) {
            savedImg.removeAttribute(attr.name)
        }
    })
}

/**
 * @description: 恢复容器中已加载的图片元素，将保存的 img 元素替换新 DOM 中的对应 img 元素。
 * 在 innerHTML 更新后，将之前保存的已完成加载的 img 元素恢复到 DOM 中，避免图片重新加载造成的闪烁。
 * 通过 src 匹配新旧 img 元素，同步属性后用保存的元素替换新元素，保持图片加载状态。
 * @param el - 包含 img 元素的容器 HTMLElement，通常是应用了自定义指令的元素
 * @param savedImages - 已保存的 img 元素映射表，以绝对 src 路径为键，img 元素数组为值
 */
export function restoreLoadedImages(el: HTMLElement, savedImages: Map<string, HTMLImageElement[]>): void {
    // 如果没有保存的图片，直接返回，避免不必要的 DOM 操作
    if (savedImages.size === 0) return

    // 遍历容器中所有的 img 元素，尝试将其替换为已保存的 img 元素
    el.querySelectorAll("img").forEach((img) => {
        const newImg = img as HTMLImageElement
        const list = savedImages.get(newImg.src)

        // 如果该 src 没有保存的图片、保存列表为空或新元素没有父节点，则跳过当前元素
        if (!list || list.length === 0 || !newImg.parentNode) return

        // 从保存列表中取出一个已加载的 img 元素
        const savedImg = list.shift()!

        // 将新 img 的属性同步到保存的 img 上，确保非 src 属性（如 alt、class 等）与最新 DOM 一致
        syncImgAttributes(savedImg, newImg)

        // 用保存的已加载 img 元素替换新 DOM 中的 img 元素，避免图片重新加载
        newImg.parentNode.replaceChild(savedImg, newImg)
    })
}

/**
 * @description: 自定义指令，增量更新 innerHTML 时保留已稳定的 DOM 节点，避免重建造成的闪烁。
 * 核心逻辑：innerHTML 更新前保存已完成加载的 <img> 元素引用；更新后将新 <img> 替换为保存的元素。
 * 所有 DOM 操作在同一 JS 任务内同步完成，浏览器来不及渲染中间态，彻底消除逐帧闪烁。
 */
export const stableHtmlDirective: Directive<HTMLElement, string> = {
    mounted(el, binding) {
        el.innerHTML = binding.value ?? ""
    },

    updated(el, binding) {
        if (binding.value === binding.oldValue) return

        const savedImages = collectLoadedImages(el)
        el.innerHTML = binding.value ?? ""
        restoreLoadedImages(el, savedImages)
    },
}
