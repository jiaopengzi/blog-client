/**
 * @Author       : jiaopengzi
 * @Date         : 2023-12-01 22:04:48
 * @LastEditors  : Please set LastEditors
 * @LastEditTime : 2025-03-09 23:59:24
 * @FilePath     : \blog-client\types\table-extension.d.ts
 * @Description  : 表格扩展 ts 声明文件
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

// declare module "@/pkg/marked/extension/table" {
declare module "marked-extended-tables" {
    import { MarkedExtension } from "marked"

    /*
     * Configures a marked extension to apply extended table functionality.
     *
     * @return A MarkedExtension to be passed to `marked.use()`
     */
    export default function tableExtension(): MarkedExtension
}
