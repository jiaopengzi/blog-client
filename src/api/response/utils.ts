/**
 * @FilePath     : \blog-client\src\api\response\utils.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 处理响应错误
 */

import type { Pagination, Res, ResResponse } from "./types"

/**
 * @description: 处理错误信息
 * @param res 返回结果
 * @param msgTitle 根据不同的接口传入不同的标题 默认为空
 * @return {string} 返回错误信息
 */
export const handleResErr = <T>(res: ResResponse<Res<T>, unknown> | Res<T>, msgTitle: string = ""): string => {
    // 处理响应数据
    const resAc = "data" in res ? (res as ResResponse<Res<T>>).data : (res as Res<T>)

    // 错误信息
    let errMsg = resAc.msg || msgTitle

    const resData = resAc.data

    // 如果data不为空且不是对象
    if (resData !== null && typeof resData !== "object" && resData !== "") {
        return (errMsg += "：" + resData)
    }

    // 如果data不为空且是对象
    if (resData !== null && typeof resData === "object") {
        // 历遍对象取出错误信息，不需要key
        const errData: string[] = []

        const data = resData as Record<string, string>

        // 判断是否为空对象
        if (Object.keys(data).length === 0) {
            return errMsg
        }

        // 非空对象，取出错误信息
        for (const key in data) {
            errData.push(data[key]!)
        }

        // 拼接错误信息
        return (errMsg += "：" + errData.join(","))
    }

    return errMsg
}

/**
 * @description: 获取空的分页数据
 * @return {Pagination<T>} 返回空的分页数据
 */
export const getEmptyPagination = <T>(): Pagination<T> => {
    return {
        total: 0, // 默认总记录数量为0
        current_page: 1, // 默认当前页为1
        page_size: 10, // 默认每页显示条数为10
        page_count: 0, // 默认总页数为0
        page_sizes: [10, 20, 30, 50], // 默认的每页显示个数选择器的选项设置
        records: [], // 默认数据为空数组
        highlight: [], // 默认高亮内容为空数组
    }
}
