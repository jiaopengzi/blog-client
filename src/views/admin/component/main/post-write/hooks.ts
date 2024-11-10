/**
 * @Author       : jiaopengzi
 * @Date         : 2024-11-08 16:05:36
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-11-10 18:57:08
 * @FilePath     : \blog-client\src\views\admin\component\main\post-write\hooks.ts
 * @Description  : 表单验证
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { type Ref } from "vue"
import { type CheckPostSlugRequest, checkPostSlugAPI } from "@/api/post/checkPostSlug"
import {
    type CheckPostSlugExcludingIDRequest,
    checkPostSlugExcludingIDAPI,
} from "@/api/post/checkPostSlugExcludingID"
import { ResponseCode } from "@/api/responseCode"
import { type PgSqlDateTime } from "@/api/common"
import { PostStatusCode, CommentStatusCode } from "@/api/post/insert"

// 表单验证选项
interface FormValidationOptions {
    form: {
        id?: Ref<string | undefined> // 文章ID
        post_author?: Ref<string> // 文章作者
        post_content?: Ref<string> // 文章内容
        post_title?: Ref<string> // 文章标题
        post_status?: Ref<PostStatusCode> // 文章状态 0 草稿 1 待审核 2 私密 3 定时发布 4 已发布 5 过期 6 回收站
        post_password?: Ref<string | undefined> // 文章密码
        comment_status?: Ref<CommentStatusCode> // 评论是否开启 0 关闭 1 开启
        price?: Ref<number | undefined> // 价格
        seo_title?: Ref<string | undefined> // SEO标题
        seo_keywords?: Ref<string | undefined> // SEO关键词
        seo_description?: Ref<string | undefined> // SEO描述
        slug?: Ref<string | undefined> // 别名
        thumbnail?: Ref<string | undefined> // 缩略图
        categories?: Ref<number[]> // 分类id
        tags?: Ref<string[] | undefined> // 标签
        pay_roles?: Ref<string[] | undefined> // 付费角色
        post_push_time?: Ref<PgSqlDateTime | undefined> // 发布时间
        post_expired_time?: Ref<PgSqlDateTime | undefined> // 过期时间
    }
}

// 表单验证
export function useFormValidation(options: FormValidationOptions) {
    const { form } = options

    // 检查文章标题是否可用
    function checkPostTitleValidator(
        rule: any,
        value: string,
        callback: (error?: string | Error | undefined) => void,
    ): void {
        // 首尾不能是空格
        if (value.trim() === "") {
            callback(new Error("文章标题不能为空"))
            return
        }
    }

    // 检查文章密码是否可用
    function checkPostPasswordValidator(
        rule: any,
        value: string,
        callback: (error?: string | Error | undefined) => void,
    ): void {
        // 如果文章状态不是密码保护，则直接返回
        if (form.post_status?.value !== PostStatusCode.Password) {
            callback()
            return
        }

        // 不能为空
        if (!value) {
            callback(new Error("文章密码不能为空"))
            return
        }

        // 密码中不能包含空格
        if (value.includes(" ")) {
            callback(new Error("文章密码不能包含空格"))
            return
        }

        // 长度不能超过 64
        if (value.length > 64) {
            callback(new Error("文章密码长度不能超过 64"))
            return
        }
    }

    // 检查 SEO 描述是否可用
    function checkSeoDescriptionValidator(
        rule: any,
        value: string,
        callback: (error?: string | Error | undefined) => void,
    ): void {
        // 若为空，则直接返回
        if (!value) {
            callback()
            return
        }

        // 如果不为空，首尾不能是空格
        if (value.trim() === "") {
            callback(new Error("SEO 关键词不能为空"))
            return
        }

        // 长度不能超过 500
        if (value.length > 500) {
            callback(new Error("SEO 关键词长度不能超过 500"))
            return
        }
    }

    // 检查 SEO 关键词是否可用
    function checkSeoKeywordsValidator(
        rule: any,
        value: string,
        callback: (error?: string | Error | undefined) => void,
    ): void {
        // 若为空，则直接返回
        if (!value) {
            callback()
            return
        }
        // 如果不为空，首尾不能是空格
        if (value.trim() === "") {
            callback(new Error("SEO 关键词不能为空"))
            return
        }

        // 长度不能超过 255
        if (value.length > 255) {
            callback(new Error("SEO 关键词长度不能超过 255"))
            return
        }

        // 判断是否为英文半角逗号分隔
        // 正则表达式：匹配由英文半角逗号分隔的项（项内允许任何字符，但逗号前后不允许有空格）
        const regex = /^([^,]+)(,[^,]+)*$/
        if (!regex.test(value)) {
            callback(new Error("SEO 关键词必须由英文半角逗号分隔"))
            return
        }
    }

    //  检查 thumbnail 是否可用
    function checkThumbnailValidator(
        rule: any,
        value: string,
        callback: (error?: string | Error | undefined) => void,
    ): void {
        // 若可以为空，则直接返回
        if (!value) {
            callback()
            return
        }

        // 如果不为空，首尾不能是空格
        if (value.trim() === "") {
            callback(new Error("缩略图不能为空"))
            return
        }

        // 检查是否为合法的 URL
        const regex = /^(http|https):\/\/.*$/
        if (!regex.test(value)) {
            callback(new Error("缩略图必须为合法的 URL"))
            return
        }
    }

    // 检查 price 是否可用
    function checkPriceValidator(
        rule: any,
        value: number,
        callback: (error?: string | Error | undefined) => void,
    ): void {
        // 若为空，则直接返回
        if (!value) {
            callback()
            return
        }

        // 若不为空，必须为数字
        if (isNaN(value)) {
            callback(new Error("价格必须为数字"))
            return
        }

        // 价格不能小于 0
        if (value < 0) {
            callback(new Error("价格不能小于 0"))
            return
        }

        // 小数位数不能超过 2 位
        const decimal = value.toString().split(".")[1]
        if (decimal && decimal.length > 2) {
            callback(new Error("价格小数位数不能超过 2 位"))
            return
        }
    }

    // 检查别名是否可用
    function checkPostSlugValidator(
        rule: any,
        value: string,
        callback: (error?: string | Error | undefined) => void,
    ): void {
        // 如果 id 不为空，则直接返回
        if (!form.id?.value) {
            callback()
            return
        }

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
        if (!form.slug?.value || !form.slug.value.trim()) {
            callback("请输入别名")
            return
        }

        // 请求参数
        const req: CheckPostSlugRequest = {
            slug: form.slug.value,
        }

        // 调用后端接口
        checkPostSlugAPI(req).then((res) => {
            if (res.data.code === ResponseCode.PostCheckSlugNoExist) {
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
    function checkPostSlugExcludingIDValidator(
        rule: any,
        value: string,
        callback: (error?: string | Error | undefined) => void,
    ): void {
        // 如果 id 为空，则直接返回
        if (!form.id?.value) {
            callback()
            return
        }

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
        if (!form.slug?.value || !form.slug.value.trim()) {
            callback("请输入别名")
            return
        }

        // 请求参数
        const req: CheckPostSlugExcludingIDRequest = {
            excluding_id: form.id.value,
            slug: form.slug.value,
        }

        // 调用后端接口
        checkPostSlugExcludingIDAPI(req).then((res) => {
            if (res.data.code === ResponseCode.PostCheckSlugNoExistExcludingID) {
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

    // 检查分类是否可用
    function checkCategoriesValidator(
        rule: any,
        value: number[],
        callback: (error?: string | Error | undefined) => void,
    ): void {
        // 不能为空
        if (value.length === 0) {
            callback(new Error("请选择分类"))
            return
        }
        callback()
    }

    // 检查发布时间是否可用
    function checkPostPushTimeValidator(
        rule: any,
        value: string,
        callback: (error?: string | Error | undefined) => void,
    ): void {
        // 如果文章状态不是定时发布，则直接返回
        if (form.post_status?.value !== PostStatusCode.Password) {
            callback()
            return
        }

        // 不能为空
        if (!value) {
            callback(new Error("发布时间不能为空"))
            return
        }

        // 若不为空，再判断 post_push_time 是否小于 post_expired_time
        if (form.post_expired_time?.value && form.post_expired_time.value.time) {
            const postExpiredTime = new Date(form.post_expired_time.value.time).getTime()
            const postPushTime = new Date(value).getTime()
            if (postPushTime > postExpiredTime) {
                callback(new Error("发布时间不能大于过期时间"))
                return
            }
        }
    }

    // 检查过期时间是否可用
    function checkPostExpiredTimeValidator(
        rule: any,
        value: string,
        callback: (error?: string | Error | undefined) => void,
    ): void {
        // 若为空，则直接返回
        if (!value) {
            callback()
            return
        }

        // 若不为空，再判断 post_push_time 为空，直接返回
        if (!form.post_push_time?.value) {
            callback()
            return
        }

        // 若不为空，再判断 post_push_time 是否小于 post_expired_time
        if (form.post_push_time?.value && form.post_push_time.value.time) {
            const postExpiredTime = new Date(value).getTime()
            const postPushTime = new Date(form.post_push_time.value.time).getTime()
            if (postPushTime > postExpiredTime) {
                callback(new Error("发布时间不能大于过期时间"))
                return
            }
        }
    }

    return {
        checkPostTitleValidator,
        checkPostPasswordValidator,
        checkSeoDescriptionValidator,
        checkSeoKeywordsValidator,
        checkThumbnailValidator,
        checkPriceValidator,
        checkPostSlugValidator,
        checkPostSlugExcludingIDValidator,
        checkCategoriesValidator,
        checkPostPushTimeValidator,
        checkPostExpiredTimeValidator,
    }
}
