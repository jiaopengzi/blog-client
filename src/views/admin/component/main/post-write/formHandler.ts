/**
 * @Author       : jiaopengzi
 * @Date         : 2024-11-25 17:24:13
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-11-25 18:06:15
 * @FilePath     : \blog-client\src\views\admin\component\main\post-write\formHandler.ts
 * @Description  : 表单处理
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { ShowMsgTip } from "@/utils/message"
import type { UpsertPostForm } from "./index"
import type { UpsertPostRequest } from "@/api/post/common"
import type { EditorState } from "@/components/editor"
import type { UserInfoStore } from "@/stores/user"
import type { FormInstance } from "element-plus" // 需要全部安装 npm i element-plus -S

/**
 * 提交表单
 * @param formEl 表单实例
 * @param postInfoForm 表单数据
 * @param editorState 编辑器状态
 * @param userStore 用户信息
 * @returns UpsertPostRequest
 */
export async function handleSubmit(
    formEl: FormInstance | undefined,
    postInfoForm: UpsertPostForm,
    editorState: EditorState,
    userStore: UserInfoStore,
): Promise<UpsertPostRequest> {
    const req = {} as UpsertPostRequest

    if (!formEl) return req

    try {
        await formEl.validate((valid, fields) => {
            if (valid) {
                // 将 postInfoForm 解析到 InsertPostRequest
                Object.assign(req, postInfoForm)

                // 更新作者ID
                req.post_author = userStore.data.user.id.toString()

                if (editorState.editor === "") {
                    ShowMsgTip(ShowMsgTip.MsgType.warning, "文章内容不能为空", 6000)
                    return
                }

                // 更新文章内容
                req.post_content = editorState.editor

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

                // 移除 req 空值字段
                if (req.id === "") {
                    delete req.id
                }
                if (req.post_password === "") {
                    delete req.post_password
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
                if (req.tag_names?.length === 0) {
                    delete req.tag_names
                }
                if (req.pay_roles?.length === 0) {
                    delete req.pay_roles
                }
            } else {
                ShowMsgTip(ShowMsgTip.MsgType.warning, "请检查表单", 6000)
                console.error("表单校验失败", fields)
                return
            }
        })
    } catch (error) {
        console.error("submitForm error", error)
        return {} as UpsertPostRequest
    }

    return req
}
