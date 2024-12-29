/**
 * @Author       : jiaopengzi
 * @Date         : 2024-12-29 12:15:45
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-29 13:39:04
 * @FilePath     : \blog-client\src\api\response\types.ts
 * @Description  :
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import type { AxiosPromise, AxiosResponse } from "axios"
export type { AxiosPromise as ResPromise, AxiosResponse as ResResponse }

// 统一响应结构
export interface Res<T> {
    code: number
    msg: string
    data: T // 可以根据实际返回的数据结构替换为更具体的类型
}
