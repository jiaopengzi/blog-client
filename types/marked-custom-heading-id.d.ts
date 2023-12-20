/**
 * @Author       : jiaopengzi
 * @Date         : 2023-12-01 22:04:48
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-12-19 11:19:09
 * @FilePath     : \blog-client\types\pkg\marked-custom-heading-id.d.ts
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
