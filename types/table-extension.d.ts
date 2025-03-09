/**
 * @FilePath     : \blog-client\types\table-extension.d.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 表格扩展 ts 声明文件
 */

declare module "marked-extended-tables" {
    import { MarkedExtension } from "marked"

    /*
     * Configures a marked extension to apply extended table functionality.
     *
     * @return A MarkedExtension to be passed to `marked.use()`
     */
    export default function tableExtension(): MarkedExtension
}
