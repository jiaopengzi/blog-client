/**
 * @Author       : jiaopengzi
 * @Date         : 2024-12-30 10:53:04
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-30 10:54:46
 * @FilePath     : \blog-client\src\components\layout\footer\types.ts
 * @Description  : 类型
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

export interface FooterProps {
    left?: {
        title?: string
        content?: string
    }
    middle?: {
        imgUrl: string
        display?: string
    }[]
    right?: {
        title?: string
        content?: string
        beianMPS?: string // 联网备案
        beianMIIT?: string // ICP备案
    }
}
