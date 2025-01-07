/**
 * @Author       : jiaopengzi
 * @Date         : 2024-11-25 17:24:13
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-11-30 14:23:43
 * @FilePath     : \blog-client\src\views\admin\component\main\post-write\formHandler copy.ts
 * @Description  : 表单处理
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import type { FormInstance } from "element-plus" // 需要全部安装 npm i element-plus -S

import type { InsertPostRequest, UpdatePostRequest } from "@/api/post/common"

import type { UpsertPostForm } from "./index"

/**
 * 提交表单
 * @param formEl 表单实例
 * @param postInfoForm 表单数据
 * @returns UpsertPostRequest
 */
export async function handleSubmit<T extends InsertPostRequest | UpdatePostRequest>(
    formEl: FormInstance | undefined,
    postInfoForm: UpsertPostForm,
): Promise<T> {
    const req = {} as T

    if (!formEl) return req

    await formEl.validate((valid, fields) => {
        if (valid) {
            // 将 postInfoForm 解析到 InsertPostRequest
            Object.assign(req, postInfoForm)

            // 价格需要乘以 100 以适应后端整数
            if (req.price) {
                req.price = (Number(req.price) * 100).toString()
            }

            // 如果有时间则设置为有效
            if (req.post_push_time && req.post_push_time.Time !== null) {
                req.post_push_time.Valid = true
            }

            if (req.post_expired_time && req.post_expired_time.Time !== null) {
                req.post_expired_time.Valid = true
            }

            // 如果没有时间则设置为无效
            if (req.post_push_time && req.post_push_time.Time === null) {
                req.post_push_time.Valid = false
            }

            if (req.post_expired_time && req.post_expired_time.Time === null) {
                req.post_expired_time.Valid = false
            }

            // 处理零值
            if (req.post_author === "") {
                delete req.post_author
            }
            if (req.post_content === "") {
                delete req.post_content
            }
            if (req.post_title === "") {
                delete req.post_title
            }
            if (req.post_status === void 0) {
                delete req.post_status
            }
            if (req.post_password === "") {
                delete req.post_password
            }
            if (req.comment_status === void 0) {
                delete req.comment_status
            }
            if (req.price === "") {
                delete req.price
            }
            if (req.seo_title === "") {
                delete req.seo_title
            }
            if (req.seo_keywords === "") {
                delete req.seo_keywords
            }
            if (req.seo_description === "") {
                delete req.seo_description
            }
            if (req.slug === "") {
                delete req.slug
            }
            if (req.thumbnail === "") {
                delete req.thumbnail
            }
            if (req.category_ids?.length === 0) {
                delete req.category_ids
            }
            if (req.tag_names?.length === 0) {
                delete req.tag_names
            }
            if (req.pay_roles?.length === 0) {
                delete req.pay_roles
            }
        } else {
            console.error("表单校验失败", fields)
            return
        }
    })

    // 如果包含 id 字段，且不为空，则为更新请求
    if ("id" in req && req.id) {
        return req as T
    }

    return req as T
}
