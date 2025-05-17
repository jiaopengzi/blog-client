<!--
 * FilePath    : blog-client\src\views\home\main-content\post-detail\components\comment-list\comment-item\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 单条评论
-->

<template>
    <div class="comment-detail">
        <!-- 右上角提示符 -->
        <div class="top-right-tip" v-if="data.is_pinned === CommentPinnedCode.IsPinned">置顶</div>
        <div class="header-container">
            <div class="header-avatar">
                <AvatarInitials :avatar="data.user_info.user_avatar" :name="data.user_info.user_display_name" :size="40" />
            </div>
            <div class="header-info">
                <div class="header-info-item header-title">
                    <span class="header-title-item header-name">{{ data.user_info.user_display_name }}</span>
                    <span class="header-title-item header-is-post-author" v-if="data.is_post_author === CommentIsPostAuthorCode.IsPostAuthor">作者</span>
                </div>
                <span class="header-info-item header-time">{{ data.created_at }}</span>
            </div>
            <div class="header-action">
                <el-tooltip v-if="isShowReplyBtn" effect="dark" content="回复" :hide-after="0" :show-after="300">
                    <el-button type="default" class="header-action-item" @click="handleReply">
                        <j-icon :name="IconKeys.Reply" custom-class="iconfont" />
                    </el-button>
                </el-tooltip>

                <el-tooltip v-if="isShowDeleteBtn" effect="dark" content="删除" :hide-after="0" :show-after="300">
                    <el-button type="default" class="header-action-item" @click="handleDelete">
                        <j-icon :name="IconKeys.Delete" custom-class="iconfont" />
                    </el-button>
                </el-tooltip>

                <el-tooltip v-if="isShowPinnedBtn" effect="dark" :content="pinnedText" :hide-after="0" :show-after="300">
                    <el-button type="default" class="header-action-item" @click="handlePinned">
                        <j-icon :name="IconKeys.Pinned" custom-class="iconfont" />
                    </el-button>
                </el-tooltip>
            </div>
        </div>
        <div class="content">
            <HtmlPreview
                ref="previewRef"
                :html="state.html"
                :img-urls="state.imgUrls"
                :is-show-el-image-viewer="state.isShowElImageViewer"
                @show-image-viewer="showImageViewer"
                @close-image-viewer="closeImageViewer"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia"
import { computed } from "vue"

import { CommentIsPostAuthorCode, CommentPinnedCode } from "@/api/comment/common"
import { type UpdateCommentRequest } from "@/api/comment/update"
import { CommentStatusCode } from "@/api/post/common"
import AvatarInitials from "@/components/common/avatar-initials"
import { IconKeys } from "@/components/common/icons"
import { EditorStateManager } from "@/components/editor"
import HtmlPreview from "@/components/editor/components/preview"
import { usePreview } from "@/components/editor/hooks/usePreview"
import { useUserStore } from "@/stores/user"

import { useCommentItem } from "./hooks"
import type { CommentItemProps } from "./types"

defineOptions({ name: "CommentItem" })

// 定义 props
const { data, status } = defineProps<CommentItemProps>()

// 事件
const emit = defineEmits<{
    (event: "reply", commentID: string): void
    (event: "delete", commentID: string): void
    (event: "pinned", commentID: string, isPinned: CommentPinnedCode): void
}>()

const userStore = useUserStore()
const { data: userData, isLogin } = storeToRefs(userStore)

const manager = new EditorStateManager({ mode: "comment" })

manager.updateState(data.content)

const state = manager.getState()

// preview
const { showImageViewer, closeImageViewer } = usePreview(manager)
const {
    deleteComment, // 删除评论
    updateComment, // 更新评论
} = useCommentItem()

// 是否显示回复按钮
const isShowReplyBtn = computed(() => {
    // 登录状态
    if (isLogin.value && status === CommentStatusCode.Open) {
        return true
    }

    return false
})

const handleReply = () => {
    emit("reply", data.id)
}

// 是否显示删除按钮
const isShowDeleteBtn = computed(() => {
    // 是否为自己的评论
    if (userData.value.user.id === data.user_info.id) {
        return true
    }

    // 是否为文章作者
    if (data.is_pinned === CommentPinnedCode.IsPinned) {
        return true
    }

    return false
})

// 处理删除评论
const handleDelete = async () => {
    // 删除评论
    await deleteComment(data.id)

    emit("delete", data.id)
}

// 是否显示置顶按钮
const isShowPinnedBtn = computed(() => {
    // 是否为文章作者
    if (isLogin.value && userData.value.user.id === data.user_info.id) {
        return true
    }

    return false
})

// 是否显示置顶按钮
const pinnedText = computed(() => {
    // 是否为文章作者
    if (data.is_post_author === CommentIsPostAuthorCode.IsPostAuthor) {
        return data.is_pinned === CommentPinnedCode.IsPinned ? "取消置顶" : "置顶"
    }

    return "置顶"
})

const handlePinned = async () => {
    // 更新请求参数
    const req: UpdateCommentRequest = {
        id: data.id,
        is_pinned: data.is_pinned === CommentPinnedCode.IsPinned ? CommentPinnedCode.NotIsPinned : CommentPinnedCode.IsPinned,
    }

    // 更新评论
    await updateComment(req)

    // 置顶成功
    emit("pinned", data.id, req.is_pinned!)
}
</script>
<style lang="scss" scoped>
.comment-detail {
    position: relative;
    overflow: hidden;
    background-color: var(--jpz-bg-color);
    padding: 20px 10px;
    margin: 10px 0;
    border-radius: 4px;
}

.header-container {
    // 网格布局
    display: grid;
    grid-template-columns: auto auto 1fr;
    grid-template-rows: auto;

    margin: 4px;
}

.header-avatar {
    display: flex;
    justify-content: center;
    align-items: center;

    margin-right: 10px;
}

.header-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;

    .header-title {
        .header-title-item {
            color: var(--jpz-color-primary);
        }

        .header-name {
            margin-right: 5px;
            font-size: 14px;
            font-weight: 700;
        }
    }

    .header-time {
        color: var(--jpz-text-color-secondary);
        font-size: 12px;
        line-height: 1.5em;
    }
}

.header-action {
    .header-action-item {
        margin-left: 10px;
        color: var(--jpz-text-color-secondary);
        background-color: transparent;
        border: none;

        .iconfont {
            font-size: 14px;
            fill: var(--jpz-text-color-secondary);

            &:hover {
                fill: var(--jpz-text-color-primary);
            }
        }
    }
}

.header-is-post-author {
    padding: 0 4px;
    background-color: var(--jpz-color-secondary);
    color: var(--jpz-text-color-primary);
    border-radius: 4px;
    font-size: 12px;
    line-height: 1.5em;
    display: inline-block;
    font-weight: 700;
}

.top-right-tip {
    background-color: var(--jpz-color-primary);
    color: var(--jpz-color-secondary);
    height: 1.5em;
    line-height: 1.5em;
    text-align: center;
    position: absolute;
    width: 70px;
    transform-origin: bottom right; // 以右下角为旋转中心,只需要计算 top 值, right 等于0
    transform: rotate(45deg);
    // top 等于 width 乘以 sin(45deg) 再减去 height 的高度
    top: 28px;
    right: 0px;
    font-size: 14px;
    font-weight: 700;
}
// @include respond-to("pc") {
// }

// @include respond-to("pad") {
// }

// @include respond-to("phone") {
// }
</style>
