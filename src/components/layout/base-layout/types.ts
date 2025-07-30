/*
 * FilePath    : blog-client\src\components\layout\base-layout\types.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 类型
 */

import { PostDetailType } from "@/components/common/post-detail"
import { type MainContentShow } from "@/components/layout/main-content"

export interface BaseLayoutProps extends MainContentShow {
    isShowSearch?: boolean // 是否显示搜索框
    detailType?: PostDetailType // 页面类型
}
