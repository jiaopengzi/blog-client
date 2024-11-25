/**
 * @Author       : jiaopengzi
 * @Date         : 2024-11-25 16:42:09
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-11-25 18:11:21
 * @FilePath     : \blog-client\src\views\admin\component\main\post-write\useAdd.ts
 * @Description  : 添加文章
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { insertPostRequestAPI } from "@/api/post/insert"
import { ResponseCode } from "@/api/responseCode"
import { ShowMsgTip } from "@/utils/message"
import router from "@/router"
import type { UpsertPostForm } from "./index"
import type { EditorState } from "@/components/editor"
import type { UserInfoStore } from "@/stores/user"

import { AdminSideMenu } from "@/views/admin/component/aside"
import type { FormInstance } from "element-plus" // 需要全部安装 npm i element-plus -S
import { handleSubmit } from "./formHandler"

export function useAdd(
    postInfoForm: UpsertPostForm,
    editorState: EditorState,
    userStore: UserInfoStore,
    queryKey: { ID: string },
) {
    // 提交表单
    const submitForm = async (formEl: FormInstance | undefined) => {
        handleSubmit(formEl, postInfoForm, editorState, userStore).then((req) => {
            // req.category_ids.map((i) => Number(i))
            // 当 id 为空时，表示为新增文章
            insertPostRequestAPI(req).then(async (res) => {
                if (res.data.code === ResponseCode.PostInsertSuccess) {
                    // 将 data 中的 id 更新到 postInfoForm
                    postInfoForm.id = res.data.data.id

                    ShowMsgTip(ShowMsgTip.MsgType.success, res.data.msg, 6000)

                    // 插入成功后变成编辑状态，更改路由
                    router.push({
                        name: AdminSideMenu.PostWrite,
                        query: { [queryKey.ID]: res.data.data.id },
                    })
                } else {
                    ShowMsgTip(ShowMsgTip.MsgType.error, res.data.msg, 0)
                }
                console.log("新增提交!")
            })
        })
    }

    return { submitForm }
}
