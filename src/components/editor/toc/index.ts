/**
 * @Author       : jiaopengzi
 * @Date         : 2023-12-19 15:05:31
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-01-11 16:55:56
 * @FilePath     : \blog-client\src\components\common\editor\toc\index.ts
 * @Description  : ts 声明文件
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */
import type { HeadingType } from '@/stores/editor'

export { default } from './index.vue'

export interface TocProps {
  headings: Array<HeadingType> // 预览内容
}
