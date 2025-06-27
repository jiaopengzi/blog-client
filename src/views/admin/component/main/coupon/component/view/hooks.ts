/*
 * FilePath    : blog-client\src\views\admin\component\main\coupon\component\view\hooks.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 表单验证
 */

import type { FormRules } from "element-plus" // 需要全部安装 npm i element-plus -S
import { reactive, type Ref } from "vue"

import { checkCouponCodeAPI, type CheckCouponCodeRequest } from "@/api/coupon/checkCouponCode"
import { checkCouponCodeExcludingIDAPI, type CheckCouponCodeExcludingIDRequest } from "@/api/coupon/checkCouponCodeExcludingID"
import { CouponStatus } from "@/api/coupon/common"
import { handleResErr, ResponseCode } from "@/api/response"

import type { ViewForm } from "./types"

// 表单验证选项
interface FormValidationOptions {
    form: {
        id?: Ref<string | undefined> // ID
        role?: Ref<string> // 优惠卷角色
        duration_time?: Ref<string | undefined> // 有效时间(秒), 0表示永久有效
        purchase_discount?: Ref<number | undefined> // 购买折扣 0-100
        download_count?: Ref<number | undefined> // 下载次数
        watch_count?: Ref<number | undefined> // 观看次数
        status?: Ref<CouponStatus> // 状态 1禁用, 2启用
        description?: Ref<string | undefined> // 描述
    }
}

// 表单验证
export function useFormValidation(options: FormValidationOptions): {
    addRules: FormRules<ViewForm>
    editRules: FormRules<ViewForm>
} {
    const { form } = options

    // 共用校验函数：检查优惠卷代码是否包含空格或为空
    function checkCommon(value: string, callback: (error?: string | Error | undefined) => void): boolean {
        if (value.includes(" ")) {
            callback(new Error("优惠卷不能包含空格"))
            return false
        }
        if (!value || value.trim() === "") {
            callback("请输入优惠卷")
            return false
        }
        return true
    }

    // 检查优惠卷代码是否可用
    function checkCodeValidator(rule: unknown, value: string, callback: (error?: string | Error | undefined) => void): void {
        // 调用共用校验函数
        if (!checkCommon(value, callback)) {
            return
        }

        // 请求参数
        const req: CheckCouponCodeRequest = {
            code: value,
        }

        // 调用后端接口
        checkCouponCodeAPI(req).then((res) => {
            if (res.data.code === ResponseCode.CouponCodeNotExist) {
                callback()
                return
            } else {
                const errMsg = handleResErr(res, "优惠卷不可用")
                callback(new Error(errMsg))
                return
            }
        })
    }

    // 检查优惠卷码是否可用(排除ID)
    function checkCodeExcludingIDValidator(rule: unknown, value: string, callback: (error?: string | Error | undefined) => void): void {
        // 调用共用校验函数
        if (!checkCommon(value, callback)) {
            return
        }

        // 请求参数
        const req: CheckCouponCodeExcludingIDRequest = {
            excluding_id: form.id?.value || "", // 需要排除的ID
            code: value,
        }

        // 调用后端接口
        checkCouponCodeExcludingIDAPI(req).then((res) => {
            if (res.data.code === ResponseCode.CouponCodeNotExistExcludingID) {
                callback()
                return
            } else {
                const errMsg = handleResErr(res, "优惠卷角色不可用")
                callback(new Error(errMsg))
                return
            }
        })
    }

    const addRules = reactive<FormRules<ViewForm>>({
        code: [
            { required: true, message: "请输入优惠卷", trigger: "blur" },
            { validator: checkCodeValidator, trigger: "blur" },
        ],
    })

    /**
     * @description: 表单校验规则
     * @return  FormRules<EditMediaForm> 表单校验规则 trigger: 'blur' 表示失去焦点时校验 'change' 表示值改变时校验
     */
    const editRules = reactive<FormRules<ViewForm>>({
        id: [{ required: true, message: "id 不能为空", trigger: "blur" }],
        code: [
            { required: true, message: "请输入优惠卷", trigger: "blur" },
            { validator: checkCodeExcludingIDValidator, trigger: "blur" },
        ],
    })

    return {
        addRules,
        editRules,
    }
}
