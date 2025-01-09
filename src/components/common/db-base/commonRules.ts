/**
 * @Author       : jiaopengzi
 * @Date         : 2025-01-08 17:47:39
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2025-01-08 18:05:19
 * @FilePath     : \blog-client\src\components\common\db-base\commonRules.ts
 * @Description  : 基础校验规则
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 */

import type { FormRules } from "element-plus"

export const commonRules: FormRules = {
    host: [{ required: true, message: "请输入数据库主机地址", trigger: "blur" }],
    port: [
        { required: true, message: "请输入数据库的端口号", trigger: "blur" },
        {
            validator: (rule, value, callback) => {
                const port = Number(value)
                if (isNaN(port) || port < 1 || port > 65535) {
                    callback(new Error("端口号必须在 1 到 65535 之间"))
                } else {
                    callback()
                }
            },
            trigger: "blur",
        },
    ],
    database: [{ required: true, message: "请输入数据库名称", trigger: "blur" }],
    user: [{ required: true, message: "请输入数据库用户", trigger: "blur" }],
    password: [{ required: true, message: "请输入数据库密码", trigger: "blur" }],
}
