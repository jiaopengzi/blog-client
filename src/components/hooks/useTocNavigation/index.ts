/**
 * FilePath    : blog-client\src\components\hooks\useTocNavigation\index.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 目录点击导航 hook (260917-01: 从 layout-aside 抽出供浮动目录共用; feedback#2 收敛为纯 store 写入)
 */

import { useStatusStore } from "@/stores/status"

/**
 * @description: 目录点击导航统一入口, 数据源固定为 statusStore (文章详情页写入).
 * @remarks 260917-01-feedback#2: 点击只写 store (锚点 + 高亮索引), 不再直接滚动/写 URL —
 * 此前点击同时触发本 hook 直滚、post-detail anchorHash watch 直滚、route.hash watch 定位校正
 * 三处平滑滚动, 快速连续点击时旧定时器把页面滚回过期锚点造成来回抖动;
 * 现由 post-detail 的 anchorHash watch 作为唯一驱动 (URL 同步 + 平滑滚动 + 定位窗口).
 * @returns tocHeadingClicked - 目录项点击处理函数.
 */
export function useTocNavigation() {
    const statusStore = useStatusStore()

    /**
     * tocHeadingClicked 处理目录项点击: 写入锚点与高亮索引, 滚动与 URL 由 post-detail 响应 anchorHash 执行.
     * @param index - 目录项索引 (statusStore.tocHtml 下标), 越界时静默返回.
     * @returns 无返回值.
     */
    function tocHeadingClicked(index: number): void {
        const heading = statusStore.tocHtml[index]
        if (!heading) {
            return
        }

        statusStore.setAnchorHash(`#${heading.anchor}`)
        statusStore.tocHeadingShowCurrentIndex = index
    }

    return { tocHeadingClicked }
}
