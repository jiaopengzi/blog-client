/**
 * @Author       : jiaopengzi
 * @Date         : 2023-11-25 15:50:05
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-12-21 14:39:33
 * @FilePath     : \blog-client\src\components\common\base\post-item-aside\postItemAside.d.ts
 * @Description  : 文章列表数据对象
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

// 定义props 后续调用
export interface PostItemAsideObj {
  thumbnailSrc: string
  thumbnailHref: string
  title: string
  titleHref: string
  date: string
  view: number
}
