/**
 * @FilePath     : \blog-client\src\views\admin\component\main\post-tag\component\view\hooks.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 表单验证
 */

import type { FormRules } from "element-plus" // 需要全部安装 npm i element-plus -S
import { reactive, type Ref } from "vue"

import { checkTagNameAPI, type CheckTagNameRequest } from "@/api/postTag/checkTagName"
import { checkTagNameExcludingIDAPI, type CheckTagNameExcludingIDRequest } from "@/api/postTag/checkTagNameExcludingID"
import { checkTagSlugAPI, type CheckTagSlugRequest } from "@/api/postTag/checkTagSlug"
import { checkTagSlugExcludingIDAPI, type CheckTagSlugExcludingIDRequest } from "@/api/postTag/checkTagSlugExcludingID"
import { handleResErr, ResponseCode } from "@/api/response"
import { RegexPatterns } from "@/utils/regexPatterns"

import type { ViewForm } from "./types"

// 表单验证选项
interface FormValidationOptions {
    form: {
        id?: Ref<string | undefined>
        name?: Ref<string>
        slug?: Ref<string>
        description?: Ref<string | undefined>
        thumbnail?: Ref<string | undefined>
        order?: Ref<string | undefined>
    }
}

// 表单验证
export function useFormValidation(options: FormValidationOptions): {
    addRules: FormRules<ViewForm>
    editRules: FormRules<ViewForm>
} {
    const { form } = options

    // 检查标签名称是否可用
    function checkTagNameValidator(rule: unknown, value: string, callback: (error?: string | Error | undefined) => void): void {
        // 去除前后空格
        if (!form.name?.value) {
            callback("请输入标签名称")
            return
        }
        // 首尾不能包含空格
        if (value.match(RegexPatterns.IsTrim)) {
            callback(new Error("首尾不能包含空格"))
            return
        }
        // 请求参数
        const req: CheckTagNameRequest = {
            name: form.name.value,
        }

        // 调用后端接口
        checkTagNameAPI(req).then((res) => {
            if (res.data.code === ResponseCode.PostTagCheckNameNoExist) {
                callback()
            } else {
                const errMsg = handleResErr(res, "标签不可用")
                callback(new Error(errMsg))
            }
        })
    }

    // 检查别名是否可用
    function checkTagSlugValidator(rule: unknown, value: string, callback: (error?: string | Error | undefined) => void): void {
        // 不能包含空格
        if (value.includes(" ")) {
            callback(new Error("别名不能包含空格"))
            return
        }

        // 不能包含特殊字符
        if (!value.match(RegexPatterns.Slug)) {
            callback(new Error("别名不能包含特殊字符，只能包含字母、数字、中划线"))
            return
        }

        // 去除前后空格
        if (!form.slug?.value) {
            callback("请输入别名")
            return
        }

        // 请求参数
        const req: CheckTagSlugRequest = {
            slug: form.slug.value,
        }

        // 调用后端接口
        checkTagSlugAPI(req).then((res) => {
            if (res.data.code === ResponseCode.PostTagCheckSlugNoExist) {
                callback()
            } else {
                const errMsg = handleResErr(res, "别名不可用")
                callback(new Error(errMsg))
            }
        })
    }

    // 检查标签名称是否可用
    function checkTagNameExcludingIDValidator(rule: unknown, value: string, callback: (error?: string | Error | undefined) => void): void {
        // 去除前后空格
        if (!form.name?.value) {
            callback("请输入标签名称")
            return
        }

        // 首尾不能包含空格
        if (value.match(RegexPatterns.IsTrim)) {
            callback(new Error("首尾不能包含空格"))
            return
        }

        if (!form.id?.value) {
            callback("标签 ID 不能为空")
            return
        }

        // 请求参数
        const req: CheckTagNameExcludingIDRequest = {
            excluding_id: form.id.value,
            name: form.name.value,
        }

        // 调用后端接口
        checkTagNameExcludingIDAPI(req).then((res) => {
            if (res.data.code === ResponseCode.PostTagCheckNameNoExistExcludingID) {
                callback()
            } else {
                const errMsg = handleResErr(res, "标签不可用")
                callback(new Error(errMsg))
            }
        })
    }

    // 检查别名是否可用
    function checkTagSlugExcludingIDValidator(rule: unknown, value: string, callback: (error?: string | Error | undefined) => void): void {
        // 不能包含空格
        if (value.includes(" ")) {
            callback(new Error("别名不能包含空格"))
            return
        }

        // 不能包含特殊字符
        if (!value.match(RegexPatterns.Slug)) {
            callback(new Error("别名不能包含特殊字符，只能包含字母、数字、中划线"))
            return
        }

        if (!form.id?.value) {
            callback("标签 ID 不能为空")
            return
        }

        // 去除前后空格
        if (!form.slug?.value) {
            callback("请输入别名")
            return
        }

        // 请求参数
        const req: CheckTagSlugExcludingIDRequest = {
            excluding_id: form.id.value,
            slug: form.slug.value,
        }

        // 调用后端接口
        checkTagSlugExcludingIDAPI(req).then((res) => {
            if (res.data.code === ResponseCode.PostTagCheckSlugNoExistExcludingID) {
                callback()
            } else {
                const errMsg = handleResErr(res, "别名不可用")
                callback(new Error(errMsg))
            }
        })
    }

    const addRules = reactive<FormRules<ViewForm>>({
        name: [
            { required: true, message: "请输入标签名称", trigger: "blur" },
            { validator: checkTagNameValidator, trigger: "blur" },
        ],
        slug: [
            { required: true, message: "请输入别名", trigger: "blur" },
            { validator: checkTagSlugValidator, trigger: "blur" },
        ],
        description: [{ message: "请输入标签描述信息", trigger: "blur" }],
        thumbnail: [{ message: "请输入标签的图片URL", trigger: "blur" }],
    })

    /**
     * @description: 表单校验规则
     * @return  FormRules<EditMediaForm> 表单校验规则 trigger: 'blur' 表示失去焦点时校验 'change' 表示值改变时校验
     */
    const editRules = reactive<FormRules<ViewForm>>({
        id: [{ required: true, message: "id 不能为空", trigger: "blur" }],
        name: [
            { required: true, message: "请输入标签名称", trigger: "blur" },
            { validator: checkTagNameExcludingIDValidator, trigger: "blur" },
        ],
        slug: [
            { required: true, message: "请输入别名", trigger: "blur" },
            { validator: checkTagSlugExcludingIDValidator, trigger: "blur" },
        ],
        description: [{ message: "请输入标签描述信息", trigger: "blur" }],
        thumbnail: [{ message: "请输入标签的图片URL", trigger: "blur" }],
    })

    return {
        addRules,
        editRules,
    }
}
