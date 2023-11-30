/**
 * @Author       : jiaopengzi
 * @Date         : 2023-11-29 11:11:04
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-11-29 11:11:44
 * @FilePath     : \blog-client\typings\marked-custom-heading-id.d.ts
 * @Description  : 手动编写的marked-custom-heading-id.d.ts文件
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

declare module 'marked-custom-heading-id' {
  import { MarkedExtension } from 'marked'

  /**
   * Configures a marked extension to apply extended table functionality.
   *
   * @return A MarkedExtension to be passed to `marked.use()`
   */
  export default function customHeadingId(): MarkedExtension
}
