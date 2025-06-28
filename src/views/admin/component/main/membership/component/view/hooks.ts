/*
 * FilePath    : blog-client\src\views\admin\component\main\membership\component\view\hooks.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 表单验证
 */

import type { FormRules } from "element-plus" // 需要全部安装 npm i element-plus -S
import { reactive, type Ref } from "vue"

import { checkMembershipRoleAPI, type CheckMembershipRoleRequest } from "@/api/membership/checkMembershipRole"
import { checkMembershipRoleExcludingIDAPI, type CheckMembershipRoleExcludingIDRequest } from "@/api/membership/checkMembershipRoleExcludingID"
import { MembershipStatus } from "@/api/membership/common"
import { handleResErr, ResponseCode } from "@/api/response"

import type { ViewForm } from "./types"

// 表单验证选项
interface FormValidationOptions {
    form: {
        id?: Ref<string | undefined> // ID
        role?: Ref<string> // 会员角色
        duration_time?: Ref<string | undefined> // 有效时间(秒), 0表示永久有效
        purchase_discount?: Ref<number | undefined> // 购买折扣 0-100
        download_count?: Ref<number | undefined> // 下载次数
        watch_count?: Ref<number | undefined> // 观看次数
        status?: Ref<MembershipStatus> // 状态 1禁用, 2启用
        description?: Ref<string | undefined> // 描述
    }
}

// 表单验证
export function useFormValidation(options: FormValidationOptions): {
    addRules: FormRules<ViewForm>
    editRules: FormRules<ViewForm>
} {
    const { form } = options

    // 共用校验函数：检查角色格式
    function checkCommon(value: string, callback: (error?: string | Error | undefined) => void): boolean {
        if (value.includes(" ")) {
            callback(new Error("会员角色不能包含空格"))
            return false
        }
        if (!value || value.trim() === "") {
            callback("请输入会员角色")
            return false
        }
        return true
    }

    // 检查角色是否可用
    function checkRoleValidator(rule: unknown, value: string, callback: (error?: string | Error | undefined) => void): void {
        // 调用共用校验函数
        if (!checkCommon(value, callback)) {
            return
        }

        // 请求参数
        const req: CheckMembershipRoleRequest = {
            role: value,
        }

        // 调用后端接口
        checkMembershipRoleAPI(req).then((res) => {
            if (res.data.code === ResponseCode.MembershipRoleNotExist) {
                callback()
                return
            } else {
                const errMsg = handleResErr(res, "会员角色不可用")
                callback(new Error(errMsg))
                return
            }
        })
    }

    // 检查会员角色是否可用(排除ID)
    function checkRoleExcludingIDValidator(rule: unknown, value: string, callback: (error?: string | Error | undefined) => void): void {
        // 调用共用校验函数
        if (!checkCommon(value, callback)) {
            return
        }

        // 请求参数
        const req: CheckMembershipRoleExcludingIDRequest = {
            excluding_id: form.id?.value || "", // 需要排除的ID
            role: value,
        }

        // 调用后端接口
        checkMembershipRoleExcludingIDAPI(req).then((res) => {
            if (res.data.code === ResponseCode.MembershipRoleNotExistExcludingID) {
                callback()
                return
            } else {
                const errMsg = handleResErr(res, "会员角色不可用")
                callback(new Error(errMsg))
                return
            }
        })
    }

    const addRules = reactive<FormRules<ViewForm>>({
        role: [
            { required: true, message: "请输入会员角色", trigger: "blur" },
            { validator: checkRoleValidator, trigger: "blur" },
        ],
        duration_time: [{ required: true, message: "请输入有效时间", trigger: "blur" }],
        purchase_discount: [{ required: true, message: "请输入购买折扣(0-100)", trigger: "blur" }],
        status: [{ required: true, message: "请选择启用状态", trigger: "change" }],
    })

    /**
     * @description: 表单校验规则
     * @return  FormRules<EditMediaForm> 表单校验规则 trigger: 'blur' 表示失去焦点时校验 'change' 表示值改变时校验
     */
    const editRules = reactive<FormRules<ViewForm>>({
        id: [{ required: true, message: "id 不能为空", trigger: "blur" }],
        role: [
            { required: true, message: "请输入会员角色", trigger: "blur" },
            { validator: checkRoleExcludingIDValidator, trigger: "blur" },
        ],
        duration_time: [{ required: true, message: "请输入有效时间", trigger: "blur" }],
        purchase_discount: [{ required: true, message: "请输入购买折扣(0-100)", trigger: "blur" }],
        status: [{ required: true, message: "请选择启用状态", trigger: "change" }],
    })

    return {
        addRules,
        editRules,
    }
}
