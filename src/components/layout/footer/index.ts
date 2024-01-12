/**
 * @Author       : jiaopengzi
 * @Date         : 2024-01-12 10:16:10
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-01-12 11:00:54
 * @FilePath     : \blog-client\src\components\layout\footer\index.ts
 * @Description  :
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

export { default } from './index.vue'

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
    beianMPS?: string
    beianMIIT?: string
  }
}
