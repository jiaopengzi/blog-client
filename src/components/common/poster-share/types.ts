/*
 * FilePath    : blog-client\src\components\common\poster-share\types.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 海报分享组件类型
 */

// 海报元素类型
export type PosterProps = {
    logoSrc: string // logo图片地址
    imgSrc: string // 图片地址
    titleText: string // 标题文字
    urlText: string // 链接文字
    qrCodeSrc: string // 二维码图片地址
}

// 海报配置项
export type PosterPropsOptions = Partial<PosterProps>
