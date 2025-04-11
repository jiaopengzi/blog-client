/**
 * @FilePath     : \blog-client\src\utils\queryParam.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 解析 URL 查询参数
 */

import { type LocationQuery } from "vue-router"

import { KeyWordParamsInURL, PaginationParamsInURL, PostDetailParamsInURL, type QueryParamsOptions } from "@/api/request"

// url query 参数状态
export interface QueryParamsStatus {
    hasQuery: boolean // 是否有查询参数
    hasPagination: boolean // 是否有分页参数
    hasKeyWord: boolean // 是否有关键字参数
    hasPostDetail: boolean // 是否有文章详情参数
}

// url query 参数结果
export interface QueryParamsResult<T> extends QueryParamsStatus {
    result: T // 查询参数结果
}

// 初始化查询参数状态
const initQueryParamsStatus = (): QueryParamsStatus => {
    return {
        hasQuery: false,
        hasPagination: false,
        hasKeyWord: false,
        hasPostDetail: false,
    }
}

// 初始化查询参数结果
const initQueryParamsResult = <T>(): QueryParamsResult<T> => {
    return {
        ...initQueryParamsStatus(),
        result: {} as T,
    }
}

/**
 * 获取参数类型集合
 * @description 根据传入的选项初始化不同类型的参数集合，包括分页参数、文章详情参数、字符串参数、数字参数和布尔参数。
 * @param options 请求参数选项
 * @returns 包含不同类型参数集合的对象
 */
const getParamSets = <T>(options?: QueryParamsOptions<T>) => {
    const paginationParamSet = new Set<string>(Object.values(PaginationParamsInURL)) // 分页参数集合
    const keyWordParamSet = new Set<string>(Object.values(KeyWordParamsInURL)) // 关键字参数集合
    const postDetailParamSet = new Set<string>(Object.values(PostDetailParamsInURL)) // 文章详情参数集合
    const stringParamSet = new Set<string>() // 字符串参数集合
    const numberParamSet = new Set<string>(Object.values(PaginationParamsInURL)) // 数字参数集合
    const booleanParamSet = new Set<string>() // 布尔参数集合

    // 根据 options 更新参数集合
    options?.stringKeys?.forEach((key) => stringParamSet.add(key))
    options?.numberKeys?.forEach((key) => numberParamSet.add(key))
    options?.booleanKeys?.forEach((key) => booleanParamSet.add(key))

    return { paginationParamSet, keyWordParamSet, postDetailParamSet, stringParamSet, numberParamSet, booleanParamSet }
}

/**
 * 处理查询参数核心逻辑
 * @description 遍历路由查询参数，更新状态并调用回调函数处理每个参数的值。
 * @param routeQuery 路由查询参数
 * @param paginationSet 分页参数集合
 * @param keyWordSet 关键字参数集合
 * @param postDetailSet 文章详情参数集合
 * @param valueHandler 可选的值处理回调函数，用于处理每个参数的值
 * @returns 查询参数状态对象
 */
const processQueryParams = (
    routeQuery: LocationQuery,
    paginationSet: Set<string>,
    keyWordSet: Set<string>,
    postDetailSet: Set<string>,
    valueHandler?: (key: string, value: unknown) => void,
): QueryParamsStatus => {
    const status = initQueryParamsStatus() // 初始化查询参数状态

    if (!Object.keys(routeQuery).length) return status // 如果没有查询参数，直接返回初始状态

    // 遍历查询参数
    for (const key in routeQuery) {
        status.hasQuery = true // 标记存在查询参数
        if (paginationSet.has(key)) status.hasPagination = true // 判断是否有分页参数
        if (keyWordSet.has(key)) status.hasKeyWord = true // 判断是否有关键字参数
        if (postDetailSet.has(key)) status.hasPostDetail = true // 判断是否有文章详情参数

        const value = routeQuery[key]
        valueHandler?.(key, value) // 调用回调函数处理参数值
    }

    return status
}

/**
 * 解析路由查询参数状态
 * @description 解析路由查询参数的状态信息，包括是否存在查询参数、分页参数和文章详情参数。
 * @param routeQuery 路由查询参数
 * @param options 请求参数选项
 * @returns 包含查询参数状态的 Promise 对象
 */
export const parseRouteQueryStatus = async <T>(routeQuery: LocationQuery, options?: QueryParamsOptions<T>): Promise<QueryParamsStatus> => {
    const { paginationParamSet, keyWordParamSet, postDetailParamSet } = getParamSets(options) // 获取参数集合
    return processQueryParams(routeQuery, paginationParamSet, keyWordParamSet, postDetailParamSet) // 调用核心逻辑处理查询参数
}

/**
 * 解析路由查询参数
 * @description 解析路由查询参数并返回包含解析结果和状态的对象。
 * @param routeQuery 路由查询参数
 * @param options 请求参数选项
 * @returns 包含解析结果和状态的 Promise 对象
 */
export const parseRouteQuery = async <T>(routeQuery: LocationQuery, options?: QueryParamsOptions<T>): Promise<QueryParamsResult<T>> => {
    type KeyType = keyof T // 定义键类型

    const query = initQueryParamsResult<T>() // 初始化查询参数结果

    if (!Object.keys(routeQuery).length) return query // 如果没有查询参数，直接返回初始结果

    // 获取参数集合
    const { paginationParamSet, keyWordParamSet, postDetailParamSet, stringParamSet, numberParamSet, booleanParamSet } = getParamSets(options)

    // 调用核心逻辑处理查询参数，并在回调中解析参数值
    const queryUpdate = processQueryParams(routeQuery, paginationParamSet, keyWordParamSet, postDetailParamSet, (key, value) => {
        if (value === undefined || value === null) return // 忽略 undefined 和 null 值

        let transformedValue: unknown // 转换后的值
        if (stringParamSet.has(key)) {
            transformedValue = value // 字符串参数直接赋值
        } else if (numberParamSet.has(key)) {
            transformedValue = Number(value) // 数字参数转换为数字
        } else if (booleanParamSet.has(key)) {
            transformedValue = value === "true" // 布尔参数转换为布尔值
        } else {
            transformedValue = value // 其他参数直接赋值
        }

        query.result[key as KeyType] = transformedValue as T[KeyType] // 更新查询结果
    })

    return { ...query, ...queryUpdate } // 合并查询结果和状态并返回
}
