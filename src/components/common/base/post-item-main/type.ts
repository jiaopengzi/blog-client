/**
 * @Author       : jiaopengzi
 * @Date         : 2023-11-25 15:50:05
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-11-25 16:17:32
 * @FilePath     : \blog-client\src\components\common\base\postItemMain.d.ts
 * @Description  : 文章列表数据对象
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

// 定义props 后续调用
export interface PostItemMainObj {
  category: string
  categoryHref: string
  thumbnailSrc: string
  thumbnailHref: string
  title: string
  titleHref: string
  summary: string
  name: string
  avatar?: string
  date: string
  view: number
  readMoreHref: string
}
