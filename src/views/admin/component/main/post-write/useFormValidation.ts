/**
 * @Author       : jiaopengzi
 * @Date         : 2024-11-25 15:09:39
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-28 16:04:06
 * @FilePath     : \blog-client\src\views\admin\component\main\post-write\useFormValidation.ts
 * @Description  : 表单验证钩子
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import type { FormRules } from "element-plus" // 需要全部安装 npm i element-plus -S
import { reactive,type Ref } from "vue"

import { type PgSqlDateTime } from "@/api/common"
import { checkPostSlugAPI,type CheckPostSlugRequest } from "@/api/post/checkPostSlug"
import {
    checkPostSlugExcludingIDAPI,
    type CheckPostSlugExcludingIDRequest,
} from "@/api/post/checkPostSlugExcludingID"
import { CommentStatusCode,PostStatusCode } from "@/api/post/common"
import { handleResErr,ResponseCode } from "@/api/response"
import { RegexPatterns } from "@/utils/regexPatterns"

import { type UpsertPostForm } from "./index"

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
        price?: Ref<string | undefined> // 价格
        seo_title?: Ref<string | undefined> // SEO标题
        seo_keywords?: Ref<string | undefined> // SEO关键词
        seo_description?: Ref<string | undefined> // SEO描述
        slug?: Ref<string | undefined> // 别名
        thumbnail?: Ref<string | undefined> // 缩略图
        category_ids?: Ref<string[]> // 分类id
        tag_names?: Ref<string[] | undefined> // 标签
        pay_roles?: Ref<string[] | undefined> // 付费角色
        post_push_time?: Ref<PgSqlDateTime | undefined> // 发布时间
        post_expired_time?: Ref<PgSqlDateTime | undefined> // 过期时间
    }
}

const titleLength = 255

// 表单验证
export function useFormValidation(options: FormValidationOptions): {
    rules: FormRules<UpsertPostForm>
} {
    const { form } = options

    // 检查文章标题是否可用
    function checkPostTitleValidator(
        rule: unknown,
        value: string,
        callback: (error?: string | Error | undefined) => void,
    ): void {
        // 不能为空
        if (!value) {
            callback(new Error("文章标题不能为空"))
            return
        }

        // 首尾不能包含空格
        if (value.match(RegexPatterns.IsTrim)) {
            callback(new Error("首尾不能包含空格"))
            return
        }

        // 长度不能超过 255
        if (value.length > titleLength) {
            callback(new Error("文章标题长度不能超过 255"))
            return
        }

        callback()
    }

    // 检查文章内容是否可用
    function checkPostContentValidator(
        rule: unknown,
        value: string,
        callback: (error?: string | Error | undefined) => void,
    ): void {
        // 不能为空
        if (!value) {
            callback(new Error("文章内容不能为空"))
            return
        }

        callback()
    }

    // 检查文章密码是否可用
    function checkPostPasswordValidator(
        rule: unknown,
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

        callback()
    }

    // 检查 SEO 标题是否可用
    function checkSeoTitleValidator(
        rule: unknown,
        value: string,
        callback: (error?: string | Error | undefined) => void,
    ): void {
        // 若为空，则直接返回
        if (!value) {
            callback()
            return
        }

        // 首尾不能包含空格
        if (value.match(RegexPatterns.IsTrim)) {
            callback(new Error("首尾不能包含空格"))
            return
        }

        // 长度不能超过 255
        if (value.length > titleLength) {
            callback(new Error("SEO 标题长度不能超过 255"))
            return
        }

        callback()
    }

    // 检查 SEO 描述是否可用
    function checkSeoDescriptionValidator(
        rule: unknown,
        value: string,
        callback: (error?: string | Error | undefined) => void,
    ): void {
        // 若为空，则直接返回
        if (!value) {
            callback()
            return
        }

        // 首尾不能包含空格
        if (value.match(RegexPatterns.IsTrim)) {
            callback(new Error("首尾不能包含空格"))
            return
        }

        // 长度不能超过 500
        if (value.length > 500) {
            callback(new Error("SEO 关键词长度不能超过 500"))
            return
        }

        callback()
    }

    // 检查 SEO 关键词是否可用
    function checkSeoKeywordsValidator(
        rule: unknown,
        value: string,
        callback: (error?: string | Error | undefined) => void,
    ): void {
        // 若为空，则直接返回
        if (!value) {
            callback()
            return
        }

        // 首尾不能包含空格
        if (value.match(RegexPatterns.IsTrim)) {
            callback(new Error("首尾不能包含空格"))
            return
        }

        // 长度不能超过 255
        if (value.length > 255) {
            callback(new Error("SEO 关键词长度不能超过 255"))
            return
        }

        // 判断是否为英文半角逗号分隔
        // 正则表达式：匹配由英文半角逗号分隔的项（项内允许任何字符，但逗号前后不允许有空格）
        if (!RegexPatterns.SeoKeyWords.test(value)) {
            callback(new Error("SEO 关键词必须由英文半角逗号分隔,关键字首尾不能有空格"))
            return
        }

        callback()
    }

    //  检查 thumbnail 是否可用
    function checkThumbnailValidator(
        rule: unknown,
        value: string,
        callback: (error?: string | Error | undefined) => void,
    ): void {
        // 若可以为空，则直接返回
        if (!value) {
            callback()
            return
        }

        // 首尾不能包含空格
        if (value.match(RegexPatterns.IsTrim)) {
            callback(new Error("首尾不能包含空格"))
            return
        }

        // 检查是否为合法的 URL
        if (!RegexPatterns.ImgURL.test(value)) {
            callback(new Error("缩略图必须为合法的 URL"))
            return
        }

        callback()
    }

    // 检查 price 是否可用
    function checkPriceValidator(
        rule: unknown,
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

        callback()
    }

    // 检查别名是否可用
    function checkPostSlugValidator(
        rule: unknown,
        value: string,
        callback: (error?: string | Error | undefined) => void,
    ): void {
        // 如果 id 不为空，则直接返回
        if (form.id?.value) {
            callback()
            return
        }

        // 如果为空，则直接返回
        if (!value) {
            callback()
            return
        }

        // 不能包含空格
        if (value.includes(" ")) {
            callback(new Error("别名不能包含空格"))
            return
        }

        // 不能包含特殊字符
        if (!value.match(RegexPatterns.Slug)) {
            callback(new Error("别名不能包含特殊字符，只能包含小写字母、数字、中划线"))
            return
        }

        // 去除前后空格
        if (!form.slug?.value || !form.slug.value) {
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
                const errMsg = handleResErr(res, "别名不可用")
                callback(new Error(errMsg))
            }
        })
    }

    // 检查别名是否可用
    function checkPostSlugExcludingIDValidator(
        rule: unknown,
        value: string,
        callback: (error?: string | Error | undefined) => void,
    ): void {
        // 如果 id 为空，则直接返回
        if (!form.id?.value) {
            callback()
            return
        }

        // 如果为空，则直接返回
        if (!value) {
            callback()
            return
        }

        // 不能包含空格
        if (value.includes(" ")) {
            callback(new Error("别名不能包含空格"))
            return
        }

        // 不能包含特殊字符
        if (!value.match(RegexPatterns.Slug)) {
            callback(new Error("别名不能包含特殊字符，只能包小写含字母、数字、中划线"))
            return
        }

        // 去除前后空格
        if (!form.slug?.value || !form.slug.value) {
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
                const errMsg = handleResErr(res, "别名不可用")
                callback(new Error(errMsg))
            }
        })
    }

    // 检查分类是否可用
    function checkCategoriesValidator(
        rule: unknown,
        value: number[],
        callback: (error?: string | Error | undefined) => void,
    ): void {
        if (value.length === 0) {
            callback(new Error("请选择分类"))
            return
        }
        callback()
    }

    // 检查发布时间是否可用
    function checkPostPushTimeValidator(
        rule: unknown,
        value: PgSqlDateTime,
        callback: (error?: string | Error | undefined) => void,
    ): void {
        // 如果文章状态不是定时发布，则直接返回
        if (form.post_status?.value !== PostStatusCode.Future) {
            callback()
            return
        }

        // PostStatusCode.Future 时，发布时间不能为空
        if (!value.Time) {
            callback(new Error("发布时间不能为空"))
            return
        }

        const now = new Date()
        const postPushTime = value.Time

        // 不能小于当前时间
        if (now >= postPushTime) {
            callback(new Error("发布时间不能小于当前时间"))
            return
        }

        // 若不为空，再判断 post_push_time 是否小于 post_expired_time
        if (form.post_expired_time?.value && form.post_expired_time.value.Time) {
            const postExpiredTime = new Date(form.post_expired_time.value.Time)
            if (postPushTime > postExpiredTime) {
                callback(new Error("发布时间不能大于过期时间"))
                return
            }
        }

        callback()
    }

    // 检查过期时间是否可用
    function checkPostExpiredTimeValidator(
        rule: unknown,
        value: PgSqlDateTime,
        callback: (error?: string | Error | undefined) => void,
    ): void {
        // 状态不为过期且过期时间为空，则直接返回
        if (form.post_status?.value !== PostStatusCode.Expired && !value.Time) {
            callback()
            return
        }

        // 状态为过期且过期时间为空
        if (form.post_status?.value === PostStatusCode.Expired && !value.Time) {
            callback(new Error("过期时间不能为空"))
            return
        }

        // 状态不为过期且过期时间不为空
        if (form.post_status?.value !== PostStatusCode.Expired && value.Time) {
            callback(new Error("状态不为过期时，过期时间必须为空"))
            return
        }

        // 校验过期时间
        if (value.Time) {
            const postExpiredTime = value.Time

            // 若不为空，再判断 post_push_time 为空，直接返回
            if (!form.post_push_time?.value) {
                callback()
                return
            }

            // 若不为空，再判断 post_push_time 是否小于 post_expired_time
            if (form.post_push_time?.value && form.post_push_time.value.Time) {
                const postPushTime = new Date(form.post_push_time.value.Time)
                if (postPushTime > postExpiredTime) {
                    callback(new Error("过期时间不能小于发布时间"))
                    return
                }
            }
        }

        callback()
    }

    /**
     * @description: 表单校验规则
     * @return  FormRules<EditMediaForm> 表单校验规则 trigger: 'blur' 表示失去焦点时校验 'change' 表示值改变时校验
     */
    const rules = reactive<FormRules<UpsertPostForm>>({
        post_title: [
            { required: true, message: "标题不能为空", trigger: "blur" },
            { validator: checkPostTitleValidator, trigger: "blur" },
        ],
        post_content: [
            { required: true, message: "文章内容不能为空", trigger: "blur" },
            { validator: checkPostContentValidator, trigger: "blur" },
        ],

        seo_title: [
            { required: false, message: "SEO自定义文章标题，留空则为文章标题。", trigger: "blur" },
            { validator: checkSeoTitleValidator, trigger: "blur" },
        ],

        seo_description: [
            {
                required: false,
                message: "SEO文章描述，留空则自动截取首段一定字数作为文章描。",
                trigger: "blur",
            },
            { validator: checkSeoDescriptionValidator, trigger: "blur" },
        ],

        seo_keywords: [
            {
                required: false,
                message:
                    "SEO文章关键词，多个关键词用英文半角逗号隔开，留空则自动将文章标签做为关键词。",
                trigger: "blur",
            },
            { validator: checkSeoKeywordsValidator, trigger: "blur" },
        ],

        thumbnail: [
            {
                required: false,
                message: "手动设置缩略图,如果没有则随机显示一张图片。",
                trigger: "blur",
            },
            { validator: checkThumbnailValidator, trigger: "blur" },
        ],

        price: [
            { required: false, message: "销售价格 为空则为免费。", trigger: "blur" },
            { validator: checkPriceValidator, trigger: "blur" },
        ],

        slug: [
            { required: false, message: "别名，留空则使用默认ID值。", trigger: "blur" },
            { validator: checkPostSlugValidator, trigger: "blur" },
            { validator: checkPostSlugExcludingIDValidator, trigger: "blur" },
        ],

        category_ids: [
            { required: true, message: "请选择文章分类1", trigger: "blur" },
            { validator: checkCategoriesValidator, trigger: "blur" },
        ],

        post_push_time: [
            { required: false, message: "文章发布时间", trigger: "blur" },
            { validator: checkPostPushTimeValidator, trigger: "blur" },
        ],

        post_expired_time: [
            { required: false, message: "文章过期时间", trigger: "blur" },
            { validator: checkPostExpiredTimeValidator, trigger: "change" },
        ],

        post_password: [
            { required: false, message: "文章密码,留空则为不设置密码。", trigger: "blur" },
            { validator: checkPostPasswordValidator, trigger: "blur" },
        ],
    })

    return {
        rules,
    }
}
