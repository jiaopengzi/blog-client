/*
 * FilePath    : blog-client\src\components\layout\footer\types.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 底部类型
 */

import type { FooterLeftInfo, FooterMiddleImage, FooterRightInfo } from "@/stores/options"

export interface FooterProps {
    left?: FooterLeftInfo
    middle?: FooterMiddleImage[]
    right?: FooterRightInfo
}
