/**
 * @Author       : jiaopengzi
 * @Date         : 2023-12-19 15:05:31
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-12-19 17:14:48
 * @FilePath     : \blog-client\src\types\components\common\editor\toc\index.d.ts
 * @Description  : ts 声明文件
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

import type { HeadingType } from '@/stores/editor'
export interface TocProps {
  headings: Array<HeadingType> // 预览内容
}
