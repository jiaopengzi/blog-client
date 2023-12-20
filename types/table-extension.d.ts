/**
 * @Author       : jiaopengzi
 * @Date         : 2023-12-01 22:04:48
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-12-19 11:19:39
 * @FilePath     : \blog-client\types\pkg\table-extension.d.ts
 * @Description  : 表格扩展 ts 声明文件
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

declare module '@/pkg/marked/extension/table' {
  import { MarkedExtension } from 'marked'

  /**
   * Configures a marked extension to apply extended table functionality.
   *
   * @return A MarkedExtension to be passed to `marked.use()`
   */
  export default function tableExtension(): MarkedExtension
}
