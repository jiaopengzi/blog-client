/*
 * FilePath    : blog-client\src\stores\status.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 状态管理
 */

import { acceptHMRUpdate, defineStore } from "pinia"

export interface StatusStore {
    isHomeUpdateRoute: boolean
}

function createStatusStore(): StatusStore {
    return {
        isHomeUpdateRoute: false,
    }
}

export const useStatusStore = defineStore("status", {
    state: () => createStatusStore(),

    getters: {
        // 获取是否更新首页路由
        getIsHomeUpdateRoute(): boolean {
            return this.isHomeUpdateRoute
        },
    },

    actions: {
        // 设置是否更新首页路由
        setIsHomeUpdateRoute(status: boolean = true): void {
            this.isHomeUpdateRoute = status
        },

        // 重置状态
        resetIsHomeUpdateRouteStatus(): void {
            this.isHomeUpdateRoute = false
        },
    },
})

// 允许开发环境下进行热更新 HMR(Hot Module Replacement)
if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useStatusStore, import.meta.hot))
}
