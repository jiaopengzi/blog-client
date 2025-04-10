/*
 * FilePath    : blog-client\src\stores\breadcrumb.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 面包屑状态
 */

import { acceptHMRUpdate, defineStore } from "pinia"

// 面包屑
export interface BreadcrumbItem {
    display: string // 显示的文字
    to: string // 跳转的路由
}

export interface BreadcrumbStore {
    items: BreadcrumbItem[] // 面包屑数据
    clickedItem: BreadcrumbItem // 点击的面包屑
}

const createBreadcrumbStore = (): BreadcrumbStore => {
    return {
        items: [],
        clickedItem: {
            display: "",
            to: "",
        }, // 点击的面包屑
    }
}

export const useBreadcrumbStore = defineStore("breadcrumb", {
    state: () => createBreadcrumbStore(),

    getters: {
        // 获取面包屑
        getItems(): BreadcrumbItem[] {
            return this.items
        },

        // 获取点击的面包屑
        getClickedItem(): BreadcrumbItem {
            return this.clickedItem
        },
    },

    actions: {
        // 初始化面包屑
        init(): void {
            this.$state = createBreadcrumbStore()
        },

        // 设置面包屑
        setItems(items: BreadcrumbItem[]): void {
            this.items = items
        },

        // 点击面包屑
        click(item: BreadcrumbItem): void {
            this.clickedItem = item
        },

        // 更新面包屑
        updateItems(display: string, to: string, isClear: boolean = true): void {
            // 清空面包屑
            if (isClear) {
                this.items.length = 0
            }

            // 更新面包屑
            const breadcrumbItem: BreadcrumbItem = {
                display,
                to,
            }

            this.items.push(breadcrumbItem)
        },

        // 更新页码面包屑
        updatePage(current_page: string | number | undefined): void {
            // 当 current_page 为 1 时不显示
            if (!current_page || current_page === 1 || current_page === "1") {
                return
            }

            this.updateItems(`第 ${current_page} 页`, "", false)
        },
    },
})

// 允许开发环境下进行热更新 HMR(Hot Module Replacement)
if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useBreadcrumbStore, import.meta.hot))
}
