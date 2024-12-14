/**
 * @Author       : jiaopengzi
 * @Date         : 2024-11-25 10:08:40
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-07 14:13:13
 * @FilePath     : \blog-client\src\views\admin\component\main\post-category\component\view\hooks.ts
 * @Description  : 分类表单验证
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { type Ref, reactive } from "vue"
import type { FormRules } from "element-plus" // 需要全部安装 npm i element-plus -S
import type { ViewForm } from "./index"
import {
    type CheckCategoryNameRequest,
    checkCategoryNameAPI,
} from "@/api/postCategory/checkCategoryName"
import {
    type CheckCategoryNameExcludingIDRequest,
    checkCategoryNameExcludingIDAPI,
} from "@/api/postCategory/checkCategoryNameExcludingID"
import {
    type CheckCategorySlugRequest,
    checkCategorySlugAPI,
} from "@/api/postCategory/checkCategorySlug"
import {
    type CheckCategorySlugExcludingIDRequest,
    checkCategorySlugExcludingIDAPI,
} from "@/api/postCategory/checkCategorySlugExcludingID"
import { ResponseCode, handleErrInfo } from "@/api/responseCode"
import { RegexPatterns } from "@/utils/regexPatterns"

// 表单验证选项
interface FormValidationOptions {
    form: {
        id?: Ref<string | undefined>
        name?: Ref<string>
        slug?: Ref<string>
        description?: Ref<string | undefined>
        thumbnail?: Ref<string | undefined>
        order?: Ref<string | undefined>
        parent?: Ref<string | undefined>
    }
}

// 表单验证
export function useFormValidation(options: FormValidationOptions): {
    addRules: FormRules<ViewForm>
    editRules: FormRules<ViewForm>
} {
    const { form } = options

    // 检查分类名称是否可用
    function checkCategoryNameValidator(
        rule: unknown,
        value: string,
        callback: (error?: string | Error | undefined) => void,
    ): void {
        // 去除前后空格
        if (!form.name?.value) {
            callback("请输入分类名称")
            return
        }

        // 首尾不能包含空格
        if (value.match(RegexPatterns.IsTrim)) {
            callback(new Error("首尾不能包含空格"))
            return
        }

        // 请求参数
        const req: CheckCategoryNameRequest = {
            name: form.name.value,
        }

        // 调用后端接口
        checkCategoryNameAPI(req).then((res) => {
            if (res.data.code === ResponseCode.PostCategoryCheckNameNoExist) {
                callback()
            } else {
                const errMsg = handleErrInfo(res, "分类不可用")
                callback(new Error(errMsg))
            }
        })
    }

    // 检查别名是否可用
    function checkCategorySlugValidator(
        rule: unknown,
        value: string,
        callback: (error?: string | Error | undefined) => void,
    ): void {
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
        const req: CheckCategorySlugRequest = {
            slug: form.slug.value,
        }

        // 调用后端接口
        checkCategorySlugAPI(req).then((res) => {
            if (res.data.code === ResponseCode.PostCategoryCheckSlugNoExist) {
                callback()
            } else {
                const errMsg = handleErrInfo(res, "别名不可用")
                callback(new Error(errMsg))
            }
        })
    }

    // 检查分类名称是否可用
    function checkCategoryNameExcludingIDValidator(
        rule: unknown,
        value: string,
        callback: (error?: string | Error | undefined) => void,
    ): void {
        // 去除前后空格
        if (!form.name?.value) {
            callback("请输入分类名称")
            return
        }

        // 首尾不能包含空格
        if (value.match(RegexPatterns.IsTrim)) {
            callback(new Error("首尾不能包含空格"))
            return
        }

        if (!form.id?.value) {
            callback("分类 ID 不能为空")
            return
        }

        // 请求参数
        const req: CheckCategoryNameExcludingIDRequest = {
            excluding_id: form.id.value,
            name: form.name.value,
        }

        // 调用后端接口
        checkCategoryNameExcludingIDAPI(req).then((res) => {
            if (res.data.code === ResponseCode.PostCategoryCheckNameNoExistExcludingID) {
                callback()
            } else {
                const errMsg = handleErrInfo(res, "分类不可用")
                callback(new Error(errMsg))
            }
        })
    }

    // 检查别名是否可用
    function checkCategorySlugExcludingIDValidator(
        rule: unknown,
        value: string,
        callback: (error?: string | Error | undefined) => void,
    ): void {
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
            callback("分类 ID 不能为空")
            return
        }

        // 去除前后空格
        if (!form.slug?.value) {
            callback("请输入别名")
            return
        }

        // 请求参数
        const req: CheckCategorySlugExcludingIDRequest = {
            excluding_id: form.id.value,
            slug: form.slug.value,
        }

        // 调用后端接口
        checkCategorySlugExcludingIDAPI(req).then((res) => {
            if (res.data.code === ResponseCode.PostCategoryCheckSlugNoExistExcludingID) {
                callback()
            } else {
                const errMsg = handleErrInfo(res, "别名不可用")
                callback(new Error(errMsg))
            }
        })
    }

    const addRules = reactive<FormRules<ViewForm>>({
        name: [
            { required: true, message: "请输入分类名称", trigger: "blur" },
            { validator: checkCategoryNameValidator, trigger: "blur" },
        ],
        slug: [
            { required: true, message: "请输入别名", trigger: "blur" },
            { validator: checkCategorySlugValidator, trigger: "blur" },
        ],
        description: [{ message: "请输入分类描述信息", trigger: "blur" }],
        thumbnail: [{ message: "请输入分类的图片URL", trigger: "blur" }],
    })

    /**
     * @description: 表单校验规则
     * @return  FormRules<EditMediaForm> 表单校验规则 trigger: 'blur' 表示失去焦点时校验 'change' 表示值改变时校验
     */
    const editRules = reactive<FormRules<ViewForm>>({
        id: [{ required: true, message: "id 不能为空", trigger: "blur" }],
        name: [
            { required: true, message: "请输入分类名称", trigger: "blur" },
            { validator: checkCategoryNameExcludingIDValidator, trigger: "blur" },
        ],
        slug: [
            { required: true, message: "请输入别名", trigger: "blur" },
            { validator: checkCategorySlugExcludingIDValidator, trigger: "blur" },
        ],
        description: [{ message: "请输入分类描述信息", trigger: "blur" }],
        thumbnail: [{ message: "请输入分类的图片URL", trigger: "blur" }],
    })

    return {
        addRules,
        editRules,
    }
}
