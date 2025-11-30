/**
 * FilePath    : blog-client-dev\src\components\editor\components\toolbar\components\alert\types.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 类型
 */

// 拿到自定义元素的名称枚举
import { Names } from "@/customElements"

// markdown 编辑器 单个命令对象 的类型
export interface PayTagItem {
    prefix: string // 前缀
    content: string // 内容
    suffix: string // 后缀
}

// 如果希望允许只包含其中一部分键（都为可选），使用 Partial
export type PayTag = Record<Names.PayVideo | Names.PayMembership | Names.PayRead | Names.PayDownload | Names.PayKey, PayTagItem>

export const payTags: Readonly<PayTag> = {
    [Names.PayVideo]: {
        prefix: `\n<${Names.PayVideo}>\n`,
        content: `您的除视频外隐藏内容，若没有则将标签设置为一行`,
        suffix: `\n</${Names.PayVideo}>\n`,
    },
    [Names.PayMembership]: {
        prefix: `\n`,
        content: `<${Names.PayMembership}></${Names.PayMembership}>`,
        suffix: `\n`,
    },
    [Names.PayRead]: {
        prefix: `\n<${Names.PayRead}>\n`,
        content: `您付费阅读的内容`,
        suffix: `\n</${Names.PayRead}>\n`,
    },
    [Names.PayDownload]: {
        prefix: `\n<${Names.PayDownload}>\n`,
        content: `您的付费下载内容`,
        suffix: `\n</${Names.PayDownload}>\n`,
    },
    [Names.PayKey]: {
        prefix: `\n`,
        content: `<${Names.PayKey} id="您的key" title="您的标题" description="您的说明"></${Names.PayKey}>`,
        suffix: `\n`,
    },
}
