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
    showPostList: boolean // 是否显示文章列表
    showHomeCarousel: boolean // 是否显示首页轮播图
    showHomeAside: boolean // 是否显示首页侧边栏
    showSearchList: boolean // 是否显示搜索列表
}

function createStatusStore(): StatusStore {
    return {
        showPostDetail: false, // 默认不显示文章详情
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
        init(): void {
            this.$state = createStatusStore()
        },

        // 设置是否显示文章详情
        setShowPostDetail(status: boolean): void {
            this.showPostDetail = status
        },

        // 设置是否显示文章列表
        setShowPostList(status: boolean): void {
            this.showPostList = status
        },

        // 设置是否显示首页轮播图
        setShowHomeCarousel(status: boolean): void {
            this.showHomeCarousel = status
        },

        // 设置是否显示首页侧边栏
        setShowHomeAside(status: boolean): void {
            this.showHomeAside = status
        },

        // 设置是否显示搜索列表
        setShowSearchList(status: boolean): void {
            this.showSearchList = status
        },

        // 预设状态 文章列表
        setHome(): void {
            this.showPostDetail = false
            this.showPostList = true
            this.showHomeCarousel = true
            this.showHomeAside = true
            this.showSearchList = false
        },

        // 预设状态 文章详情
        setPostDetail(): void {
            this.showPostDetail = true
            this.showPostList = false
            this.showHomeCarousel = false
            this.showHomeAside = true
            this.showSearchList = false
        },

        // 预设状态 搜索
        setSearch(): void {
            this.showPostDetail = false
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
