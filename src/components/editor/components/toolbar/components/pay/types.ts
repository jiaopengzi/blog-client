/**
 * FilePath    : blog-client-dev\src\components\editor\components\toolbar\components\alert\types.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 类型
 */

// 拿到自定义元素的名称枚举
import { Names } from "@/customElements"

// 付费相关自定义元素枚举
export enum Pay {
    PayVideo = `<${Names.PayVideo}></${Names.PayVideo}>`, // 付费视频
    PayMembership = `<${Names.PayMembership}></${Names.PayMembership}>`, // 付费会员
    PayRead = `<${Names.PayRead}></${Names.PayRead}>`, // 付费阅读
    PayDownload = `<${Names.PayDownload}></${Names.PayDownload}>`, // 付费下载
    PayKey = `<${Names.PayKey} id="您的key" title="您的标题" description="您的说明"></${Names.PayKey}>`, // 付费密钥
}
