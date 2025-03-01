/**
 * @Author       : jiaopengzi
 * @Date         : 2024-12-25 11:46:44
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2025-01-07 17:54:22
 * @FilePath     : \blog-client\src\components\hooks\useHome\api.ts
 * @Description  : 数据请求
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { reactive } from "vue"

import type { PostResCommon, PostResPagination } from "@/api/post/common"
import { getPostCountByMonthAPI } from "@/api/post/getPostCountByMonth"
import { viewPostAPI, type ViewPostRequest } from "@/api/post/view"
import { viewHotPostAPI } from "@/api/post/viewHotPost"
import { viewRecommendedPostAPI } from "@/api/post/viewRecommendedPost"
import { type QueryParamsOptions } from "@/api/request"
import { getEmptyPagination, type Pagination, type Res, ResponseCode, type ResPromise } from "@/api/response"
import { type MonthArchiveData } from "@/components/common/month-archive"

import type { ViewPostResKey } from "./types"

export function useGetData(options?: QueryParamsOptions<ViewPostRequest>) {
    const pagination = reactive<Pagination<PostResPagination>>(getEmptyPagination<PostResPagination>()) // 分页数据

    const hotPost = reactive<PostResCommon[]>([]) // 热门文章
    const recommendedPost = reactive<PostResCommon[]>([]) // 推荐文章
    const monthArchiveProps = reactive<MonthArchiveData[]>([]) // 月份归档

    // 通用返回为 PostResCommon[] 的 API
    const getPostResCommons = async (apiFunc: () => ResPromise<Res<PostResCommon[]>>, targetArray: PostResCommon[], successCode: number) => {
        const res = await apiFunc()
        if (res.data.code === successCode) {
            Object.assign(targetArray, res.data.data)
        }
    }

    // 获取分页
    async function getPaginate(req: ViewPostRequest): Promise<Pagination<PostResPagination>> {
        // 遍历 options.NoRequest 中的参数，如果 req 中的参数值等于 options.NoRequest 中的值则删除,不请求
        for (const key in options?.noRequestKeys) {
            if (key in req && req[key as ViewPostResKey] === options.noRequestKeys[key as ViewPostResKey]) {
                delete req[key as ViewPostResKey]
            }
        }

        // 获取标签列表
        const res = await viewPostAPI(req)
        if (res.data.code === ResponseCode.PostViewSuccess) {
            return res.data.data
        }

        return getEmptyPagination<PostResPagination>()
    }

    // 热门文章
    const getHostPost = async () => {
        await getPostResCommons(viewHotPostAPI, hotPost, ResponseCode.PostViewHotSuccess)
    }

    // 推荐文章
    const getRecommendedPost = async () => {
        await getPostResCommons(viewRecommendedPostAPI, recommendedPost, ResponseCode.PostViewRecommendedSuccess)
    }

    // 推荐文章
    async function getPostCountByMonth() {
        // 获取标签列表
        const res = await getPostCountByMonthAPI()
        if (res.data.code === ResponseCode.PostCountByMonthSuccess) {
            // 清空现有的 monthArchiveProps
            monthArchiveProps.length = 0
            // 遍历 res.data.data 并更新 monthArchiveProps
            res.data.data.forEach((item) => {
                // 创建新的对象并添加 year_month 字段
                const newItem = {
                    ...item,
                    year_month: `${item.year}-${item.month}`,
                }
                // 将 newItem 添加到 monthArchiveProps
                monthArchiveProps.push(newItem)
            })

            // 按照 year 和 month 进行降序排序
            monthArchiveProps.sort((a, b) => {
                if (a.year !== b.year) {
                    return b.year - a.year // 年份降序
                }
                return a.month - b.month // 月份降序
            })
        }
    }

    return {
        pagination, // 分页数据
        hotPost, // 热门文章
        recommendedPost, // 推荐文章
        monthArchiveProps, // 月份归档
        getHostPost, // 热门文章
        getRecommendedPost, // 推荐文章
        getPostCountByMonth, // 月份归档
        getPaginate, // 获取分页
    }
}
