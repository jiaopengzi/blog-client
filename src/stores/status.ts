/*
 * FilePath    : blog-client\src\stores\status.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 状态管理
 */

import { acceptHMRUpdate, defineStore } from "pinia"

import { PostDetailType } from "@/components/common/post-detail"

export interface StatusStore {
    isShowPostDetail: boolean // 是否显示文章详情
    postId: string // 文章 ID
    anchorHash: string // 锚点
    isShowPostList: boolean // 是否显示文章列表
    isShowHomeCarousel: boolean // 是否显示首页轮播图
    isShowHomeAside: boolean // 是否显示首页侧边栏
    isShowSearchList: boolean // 是否显示搜索列表
    disablePagination: boolean // 是否禁用分页功能,主要是临时禁用，比如在搜索时，一段时间后自动解禁

    detailType: PostDetailType // 页面类型
    isShowSearch: boolean // 是否显示搜索框

    isShowToc: boolean // 是否显示目录
    isShowRecommendedRead: boolean // 是否显示推荐文章
    isShowHotPost: boolean // 是否显示热门文章
    isShowMonthArchive: boolean // 是否显示归档
    isShowPostTag: boolean // 是否显示标签

    // 文章详情相关属性
    isShowDetailInteraction: boolean // 是否显示详情交互
    isShowDetailBottomSame: boolean // 是否显示详情底部相同内容
    isShowDetailCategoryTag: boolean // 是否显示详情分类标签
    isShowDetailCopyright: boolean // 是否显示详情版权信息
    isShowDetailPrevNext: boolean // 是否显示详情上一篇下一篇
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

        detailType: PostDetailType.Post, // 默认页面类型为文章
        isShowSearch: true, // 默认不显示搜索框

        isShowToc: true, // 默认显示目录
        isShowRecommendedRead: true, // 默认显示推荐文章
        isShowHotPost: true, // 默认显示热门文章
        isShowMonthArchive: true, // 默认显示归档
        isShowPostTag: true, // 默认显示标签

        isShowDetailInteraction: true, // 默认显示详情交互
        isShowDetailBottomSame: true, // 默认显示详情底部相同内容
        isShowDetailCategoryTag: true, // 默认显示详情分类标签
        isShowDetailCopyright: true, // 默认显示详情版权信息
        isShowDetailPrevNext: true, // 默认显示详情上一篇下一篇
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

        // 设置页面类型
        async setDetailType(type: PostDetailType): Promise<void> {
            this.detailType = type
        },

        // 设置是否显示搜索框
        async setShowSearch(status: boolean): Promise<void> {
            this.isShowSearch = status
        },

        // 设置是否显示目录
        async setShowToc(status: boolean): Promise<void> {
            this.isShowToc = status
        },

        // 设置是否显示推荐文章
        async setShowRecommendedRead(status: boolean): Promise<void> {
            this.isShowRecommendedRead = status
        },

        // 设置是否显示热门文章
        async setShowHotPost(status: boolean): Promise<void> {
            this.isShowHotPost = status
        },

        // 设置是否显示归档
        async setShowMonthArchive(status: boolean): Promise<void> {
            this.isShowMonthArchive = status
        },

        // 设置是否显示标签
        async setShowPostTag(status: boolean): Promise<void> {
            this.isShowPostTag = status
        },

        // 设置文章详情相关属性
        async setShowDetailInteraction(status: boolean): Promise<void> {
            this.isShowDetailInteraction = status
        },

        async setShowDetailBottomSame(status: boolean): Promise<void> {
            this.isShowDetailBottomSame = status
        },

        async setShowDetailCategoryTag(status: boolean): Promise<void> {
            this.isShowDetailCategoryTag = status
        },

        async setShowDetailCopyright(status: boolean): Promise<void> {
            this.isShowDetailCopyright = status
        },

        async setShowDetailPrevNext(status: boolean): Promise<void> {
            this.isShowDetailPrevNext = status
        },

        // 预设状态 主页文章列表
        async setHome(): Promise<void> {
            this.isShowPostDetail = false
            this.postId = ""
            this.isShowPostList = true
            this.isShowHomeAside = true
            this.isShowHomeCarousel = true
            this.isShowSearchList = false
            this.isShowSearch = true
            this.isShowRecommendedRead = true
            this.isShowHotPost = true
            this.isShowMonthArchive = true
            this.isShowPostTag = true
        },

        // 预设状态 文章详情
        async setPostDetail(): Promise<void> {
            this.isShowPostDetail = true
            this.isShowPostList = false
            this.isShowHomeCarousel = false
            this.isShowHomeAside = true
            this.isShowSearchList = false
            this.isShowSearch = false
            this.isShowToc = true
            this.isShowRecommendedRead = true
            this.isShowHotPost = true
            this.isShowMonthArchive = true
            this.isShowPostTag = true
            this.detailType = PostDetailType.Post
            this.isShowDetailInteraction = true
            this.isShowDetailBottomSame = true
            this.isShowDetailCategoryTag = true
            this.isShowDetailCopyright = true
            this.isShowDetailPrevNext = true
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

        // 预设状态 自定义page
        async setCustomPage(): Promise<void> {
            this.isShowPostDetail = true
            this.isShowPostList = false
            this.isShowHomeCarousel = false
            this.isShowHomeAside = true
            this.isShowSearchList = false
            this.detailType = PostDetailType.Page
            this.isShowSearch = false
            this.isShowToc = false
            this.isShowRecommendedRead = false
            this.isShowHotPost = false
            this.isShowMonthArchive = false
            this.isShowPostTag = false
            this.isShowDetailInteraction = false
            this.isShowDetailBottomSame = false
            this.isShowDetailCategoryTag = false
            this.isShowDetailCopyright = false
            this.isShowDetailPrevNext = false
        },
    },
})

// 允许开发环境下进行热更新 HMR(Hot Module Replacement)
if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useStatusStore, import.meta.hot))
}
