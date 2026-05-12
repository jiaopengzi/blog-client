/**
 * FilePath    : blog-client\src\components\editor\utils\css-shorthand.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : CSS 简写属性展开工具模块, 提供简写→长写映射、属性查询与值归一化。新增简写类型只需在 SHORTHAND_REGISTRY 中添加条目。
 */

/** 简写属性注册条目 */
interface ShorthandEntry {
    /** 对应的长写属性名列表 */
    longhands: readonly string[]
}

/**
 * CSS 简写属性注册表。
 * 复制链路中 getComputedStyle 对简写属性返回不稳定(常为空), 需将简写展开为长写,
 * 循环结束后统一从 computedStyle 读取长写值下发, 避免简写之间的级联覆盖问题。
 * 新增简写类型只需在此添加条目, 无需修改其他模块。
 */
const SHORTHAND_REGISTRY: Readonly<Record<string, ShorthandEntry>> = {
    // === border 系列 ===
    border: {
        longhands: [
            "border-top-width",
            "border-top-style",
            "border-top-color",
            "border-right-width",
            "border-right-style",
            "border-right-color",
            "border-bottom-width",
            "border-bottom-style",
            "border-bottom-color",
            "border-left-width",
            "border-left-style",
            "border-left-color",
        ],
    },
    "border-top": { longhands: ["border-top-width", "border-top-style", "border-top-color"] },
    "border-right": { longhands: ["border-right-width", "border-right-style", "border-right-color"] },
    "border-bottom": { longhands: ["border-bottom-width", "border-bottom-style", "border-bottom-color"] },
    "border-left": { longhands: ["border-left-width", "border-left-style", "border-left-color"] },
    "border-width": { longhands: ["border-top-width", "border-right-width", "border-bottom-width", "border-left-width"] },
    "border-style": { longhands: ["border-top-style", "border-right-style", "border-bottom-style", "border-left-style"] },
    "border-color": { longhands: ["border-top-color", "border-right-color", "border-bottom-color", "border-left-color"] },
    "border-radius": { longhands: ["border-top-left-radius", "border-top-right-radius", "border-bottom-right-radius", "border-bottom-left-radius"] },

    // === 盒模型 ===
    margin: { longhands: ["margin-top", "margin-right", "margin-bottom", "margin-left"] },
    padding: { longhands: ["padding-top", "padding-right", "padding-bottom", "padding-left"] },

    // === 背景 ===
    background: {
        longhands: [
            "background-color",
            "background-image",
            "background-position-x",
            "background-position-y",
            "background-size",
            "background-repeat",
            "background-origin",
            "background-clip",
            "background-attachment",
        ],
    },

    // === 字体 ===
    font: {
        longhands: ["font-style", "font-variant", "font-weight", "font-stretch", "font-size", "line-height", "font-family"],
    },

    // === 文本 ===
    "text-decoration": { longhands: ["text-decoration-line", "text-decoration-style", "text-decoration-color", "text-decoration-thickness"] },
}

/**
 * isShorthand 判断属性是否为已注册的 CSS 简写属性。
 * @param property CSS 属性名。
 * @returns 若为已注册简写则返回 true。
 */
export function isShorthand(property: string): boolean {
    return property in SHORTHAND_REGISTRY
}

/**
 * getLonghands 获取简写属性对应的长写属性列表。
 * @param property CSS 简写属性名。
 * @returns 对应的长写属性名数组, 未注册时返回空数组。
 */
export function getLonghands(property: string): readonly string[] {
    return SHORTHAND_REGISTRY[property]?.longhands ?? []
}

/**
 * normalizeValue 归一化 CSS 属性值, 消除浏览器缩放等产生的偏差。
 * 当前仅处理 border-*-width 的分数像素问题, 后续可扩展其他属性的归一化逻辑。
 * @param property CSS 属性名。
 * @param value CSS 属性值。
 * @returns 归一化后的值, 无需处理时返回原值。
 */
export function normalizeValue(property: string, value: string): string {
    if (/^border-(top|right|bottom|left)-width$/.test(property)) {
        if (!value.endsWith("px")) return value
        const num = parseFloat(value)
        if (!Number.isFinite(num)) return value
        const rounded = Math.round(num)
        if (rounded <= 0) return value
        return `${rounded}px`
    }
    return value
}

/**
 * BORDER_SIDE_SHORTHAND border 侧边简写到方向名的映射, 用于 applyBorderLonghandsFromComputedStyle。
 */
export const BORDER_SIDE_SHORTHAND: Readonly<Record<string, "top" | "right" | "bottom" | "left">> = {
    "border-top": "top",
    "border-right": "right",
    "border-bottom": "bottom",
    "border-left": "left",
}
