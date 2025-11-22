/**
 * @FilePath     : \blog-client\src\components\common\db-es\types.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : es 表单类型
 */

import { type BaseConfigFormRef } from "@/components/common/base-config-form"

export interface ESForm {
    addresses: string // 地址列表转成字符串使用逗号分隔
    user: string // 用户名
    password: string // 密码
    index_prefix: string // 表前缀
    ca_cert: string // CA 证书(可选)
    use_ca_cert: boolean // 是否使用CA认证(可选)
}

export interface ElasticsearchFormRef extends HTMLElement {
    root: HTMLElement
    formRef: BaseConfigFormRef
}
