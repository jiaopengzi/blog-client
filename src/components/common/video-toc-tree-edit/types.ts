/*
 * FilePath    : blog-client\src\components\common\video-toc-tree-edit\types.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 目录树编辑类型
 */

import type { RenderContentContext } from "element-plus"

export interface TreeProps {
    treeList?: Tree[] // 用户信息
}

// 目录树
export interface Tree {
    id: number
    label: string
    isChapter: boolean // 是否是章节
    videoOrder?: number // 视频顺序
    videoType?: string // 视频类型
    videoId?: string // 关联的视频id
    videoSrc?: string // 关联的视频地址
    children?: Tree[]
}

// 参考：https://element-plus.org/zh-CN/component/tree#%E8%87%AA%E5%AE%9A%E4%B9%89%E8%8A%82%E7%82%B9%E5%86%85%E5%AE%B9

// Element Plus 树节点类型
export type Node = RenderContentContext["node"]

// Element Plus 树节点数据类型
export type Data = RenderContentContext["data"]
