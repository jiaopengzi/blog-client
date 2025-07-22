/*
 * FilePath    : blog-client\src\components\common\post-upsert\useAdd.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 添加逻辑
 */

import type { FormInstance } from "element-plus"
import { type Router } from "vue-router"

import { type InsertPostRequest } from "@/api/post/common"
import { insertPostAPI } from "@/api/post/insert"
import { handleResErr, ResponseCode } from "@/api/response"
import { RouteNames } from "@/router"
import { MessageUtil } from "@/utils/message"

import { handleSubmit } from "./formHandler"
import type { PostInfoAboutTime, UpsertPostForm } from "./types"

export function useAdd(postInfoForm: UpsertPostForm, queryKey: { ID: string }, postInfoAboutTime: PostInfoAboutTime, router: Router, routeName: RouteNames) {
    // 提交表单
    const submitForm = async (formEl: FormInstance | undefined): Promise<boolean> => {
        // 表单校验及值转换
        const req = await handleSubmit<InsertPostRequest>(formEl, postInfoForm)

        // 如果 req 是空对象，则表示表单验证失败
        if (Object.keys(req).length === 0) return false

        // 插入文章
        return await insertPostAPI(req).then(async (res): Promise<boolean> => {
            if (res.data.code === ResponseCode.PostInsertSuccess) {
                // 将 data 中的 id 更新到 postInfoForm
                postInfoForm.id = res.data.data.id

                // 更新创建时间
                postInfoAboutTime.created_at = new Date(res.data.data.created_at)
                postInfoAboutTime.updated_at = new Date(res.data.data.updated_at)

                MessageUtil.success(res.data.msg, 6000)

                // 插入成功后变成编辑状态，更改路由
                router.push({
                    name: routeName,
                    query: { [queryKey.ID]: res.data.data.id },
                })
                return true
            } else {
                MessageUtil.error(handleResErr(res), 0)
                return false
            }
        })
    }

    return { submitForm }
}
