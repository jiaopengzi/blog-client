<!--
 * FilePath    : blog-client\src\components\common\user-item\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 用户展示
-->

<template>
    <div class="user-container">
        <div :class="isShowCursorPointer ? 'user-avatar-pointer' : 'user-avatar'" @click="handleUserClick">
            <AvatarInitials :avatar="user.user_avatar" :name="user.user_display_name" :size="size" />
        </div>
        <div class="user-info">
            <div class="user-info-item user-title">
                <span
                    :class="isShowCursorPointer ? 'user-title-item user-display-name-pointer' : 'user-title-item user-display-name'"
                    v-if="isShowUserDisplayName"
                    @click="handleUserClick"
                    >{{ user.user_display_name }}</span
                >
                <span class="user-title-item user-is-post-author" v-if="commentIsPostAuthorCode === CommentIsPostAuthorCode.IsPostAuthor">作者</span>
            </div>
            <div class="user-info-item user-title" v-if="isShowUserEmail" @click="handleUserClick">
                <span :class="isShowCursorPointer ? 'user-title-item user-email-pointer' : 'user-title-item user-email'">{{ user.user_email }}</span>
            </div>
            <div class="user-info-item user-title" v-if="isShowUserName" @click="handleUserClick">
                <span :class="isShowCursorPointer ? 'user-title-item user-name-pointer' : 'user-title-item user-name'" v-if="isShowUserName">{{
                    user.user_name
                }}</span>
            </div>
            <span class="user-info-item user-time" v-if="createdAt">{{ createdAt }}</span>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { CommentIsPostAuthorCode } from "@/api/comment/common"
import AvatarInitials from "@/components/common/avatar-initials"

import type { UserProps } from "./types"

defineOptions({ name: "UserItem" })

// 定义 props
const {
    user,
    size = 40, // 默认为 40px
    isShowUserName = false, // 默认不显示用户名
    isShowUserEmail = false, // 默认不显示用户邮箱
    isShowUserDisplayName = true, // 默认显示用户显示名称
    isShowCursorPointer = false, // 默认不显示鼠标悬停手型
    commentIsPostAuthorCode = CommentIsPostAuthorCode.NotIsPostAuthor, // 默认不是作者
    createdAt = "", // 默认没有创建时间
} = defineProps<UserProps>()

// 事件
const emit = defineEmits<{
    (event: "user-click", userID: string): void
}>()

// 处理用户点击事件
const handleUserClick = () => {
    if (!isShowCursorPointer) return
    emit("user-click", user.id)
}
</script>
<style lang="scss" scoped>
.user-container {
    // 网格布局
    display: grid;
    grid-template-columns: auto auto 1fr;
    grid-template-rows: auto;
}

// 用户头像样式占位
%user-avatar {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 10px;
}

.user-avatar {
    @extend %user-avatar;
}

.user-avatar-pointer {
    @extend %user-avatar;
    cursor: pointer;
}

.user-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;

    .user-title {
        // 行高
        line-height: 1.1em;

        .user-title-item {
            color: var(--jpz-color-primary);
        }

        // 通用样式
        .user-email,
        .user-name,
        .user-email-pointer,
        .user-name-pointer {
            margin-right: 5px;
            font-size: 12px;
        }

        // 鼠标悬停手型样式
        .user-email-pointer,
        .user-name-pointer,
        .user-display-name-pointer {
            cursor: pointer;
        }

        // 显示名称加粗
        .user-display-name,
        .user-display-name-pointer {
            font-size: 14px;
            margin-right: 5px;
            font-weight: 700;
        }
    }

    .user-time {
        color: var(--jpz-text-color-secondary);
        font-size: 12px;
        line-height: 1.5em;
    }
}

.user-is-post-author {
    padding: 0 4px;
    background-color: var(--jpz-color-secondary);
    color: var(--jpz-text-color-primary);
    border-radius: 4px;
    font-size: 12px;
    line-height: 1.5em;
    display: inline-block;
    font-weight: 700;
}

// @include respond-to("pc") {
// }

// @include respond-to("pad") {
// }

// @include respond-to("phone") {
// }
</style>
