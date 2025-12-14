/**
 * @FilePath     : \blog-client\src\components\common\base-config-form\commonRules.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 基础校验规则
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import type { FormRules } from "element-plus"

import { useFormItemRule } from "@/components/hooks/useFormItemRule"
import { isValidCSS } from "@/utils/cssValidator"

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

// 前缀校验 结尾为'_'且长度不超过50,不包含空格
export const prefixValidatorFunc = (rule: any, value: any, callback: any) => {
    if (!value.endsWith("_") || value.length > 50 || /\s/.test(value)) {
        callback(new Error("前缀必须以'_'结尾,长度不超过50,不包含空格"))
    } else {
        callback()
    }
}

// urlList 校验 以逗号分隔的 url 列表, 每个 url 必须以 http 或 https 开头
// 例如: http://localhost:9200,https://localhost:9200
// 同时判断逗号是否合法,不能有空格
export const urlListValidatorFunc = (rule: any, value: any, callback: any) => {
    // 判断是否有空格
    if (value.includes(" ")) {
        callback(new Error("url列表不能包含空格"))
        return
    }

    // 判断逗号是否为合法的逗号
    if (value.startsWith(",") || value.endsWith(",")) {
        callback(new Error("逗号不合法"))
        return
    }

    // 判断是否有连续的逗号
    if (value.includes(",,") || value.includes(",,")) {
        callback(new Error("逗号不合法"))
        return
    }

    // 如果逗号为中文逗号则不合法
    if (value.includes("，")) {
        callback(new Error("逗号不合法,请使用英文逗号"))
        return
    }

    const urlList = value.split(",")
    for (const url of urlList) {
        if (!url.startsWith("http://") && !url.startsWith("https://")) {
            callback(new Error("url必须以http或https开头"))
            return
        }
    }

    callback()
}

// url校验 必须以http或https开头
export const urlValidatorFunc = (rule: any, value: any, callback: any) => {
    if (!value.startsWith("http://") && !value.startsWith("https://")) {
        callback(new Error("url必须以http或https开头"))
    } else {
        callback()
    }
}

// imageURL校验 必须以http或https开头,判断是否为图片,可以为空
export const imageURLRequiredValidatorFunc = (rule: any, value: any, callback: any) => {
    if (value === "") {
        callback()
    } else if (!value.startsWith("http://") && !value.startsWith("https://")) {
        callback(new Error("url必须以http或https开头"))
    } else if (!/\.(gif|jpg|jpeg|tiff|png|ico|svg)$/i.test(value)) {
        callback(new Error("url必须为图片"))
    } else {
        callback()
    }
}

// 校验 css
export const cssValidatorFunc = (rule: any, value: any, callback: any) => {
    const { isValid, errors } = isValidCSS(value)
    if (isValid) {
        callback()
    } else {
        // 只显示errors的最后一条信息
        if (errors.length === 0) {
            callback(new Error("意外的 CSS 语法错误"))
            return
        }
        callback(new Error("CSS 语法错误:\n" + errors[errors.length - 1]))
    }
}
