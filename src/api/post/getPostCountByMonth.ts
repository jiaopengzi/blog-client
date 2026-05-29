/**
 * @FilePath     : \blog-client\src\api\post\getPostCountByMonth.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 按照作者统计文章数量
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface PostCountByMonth {
    year: number // 年
    month: number // 月
    count: number // 文章数量
}

// getPostCountByMonthSortValue 获取月度统计排序值.
// 参数 item, 单条月度统计; 返回年月组成的可比较数值.
function getPostCountByMonthSortValue(item: PostCountByMonth): number {
    return item.year * 100 + item.month
}

// sortPostCountByMonthDesc 按年月倒序排序月度统计列表.
// 参数 list, 月度统计列表; 返回新的排序后列表, 不修改原数组.
export function sortPostCountByMonthDesc(list: PostCountByMonth[]): PostCountByMonth[] {
    const sortedList: PostCountByMonth[] = []

    for (const item of list) {
        const insertIndex = sortedList.findIndex((sortedItem) => getPostCountByMonthSortValue(item) > getPostCountByMonthSortValue(sortedItem))
        if (insertIndex === -1) {
            sortedList.push(item)
            continue
        }

        sortedList.splice(insertIndex, 0, item)
    }

    return sortedList
}

export function getPostCountByMonthAPI(): ResPromise<Res<PostCountByMonth[]>> {
    const urlStr = routerGroup + "/post/count-by-month"
    return request({
        url: urlStr,
        method: "get",
    })
}
