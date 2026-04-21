<!--
 * FilePath    : blog-client\src\components\common\post-detail\components\comment-list\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 评论列表
-->

<template>
    <div class="comment-list-container" v-if="pagination.total > 0">
        <div class="comment-list">
            <div v-for="item in pagination.records" :key="item.id" class="comment-item">
                <CommentItem
                    :data="item"
                    :status="status"
                    :post-id="postId"
                    :post-author="postAuthor"
                    :is-admin="isAdmin"
                    @reply="handleReply"
                    @delete="handleDelete"
                    @pinned="handlePinned"
                />
            </div>
        </div>
        <!-- 分页 -->
        <div class="pagination-container" v-if="pagination.page_count > 1">
            <div class="loader" v-show="isShowLoading"></div>
            <div class="pagination-block" ref="paginationBlockRef">
                <!-- 注意这里使用 v-model 双向绑定, 会造成意外的触发在 update 中手动更新 -->
                <el-pagination
                    :current-page="pagination.current_page"
                    :page-size="pagination.page_size"
                    :page-sizes="pagination.page_sizes"
                    :page-count="pagination.page_count"
                    :total="pagination.total"
                    :background="true"
                    :layout="paginationLayout"
                    size="small"
                    @update:current-page="updateCurrentPage"
                    @update:page-size="updatePageSize"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { Completion } from "@codemirror/autocomplete"
import { onBeforeMount, reactive, watch } from "vue"

import { type CommentRes } from "@/api/comment/common"
import { type ViewCommentRequest } from "@/api/comment/viewByPostID"
import { useDevice } from "@/components/hooks/useDevice"

import CommentItem from "./comment-item/index.vue"
import { useCommentList } from "./hooks"
import type { CommentListProps } from "./types"

defineOptions({ name: "CommentList" })

// 定义 props
const { postId, postAuthor, status, updateTime, isAdmin = false } = defineProps<CommentListProps>()

// 事件
const emit = defineEmits<{
    (event: "reply", comment: CommentRes): void
    (event: "mentions", mentions: Completion[]): void
}>()

const req = reactive<ViewCommentRequest>({ post_id: postId })

const { paginationLayout } = useDevice()

const {
    pagination, // 分页数据
    updateCurrentPage, // 更新当前页
    updatePageSize, // 更新每页显示条数
    updatePaginate, // 更新分页
    mentions, // @ 提及数据
    isShowLoading, // 是否显示加载动画
    handleDelete, // 处理删除
    handlePinned, // 处理置顶
} = useCommentList(req)

// 处理回复
const handleReply = (commentID: string) => {
    // 从评论列表中获取评论
    const comment = pagination.records.find((item) => item.id === commentID)
    if (!comment) return
    emit("reply", comment)
}

// 更新数据
const updateData = async () => {
    await updatePaginate()
    emit("mentions", mentions.value)
}

// 根据时间戳更新分页
watch(
    () => updateTime,
    async () => {
        await updateData()
    },
)

// 文章变化时更新分页
watch(
    () => postId,
    async (newVal) => {
        req.post_id = newVal
        await updateData()
    },
)

onBeforeMount(async () => {
    await updateData()
})
</script>
<style lang="scss" scoped>
.comment-list {
    font-size: 14px;
    margin-top: 10px;
}

@include respond-to("pc") {
}

@include respond-to("pad") {
    .comment-list-container {
        margin-left: 10px;
        margin-right: 10px;
    }
}

@include respond-to("phone") {
    .comment-list-container {
        margin-left: 10px;
        margin-right: 10px;
    }
}

.pagination-container {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.pagination-block {
    display: flex;
    justify-content: center;
    margin: 10px;
}

/* 参考:https://css-loaders.com/dots/ */
.loader {
    width: 60px;
    aspect-ratio: 3;
    --_g: no-repeat radial-gradient(circle closest-side, var(--jpz-color-primary) 90%, #0000);
    background:
        var(--_g) 0% 50%,
        var(--_g) 50% 50%,
        var(--_g) 100% 50%;
    background-size: calc(100% / 3) 50%;
    animation: l3 1s infinite linear;
    margin-top: 20px;
}
@keyframes l3 {
    20% {
        background-position:
            0% 0%,
            50% 50%,
            100% 50%;
    }
    40% {
        background-position:
            0% 100%,
            50% 0%,
            100% 50%;
    }
    60% {
        background-position:
            0% 50%,
            50% 100%,
            100% 0%;
    }
    80% {
        background-position:
            0% 50%,
            50% 50%,
            100% 100%;
    }
}
</style>
