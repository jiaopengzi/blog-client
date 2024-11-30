/**
 * @Author       : jiaopengzi
 * @Date         : 2024-11-25 16:42:09
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-11-30 14:35:34
 * @FilePath     : \blog-client\src\views\admin\component\main\post-write\useAdd.ts
 * @Description  : 添加文章
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { insertPostRequestAPI } from "@/api/post/insert"
import type { InsertPostRequest } from "@/api/post/common"
import { ResponseCode, handleErrInfo } from "@/api/responseCode"
import { ShowMsgTip } from "@/utils/message"
import router from "@/router"
import type { UpsertPostForm, PostInfoAboutTime } from "./index"
import { AdminSideMenu } from "@/views/admin/component/aside"
import type { FormInstance } from "element-plus" // 需要全部安装 npm i element-plus -S
import { handleSubmit } from "./formHandler"

export function useAdd(
    postInfoForm: UpsertPostForm,
    queryKey: { ID: string },
    postInfoAboutTime: PostInfoAboutTime,
) {
    // 提交表单
    const submitForm = async (formEl: FormInstance | undefined): Promise<boolean> => {
        // 表单校验及值转换
        const req = await handleSubmit<InsertPostRequest>(formEl, postInfoForm)

        // 如果 req 是空对象，则表示表单验证失败
        if (Object.keys(req).length === 0) return false

        // 插入文章
        return await insertPostRequestAPI(req).then(async (res): Promise<boolean> => {
            if (res.data.code === ResponseCode.PostInsertSuccess) {
                // 将 data 中的 id 更新到 postInfoForm
                postInfoForm.id = res.data.data.id

                // 更新创建时间
                postInfoAboutTime.created_at = new Date(res.data.data.created_at)
                postInfoAboutTime.updated_at = new Date(res.data.data.updated_at)

                ShowMsgTip(ShowMsgTip.MsgType.success, res.data.msg, 6000)

                // 插入成功后变成编辑状态，更改路由
                router.push({
                    name: AdminSideMenu.PostWrite,
                    query: { [queryKey.ID]: res.data.data.id },
                })
                return true
            } else {
                ShowMsgTip(ShowMsgTip.MsgType.error, handleErrInfo(res), 0)
                return false
            }
        })
    }

    return { submitForm }
}
