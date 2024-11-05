/**
 * @Author       : jiaopengzi
 * @Date         : 2024-11-05 10:11:52
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-11-05 16:12:41
 * @FilePath     : \blog-client\src\views\admin\component\main\post-tag\component\hooks.ts
 * @Description  : 表单验证
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { type Ref } from "vue"
import { type CheckTagNameRequest, checkTagNameAPI } from "@/api/postTag/checkTagName"
import {
    type CheckTagNameExcludingIDRequest,
    checkTagNameExcludingIDAPI,
} from "@/api/postTag/checkTagNameExcludingID"
import { type CheckTagSlugRequest, checkTagSlugAPI } from "@/api/postTag/checkTagSlug"
import {
    type CheckTagSlugExcludingIDRequest,
    checkTagSlugExcludingIDAPI,
} from "@/api/postTag/checkTagSlugExcludingID"
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
    }
}

// 表单验证
export function useFormValidation(options: FormValidationOptions) {
    const { form } = options

    // 检查标签名称是否可用
    function checkTagNameValidator(
        rule: any,
        value: string,
        callback: (error?: string | Error | undefined) => void,
    ): void {
        // 去除前后空格
        if (!form.name?.value.trim()) {
            callback("请输入标签名称")
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
                let errMsg = res.data.msg || "标签不可用"
                if (res.data.data !== null) {
                    errMsg = res.data.msg + "：" + res.data.data
                }
                callback(new Error(errMsg))
            }
        })
    }

    // 检查别名是否可用
    function checkTagSlugValidator(
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
        const req: CheckTagSlugRequest = {
            slug: form.slug.value,
        }

        // 调用后端接口
        checkTagSlugAPI(req).then((res) => {
            if (res.data.code === ResponseCode.PostTagCheckSlugNoExist) {
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

    // 检查标签名称是否可用
    function checkTagNameExcludingIDValidator(
        rule: any,
        value: string,
        callback: (error?: string | Error | undefined) => void,
    ): void {
        // 去除前后空格
        if (!form.name?.value.trim()) {
            callback("请输入标签名称")
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
                let errMsg = res.data.msg || "标签不可用"
                if (res.data.data !== null) {
                    errMsg = res.data.msg + "：" + res.data.data
                }
                callback(new Error(errMsg))
            }
        })
    }

    // 检查别名是否可用
    function checkTagSlugExcludingIDValidator(
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
            callback("标签 ID 不能为空")
            return
        }

        // 去除前后空格
        if (!form.slug?.value.trim()) {
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
                let errMsg = res.data.msg || "别名不可用"

                if (res.data.data !== null) {
                    errMsg = res.data.msg + "：" + res.data.data
                }
                callback(new Error(errMsg))
            }
        })
    }

    return {
        checkTagNameValidator,
        checkTagSlugValidator,
        checkTagNameExcludingIDValidator,
        checkTagSlugExcludingIDValidator,
    }
}
