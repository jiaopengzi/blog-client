/*
 * FilePath    : blog-client\src\views\admin\component\main\app-nav\nav-item\hook.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : hook
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import type { FormRules } from "element-plus"
import { reactive } from "vue"
import { type Reactive } from "vue"

import { Target } from "@/api/common"
import { imageURLRequiredValidatorFunc } from "@/components/common/base-config-form"
import { IconKeys } from "@/components/common/icons"
import { checkIconKeys } from "@/components/common/icons"

import { type NavItemProps } from "./types"

export function useNavItem(formDataResult: Reactive<NavItemProps>): { rules: FormRules<NavItemProps> } {
    const rules = reactive<FormRules<NavItemProps>>({
        index: [
            {
                required: true,
                message: "请输入索引",
                trigger: "blur",
            },
            {
                validator: (rule: any, value: any, callback: any) => {
                    // 判断是否与 parentIndex 重复
                    if (value === formDataResult.parentIndex) {
                        callback(new Error("不能与父索引重复"))
                    } else if (!/^\d+$/.test(value)) {
                        callback(new Error("请输入大于等于 0 的整数"))
                    } else {
                        callback()
                    }
                },
                trigger: "blur",
            },
        ],
        text: [
            {
                required: true,
                message: "请输入文字",
                trigger: "blur",
            },
        ],
        href: [
            {
                required: true,
                message: "请输入目的",
                trigger: "blur",
            },
        ],
        target: [
            {
                required: false,
                trigger: "blur",
            },
            {
                validator: (rule: any, value: any, callback: any) => {
                    // 判断是否在 Target 中
                    if (value === "" || value === null || value === undefined) {
                        callback()
                    } else if (!Object.values(Target).includes(value)) {
                        // 将 Target 的值拼接成字符串
                        const targetValues = Object.values(Target).join(" | ")
                        callback(new Error(`请输入正确的打开方式: ${targetValues}`))
                    } else {
                        callback()
                    }
                },
                trigger: "blur",
            },
        ],
        parentIndex: [
            {
                required: false,
                trigger: "blur",
            },
            {
                validator: (rule: any, value: any, callback: any) => {
                    // 判断是否与 index 重复
                    if (value === "" || value === null || value === undefined) {
                        callback()
                    } else if (value === formDataResult.index) {
                        callback(new Error("不能与索引重复"))
                    } else if (!/^\d+$/.test(value)) {
                        callback(new Error("请输入大于等于 0 的整数"))
                    } else {
                        callback()
                    }
                },
                trigger: "blur",
            },
        ],
        "icon.name": [
            {
                validator: (rule: any, value: any, callback: any) => {
                    const isIconKey = checkIconKeys(value as IconKeys)
                    if (value === "" || value === null || value === undefined) {
                        callback()
                    } else if (!isIconKey) {
                        callback(new Error("请输入正确的内置图标"))
                    } else {
                        callback()
                    }
                },
                trigger: "blur",
            },
        ],
        "icon.src": [
            {
                validator: imageURLRequiredValidatorFunc,
                trigger: "blur",
            },
        ],
    })

    return {
        rules,
    }
}
