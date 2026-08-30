/*
 * FilePath    : blog-client-nuxt\src\components\views\admin\component\main\links\component\view\hooks.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 表单验证
 */

import type { FormRules } from "element-plus" // 需要全部安装 npm i element-plus -S
import { reactive, type Ref } from "vue"

import { checkURLAPI, type CheckURLRequest } from "@/api/link/checkURL"
import { checkURLExcludingIDAPI, type CheckURLExcludingIDRequest } from "@/api/link/checkURLExcludingID"
import { LinkStatusCode } from "@/api/link/common"
import { handleResErr, ResponseCode } from "@/api/response"
import { RegexPatterns } from "@/utils/regexPatterns"

import type { ViewForm } from "./index"

interface FormValidationOptions {
    form: {
        id?: Ref<string | undefined>
        name?: Ref<string>
        url?: Ref<string>
        thumbnail?: Ref<string | undefined>
        description?: Ref<string | undefined>
        status?: Ref<LinkStatusCode | undefined>
        order?: Ref<string | undefined>
    }
}

export function useFormValidation(options: FormValidationOptions): {
    addRules: FormRules<ViewForm>
    editRules: FormRules<ViewForm>
} {
    const { form } = options

    // 检查 URL 是否可用
    function checkURLValidator(rule: unknown, value: string, callback: (error?: string | Error | undefined) => void): void {
        // 链接不能为空
        if (!form.url?.value) {
            callback("请输入链接")
            return
        }

        // 首尾不能包含空格
        if (value.match(RegexPatterns.IsTrim)) {
            callback(new Error("首尾不能包含空格"))
            return
        }

        // 校验 URL 格式
        if (!value.match(RegexPatterns.URL)) {
            callback(new Error("请输入有效的 URL"))
            return
        }
        const req: CheckURLRequest = {
            url: form.url.value,
        }
        checkURLAPI(req).then((res) => {
            if (res.data.code === ResponseCode.LinkCheckURLNotExist) {
                callback()
            } else {
                const errMsg = handleResErr(res, "链接重复不可用")
                callback(new Error(errMsg))
            }
        })
    }

    // 检查 URL 排除自身 ID 后是否可用
    function checkURLExcludingIDValidator(rule: unknown, value: string, callback: (error?: string | Error | undefined) => void): void {
        // 链接不能为空
        if (!form.url?.value) {
            callback("请输入链接")
            return
        }

        // 首尾不能包含空格
        if (value.match(RegexPatterns.IsTrim)) {
            callback(new Error("首尾不能包含空格"))
            return
        }

        // 校验 URL 格式
        if (!value.match(RegexPatterns.URL)) {
            callback(new Error("请输入有效的 URL"))
            return
        }

        if (!form.id?.value) {
            callback("标签 ID 不能为空")
            return
        }
        const req: CheckURLExcludingIDRequest = {
            excluding_id: form.id.value,
            url: form.url.value,
        }
        checkURLExcludingIDAPI(req).then((res) => {
            if (res.data.code === ResponseCode.LinkCheckURLNotExistExcludingID) {
                callback()
            } else {
                const errMsg = handleResErr(res, "链接重复不可用")
                callback(new Error(errMsg))
            }
        })
    }

    // 校验图片 URL 格式
    function checkImgURLValidator(rule: unknown, value: string, callback: (error?: string | Error | undefined) => void): void {
        // 图片链接不能为空
        if (!form.thumbnail?.value) {
            callback("请输入图片链接")
            return
        }

        // 首尾不能包含空格
        if (value.match(RegexPatterns.IsTrim)) {
            callback(new Error("首尾不能包含空格"))
            return
        }

        // 校验 URL 格式
        if (!value.match(RegexPatterns.ImgURL)) {
            callback(new Error("请输入有效的图片 URL"))
            return
        }

        callback() // 图片 URL 验证通过
    }

    const addRules = reactive<FormRules<ViewForm>>({
        name: [{ required: true, message: "请输入链接名称", trigger: "blur" }],
        url: [
            { required: true, message: "请输有效的 URL", trigger: "blur" },
            { validator: checkURLValidator, trigger: "blur" },
        ],
        thumbnail: [
            { required: true, message: "请输入链接的图片 URL", trigger: "blur" },
            { validator: checkImgURLValidator, trigger: "blur" },
        ],
        description: [{ required: true, message: "请输入标签描述信息", trigger: "blur" }],
    })

    // 编辑表单校验规则, trigger: blur 表示失去焦点时校验, change 表示值改变时校验
    const editRules = reactive<FormRules<ViewForm>>({
        id: [{ required: true, message: "id 不能为空", trigger: "blur" }],
        name: [{ required: true, message: "请输入链接名称", trigger: "blur" }],
        url: [
            { required: true, message: "请输有效的 URL", trigger: "blur" },
            { validator: checkURLExcludingIDValidator, trigger: "blur" },
        ],
        thumbnail: [
            { required: true, message: "请输入链接的图片 URL", trigger: "blur" },
            { validator: checkImgURLValidator, trigger: "blur" },
        ],
        description: [{ required: true, message: "请输入标签描述信息", trigger: "blur" }],
    })

    return {
        addRules,
        editRules,
    }
}
