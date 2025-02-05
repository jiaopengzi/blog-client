/**
 * @Author       : jiaopengzi
 * @Date         : 2025-01-08 17:47:39
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2025-02-05 17:07:43
 * @FilePath     : \blog-client\src\components\common\base-config-form\commonRules.ts
 * @Description  : 基础校验规则
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 */

import type { FormRules } from "element-plus"

import { useFormItemRule } from "@/components/hooks/useFormItemRule"

export const dbRules: FormRules = {
    host: [{ required: true, message: "请输入数据库主机地址", trigger: "blur" }],
    port: [{ required: true, message: "请输入数据库的端口号", trigger: "blur" }, useFormItemRule().portFormItemRule()],
    database: [{ required: true, message: "请输入数据库名称", trigger: "blur" }],
    user: [{ required: true, message: "请输入数据库用户", trigger: "blur" }],
    password: [{ required: true, message: "请输入数据库密码", trigger: "blur" }],
}

export const uploadRules: FormRules = {
    path: [
        {
            required: true,
            message: "path 为必填项",
            trigger: "blur",
        },
        {
            validator: (rule, value, callback) => {
                // 结尾需要有斜杠
                if (value.endsWith("/")) {
                    callback()
                } else {
                    callback(new Error("path需要以斜杠 '/' 结尾"))
                }
            },
            trigger: "blur",
        },
    ],
}
