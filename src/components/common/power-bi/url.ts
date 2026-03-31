/**
 * FilePath    : blog-client\src\components\common\power-bi\url.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : PowerBI 组件 URL 处理逻辑
 */

export const resolvePowerBiUrl = (src?: string): { isValid: boolean; normalizedSrc: string; message: string } => {
    const trimmedSrc = src?.trim() || ""

    if (!trimmedSrc) {
        return {
            isValid: false,
            normalizedSrc: "",
            message: "Power BI 组件：未提供 src",
        }
    }

    let parsedUrl: URL

    try {
        parsedUrl = new URL(trimmedSrc)
    } catch {
        return {
            isValid: false,
            normalizedSrc: "",
            message: "Power BI 组件：src 不是有效的 Power BI 地址",
        }
    }

    const isAllowedProtocol = parsedUrl.protocol === "https:" || parsedUrl.protocol === "http:"
    const isAllowedHost = ["app.powerbi.cn", "app.powerbi.com"].includes(parsedUrl.hostname)

    if (!isAllowedProtocol || !isAllowedHost) {
        return {
            isValid: false,
            normalizedSrc: "",
            message: "Power BI 组件：src 不是有效的 Power BI 地址",
        }
    }

    return {
        isValid: true,
        normalizedSrc: parsedUrl.toString(),
        message: "",
    }
}
