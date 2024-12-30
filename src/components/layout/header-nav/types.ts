/**
 * @Author       : jiaopengzi
 * @Date         : 2024-12-30 10:51:03
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-30 10:52:19
 * @FilePath     : \blog-client\src\components\layout\header-nav\types.ts
 * @Description  : 类型定义
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { IconKeys } from "@/components/common/icons"

export interface HeaderNavPropsItem {
    path: string
    iconKey?: IconKeys
    title?: string
    customClass?: string
}
