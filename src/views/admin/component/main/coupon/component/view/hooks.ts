/*
 * FilePath    : blog-client\src\views\admin\component\main\coupon\component\view\hooks.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 表单验证
 */

import type { FormRules } from "element-plus" // 需要全部安装 npm i element-plus -S
import { reactive, type Ref } from "vue"

import { type PgSqlDateTime } from "@/api/common"
import { checkCouponCodeAPI, type CheckCouponCodeRequest } from "@/api/coupon/checkCouponCode"
import { checkCouponCodeExcludingIDAPI, type CheckCouponCodeExcludingIDRequest } from "@/api/coupon/checkCouponCodeExcludingID"
import { CouponDiscountType, CouponStackable, CouponStatus } from "@/api/coupon/common"
import { handleResErr, ResponseCode } from "@/api/response"

import type { ViewForm } from "./types"

// 表单验证选项
interface FormValidationOptions {
    form: {
        id?: Ref<string | undefined> // ID
        code?: Ref<string> // 优惠码
        description?: Ref<string | undefined> // 优惠券描述
        discount_type?: Ref<CouponDiscountType> // 优惠类型 1 固定金额折扣, 2 百分比折扣
        amount?: Ref<string> // 优惠数量(金额/百分比) 单位分
        expire_time?: Ref<PgSqlDateTime | undefined> // 过期时间
        min_spend?: Ref<string | undefined> // 最小消费金额(分)
        max_spend?: Ref<string | undefined> // 最大消费金额(分)
        is_stackable: Ref<CouponStackable> // 是否允许叠加使用,默认 1 禁用 2 启用
        use_limit?: Ref<string | undefined> // 使用次数限制
        used_count?: Ref<string | undefined> // 已使用次数
        use_limit_per_user?: Ref<string | undefined> // 单人使用次数限制
        status: Ref<CouponStatus> // 状态 1禁用, 2启用
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

    // 检查优惠数量是否为数字且大于0
    function checkAmountValidator(rule: unknown, value: string, callback: (error?: string | Error | undefined) => void): void {
        if (!value || isNaN(Number(value)) || Number(value) <= 0) {
            callback(new Error("请输入大于0的优惠数量"))
            return
        }

        // 如果是百分比折扣类型，检查是否在0-100之间
        if (form.discount_type && form.discount_type.value === CouponDiscountType.Percentage) {
            const amount = Number(value)
            if (amount < 0 || amount > 100) {
                callback(new Error("百分比折扣必须在0-100之间"))
                return
            }
        }

        callback()
    }

    const addRules = reactive<FormRules<ViewForm>>({
        code: [
            { required: true, message: "请输入优惠卷", trigger: "blur" },
            { validator: checkCodeValidator, trigger: "blur" },
        ],
        discount_type: [{ required: true, message: "请选择优惠类型", trigger: "change" }],
        amount: [
            { required: true, message: "请输入优惠数量", trigger: "blur" },
            { validator: checkAmountValidator, trigger: "blur" },
        ],
        is_stackable: [{ required: true, message: "请选择是否允许叠加使用", trigger: "change" }],
        status: [{ required: true, message: "请选择启用状态", trigger: "change" }],
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
        discount_type: [{ required: true, message: "请选择优惠类型", trigger: "change" }],
        amount: [
            { required: true, message: "请输入优惠数量", trigger: "blur" },
            { validator: checkAmountValidator, trigger: "blur" },
        ],
        is_stackable: [{ required: true, message: "请选择是否允许叠加使用", trigger: "change" }],
        status: [{ required: true, message: "请选择启用状态", trigger: "change" }],
    })

    return {
        addRules,
        editRules,
    }
}
