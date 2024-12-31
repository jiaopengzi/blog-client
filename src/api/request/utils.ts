/**
 * @Author       : jiaopengzi
 * @Date         : 2024-12-25 11:51:57
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-31 12:47:53
 * @FilePath     : \blog-client\src\api\request\utils.ts
 * @Description  : 工具
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { type PaginationRequest, type QueryParamsOptions, PaginationParamsInURL } from "./types"

/**
 * 从 URL 中解析参数
 * @param routeQuery URL 中的查询参数
 * @param options 请求参数选项
 * @returns {Promise<{ hasPaginationParams: boolean, hasQueryParams: boolean, queryParamsResult: T }>}
 */
export const parseQueryParams = async <T extends PaginationRequest>(
    routeQuery: Record<string, unknown>,
    options: QueryParamsOptions<T>,
): Promise<{ hasPaginationParams: boolean; hasQueryParams: boolean; queryParamsResult: T }> => {
    type KeyType = keyof T // key 类型

    let hasPaginationParams = false // 判断是否有分页参数
    let hasQueryParams = false // 判断是否有查询参数
    const queryParamsResult = {} as T // 查询参数结果

    // 没有查询参数直接返回
    if (!Object.keys(routeQuery).length) {
        return { hasPaginationParams, hasQueryParams, queryParamsResult }
    }

    const paginationParamSet = new Set<string>(Object.values(PaginationParamsInURL)) // 分页参数集合
    const stringParamSet = new Set<string>() // 字符串参数集合
    const numberParamSet = new Set<string>(Object.values(PaginationParamsInURL)) // 数字参数集合
    const booleanParamSet = new Set<string>() // 布尔参数集合

    // 更新 stringParamSet
    if ((options?.stringKeys?.length ?? 0) > 0) {
        options?.stringKeys?.forEach((key) => {
            stringParamSet.add(key)
        })
    }

    // 更新 numberParamSet
    if ((options?.numberKeys?.length ?? 0) > 0) {
        options?.numberKeys?.forEach((key) => {
            numberParamSet.add(key)
        })
    }

    // 更新 booleanParamSet
    if ((options?.booleanKeys?.length ?? 0) > 0) {
        options?.booleanKeys?.forEach((key) => {
            booleanParamSet.add(key)
        })
    }

    // 遍历查询参数逐一解析
    for (const key in routeQuery) {
        hasQueryParams = true // 判断是否有查询参数

        // 判断是否有分页参数
        if (paginationParamSet.has(key)) {
            hasPaginationParams = true
        }

        const value = routeQuery[key]
        if (value !== undefined && value !== null) {
            // 解析参数
            if (stringParamSet.has(key)) {
                queryParamsResult[key as KeyType] = value as unknown as T[KeyType]
            } else if (numberParamSet.has(key)) {
                queryParamsResult[key as KeyType] = Number(value) as unknown as T[KeyType]
            } else if (booleanParamSet.has(key)) {
                queryParamsResult[key as KeyType] = (value === "true") as unknown as T[KeyType]
            } else {
                queryParamsResult[key as KeyType] = value as unknown as T[KeyType]
            }
        }
    }

    return { hasPaginationParams, hasQueryParams, queryParamsResult }
}
