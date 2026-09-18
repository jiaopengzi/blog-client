<!--
 * FilePath    : blog-client\src\components\layout\search\search-dialog\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 搜索对话框 (历史清空/截断标签叉修复/悬停提示/三端样式, bugfix 260918-06)
-->

<template>
    <el-dialog v-model="isVisible" fullscreen class="search-dialog" @close="dialogClose" @opened="handleOpened">
        <div class="container-search">
            <div class="search-main">
                <div class="input-content">
                    <el-input
                        ref="SearchInputRef"
                        class="search-input"
                        placeholder="请输入搜索内容"
                        v-model="searchValue"
                        clearable
                        @keydown.enter="handleSearchEnter"
                    />
                    <el-button class="search-btn" type="primary" @click="handleSearch">搜索</el-button>
                </div>
                <div class="search-history" v-if="searchHistory.length > 0">
                    <div class="history-header">
                        <h4 class="history-title">搜索历史</h4>
                        <el-button class="history-clear-btn" link type="info" @click="clearAllHistory">
                            <j-icon :name="IconKeys.Delete" custom-class="history-clear-icon" />
                            <span>清空历史</span>
                        </el-button>
                    </div>
                    <div class="search-history-list">
                        <el-tooltip
                            v-for="item in searchHistory"
                            :key="`${item.id}-${item.time}`"
                            effect="dark"
                            :content="item.value"
                            placement="top"
                            :show-after="300"
                            :hide-after="0"
                            :disabled="!truncatedIds.has(item.id)"
                        >
                            <el-tag
                                class="history-item"
                                :ref="(el) => collectTagRef(item.id, el)"
                                closable
                                @close="tagClose(item.id)"
                                @click="tagSearch(item.value)"
                                >{{ item.value }}</el-tag
                            >
                        </el-tooltip>
                    </div>
                </div>
            </div>
        </div>
    </el-dialog>
</template>

<script lang="ts" setup>
import type { ComponentPublicInstance } from "vue"
import type { ElInput } from "element-plus"
import { computed, nextTick, onBeforeMount, onBeforeUnmount, onMounted, ref, useTemplateRef } from "vue"

import { IconKeys } from "@/components/common/icons"
import { LocalStorageKey } from "@/stores/local"
import { confirmCommon } from "@/utils/confirm.ts"
import { MessageUtil } from "@/utils/message.ts"

import { buildNextSearchHistory, parseSearchHistory } from "./utils.ts"
import type { SearchHistoryItem } from "./types.ts"
defineOptions({ name: "SearchDialog" })

const { isShow = false } = defineProps<{
    isShow?: boolean
}>()

const emit = defineEmits<{
    (event: "update:isShow", val: boolean): void
    (event: "search", val: string): void
}>()

// v-model 绑定
const isVisible = computed<boolean>({
    get: () => isShow === true,
    set: (val: boolean) => emit("update:isShow", val),
})

const dialogClose = () => {
    emit("update:isShow", false)
}

const searchValue = ref("")
const searchHistory = ref<SearchHistoryItem[]>([])

const SearchInputRef = useTemplateRef<InstanceType<typeof ElInput>>("SearchInputRef")

// 弹窗打开动画结束后自动聚焦输入框, 省一次点击
const handleOpened = () => {
    SearchInputRef.value?.focus()
}

// 从本地存储中拿到搜索历史内容
const getHistory = () => {
    const raw = localStorage.getItem(LocalStorageKey.SearchHistory)
    const parsed = parseSearchHistory(raw)
    if (parsed.length === 0 && raw) {
        // 存储内容损坏时解析回退空列表, 顺带清理脏数据, 避免每次打开都重复解析失败
        localStorage.removeItem(LocalStorageKey.SearchHistory)
    }
    searchHistory.value = parsed
}

// 将搜索历史存储到本地
const setHistory = () => {
    localStorage.setItem(LocalStorageKey.SearchHistory, JSON.stringify(searchHistory.value))
}

// 搜索历史标签根元素引用表 (id -> el-tag 根节点), 用于测量文本是否被省略号截断
const tagRootMap = new Map<number, HTMLElement>()

/**
 * collectTagRef 收集 v-for 中 el-tag 的根元素引用.
 * @param id - 历史项 id.
 * @param el - 模板函数 ref 回调入参; el-tag 是组件, 根元素在 $el 上; 条目卸载时回调 null 用于清理.
 */
const collectTagRef = (id: number, el: Element | ComponentPublicInstance | null) => {
    const dom = (el as ComponentPublicInstance | null)?.$el as HTMLElement | undefined
    if (dom) {
        tagRootMap.set(id, dom)
    } else {
        tagRootMap.delete(id)
    }
}

// 记录文本被截断 (显示省略号) 的历史项 id, 仅这些项悬停时展示完整内容 tooltip, 未截断的不弹提示
const truncatedIds = ref<Set<number>>(new Set())

/**
 * measureTruncatedTags 测量各历史标签文本是否溢出并刷新 truncatedIds.
 * @remarks 三端断点下标签可用宽度不同, 视口 resize 后需重测.
 */
const measureTruncatedTags = async () => {
    await nextTick()
    const ids = new Set<number>()
    for (const [id, root] of tagRootMap) {
        const content = root.querySelector<HTMLElement>(".el-tag__content")
        if (content && content.scrollWidth > content.clientWidth) {
            ids.add(id)
        }
    }
    truncatedIds.value = ids
}

// 跨断点 resize 防抖重测截断状态
let resizeMeasureTimer: ReturnType<typeof setTimeout> | undefined
const handleResize = () => {
    clearTimeout(resizeMeasureTimer)
    resizeMeasureTimer = setTimeout(() => void measureTruncatedTags(), 200)
}

const handleSearch = () => {
    // 修剪首尾空白, 防止纯空格被当作有效搜索词
    const keyword = searchValue.value.trim()
    if (!keyword) {
        MessageUtil.warning("请输入搜索内容", 3000)
        return
    }

    emit("search", keyword)

    searchHistory.value = buildNextSearchHistory(searchHistory.value, keyword)
    setHistory()

    searchValue.value = ""
}

/**
 * handleSearchEnter 回车搜索的输入法守卫.
 * @param e - el-input 的 keydown 事件对象, 组件声明的载荷是 Event | KeyboardEvent 联合类型.
 * @remarks 中文输入法确认候选词的 Enter (isComposing / keyCode 229) 不触发搜索, 避免词未选完就被提交.
 */
const handleSearchEnter = (e: Event | KeyboardEvent) => {
    const keyboardEvent = e as KeyboardEvent
    if (keyboardEvent.isComposing || keyboardEvent.keyCode === 229) {
        return
    }
    handleSearch()
}

const tagClose = (id: number) => {
    const index = searchHistory.value.findIndex((item) => item.id === id)
    if (index !== -1) {
        searchHistory.value.splice(index, 1)
    }

    setHistory()
}

/**
 * clearAllHistory 二次确认后清空全部搜索历史.
 * @remarks 批量删除属破坏性操作, 沿用项目 confirmCommon 确认框惯例.
 */
const clearAllHistory = () => {
    confirmCommon(
        "确定要清空全部搜索历史吗?",
        () => {
            searchHistory.value = []
            tagRootMap.clear()
            truncatedIds.value = new Set()
            setHistory()
        },
        () => {},
    )
}

const tagSearch = (value: string) => {
    // 点击搜索历史, 直接搜索
    searchValue.value = value
    handleSearch()
}

onBeforeMount(() => {
    getHistory()
})

onMounted(() => {
    void measureTruncatedTags()
    window.addEventListener("resize", handleResize)
})

onBeforeUnmount(() => {
    window.removeEventListener("resize", handleResize)
    clearTimeout(resizeMeasureTimer)
})
</script>

<style scoped lang="scss">
// 弹窗挂载到 body 上, 样式在 main.scss 中

.container-search {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.input-content {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;

    .search-input {
        width: 100%;
        max-width: 500px;
        margin-right: 10px;
        height: 40px;
        font-size: 16px;
        line-height: 1.5;
        color: var(--jpz-text-color-primary);
    }
    .search-btn {
        width: 84px;
        height: 40px;
        font-size: 16px;
        line-height: 1.5;
        border: none;
    }
}

.search-history {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
}

// 标题行: 左侧标题 + 右侧清空按钮
.history-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin-top: 10px;
    padding: 0 8px;
    box-sizing: border-box;
}

.history-title {
    font-size: 14px;
    line-height: 1.5;
    color: var(--jpz-text-color-regular);
}

// 清空按钮: link 弱化样式, 不与搜索主操作抢视觉; 留 padding 扩大点按热区 (phone 防误触)
.history-clear-btn {
    padding: 4px 8px;
    height: auto;
    font-size: 13px;
    line-height: 1.5;
}

.history-clear-icon {
    font-size: 13px;
    margin-right: 2px;
    fill: currentColor;
}

.search-history-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
}

.history-item {
    cursor: pointer;
    font-size: 14px;
    line-height: 1.5;
    &:hover {
        background-color: var(--jpz-bg-color-regular);
    }
    margin-left: 8px;
    margin-top: 10px;
    max-width: 200px;

    // bugfix(260918-06 bug02): 截断样式必须作用在 el-tag 内容层 .el-tag__content 上;
    // 原实现把 overflow:hidden 加在根元素 (inline-flex), 长文本会把尾部的关闭叉挤出可视区被裁掉
    :deep(.el-tag__content) {
        // flex 子项默认 min-width:auto 阻止收缩, 归零后省略号才能生效, 关闭叉 (flex-shrink:0) 始终保留
        min-width: 0;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
}

.search-main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 20px 0;
    border-radius: 10px;
    width: 100%;
    max-width: pc.$width-page-main;
}

// bugfix(260918-06 bug04): phone 端标签放宽到接近整行, 长词优先展示更多内容;
// pad/pc 维持 200px 上限, 超出靠省略号 + 悬停 tooltip 补全
@include respond-to("phone") {
    .history-item {
        // 减 8px 对冲 margin-left, 避免整行标签右溢出
        max-width: calc(100% - 8px);
    }

    .input-content {
        .search-input {
            max-width: none;
        }
    }
}
</style>
