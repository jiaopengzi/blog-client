/**
 * FilePath    : blog-client\src\components\hooks\useHome\api.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 数据请求 (slug 归一与非法 id 拦截, bugfix 260918-03)
 */

import { reactive } from "vue"

import { isValidPostId, type PostResCommon, type PostResPagination } from "@/api/post/common"
import { getPostCountByMonthAPI, sortPostCountByMonthDesc } from "@/api/post/getPostCountByMonth"
import { viewPostAPI } from "@/api/post/view"
import { type ViewPostRequest } from "@/api/post/view"
import { viewHotPostAPI } from "@/api/post/viewHotPost"
import { viewRecommendedPostAPI } from "@/api/post/viewRecommendedPost"
import { type QueryParamsOptions } from "@/api/request"
import { getEmptyPagination, type Pagination, ResponseCode } from "@/api/response"
import { type MonthArchiveData } from "@/components/common/month-archive"
import { useStatusStore } from "@/stores/status"
import { encodeSlugOnce } from "@/utils/slug"

import type { ViewPostReqKey } from "./types"

// 后端按 "URL 转义形态" 的 slug 匹配 (中文标签/分类的 slug 在库中即存为 %E5%A4%9A... 形式):
// 直接用明文请求会被后端视为未命中而返回无数据 (bf-260919-02), 须编码一次后请求
// bugfix 260918-03: 旧判断 "已含 %XX 转义则原样保持" (避免标签云 API 返回的转义 slug 二次转义)
// 对多层编码形态失效——canonical 双重编码使爬虫逐层跟随产生多层 %25 形态 (生产日志实测 380 层),
// 会原样发给后端; 修正: 统一先完全解码到明文再编码一次, 任意层数 (含标签云转义 slug 与明文) 归一到单层
const normalizeSlug = (value: string | undefined): string | undefined => {
    if (!value) {
        return value
    }
    return encodeSlugOnce(value)
}

export function useGetData(options?: QueryParamsOptions<ViewPostRequest>) {
    const pagination = reactive<Pagination<PostResPagination>>(getEmptyPagination<PostResPagination>()) // 分页数据

    const recommendedPost = reactive<PostResCommon[]>([]) // 推荐文章
    const hotPost = reactive<PostResCommon[]>([]) // 热门文章
    const monthArchiveProps = reactive<MonthArchiveData[]>([]) // 月份归档

    const statusStore = useStatusStore()

    // 获取分页
    async function getPaginate(req: ViewPostRequest): Promise<Pagination<PostResPagination>> {
        // 遍历 options.noRequestKeys 中的参数, 如果 req 中的参数值与其相等则删除该参数, 不参与请求
        for (const key in options?.noRequestKeys) {
            if (key in req && req[key as ViewPostReqKey] === options.noRequestKeys[key as ViewPostReqKey]) {
                delete req[key as ViewPostReqKey]
            }
        }

        // bugfix 260918-03: 外部 URL query 透传的字符串 "0"/非正整数 id (如 /tag/:slug?post_tag_id=0,
        // 搜索引擎索引或第三方构造的链接) 属非法值, 与 260918-02 的 post_id 问题同族, 发请求前统一拦截
        if ("post_tag_id" in req && !isValidPostId(req.post_tag_id)) {
            delete req.post_tag_id
        }
        if ("post_category_id" in req && !isValidPostId(req.post_category_id)) {
            delete req.post_category_id
        }

        // 如果是关键字查询需要设置高亮字
        if (req.key_word && options?.highlight_fields && options.highlight_fields.length > 0) {
            req.highlight_fields = options?.highlight_fields
            req.pre_tags = options?.pre_tags
            req.post_tags = options?.post_tags
        }

        // 请求文章列表
        const res = await viewPostAPI({
            ...req,
            post_category_slug: normalizeSlug(req.post_category_slug),
            post_tag_slug: normalizeSlug(req.post_tag_slug),
        })
        if (res.data.code === ResponseCode.PostViewSuccess) {
            return res.data.data
        }

        return getEmptyPagination<PostResPagination>()
    }

    // 推荐文章
    const getRecommendedPost = async () => {
        const res = await viewRecommendedPostAPI()
        if (res.data.code === ResponseCode.PostViewRecommendedSuccess) {
            Object.assign(recommendedPost, res.data.data)

            // 设置状态
            statusStore.setHasDataRecommendedRead(recommendedPost.length > 0)
        }
    }

    // 热门文章
    const getHostPost = async () => {
        const res = await viewHotPostAPI()
        if (res.data.code === ResponseCode.PostViewHotSuccess) {
            Object.assign(hotPost, res.data.data)

            // 设置状态
            statusStore.setHasDataHotPost(hotPost.length > 0)
        }
    }

    // 月份归档统计
    async function getPostCountByMonth() {
        // 请求月度文章数量统计
        const res = await getPostCountByMonthAPI()
        if (res.data.code === ResponseCode.PostCountByMonthSuccess) {
            // 清空现有的 monthArchiveProps
            monthArchiveProps.length = 0

            // 当没有数据时直接返回
            if (!res.data.data || !Array.isArray(res.data.data) || res.data.data.length === 0) {
                // 设置状态
                statusStore.setHasDataMonthArchive(false)
                return
            }

            // 遍历倒序月度统计并更新 monthArchiveProps
            sortPostCountByMonthDesc(res.data.data).forEach((item) => {
                // 创建新的对象并添加 year_month 字段
                const newItem = {
                    ...item,
                    year_month: `${item.year}-${item.month}`,
                }
                // 将 newItem 添加到 monthArchiveProps
                monthArchiveProps.push(newItem)
            })

            // 设置状态
            statusStore.setHasDataMonthArchive(monthArchiveProps.length > 0)
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
