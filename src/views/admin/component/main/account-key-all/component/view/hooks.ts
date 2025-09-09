/*
 * FilePath    : blog-client\src\views\admin\component\main\account-key-all\component\view\hooks.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 表单验证
 */

import type { FormRules } from "element-plus" // 需要全部安装 npm i element-plus -S
import { reactive, type Ref } from "vue"

import { type PgSqlDateTime } from "@/api/common"
import { RegexPatterns } from "@/utils/regexPatterns"

import type { ViewForm } from "./types"

// 表单验证选项
interface FormValidationOptions {
    form: {
        id?: Ref<string | undefined>
        title?: Ref<string | undefined>
        description?: Ref<string | undefined>
        itemStr?: Ref<string | undefined>
        price?: Ref<number | undefined>
        purchase_min?: Ref<number | undefined>
        purchase_max?: Ref<number | undefined>
        user_max?: Ref<number | undefined>
        purchase_start?: Ref<PgSqlDateTime>
        purchase_end?: Ref<PgSqlDateTime>
        pay_roles?: Ref<string[] | undefined>
    }
}

// 表单验证
export function useFormValidation(options: FormValidationOptions): {
    addRules: FormRules<ViewForm>
    editRules: FormRules<ViewForm>
} {
    const { form } = options

    // 校验标题
    function checkTitleValidator(rule: unknown, value: string, callback: (error?: string | Error | undefined) => void): void {
        // 首尾不能包含空格
        if (value.match(RegexPatterns.IsTrim)) {
            callback(new Error("首尾不能包含空格"))
            return
        }

        callback()
    }

    // 检查账号密钥明细
    function checkItemStrInsertValidator(rule: unknown, value: string, callback: (error?: string | Error | undefined) => void): void {
        // 首尾不能包含空格
        if (value.match(RegexPatterns.IsTrim)) {
            callback(new Error("首尾不能包含空格"))
            return
        }

        callback()
    }

    // 检查账号密钥明细
    function checkItemStrEditValidator(rule: unknown, value: string, callback: (error?: string | Error | undefined) => void): void {
        if (!form.itemStr?.value) {
            callback()
            return
        }

        // 首尾不能包含空格
        if (value.match(RegexPatterns.IsTrim)) {
            callback(new Error("首尾不能包含空格"))
            return
        }

        callback()
    }
    // 校验最小购买数量，不能大于最大购买数量
    function checkPurchaseMinValidator(rule: unknown, value: number, callback: (error?: string | Error | undefined) => void): void {
        if (form.purchase_max?.value && value > form.purchase_max.value) {
            callback(new Error("最小购买数量不能大于最大购买数量"))
            return
        }
        callback()
    }

    // 校验最大购买数量，不能小于最小购买数量
    function checkPurchaseMaxValidator(rule: unknown, value: number, callback: (error?: string | Error | undefined) => void): void {
        if (form.purchase_min?.value && value < form.purchase_min.value) {
            callback(new Error("最大购买数量不能小于最小购买数量"))
            return
        }
        callback()
    }

    // 校验同一用户最多购买数量，不能小于最小购买数量，不能大于最大购买数量
    function checkUserMaxValidator(rule: unknown, value: number, callback: (error?: string | Error | undefined) => void): void {
        if (form.purchase_min?.value && value < form.purchase_min.value) {
            callback(new Error("同一用户最多购买数量不能小于最小购买数量"))
            return
        }
        if (form.purchase_max?.value && value > form.purchase_max.value) {
            callback(new Error("同一用户最多购买数量不能大于最大购买数量"))
            return
        }
        callback()
    }

    const addRules = reactive<FormRules<ViewForm>>({
        title: [
            { required: true, message: "请输入标题", trigger: "blur" },
            { validator: checkTitleValidator, trigger: "blur" },
        ],
        itemStr: [
            { required: true, message: "请输入账号密钥明细", trigger: "blur" },
            { validator: checkItemStrInsertValidator, trigger: "blur" },
        ],
        price: [{ required: true, message: "请输入价格", trigger: "blur" }],
        purchase_min: [
            { required: true, message: "请输最小购买数量", trigger: "blur" },
            { validator: checkPurchaseMinValidator, trigger: "blur" },
        ],
        purchase_max: [{ validator: checkPurchaseMaxValidator, trigger: "blur" }],
        user_max: [{ validator: checkUserMaxValidator, trigger: "blur" }],
    })

    /**
     * @description: 表单校验规则
     * @return  FormRules<EditMediaForm> 表单校验规则 trigger: 'blur' 表示失去焦点时校验 'change' 表示值改变时校验
     */
    const editRules = reactive<FormRules<ViewForm>>({
        title: [
            { required: true, message: "请输入标题", trigger: "blur" },
            { validator: checkTitleValidator, trigger: "blur" },
        ],
        itemStr: [{ validator: checkItemStrEditValidator, trigger: "blur" }],
        price: [{ required: true, message: "请输入价格", trigger: "blur" }],
        purchase_min: [
            { required: true, message: "请输最小购买数量", trigger: "blur" },
            { validator: checkPurchaseMinValidator, trigger: "blur" },
        ],
        purchase_max: [{ validator: checkPurchaseMaxValidator, trigger: "blur" }],
        user_max: [{ validator: checkUserMaxValidator, trigger: "blur" }],
    })

    return {
        addRules,
        editRules,
    }
}

// 格式化时间
export const formatTime = (form: ViewForm) => {
    // 如果有时间则设置为有效
    if (form.purchase_start && form.purchase_start.Time !== null) {
        form.purchase_start.Time = new Date(form.purchase_start.Time)
        form.purchase_start.Valid = true
    }

    if (form.purchase_end && form.purchase_end.Time !== null) {
        form.purchase_end.Time = new Date(form.purchase_end.Time)
        form.purchase_end.Valid = true
    }

    // 如果没有时间则设置为无效
    if (form.purchase_start && form.purchase_start.Time === null) {
        form.purchase_start.Valid = false
    }

    if (form.purchase_end && form.purchase_end.Time === null) {
        form.purchase_end.Valid = false
    }

    return form
}
