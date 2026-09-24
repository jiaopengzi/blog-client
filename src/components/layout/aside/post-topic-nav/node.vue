<!--
 * FilePath    : blog-client\src\components\layout\aside\post-topic-nav\node.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 专题导航树节点 (Children 递归渲染, 分组手风琴交互, 当前文章链递归 active)
-->

<template>
    <div class="topic-nav-node" :class="{ 'topic-nav-node--root': level === 0 }">
        <!-- 分组头: 根节点不渲染 (卡片标题行已承担专题根名称, D5), 子级带序号; 点击折叠/展开; 当前文章链上递归 active -->
        <button
            v-if="level > 0"
            class="topic-nav-group-head"
            :class="{ 'is-active': isOnCurrentChain }"
            type="button"
            :aria-expanded="isExpanded"
            @click="toggle"
        >
            <el-icon class="topic-nav-group-arrow" :class="{ 'is-expanded': isExpanded }"><CaretRight /></el-icon>
            <span class="topic-nav-group-index">{{ index + 1 }}.</span>
            <span class="topic-nav-group-name">{{ category.name }}</span>
        </button>

        <!-- 分组直属文章 (可见口径, 时间正序或字母序由父层计算传入的已排序树决定); 根常显, 其余分组仅展开时渲染 -->
        <!-- 当前文章渲染为非链接条目 (第3轮反馈#3): 当前位置不是导航目标, 且 NuxtLink 指向自身会在水合后
             经可见性预取反复请求自身 _payload.json (同文章多分组时出现多个相同请求) -->
        <!-- 文章条目禁用 NuxtLink 预取 (第4轮反馈#1/#2): 同文章多分组 = 多个链接实例, 手风琴展开/折叠会重建
             实例, 每个实例可见即各自预取目标 _payload.json 造成重复请求; 切换文章后原条目恢复链接又会预取
             刚离开的页面 (payload 已在内存); 点击切换本身经 payloadExtraction:"client" 在路由 beforeResolve
             精确拉取目标页 payload 一次, 不依赖预取加速 -->
        <div v-if="level === 0 || isExpanded" class="topic-nav-posts">
            <template v-for="post in category.posts ?? []" :key="`${category.id}-${post.id}`">
                <span v-if="post.id === currentPostId" class="topic-nav-post is-current" aria-current="page">{{ post.post_title }}</span>
                <NuxtLink v-else class="topic-nav-post" :to="`/p/${post.id}`" :prefetch="false">{{ post.post_title }}</NuxtLink>
            </template>
        </div>

        <!-- 子分类递归; 根常显, 其余分组仅展开时渲染 -->
        <template v-if="level === 0 || isExpanded">
            <PostTopicNavNode
                v-for="(child, childIndex) in category.children ?? []"
                :key="child.id"
                :category="child"
                :level="level + 1"
                :index="childIndex"
                :current-post-id="currentPostId"
                :current-chain-ids="currentChainIds"
                :parent-key="level === 0 ? TOPIC_NAV_ROOT_PARENT : category.id"
            />
        </template>
    </div>
</template>

<script setup lang="ts">
import { CaretRight } from "@element-plus/icons-vue"
import { computed, inject } from "vue"

import type { PostTopicNavCategory } from "@/api/post/topicNav"

import PostTopicNavNode from "./node.vue"
import { TOPIC_NAV_EXPAND_KEY, TOPIC_NAV_ROOT_PARENT } from "./types"

defineOptions({ name: "PostTopicNavNode" })

// props
const {
    category,
    level = 0,
    index = 0,
    currentPostId = "",
    currentChainIds,
    parentKey = TOPIC_NAV_ROOT_PARENT,
} = defineProps<{
    category: PostTopicNavCategory // 当前分类节点 (含直属文章与子分类)
    level?: number // 层级 (0 为根, 根不渲染分组头)
    index?: number // 同级序号 (从 0 起, 用于分组序号展示)
    currentPostId?: string // 当前文章 ID, 匹配条目高亮
    currentChainIds?: ReadonlySet<string> // 当前文章所在分组链 id 集合 (index.vue 计算), 链上分组头递归 active
    parentKey?: string // 父分组在展开状态表中的 key (根层子分组为 TOPIC_NAV_ROOT_PARENT, 其余为父分组 id)
}>()

// 手风琴上下文 (index.vue provide): 同父分组下同时仅一个子分组展开
const expandContext = inject(TOPIC_NAV_EXPAND_KEY)

const isExpanded = computed(() => expandContext?.expandedByParent.value[parentKey] === category.id)

const toggle = () => expandContext?.toggleGroup(parentKey, category.id)

// 链路递归高亮 (第2轮反馈#1): 折叠状态下分组头仍标示当前文章所在链
const isOnCurrentChain = computed(() => currentChainIds?.has(category.id) ?? false)
</script>

<style scoped lang="scss">
// 非根节点整体右缩进一级, 嵌套递归自然形成层级缩进
.topic-nav-node:not(.topic-nav-node--root) {
    margin-left: 12px;
}

// 分组头: 可点击折叠/展开 (button 复位默认样式, 箭头指示展开态)
.topic-nav-group-head {
    display: flex;
    align-items: baseline;
    gap: 2px;
    width: 100%;
    margin-top: 10px;
    padding: 0;
    border: none;
    background-color: transparent;
    font-size: 13px;
    font-weight: 600;
    text-align: left;
    cursor: pointer;

    .topic-nav-group-name {
        color: var(--jpz-text-color-primary);
        transition: color 0.2s ease;
    }

    &:hover .topic-nav-group-name {
        color: var(--jpz-color-primary);
    }

    // 当前文章所在链 (第2轮反馈#1): 分组头递归保持主题色, 折叠后仍可辨识当前位置
    // (第3轮反馈#5: 序号 topic-nav-group-index 同随主题色)
    &.is-active {
        .topic-nav-group-arrow,
        .topic-nav-group-index,
        .topic-nav-group-name {
            color: var(--jpz-color-primary);
        }
    }
}

// 展开指示箭头 (收起朝右, 展开旋转 90° 朝下)
.topic-nav-group-arrow {
    align-self: center;
    flex-shrink: 0;
    margin-right: 1px;
    font-size: 12px;
    color: var(--jpz-color-secondary);
    fill: currentColor;
    transition: transform 0.2s ease;

    &.is-expanded {
        transform: rotate(90deg);
    }
}

.topic-nav-group-index {
    color: var(--jpz-color-secondary);
    font-weight: 400;
}

.topic-nav-posts {
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin-top: 4px;
}

.topic-nav-post {
    display: block;
    padding: 3px 6px;
    border-left: 3px solid transparent;
    border-radius: 3px;
    font-size: 13px;
    line-height: 1.6;
    color: var(--jpz-text-color-regular);
    text-decoration: none;
    word-break: break-word;
    transition:
        background-color 0.2s ease,
        color 0.2s ease;

    &:hover {
        color: var(--jpz-color-primary);
        background-color: var(--jpz-bg-color-page);
    }

    // 当前文章: 主题色 + 左侧竖条 + 浅底 (非链接条目, 无指针光标)
    &.is-current {
        color: var(--jpz-color-primary);
        border-left-color: var(--jpz-color-primary);
        background-color: var(--jpz-bg-color-page);
        font-weight: 600;
        cursor: default;
    }
}
</style>
