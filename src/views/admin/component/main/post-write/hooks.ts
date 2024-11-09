/**
 * @Author       : jiaopengzi
 * @Date         : 2024-11-08 16:05:36
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-11-08 16:06:42
 * @FilePath     : \blog-client\src\views\admin\component\main\post-write\hooks.ts
 * @Description  : 表单验证
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { type Ref } from "vue"
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
        slug?: Ref<string>
    }
}

// 表单验证
export function useFormValidation(options: FormValidationOptions) {
    const { form } = options

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
        checkTagSlugValidator,
        checkTagSlugExcludingIDValidator,
    }
}
