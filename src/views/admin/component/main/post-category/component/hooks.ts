/**
 * @Author       : jiaopengzi
 * @Date         : 2024-11-06 14:47:08
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-11-09 15:25:05
 * @FilePath     : \blog-client\src\views\admin\component\main\post-category\component\hooks.ts
 * @Description  : 分类表单验证
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { type Ref } from "vue"
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
import { ResponseCode } from "@/api/responseCode"

// 表单验证选项
interface FormValidationOptions {
    form: {
        id?: Ref<number>
        name?: Ref<string>
        slug?: Ref<string>
        description?: Ref<string | undefined>
        thumbnail?: Ref<string | undefined>
        order?: Ref<number | undefined>
        parent?: Ref<number | undefined>
    }
}

// 表单验证
export function useFormValidation(options: FormValidationOptions) {
    const { form } = options

    // 检查分类名称是否可用
    function checkCategoryNameValidator(
        rule: any,
        value: string,
        callback: (error?: string | Error | undefined) => void,
    ): void {
        // 去除前后空格
        if (!form.name?.value.trim()) {
            callback("请输入分类名称")
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
                let errMsg = res.data.msg || "分类不可用"
                if (res.data.data !== null) {
                    errMsg = res.data.msg + "：" + res.data.data
                }
                callback(new Error(errMsg))
            }
        })
    }

    // 检查别名是否可用
    function checkCategorySlugValidator(
        rule: any,
        value: string,
        callback: (error?: string | Error | undefined) => void,
    ): void {
        // 不能包含空格
        if (value.includes(" ")) {
            callback(new Error("别名不能包含空格"))
            return
        }

        // 不能包含特殊字符
        if (value.match(/[^a-zA-Z0-9-]/)) {
            callback(new Error("别名不能包含特殊字符，只能包含字母、数字、中划线"))
            return
        }

        // 去除前后空格
        if (!form.slug?.value.trim()) {
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
                let errMsg = res.data.msg || "别名不可用"

                if (res.data.data !== null) {
                    errMsg = res.data.msg + "：" + res.data.data
                }
                callback(new Error(errMsg))
            }
        })
    }

    // 检查分类名称是否可用
    function checkCategoryNameExcludingIDValidator(
        rule: any,
        value: string,
        callback: (error?: string | Error | undefined) => void,
    ): void {
        // 去除前后空格
        if (!form.name?.value.trim()) {
            callback("请输入分类名称")
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
                let errMsg = res.data.msg || "分类不可用"
                if (res.data.data !== null) {
                    errMsg = res.data.msg + "：" + res.data.data
                }
                callback(new Error(errMsg))
            }
        })
    }

    // 检查别名是否可用
    function checkCategorySlugExcludingIDValidator(
        rule: any,
        value: string,
        callback: (error?: string | Error | undefined) => void,
    ): void {
        // 不能包含空格
        if (value.includes(" ")) {
            callback(new Error("别名不能包含空格"))
            return
        }

        // 不能包含特殊字符
        if (value.match(/[^a-zA-Z0-9-]/)) {
            callback(new Error("别名不能包含特殊字符，只能包含字母、数字、中划线"))
            return
        }

        if (!form.id?.value) {
            callback("分类 ID 不能为空")
            return
        }

        // 去除前后空格
        if (!form.slug?.value.trim()) {
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
                let errMsg = res.data.msg || "别名不可用"

                if (res.data.data !== null) {
                    errMsg = res.data.msg + "：" + res.data.data
                }
                callback(new Error(errMsg))
            }
        })
    }

    return {
        checkCategoryNameValidator,
        checkCategorySlugValidator,
        checkCategoryNameExcludingIDValidator,
        checkCategorySlugExcludingIDValidator,
    }
}
