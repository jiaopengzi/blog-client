/*
 * FilePath    : blog-client\src\components\editor\layout.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 编辑器三栏布局比例的存储与拖拽计算
 */

import { LocalStorageKey } from "@/stores/local"

export type EditorPaneName = "toc" | "editor" | "preview"

export interface EditorPaneRatios {
    toc: number
    editor: number
    preview: number
}

export interface ResizeEditorPaneRatiosOptions {
    ratios: EditorPaneRatios
    visiblePanes: EditorPaneName[]
    leftPane: EditorPaneName
    rightPane: EditorPaneName
    containerWidth: number
    deltaPx: number
    handleWidthPx?: number
    minPaneWidths?: Partial<Record<EditorPaneName, number>>
}

const EDITOR_PANES: EditorPaneName[] = ["toc", "editor", "preview"]

export const DEFAULT_EDITOR_PANE_RATIOS: EditorPaneRatios = {
    toc: 1,
    editor: 2,
    preview: 2,
}

export const DEFAULT_EDITOR_PANE_HANDLE_WIDTH = 8

const DEFAULT_MIN_PANE_WIDTHS: Record<EditorPaneName, number> = {
    toc: 180,
    editor: 320,
    preview: 320,
}

/**
 * 判断值是否为有效的正数比例。
 * @param value - 待判断的值。
 * @returns 仅在 value 为大于 0 的有限数字时返回 true。
 */
const isPositiveFiniteNumber = (value: unknown): value is number => {
    return typeof value === "number" && Number.isFinite(value) && value > 0
}

/**
 * 过滤并规范化布局比例。
 * @param ratios - 外部传入的布局比例对象。
 * @returns 仅保留有效正数, 其余字段回退到默认比例。
 */
export function normalizeEditorPaneRatios(ratios?: Partial<EditorPaneRatios> | null): EditorPaneRatios {
    const normalized: EditorPaneRatios = { ...DEFAULT_EDITOR_PANE_RATIOS }
    if (!ratios) {
        return normalized
    }

    for (const pane of EDITOR_PANES) {
        const ratio = ratios[pane]
        if (isPositiveFiniteNumber(ratio)) {
            normalized[pane] = ratio
        }
    }

    return normalized
}

/**
 * 将编辑器三栏比例保存到 localStorage。
 * @param ratios - 当前布局比例。
 * @returns 无返回值。
 */
export function saveEditorPaneRatios(ratios: EditorPaneRatios): void {
    localStorage.setItem(LocalStorageKey.EditorPaneRatios, JSON.stringify(normalizeEditorPaneRatios(ratios)))
}

/**
 * 清除 localStorage 中保存的编辑器三栏比例。
 * @returns 无返回值。
 */
export function clearEditorPaneRatios(): void {
    localStorage.removeItem(LocalStorageKey.EditorPaneRatios)
}

/**
 * 从 localStorage 读取编辑器三栏比例。
 * @returns 读取成功时返回比例对象, 否则返回 null。
 */
export function loadEditorPaneRatios(): EditorPaneRatios | null {
    const raw = localStorage.getItem(LocalStorageKey.EditorPaneRatios)
    if (!raw) {
        return null
    }

    try {
        return normalizeEditorPaneRatios(JSON.parse(raw) as Partial<EditorPaneRatios>)
    } catch {
        return null
    }
}

/**
 * 判断当前三栏比例是否已回到默认值。
 * @param ratios - 待比较的布局比例。
 * @returns 与默认比例一致时返回 true, 否则返回 false。
 */
export function isDefaultEditorPaneRatios(ratios: EditorPaneRatios): boolean {
    const normalized = normalizeEditorPaneRatios(ratios)
    const precision = 0.001

    return EDITOR_PANES.every((pane) => {
        return Math.abs(normalized[pane] - DEFAULT_EDITOR_PANE_RATIOS[pane]) < precision
    })
}

/**
 * 根据当前可见栏位生成 grid 模板字符串。
 * @param visiblePanes - 当前可见的栏位顺序。
 * @param ratios - 三栏布局比例。
 * @param handleWidthPx - 拖拽分隔条宽度。
 * @returns CSS grid-template-columns 字符串。
 */
export function buildEditorGridTemplate(
    visiblePanes: EditorPaneName[],
    ratios: EditorPaneRatios,
    handleWidthPx: number = DEFAULT_EDITOR_PANE_HANDLE_WIDTH,
): string {
    if (visiblePanes.length === 0) {
        return "minmax(0, 1fr)"
    }

    const normalized = normalizeEditorPaneRatios(ratios)
    const tracks: string[] = []

    visiblePanes.forEach((pane, index) => {
        tracks.push(`minmax(0, ${normalized[pane]}fr)`)
        if (handleWidthPx > 0 && index < visiblePanes.length - 1) {
            tracks.push(`${handleWidthPx}px`)
        }
    })

    return tracks.join(" ")
}

/**
 * 根据拖拽位移重新计算左右两栏的比例。
 * @param options - 拖拽计算所需的容器宽度、位移与栏位信息。
 * @returns 更新后的三栏比例对象。
 */
export function resizeEditorPaneRatios(options: ResizeEditorPaneRatiosOptions): EditorPaneRatios {
    const { ratios, visiblePanes, leftPane, rightPane, containerWidth, deltaPx, handleWidthPx = DEFAULT_EDITOR_PANE_HANDLE_WIDTH, minPaneWidths } = options

    if (!visiblePanes.includes(leftPane) || !visiblePanes.includes(rightPane) || containerWidth <= 0) {
        return normalizeEditorPaneRatios(ratios)
    }

    const normalized = normalizeEditorPaneRatios(ratios)
    const totalVisibleRatio = visiblePanes.reduce((sum, pane) => sum + normalized[pane], 0)
    const handleTotalWidth = Math.max(0, visiblePanes.length - 1) * Math.max(handleWidthPx, 0)
    const availableWidth = containerWidth - handleTotalWidth

    if (totalVisibleRatio <= 0 || availableWidth <= 0) {
        return normalized
    }

    const currentLeftWidth = (availableWidth * normalized[leftPane]) / totalVisibleRatio
    const currentRightWidth = (availableWidth * normalized[rightPane]) / totalVisibleRatio
    const pairWidth = currentLeftWidth + currentRightWidth
    const resolvedMinPaneWidths = { ...DEFAULT_MIN_PANE_WIDTHS, ...minPaneWidths }
    const minLeftWidth = Math.min(resolvedMinPaneWidths[leftPane], pairWidth - 1)
    const minRightWidth = Math.min(resolvedMinPaneWidths[rightPane], pairWidth - 1)

    if (minLeftWidth + minRightWidth >= pairWidth) {
        return normalized
    }

    const minDelta = minLeftWidth - currentLeftWidth
    const maxDelta = currentRightWidth - minRightWidth
    const clampedDelta = Math.min(Math.max(deltaPx, minDelta), maxDelta)
    const nextLeftWidth = currentLeftWidth + clampedDelta
    const nextRightWidth = currentRightWidth - clampedDelta

    if (nextLeftWidth <= 0 || nextRightWidth <= 0) {
        return normalized
    }

    return normalizeEditorPaneRatios({
        ...normalized,
        [leftPane]: (nextLeftWidth / availableWidth) * totalVisibleRatio,
        [rightPane]: (nextRightWidth / availableWidth) * totalVisibleRatio,
    })
}
