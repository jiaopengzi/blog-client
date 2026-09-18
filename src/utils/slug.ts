/**
 * FilePath    : blog-client\src\utils\slug.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : slug 编码归一化工具 (bugfix 260918-03)
 */

// 循环解码层数上限: 防御恶意构造的超长多层串; 生产日志实测爬虫循环已达 380 层, 上限需覆盖并留裕量
const DECODE_MAX_LAYERS = 512

/**
 * decodeSlugFully 将任意编码层数的 slug 完全解码到明文.
 * @remarks bugfix 260918-03: canonical 双重编码使爬虫逐层跟随产生多层 %25 形态
 * (生产后端日志实测 380 层); 单次 decodeURIComponent 无法收敛, 需循环解码到值不再变化.
 * 容错: 遇畸形 % 序列 (decodeURIComponent 抛 URIError) 时保留当前值提前结束,
 * 明文含 % 字面量时不受影响.
 * @param value - 待解码的 slug (任意编码层数或明文).
 * @returns 完全解码后的明文; 空串原样返回.
 */
export function decodeSlugFully(value: string): string {
    if (!value) {
        return value
    }
    let current = value
    for (let i = 0; i < DECODE_MAX_LAYERS; i++) {
        let next: string
        try {
            next = decodeURIComponent(current)
        } catch {
            break
        }
        if (next === current) {
            break
        }
        current = next
    }
    return current
}

/**
 * encodeSlugOnce 将任意编码层数的 slug 归一到单层 URL 编码形态.
 * @remarks bugfix 260918-03: 后端按 "URL 转义形态" 的 slug 匹配 (中文标签/分类的
 * slug 在库中即存为 %E5%A4%9A... 形式), 请求与 canonical 统一经本函数归一,
 * 多层形态收敛回单层, 正确命中后端记录.
 * @param value - 待归一的 slug (任意编码层数或明文).
 * @returns 单层 URL 编码形态; 空串原样返回.
 */
export function encodeSlugOnce(value: string): string {
    if (!value) {
        return value
    }
    return encodeURIComponent(decodeSlugFully(value))
}
