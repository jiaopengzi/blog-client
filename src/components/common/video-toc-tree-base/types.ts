/*
 * FilePath    : blog-client\src\components\common\video-toc-tree-base\types.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 类型
 */

import type { RenderContentContext } from "element-plus"

import type { PostVideoTocTree } from "@/api/post/common"

export interface TreeProps {
    treeList?: PostVideoTocTree[] // 目录树数据
    draggable?: boolean // 是否可拖拽
    showBtns?: boolean // 是否显示操作按钮
    isEdit?: boolean // 是否可编辑
    isExpandAll?: boolean // 是否默认展开所有节点
    currentNodeKey?: string | number
}

// 目录树
export type Tree = PostVideoTocTree

// 目录树映射, key 为节点 videoOrder
export type VideoTocMapByOrder = Record<number, Tree>

// 目录树映射, key 为节点 fileIdHash
export type VideoTocMapByFileIdHash = Record<string, Tree>

// 参考：https://element-plus.org/zh-CN/component/tree#%E8%87%AA%E5%AE%9A%E4%B9%89%E8%8A%82%E7%82%B9%E5%86%85%E5%AE%B9

// Element Plus 树节点类型
export type Node = RenderContentContext["node"]

// Element Plus 树节点数据类型
export type Data = RenderContentContext["data"]
