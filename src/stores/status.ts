/*
 * FilePath    : blog-client\src\stores\status.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 状态管理
 */

import { acceptHMRUpdate, defineStore } from "pinia"

export interface StatusStore {
    isShowPostDetail: boolean // 是否显示文章详情
    postId: string // 文章 ID
    anchorHash: string // 锚点
    isShowPostList: boolean // 是否显示文章列表
    isShowHomeCarousel: boolean // 是否显示首页轮播图
    isShowHomeAside: boolean // 是否显示首页侧边栏
    isShowSearchList: boolean // 是否显示搜索列表
    disablePagination: boolean // 是否禁用分页功能,主要是临时禁用，比如在搜索时，一段时间后自动解禁
}

function createStatusStore(): StatusStore {
    return {
        isShowPostDetail: false, // 默认不显示文章详情
        postId: "", // 文章 ID
        anchorHash: "", // 锚点
        isShowPostList: true, // 默认显示文章列表
        isShowHomeCarousel: true, // 默认显示首页轮播图
        isShowHomeAside: true, // 默认显示首页侧边栏
        isShowSearchList: false, // 默认不显示搜索列表
        disablePagination: false, // 默认不禁用分页功能
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
            this.isShowPostDetail = status
        },

        // 设置文章 ID
        async setPostId(id: string): Promise<void> {
            this.postId = id
        },

        // 设置锚点
        async setAnchorHash(hash: string): Promise<void> {
            this.anchorHash = hash
        },

        // 设置是否显示文章列表
        async setShowPostList(status: boolean): Promise<void> {
            this.isShowPostList = status
        },

        // 设置是否显示首页轮播图
        async setShowHomeCarousel(status: boolean): Promise<void> {
            this.isShowHomeCarousel = status
        },

        // 设置是否显示首页侧边栏
        async setShowHomeAside(status: boolean): Promise<void> {
            this.isShowHomeAside = status
        },

        // 设置是否显示搜索列表
        async setShowSearchList(status: boolean): Promise<void> {
            this.isShowSearchList = status
        },

        // 设置是否禁用分页功能
        async setDisablePagination(status: boolean): Promise<void> {
            this.disablePagination = status

            // 禁用分页功能 5 秒后自动解禁
            if (status) {
                setTimeout(() => {
                    this.disablePagination = false
                }, 5000)
            }
        },

        // 预设状态 文章列表
        async setHome(): Promise<void> {
            this.isShowPostDetail = false
            this.postId = ""
            this.isShowPostList = true
            this.isShowHomeCarousel = true
            this.isShowHomeAside = true
            this.isShowSearchList = false
        },

        // 预设状态 文章详情
        async setPostDetail(): Promise<void> {
            this.isShowPostDetail = true
            this.isShowPostList = false
            this.isShowHomeCarousel = false
            this.isShowHomeAside = true
            this.isShowSearchList = false
        },

        // 预设状态 搜索
        async setSearch(): Promise<void> {
            this.isShowPostDetail = false
            this.postId = ""
            this.isShowPostList = false
            this.isShowHomeCarousel = false
            this.isShowHomeAside = false
            this.isShowSearchList = true
        },
    },
})

// 允许开发环境下进行热更新 HMR(Hot Module Replacement)
if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useStatusStore, import.meta.hot))
}
