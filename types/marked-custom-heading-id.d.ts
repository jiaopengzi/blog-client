/**
 * @FilePath     : \blog-client\types\marked-custom-heading-id.d.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 手动编写的 marked-custom-heading-id.d.ts 文件
 */

declare module "marked-custom-heading-id" {
    import { MarkedExtension } from "marked"

    /**
     * Configures a marked extension to apply extended table functionality.
     *
     * @return A MarkedExtension to be passed to `marked.use()`
     */
    export default function customHeadingId(): MarkedExtension
}
