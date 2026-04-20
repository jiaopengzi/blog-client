/*
 * FilePath    : blog-client\src\components\common\post-upsert\useEdit.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 编辑逻辑
 */

import type { FormInstance } from "element-plus" // 需要全部安装 npm i element-plus -S
import { type Reactive, type Ref } from "vue"
import { useRoute } from "vue-router"

import { CommentStatusCode, type UpdatePostRequest } from "@/api/post/common"
import { updatePostAPI } from "@/api/post/update"
import { viewPostByIDAdminAPI, type ViewPostByIDRequest } from "@/api/post/viewByIDAdmin"
import { type PostCategory } from "@/api/postCategory/view"
import { type PostTag } from "@/api/postTag/view"
import { ResponseCode } from "@/api/response"
import type { SwitchItem } from "@/components/common/switch-group"
import { EditorStateManager } from "@/components/editor"
import { MessageUtil } from "@/utils/message"

import { handleSubmit } from "./formHandler"
import type { PostInfoAboutTime, UpsertPostForm } from "./types"
import { handlePostUpsertError } from "./utils"

// 更新 SwitchItem 列表中的状态
const updateSwitchItem = (list: SwitchItem[], name: string, status: boolean) => {
    const item = list.find((item) => item.name === name)
    if (item) {
        item.status = status
    }
}

export function useEdit(
    postInfoForm: Reactive<UpsertPostForm>,
    rolePaidList: SwitchItem[],
    commentStatus: SwitchItem[],
    queryKey: { ID: string },
    stateManager: EditorStateManager,
    dataOfUpdate: UpsertPostForm,
    postInfoAboutTime: PostInfoAboutTime,
    postShowMethod: SwitchItem[],
    unfoldDefaultStatus: () => void,
    isPaid: Ref<boolean>,
) {
    const route = useRoute()

    // 从路由中query中获取值
    const getValueFromQuery = async () => {
        postInfoForm.id = route.query[queryKey.ID] as string
    }

    // 初始化数据
    const getDataOnBeforeMount = async () => {
        if (postInfoForm.id) {
            // 获取文章信息
            const req: ViewPostByIDRequest = {
                post_id: postInfoForm.id,
            }
            await viewPostByIDAdminAPI(req).then((res) => {
                if (res.data.code === ResponseCode.PostViewByIDSuccess) {
                    const data = res.data.data
                    // 更新编辑器内容
                    stateManager.setInitDocIsEmpty(false)
                    stateManager.updateState(data.post_content_paid)
                    postInfoForm.id = data.id
                    postInfoForm.post_author = data.author_info.id
                    postInfoForm.post_title = data.post_title
                    postInfoForm.post_content = data.post_content_paid
                    postInfoForm.seo_title = data.seo_title
                    postInfoForm.seo_description = data.seo_description
                    postInfoForm.seo_keywords = data.seo_keywords
                    postInfoForm.thumbnail = data.thumbnail
                    postInfoForm.price = parseFloat((parseFloat(data.price) / 100).toFixed(2))
                    postInfoForm.slug = data.slug
                    postInfoForm.pay_roles = data.pay_roles
                    postInfoForm.comment_status = data.comment_status
                    postInfoForm.post_status = data.post_status
                    postInfoForm.post_password = data.post_password
                    postInfoForm.is_pinned = data.is_pinned
                    postInfoForm.is_recommended = data.is_recommended
                    postInfoForm.post_type = data.post_type
                    postInfoForm.pay_strategy = data.pay_strategy

                    // 更新视频目录
                    postInfoForm.video_toc = data.video_toc?.toc || []
                    postInfoForm.video_file_id_hash_list = []

                    if (data.post_push_time) {
                        postInfoForm.post_push_time = data.post_push_time
                    }
                    if (data.post_expired_time) {
                        postInfoForm.post_expired_time = data.post_expired_time
                    }

                    // 历遍 data.categories 列表,取出 id 组成新数组
                    postInfoForm.category_ids = data.categories?.map((item: PostCategory) => item.id.toString())

                    // 历遍 data.tags 列表,取出 name 组成新数组
                    postInfoForm.tag_names = data.tags?.map((item: PostTag) => item.name)

                    // 更新角色付费管理
                    if (data.pay_roles) {
                        rolePaidList.forEach((item) => {
                            item.status = data.pay_roles.includes(item.name)
                        })
                        postInfoForm.pay_roles = data.pay_roles
                    }

                    isPaid.value = data.is_paid

                    postInfoAboutTime.created_at = new Date(data.created_at)
                    postInfoAboutTime.updated_at = new Date(data.updated_at)

                    // 更新评论状态
                    updateSwitchItem(commentStatus, "commentStatus", postInfoForm.comment_status === CommentStatusCode.Open)

                    // 更新显示方式
                    updateSwitchItem(postShowMethod, "is_pinned", postInfoForm.is_pinned > 0)
                    updateSwitchItem(postShowMethod, "is_recommended", postInfoForm.is_recommended > 0)
                }
            })
        }
    }

    // 提交表单
    const submitForm = async (formEl: FormInstance | undefined): Promise<boolean> => {
        const req = await handleSubmit<UpdatePostRequest>(formEl, dataOfUpdate, unfoldDefaultStatus)
        // 如果 req 是空对象，则表示表单验证失败
        if (Object.keys(req).length === 0) return false

        return await updatePostAPI(req).then(async (res): Promise<boolean> => {
            if (res.data.code === ResponseCode.PostUpdateSuccess) {
                postInfoAboutTime.updated_at = new Date(res.data.data.updated_at)
                isPaid.value = res.data.data.is_paid
                MessageUtil.success(res.data.msg, 6000)
                return true
            } else {
                handlePostUpsertError(res)
                return false
            }
        })
    }

    return { getValueFromQuery, getDataOnBeforeMount, submitForm }
}
