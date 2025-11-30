/**
 * FilePath    : blog-client-dev\src\stores\customElementsDataCache.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 自定义元素缓存, 在作者编辑的时候避免重复请求数据
 */

import { acceptHMRUpdate, defineStore } from "pinia"

import type { AccountKeyRes } from "@/api/accountKey/common"
import { type MembershipRes } from "@/api/membership/common"
import { Names } from "@/customElements"

// 自定义元素数据类型
export type DataType = AccountKeyRes | MembershipRes[] | null

// 自定义元素数据缓存接口
export interface DataCache {
    name: Names // 自定义元素名称
    key: string | number // 缓存键
    data: DataType // 缓存数据
}

// 自定义元素数据缓存集合接口
export interface CustomElementsDataCache {
    [key: string]: DataCache
}

// 生成 CustomElementsDataCache key 的函数
export const generateCustomElementsDataCacheKey = (name: Names, key: string | number): string => {
    return `${name}:${key}`
}

// 初始化自定义元素数据缓存
const initCustomElementsDataCache = (): CustomElementsDataCache => {
    return {}
}

// 自定义元素数据缓存 Store
export const useCustomElementsDataCacheStore = defineStore("customElementsDataCache", {
    state: () => initCustomElementsDataCache(),

    getters: {
        // 获取自定义元素数据缓存
        getDataCache(): CustomElementsDataCache {
            return this
        },
    },

    actions: {
        // 初始化面包屑
        init(): void {
            this.$state = initCustomElementsDataCache()
        },

        // 设置自定义元素数据缓存
        setDataCache(dataCache: DataCache): void {
            const key = generateCustomElementsDataCacheKey(dataCache.name, dataCache.key)
            this[key] = dataCache
        },

        // 删除自定义元素数据缓存
        deleteDataCacheByKey(name: Names, key: string | number): void {
            const cacheKey = generateCustomElementsDataCacheKey(name, key)
            delete this[cacheKey]
        },

        // 获取自定义元素数据缓存
        getDataCacheByKey(name: Names, key: string | number): DataCache | null {
            const cacheKey = generateCustomElementsDataCacheKey(name, key)
            return this[cacheKey] || null
        },

        // 是否存在自定义元素数据缓存
        hasDataCacheByKey(name: Names, key: string | number): boolean {
            const cacheKey = generateCustomElementsDataCacheKey(name, key)
            return !!this[cacheKey]
        },

        // 清空自定义元素数据缓存
        clearDataCache(): void {
            this.$state = initCustomElementsDataCache()
        },
    },
})

// 允许开发环境下进行热更新 HMR(Hot Module Replacement)
if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useCustomElementsDataCacheStore, import.meta.hot))
}
