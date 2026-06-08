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
            <h4 v-if="col.isHeading" :class="{ 'heading-clickable': !!col.onHeadingClick }" @click="col.onHeadingClick && col.onHeadingClick(scope.row)">
                {{ scope.row[col.prop] }}
            </h4>

            <!-- 标题包含标题ID -->
            <div v-if="col.isHeadingWithId" class="title-with-id-wrap">
                <el-button @click="handleViewWithID(scope.row)" class="title-with-id" type="">{{ scope.row[col.prop] }}</el-button>
                <!-- 复制标题按钮, 复用通用复制按钮组件 -->
                <CopyButton :text="String(scope.row[col.prop] ?? '')" />
            </div>

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

            <!-- 可点击标签: 多分类多标签时自动换行平铺, 不再使用滚动条 -->
            <div v-if="col.isTags || col.isCategories" class="tag-wrap">
                <!-- 注意 key 需要使用 id + 文章数量 -->
                <TagItem
                    v-for="item in getSortedTagItems(scope.row)"
                    :tag-data="item"
                    :is-admin="true"
                    :key="item.id + item.post_count_admin"
                    @click="handleTagClick(item)"
                />
            </div>

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
import CopyButton from "@/components/common/copy-button"
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

/**
 * 获取当前单元格要渲染的分类或标签列表.
 * @param row - 当前行数据.
 * @returns 按列配置排序后的分类或标签列表.
 */
const getSortedTagItems = (row: TableData): Array<PostCategory | PostTag> => {
    const rawItems = Reflect.get(row, String(col.prop))

    if (!Array.isArray(rawItems)) {
        return []
    }

    const taxonomyItems = rawItems as Array<PostCategory | PostTag>

    if (!col.itemSorter) {
        return taxonomyItems
    }

    return col.itemSorter(taxonomyItems)
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

// 标题列容器: 标题文本与复制按钮纵向排列, 复制按钮位于标题正下方
.title-with-id-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    width: 100%;
    box-sizing: border-box;
}

.title-with-id {
    font-weight: bold;
    text-align: center;
    user-select: text;
    border: none;
    background-color: transparent;
    line-height: 1.5;
    width: 100%;
    height: auto;
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    // 标题为关键信息, 全量显示不截断; 使用块级容器配合自动换行
    display: block;
    // 自动换行, 优先在词边界换行, 避免生硬拆字
    white-space: normal;
    word-break: break-word;
    color: var(--jpz-text-color-primary);
    transition: color 0.2s ease;

    // hover 时标题变为主色, 保持背景透明避免默认按钮高亮
    &:hover,
    &:focus {
        background-color: transparent;
        color: var(--jpz-color-primary);
    }

    // el-button 内部文本被包裹在 display:inline-flex 的 span 中, 直接在按钮上加 text-decoration 不会生效;
    // 需穿透到内部 span 并将其改为 inline 才能让下划线渲染, 更显著地提示 hover 可点击效果.
    :deep(span) {
        display: inline;
    }

    &:hover :deep(span),
    &:focus :deep(span) {
        text-decoration: underline;
        text-underline-offset: 3px;
    }
}

.heading-clickable {
    color: var(--el-color-primary);
    cursor: pointer;

    &:hover {
        text-decoration: underline;
    }
}

// 分类/标签容器: flex 换行平铺, 居中对齐, 支持多分类多标签自适应换行
.tag-wrap {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    width: 100%;
    box-sizing: border-box;
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
