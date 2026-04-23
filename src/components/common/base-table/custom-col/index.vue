<!--
 * @FilePath     : \blog-client\src\components\common\base-table\custom-col\index.vue
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
 * @Description  : 自定义列 
-->

<template>
    <el-table-column :width="col.width" :min-width="col.minWidth" :align="col.align" :label="col.label">
        <template #default="scope">
            <!-- 标题 -->
            <h4
                v-if="col.isHeading"
                :class="{ 'heading-clickable': !!col.onHeadingClick }"
                @click="col.onHeadingClick && col.onHeadingClick(scope.row)"
            >
                {{ scope.row[col.prop] }}
            </h4>

            <!-- 标题包含标题ID -->
            <el-button v-if="col.isHeadingWithId" @click="handleViewWithID(scope.row)" class="title-with-id" type="">{{ scope.row[col.prop] }}</el-button>

            <!-- 作者 -->
            <UserItem
                v-if="col.isUser"
                :key="scope.row[col.prop].id"
                :user="scope.row[col.prop]"
                :is-show-cursor-pointer="isShowCursorPointer"
                :is-show-user-name="isShowUserName"
                :size="avatarWidth"
                :is-show-user-email="isShowUserEmail"
                :is-show-user-display-name="isShowUserDisplayName"
                :comment-is-post-author-code="scope.row['is_post_author']"
                @user-click="(userID: string) => handleUserClick(userID, scope.row[col.prop])"
            />

            <!-- 需要复制的文本(支持 formatter 格式化显示) -->
            <CopyText
                v-if="col.isCopyText"
                :key="scope.row[col.prop]"
                :text="String(scope.row[col.prop] ?? '')"
                :display-text="col.formatter ? String(col.formatter(scope.row) ?? '') : undefined"
                :placeholder="col.copyPlaceholder"
            />

            <!-- markdown渲染 -->
            <div class="markdown-preview" v-if="col.isMarkdownPreview" :style="{ maxHeight: markdownPreviewMaxHeight }">
                <CommentMarkdownPreview :markdown-content="scope.row[col.prop]" :key="`${scope.row['id']}-${scope.row[col.prop]}`" />
            </div>

            <!-- 评论文章信息 -->
            <CommentPostItem
                v-if="col.isCommentWithPost"
                :key="`${scope.row[col.prop]}`"
                :post="scope.row[col.prop]"
                :is-admin="col.isCommentWithAdmin"
                @post-click="handlePostClick"
                @view-post="handleViewPost"
            />

            <!-- 可点击标签 -->
            <el-scrollbar v-if="col.isTags || col.isCategories" :style="{ maxHeight: tagsItemMaxHeight }">
                <!-- 注意 key 需要使用 id + 文章数量 -->
                <TagItem
                    v-for="item in scope.row[col.prop]"
                    :tag-data="item"
                    :is-admin="true"
                    :key="item.id + item.post_count_admin"
                    @click="handleTagClick(item)"
                />
            </el-scrollbar>

            <!-- 可滚动的格式化文本 -->
            <div v-if="col.isScrollFormatter && col.formatter && !col.isCopyText" class="scroll-formatter-box" :style="{ maxHeight: tagsItemMaxHeight }">
                <div class="scroll-formatter-text">{{ col.formatter(scope.row) }}</div>
            </div>

            <!-- 格式化(isCopyText 时由 CopyText 组件负责显示, 此处不重复渲染) -->
            <span v-if="col.formatter && !col.isCopyText && !col.isScrollFormatter">{{ col.formatter(scope.row) }}</span>
        </template>
    </el-table-column>
</template>

<script lang="ts" setup>
import type { PostCategory } from "@/api/postCategory/view"
import type { PostTag } from "@/api/postTag/view"
import type { User } from "@/api/user/getUsers"
import CommentMarkdownPreview from "@/components/common/comment-markdown-preview"
import CommentPostItem from "@/components/common/comment-post-item"
import CopyText from "@/components/common/copy-text"
import TagItem from "@/components/common/tag-item"
import UserItem from "@/components/common/user-item"

import type { TableColumn, TableData } from "../types"

defineOptions({ name: "CustomCol" })

const {
    col,
    tagsItemMaxHeight = "100px", // 标签项目最大高度
    markdownPreviewMaxHeight = "200px", // markdown 预览最大高度

    avatarWidth = 30,
    isShowUserName = false,
    isShowUserEmail = false,
    isShowUserDisplayName = true,
    isShowCursorPointer = false,
} = defineProps<{
    col: TableColumn
    tagsItemMaxHeight?: string // 标签项目最大高度

    avatarWidth?: number // 用户头像宽度
    isShowUserName?: boolean // 是否显示用户名
    isShowUserEmail?: boolean // 是否显示用户邮箱
    isShowUserDisplayName?: boolean // 是否显示用户昵称
    isShowCursorPointer?: boolean // 是否显示鼠标指针为手型

    markdownPreviewMaxHeight?: string // markdown 预览最大高度
}>()

const emit = defineEmits<{
    (event: "click-item", item: PostCategory | PostTag): void
    (event: "click-author", user: User): void
    (event: "post-click", postID: string): void
    (event: "view-post", postID: string): void
}>()

const handleTagClick = (item: PostCategory | PostTag) => {
    emit("click-item", item)
}

// 处理作者点击事件
const handleUserClick = (userID: string, user: User) => {
    if (!col.isUser || userID !== user.id.toString()) {
        return
    }

    emit("click-author", user)
}

// 处理文章点击事件
const handlePostClick = (postID: string) => {
    emit("post-click", postID)
}

// 处理查看文章事件
const handleViewPost = (postID: string) => {
    emit("view-post", postID)
}

// 处理带有 ID 的查看文章事件
const handleViewWithID = (row: TableData) => {
    if (!row || !row.id) {
        return
    }
    // 有文字选中时不触发跳转，让用户可以复制
    const selection = window.getSelection()
    if (selection && selection.toString().length > 0) {
        return
    }
    emit("view-post", row.id)
}
</script>

<style lang="scss" scoped>
.markdown-preview {
    overflow: auto;
    padding: 4px;
}

.title-with-id {
    font-weight: bold;
    text-align: center;
    user-select: text;
    border: none;
    background-color: transparent;
    line-height: 1.5;
    width: 100%;
    max-height: 100px;
    min-height: 50px;
    overflow-y: auto;
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    // 防止按钮拉伸到整行
    display: inline-block;
    // 自动换行
    white-space: normal;
    // 长文本换行
    word-break: break-all;
}

.heading-clickable {
    color: var(--el-color-primary);
    cursor: pointer;

    &:hover {
        text-decoration: underline;
    }
}

.scroll-formatter-text {
    white-space: pre-wrap;
    word-break: break-all;
    line-height: 1.65;
    text-align: left;
    width: 100%;
    box-sizing: border-box;
    padding-right: 8px;
}

.scroll-formatter-box {
    width: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    box-sizing: border-box;
    scrollbar-gutter: stable;
}

.scroll-formatter-box::-webkit-scrollbar {
    width: 6px;
}

.scroll-formatter-box::-webkit-scrollbar-thumb {
    background-color: rgba(24, 39, 75, 0.28);
    border-radius: 999px;
}

.scroll-formatter-box::-webkit-scrollbar-track {
    background-color: rgba(24, 39, 75, 0.08);
    border-radius: 999px;
}
</style>
