/**
 * @FilePath     : \blog-client\src\components\hooks\useFormItemRule\index.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 表单子项校验规则
 */

import type { FormItemRule } from "element-plus"

/**
 * @description: 端口号校验规则
 * @param trigger 触发方式 默认为 blur, 可选值为 blur, change
 * @return {FormItemRule} 校验规则
 */
const portFormItemRule = (trigger: string = "blur"): FormItemRule => {
    return {
        validator: (rule, value, callback) => {
            const port = Number(value)
            if (isNaN(port) || port < 1 || port > 65535) {
                callback(new Error("端口号必须在 1 到 65535 之间"))
            } else {
                callback()
            }
        },
        trigger,
    }
}

export function useFormItemRule() {
    return {
        portFormItemRule,
    }
}
