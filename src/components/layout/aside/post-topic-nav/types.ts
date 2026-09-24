/**
 * FilePath    : blog-client\src\components\layout\aside\post-topic-nav\types.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 专题导航组件类型定义
 */

import type { InjectionKey, Ref } from "vue"

// 排序模式: time 时间正序(后端原始顺序); alpha 字母序(前端按标题本地重排)
export type TopicNavSortMode = "time" | "alpha"

// 排序偏好本地存储值 (与 TopicNavSortMode 一一对应)
export const TOPIC_NAV_SORT_ALPHA = "alpha"
export const TOPIC_NAV_SORT_TIME = "time"

/**
 * 专题导航 asyncData 的固定 key.
 * @remarks 同一时刻侧栏至多一张专题卡, 组件跨文章导航复用同一实例与同一份数据槽 (同专题零请求);
 * 组件自取与 layout-aside 互斥读取 (useNuxtData) 必须使用同一 key.
 */
export const POST_TOPIC_NAV_DATA_KEY = "post-topic-nav"

/**
 * 手风琴展开表中根层的父分组 key.
 * @remarks 根节点自身不参与折叠, 其直属子分组以本 key 登记展开状态; 其余层以父分组 id 为 key.
 */
export const TOPIC_NAV_ROOT_PARENT = "__topic_nav_root__"

// 手风琴上下文: expandedByParent 为 父分组 key → 该层当前展开的子分组 id (同父互斥), 由 index.vue provide
export interface TopicNavExpandContext {
    expandedByParent: Ref<Record<string, string>>
    toggleGroup: (parentKey: string, groupId: string) => void
}

export const TOPIC_NAV_EXPAND_KEY: InjectionKey<TopicNavExpandContext> = Symbol("topic-nav-expand")
