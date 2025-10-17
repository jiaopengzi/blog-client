/*
 * FilePath    : blog-client\src\components\common\post-upsert\formHandler.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 表单到请求转换处理
 */

import type { FormInstance } from "element-plus" // 需要全部安装 npm i element-plus -S
import { type Reactive } from "vue"

import { type InsertPostRequest, PostType, type UpdatePostRequest } from "@/api/post/common"

import type { UpsertPostForm } from "./types"

/**
 * 提交表单
 * @param formEl 表单实例
 * @param postInfoForm 表单数据
 * @returns UpsertPostRequest
 */
export async function handleSubmit<T extends InsertPostRequest | UpdatePostRequest>(
    formEl: FormInstance | undefined,
    postInfoForm: Reactive<UpsertPostForm>,
): Promise<T> {
    const req = {} as T

    if (!formEl) return req

    await formEl.validate((valid, fields) => {
        if (valid) {
            // 将 postInfoForm 解析到 InsertPostRequest，排除 price 字段
            const { price, ...rest } = postInfoForm
            Object.assign(req, rest)

            // 价格需要乘以 100 以适应后端整数，并转换为 string
            if (typeof price !== "undefined" && price !== null) {
                req.price = (price * 100).toFixed(0).toString()
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
            if (req.category_ids?.length === 0 || req.post_type === PostType.Page) {
                delete req.category_ids
            }
            if (req.tag_names?.length === 0 || req.post_type === PostType.Page) {
                delete req.tag_names
            }
            if (req.pay_roles?.length === 0) {
                delete req.pay_roles
            }
            if (!req.video_file_id_hash_list || req.video_file_id_hash_list.length === 0) {
                delete req.video_file_id_hash_list
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
