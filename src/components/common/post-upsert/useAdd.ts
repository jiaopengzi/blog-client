/*
 * FilePath    : blog-client-nuxt\src\components\common\post-upsert\useAdd.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 添加逻辑
 */

import type { FormInstance } from "element-plus"
import { type Reactive, type Ref } from "vue"
import { type Router } from "vue-router"

import { type InsertPostRequest } from "@/api/post/common"
import { insertPostAPI } from "@/api/post/insert"
import { ResponseCode } from "@/api/response"
import { RouteNames } from "@/router"
import { invalidateSsrRenderCache } from "@/utils/ssrCache"
import { MessageUtil } from "@/utils/message"

import { handleSubmit } from "./formHandler"
import type { PostInfoAboutTime, UpsertPostForm } from "./types"
import { handlePostUpsertError } from "./utils"

export function useAdd(
    postInfoForm: Reactive<UpsertPostForm>,
    queryKey: { ID: string },
    postInfoAboutTime: PostInfoAboutTime,
    router: Router,
    routeName: RouteNames,
    unfoldDefaultStatus: () => void,
    isPaid: Ref<boolean>,
) {
    // 提交表单
    const submitForm = async (formEl: FormInstance | undefined): Promise<boolean> => {
        // 表单校验及值转换
        const req = await handleSubmit<InsertPostRequest>(formEl, postInfoForm, unfoldDefaultStatus)

        // 如果 req 是空对象, 则表示表单验证失败
        if (Object.keys(req).length === 0) return false

        // 插入文章
        return await insertPostAPI(req).then(async (res): Promise<boolean> => {
            if (res.data.code === ResponseCode.PostInsertSuccess) {
                // 将 data 中的 id 更新到 postInfoForm
                postInfoForm.id = res.data.data.id
                isPaid.value = res.data.data.is_paid

                // 更新创建时间
                postInfoAboutTime.created_at = new Date(res.data.data.created_at)
                postInfoAboutTime.updated_at = new Date(res.data.data.updated_at)

                MessageUtil.success(res.data.msg, 6000)

                // feature01(260829-08): 新增文章/自定义页会改变首页/分类/标签等 SSR 列表直出内容,
                // 保存成功后立即清空 swr 渲染缓存, 下次请求按新数据重新 SSR
                await invalidateSsrRenderCache()

                // 插入成功后变成编辑状态, 更改路由
                // bug01(260829-05): Nuxt 的 admin 子页为 [...slug] catch-all (name 为 admin-slug),
                // SPA 路由名 (post-write/page-write) 不在 Nuxt 路由表中, 按 name push 会抛
                // "No match" 且 URL 不更新 (文章已保存成功), 对齐 index.vue newPostWrite 的路径跳转
                router.push({
                    path: `/admin/${routeName}`,
                    query: { [queryKey.ID]: res.data.data.id },
                })
                return true
            } else {
                handlePostUpsertError(res)
                return false
            }
        })
    }

    return { submitForm }
}
