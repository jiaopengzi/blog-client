<!--
 * FilePath    : blog-client-nuxt\src\components\layout\search\search-dialog\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 搜索对话框
-->

<template>
    <el-dialog v-model="isVisible" fullscreen @close="dialogClose" class="search-dialog">
        <div class="container-search">
            <div class="search-main">
                <div class="input-content">
                    <el-input class="search-input" placeholder="请输入搜索内容" v-model="searchValue" clearable @keyup.enter="handleSearch" />
                    <el-button class="search-btn" type="primary" @click="handleSearch">搜索</el-button>
                </div>
                <div class="search-history" v-if="searchHistory.length > 0">
                    <h4 class="history-title">搜索历史</h4>
                    <div class="search-history-list">
                        <el-tag
                            class="history-item"
                            v-for="item in searchHistory"
                            :key="`${item.id}-${item.time}`"
                            closable
                            @close="tagClose(item.id)"
                            @click="tagSearch(item.value)"
                            >{{ item.value }}</el-tag
                        >
                    </div>
                </div>
            </div>
        </div>
    </el-dialog>
</template>

<script lang="ts" setup>
import { computed, onBeforeMount, ref } from "vue"

import { LocalStorageKey } from "@/stores/local"
import { MessageUtil } from "@/utils/message.ts"

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

// 从本地存储中拿到搜索历史内容
const getHistory = () => {
    const searchHistoryStr = localStorage.getItem(LocalStorageKey.SearchHistory)
    searchHistory.value = JSON.parse(searchHistoryStr || "[]") as SearchHistoryItem[]
}

// 将搜索历史存储到本地
const setHistory = () => {
    localStorage.setItem(LocalStorageKey.SearchHistory, JSON.stringify(searchHistory.value))
}

const updateHistory = (val: string) => {
    if (!val) {
        return
    }

    const hasValue = searchHistory.value.some((item) => item.value === val)

    if (!hasValue) {
        searchHistory.value.unshift({
            id: searchHistory.value.length,
            value: val,
            time: new Date().getTime(),
        })
    } else {
        // 已存在则更新时间并移到最前
        const index = searchHistory.value.findIndex((item) => item.value === val)
        searchHistory.value[index]!.time = new Date().getTime()
        const item = searchHistory.value[index]
        searchHistory.value.splice(index, 1)
        searchHistory.value.unshift(item!)
    }

    // 限制搜索历史的长度, 只保留 20 条
    if (searchHistory.value.length > 20) {
        searchHistory.value.pop()
    }

    setHistory()
}

const handleSearch = () => {
    if (!searchValue.value) {
        MessageUtil.warning("请输入搜索内容", 3000)
        return
    }

    emit("search", searchValue.value)

    updateHistory(searchValue.value)

    searchValue.value = ""
}

const tagClose = (id: number) => {
    const index = searchHistory.value.findIndex((item) => item.id === id)
    if (index !== -1) {
        searchHistory.value.splice(index, 1)
    }

    setHistory()
}

const tagSearch = (value: string) => {
    // 点击搜索历史, 直接搜索
    searchValue.value = value
    handleSearch()
}

onBeforeMount(() => {
    getHistory()
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

.history-title {
    font-size: 14px;
    line-height: 1.5;
    color: var(--jpz-text-color-regular);
    margin-top: 10px;
    margin-left: 10px;
    margin-right: auto;
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
    display: inline-block; // 让元素可设置宽度
    max-width: 160px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
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

.container-search {
    @include respond-to("pc") {
        .container-search {
            max-width: pc.$width-page-main;
        }
    }

    @include respond-to("pad") {
        .container-search {
            width: pad.$width-page;
        }
    }

    @include respond-to("phone") {
        .container-search {
            width: 100vw;
        }
    }
}
</style>
