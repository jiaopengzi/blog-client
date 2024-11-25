/**
 * @Author       : jiaopengzi
 * @Date         : 2024-11-25 16:44:10
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-11-25 18:07:22
 * @FilePath     : \blog-client\src\views\admin\component\main\post-write\useEdit.ts
 * @Description  : 编辑文章
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { viewPostByIDRequestAPI, type ViewPostByIDRequest } from "@/api/post/viewByID"
import { updatePostRequestAPI } from "@/api/post/update"
import { ResponseCode } from "@/api/responseCode"
import { ShowMsgTip } from "@/utils/message"
import type { UpsertPostForm } from "./index"
import type { EditorState } from "@/components/editor"
import type { SwitchItem } from "@/components/common/switch-group"
import { CommentStatusCode } from "@/api/post/common"
import router from "@/router"
import { EditorStateManager } from "@/components/editor"
import { type PostTag } from "@/api/postTag/view"
import type { FormInstance } from "element-plus" // 需要全部安装 npm i element-plus -S
import type { UserInfoStore } from "@/stores/user"
import { handleSubmit } from "./formHandler"

export function useEdit(
    postInfoForm: UpsertPostForm,
    editorState: EditorState,
    rolePaidList: SwitchItem[],
    commentStatus: SwitchItem[],
    userStore: UserInfoStore,
    queryKey: { ID: string },
    stateManager: EditorStateManager,
) {
    // 从路由中query中获取值
    function getValueFromQuery() {
        postInfoForm.id = router.currentRoute.value.query[queryKey.ID] as string
    }

    // 初始化数据
    const getDataOnBeforeMount = async () => {
        getValueFromQuery()
        if (postInfoForm.id) {
            // 获取文章信息
            const req: ViewPostByIDRequest = {
                post_id: postInfoForm.id,
            }
            await viewPostByIDRequestAPI(req).then((res) => {
                if (res.data.code === ResponseCode.PostViewByIDSuccess) {
                    const data = res.data.data
                    postInfoForm.id = data.id

                    postInfoForm.post_author = data.author_info.id

                    postInfoForm.post_title = data.post_title

                    // 更新编辑器内容
                    stateManager.updateState(data.post_content)

                    postInfoForm.seo_title = data.seo_title
                    postInfoForm.seo_description = data.seo_description
                    postInfoForm.seo_keywords = data.seo_keywords
                    postInfoForm.thumbnail = data.thumbnail
                    postInfoForm.price = (Number(data.price) / 100).toString()
                    postInfoForm.slug = data.slug
                    postInfoForm.tag_names = data.tags.map((item: PostTag) => item.name)
                    postInfoForm.pay_roles = data.pay_roles
                    postInfoForm.comment_status = data.comment_status
                    postInfoForm.post_status = data.post_status
                    postInfoForm.post_password = data.post_password

                    if (data.post_push_time) {
                        postInfoForm.post_push_time = data.post_push_time
                    }
                    if (data.post_expired_time) {
                        postInfoForm.post_expired_time = data.post_expired_time
                    }

                    // 历遍 data.categories 列表,取出 id 组成新数组
                    postInfoForm.category_ids = data.categories.map((item: any) =>
                        item.id.toString(),
                    )

                    // 历遍 data.tags 列表,取出 name 组成新数组
                    postInfoForm.tag_names = data.tags.map((item: any) => item.name)

                    // 更新角色付费管理
                    if (data.pay_roles) {
                        data.pay_roles.forEach((role: string) => {
                            const index = rolePaidList.findIndex((i) => i.name === role)
                            rolePaidList[index].status = true
                        })
                        postInfoForm.pay_roles = data.pay_roles
                    }

                    // 更新评论状态
                    const commentItem = commentStatus.find((item) => item.name === "commentStatus")
                    if (commentItem) {
                        commentItem.status = postInfoForm.comment_status === CommentStatusCode.Open
                    }
                }
            })
        }
    }

    // 提交表单
    const submitForm = async (formEl: FormInstance | undefined) => {
        handleSubmit(formEl, postInfoForm, editorState, userStore).then((req) => {
            // 更新文章
            req.id = postInfoForm.id
            updatePostRequestAPI(req).then(async (res) => {
                if (res.data.code === ResponseCode.PostUpdateSuccess) {
                    ShowMsgTip(ShowMsgTip.MsgType.success, res.data.msg, 6000)
                } else {
                    ShowMsgTip(ShowMsgTip.MsgType.error, res.data.msg, 0)
                }
                console.log("更新提交!")
            })
        })
    }

    return { getDataOnBeforeMount, submitForm }
}
