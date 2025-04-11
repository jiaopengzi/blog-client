/*
 * FilePath    : blog-client\src\stores\status.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 状态管理
 */

import { acceptHMRUpdate, defineStore } from "pinia"

export interface StatusStore {
    showPostDetail: boolean // 是否显示文章详情
    postId: string // 文章 ID
    showPostList: boolean // 是否显示文章列表
    showHomeCarousel: boolean // 是否显示首页轮播图
    showHomeAside: boolean // 是否显示首页侧边栏
    showSearchList: boolean // 是否显示搜索列表
}

function createStatusStore(): StatusStore {
    return {
        showPostDetail: false, // 默认不显示文章详情
        postId: "", // 文章 ID
        showPostList: true, // 默认显示文章列表
        showHomeCarousel: true, // 默认显示首页轮播图
        showHomeAside: true, // 默认显示首页侧边栏
        showSearchList: false, // 默认不显示搜索列表
    }
}

export const useStatusStore = defineStore("status", {
    state: () => createStatusStore(),

    actions: {
        // 重置状态
        async init(): Promise<void> {
            this.$state = createStatusStore()
        },

        // 设置是否显示文章详情
        async setShowPostDetail(status: boolean): Promise<void> {
            this.showPostDetail = status
        },

        // 设置文章 ID
        async setPostId(id: string): Promise<void> {
            this.postId = id
        },

        // 设置是否显示文章列表
        async setShowPostList(status: boolean): Promise<void> {
            this.showPostList = status
        },

        // 设置是否显示首页轮播图
        async setShowHomeCarousel(status: boolean): Promise<void> {
            this.showHomeCarousel = status
        },

        // 设置是否显示首页侧边栏
        async setShowHomeAside(status: boolean): Promise<void> {
            this.showHomeAside = status
        },

        // 设置是否显示搜索列表
        async setShowSearchList(status: boolean): Promise<void> {
            this.showSearchList = status
        },

        // 预设状态 文章列表
        async setHome(): Promise<void> {
            this.showPostDetail = false
            this.postId = ""
            this.showPostList = true
            this.showHomeCarousel = true
            this.showHomeAside = true
            this.showSearchList = false
        },

        // 预设状态 文章详情
        async setPostDetail(): Promise<void> {
            this.showPostDetail = true
            this.showPostList = false
            this.showHomeCarousel = false
            this.showHomeAside = true
            this.showSearchList = false
        },

        // 预设状态 搜索
        async setSearch(): Promise<void> {
            this.showPostDetail = false
            this.postId = ""
            this.showPostList = false
            this.showHomeCarousel = false
            this.showHomeAside = false
            this.showSearchList = true
        },
    },
})

// 允许开发环境下进行热更新 HMR(Hot Module Replacement)
if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useStatusStore, import.meta.hot))
}
