<!--
 * @FilePath     : \blog-client\src\components\common\post-item-main\index.vue
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
 * @Description  : 单个主文章组件
-->

<template>
    <div class="post-item" @click="handlePostItemClick">
        <!-- 左上角提示符 -->
        <div class="top-left-tip"></div>

        <!-- 右上角提示符 -->
        <div class="top-right-tip" v-if="topRightTip">{{ topRightTip }}</div>

        <!-- 左上角分类 -->
        <el-button class="category" plain @click="clickCategory(postData.categories[0]!)">{{ postData.categories[0]!.name }}</el-button>

        <!-- 缩略图 -->
        <div class="thumbnail">
            <PostThumbnail :src="postData.thumbnail" class="thumbnail-img" :initial="fallbackInitial" theme="main" @click="handleThumbnailClick" />
        </div>

        <!-- 文章摘要内容 -->
        <div class="content">
            <!-- 标题 -->
            <h2 class="title-row">
                <span class="title" @click="handleTitleClick">
                    <!-- 置顶 / 私密 标识使用 float:left, 仅占用第一行宽度;
                         标题第二、第三行的文字会左对齐贴边显示, 不再被标识左侧空白挤压. -->
                    <span class="pinned" v-if="postData.is_pinned">置顶</span>
                    <span class="pinned" v-if="postData.post_status === PostStatusCode.Private">私密</span>
                    <span class="title-text">{{ postData.post_title }}</span>
                </span>
            </h2>

            <!-- 摘要文字 -->
            <div class="summary">
                <p>{{ postData.seo_description.slice(0, postListSummaryTruncate) }} ...</p>
            </div>

            <!-- 作者 日志 访问量 -->
            <PostMeta :meta="postMeta" :is-hide-time-icon="isHideTimeIcon" :is-set-time-margin="isSetTimeMargin" @author-user-name="clickAuthorUserName" />
        </div>

        <!-- 阅读跳转 -->
        <el-button class="read-more" plain @click="handleReadMoreClick">阅读全文</el-button>
    </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia"
import { computed } from "vue"
import { useRouter } from "vue-router"

import { type PostResPagination, PostStatusCode } from "@/api/post/common"
import { type PostCategory } from "@/api/postCategory/view"
import PostMeta, { type PostMetaProps } from "@/components/common/post-meta"
import PostThumbnail from "@/components/common/post-thumbnail"
import { DeviceType, useDeviceStore } from "@/stores/device"
import { RouteNames } from "@/router"

defineOptions({ name: "PostItemMain" })

const {
    postData,
    postListSummaryTruncate = 100,
    isHideTimeIcon = false,
    isSetTimeMargin = false,
} = defineProps<{
    postData: PostResPagination
    postListSummaryTruncate?: number
    isHideTimeIcon?: boolean
    isSetTimeMargin?: boolean
}>()

const fallbackInitial = computed(() => postData.post_title?.trim().slice(0, 1).toUpperCase() || "P")

// 设备类型
const deviceStore = useDeviceStore()
const { device } = storeToRefs(deviceStore)
const router = useRouter()

// 文章元数据
const postMeta = computed(() => {
    const data: PostMetaProps = {
        created_at: postData.created_at,
        formatStr: "YYYY-MM-DD",
        view_count: postData.view_count,
        author_avatar: postData.author_info.user_avatar,
        author_user_name: postData.author_info.user_name,
        author_display_name: postData.author_info.user_display_name,
        avatar_size: device.value === DeviceType.PHONE ? 18 : 24, // 头像大小: phone 端 18px, 其他 24px
        author_id: postData.author_info.id,
        is_show_read_time: false, // 是否显示阅读时间
    }

    if (device.value === DeviceType.PC || device.value === DeviceType.PAD) {
        data.comment_count = postData.comment_count
        data.like_count = postData.like_count
        data.star_count = postData.star_count
    }
    return data
})

// 事件
const emit = defineEmits<{
    (event: "clickCategory", val: PostCategory): void
    (event: "postId", val: string): void
    (event: "author-user-name", val: string): void
}>()

// 点击分类
const clickCategory = (val: PostCategory) => {
    emit("clickCategory", val)
}

// 点击文章
const postId = (val: string) => {
    emit("postId", val)
}

/**
 * 处理文章卡片点击, 仅在 phone 和 pad 端触发文章跳转.
 * 若点击目标位于 button 内, 则保留该按钮原有交互.
 */
const handlePostItemClick = (event: MouseEvent) => {
    if (device.value !== DeviceType.PHONE && device.value !== DeviceType.PAD) {
        return
    }

    const target = event.target
    if (target instanceof HTMLElement && target.closest("button")) {
        return
    }

    postId(postData.id)
}

/**
 * 处理缩略图点击, 保持 PC, pad, phone 三端行为一致.
 */
const handleThumbnailClick = () => {
    postId(postData.id)
}

/**
 * 处理标题点击, PC 端保持原有直接跳转行为.
 */
const handleTitleClick = () => {
    if (device.value === DeviceType.PC) {
        postId(postData.id)
    }
}

/**
 * 处理阅读全文按钮点击, 保持原有直接跳转行为.
 */
const handleReadMoreClick = () => {
    postId(postData.id)
}

// 点击作者
const clickAuthorUserName = (val: string) => {
    router.push({
        name: RouteNames.UserPublicProfile,
        params: { username: val },
    })
}

// 右上角提示符内容
const topRightTip = computed(() => {
    // 判断 postData 中创建时间是否在 7 天内,显示 NEW
    const createTime = new Date(postData.created_at).getTime()
    const nowTime = new Date().getTime()
    const diffTime = nowTime - createTime
    const diffDay = diffTime / (1000 * 60 * 60 * 24)
    if (diffDay <= 7) {
        return "NEW"
    }

    return ""
})
</script>
<style lang="scss" scoped>
// 公共样式
.post-item {
    position: relative;
    padding: 15px;
    background-color: var(--jpz-bg-color);
    overflow: hidden;

    &:hover {
        // 鼠标移动到 .post-item 上时, .post-item 出现上下阴影
        // box-shadow: var(--jpz-post-item-main-hover-shadow);
        .read-more {
            opacity: 1;
        }
    }
}

.top-left-tip {
    position: absolute;
    top: 10px;
    left: 0;
    line-height: 200%;
    font-size: 14px;
    background-color: transparent;
    border-radius: 5%;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;

    // 使用 ::before 伪元素添加红色外边框和绿色内边框
    &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0; // 使得红色外边框在 .tip 的左侧
        height: 28px;
        border-right: 6px solid var(--jpz-color-primary);
    }
}

.post-item:hover .top-left-tip {
    opacity: 1;
}

.category {
    position: absolute;
    top: 10px;
    left: 20px;
    padding-left: 10px;
    padding-right: 10px;
    z-index: 2;
    background-color: var(--jpz-color-primary);
    line-height: 200%;
    font-size: 14px;
    color: var(--jpz-bg-color);
    border-radius: 5%;
    font-weight: 500;
    border: none;
}

.thumbnail {
    float: left;
    height: 100%;
    box-sizing: border-box;
    overflow: hidden;
    border-radius: 4px;
    border: 1px solid var(--jpz-border-color);

    .thumbnail-img {
        width: 100%;
        height: 100%;
        background-size: cover;
        transition: transform 0.3s ease;
        cursor: pointer;
    }

    &:hover .thumbnail-img {
        // 鼠标移动到 .thumbnail 上时, .thumbnail-img 放大
        transform: scale(1.2);
    }
}

.content {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.title-row {
    // 不再使用 flex: 让 .title 成为正常块级容器, 内部的 .pinned (float:left)
    // 才能让标题文本仅在第一行环绕, 后续行回到左对齐.
    display: block;
    margin: 0;
    font-size: 14px;
    font-weight: 500;
    border: 0;
    padding: 0;
}

.title {
    cursor: pointer;
    display: block;
    overflow: hidden;
    color: var(--jpz-text-color-primary);

    // 当鼠标移动到 .title 上时, .title 的颜色变为 var(--jpz-color-primary)
    &:hover {
        color: var(--jpz-color-primary);
    }
}

.title-text {
    // 提供 hover 时的下划线渐变效果, 与原标题视觉一致
    background: linear-gradient(to right, var(--jpz-text-color-primary), var(--jpz-color-primary)) no-repeat;
    background-position: right bottom;
    transition: background-size 0.3s ease;
    background-size: 0 2px;

    .title:hover & {
        background-position: left bottom;
        background-size: 100% 2px;
    }
}

.pinned {
    // 使用 float:left 让标识只占用第一行宽度, 第二、第三行文字回到左对齐
    float: left;
    padding: 0px 6px; //手动调整位置
    margin-top: 2px;
    margin-right: 5px;
    background-color: var(--jpz-color-secondary);
    color: var(--jpz-text-color-primary);
    border-radius: 2px;
    font-size: 0.8em;
    font-weight: 700;
    line-height: 1.5;
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

.summary {
    margin-top: 5px;
    flex-grow: 1;
    color: var(--jpz-text-color-secondary);
    line-height: 1.5em;
    font-size: 14px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
}

.read-more {
    position: absolute;
    right: 10px;
    bottom: 10px;
    z-index: 2;
    padding: 5px 10px;
    border-radius: 5px;
    background-color: var(--jpz-color-primary);
    color: var(--jpz-bg-color);
    line-height: 150%;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
}

// 媒体查询
@include respond-to("pc") {
    .post-item {
        height: 150px;
        padding: 20px;

        .read-more {
            opacity: 0;
        }
    }

    .thumbnail {
        width: 200px;
    }

    .content {
        margin-left: 210px;
    }

    .title {
        // 标题最多 2 行: 使用 max-height + overflow:hidden 简单截断,
        // 与浮动的 .pinned (置顶/私密) 标识共存, 标识只占第一行, 后续行左对齐.
        font-size: 16px;
        font-weight: 700;
        line-height: 1.5em;
        max-height: calc(1.5em * 2);
        word-break: break-word;
    }

    .summary {
        height: 2em;
        line-clamp: 4;
        -webkit-line-clamp: 4; // 限制行数为4
    }
}

@include respond-to("pad") {
    .post-item {
        height: 75px;

        .category,
        .summary,
        .read-more {
            display: none;
        }
    }

    .thumbnail {
        width: 100px;
    }

    .content {
        margin-left: 110px;
    }

    .title {
        // 标题最多 2 行: 使用 max-height + overflow:hidden 简单截断,
        // 与浮动的 .pinned (置顶/私密) 标识共存, 标识只占第一行, 后续行左对齐.
        font-weight: 700;
        line-height: 1.5em;
        max-height: calc(1.5em * 2);
        word-break: break-word;
    }
}

@include respond-to("phone") {
    // 手机端: 卡片高度由缩略图 (128x96px) 与内容区共同决定, 内容区拉伸填满卡片高度.
    .post-item {
        height: auto;
        padding: 10px 8px 9px 8px;
        display: flex;
        align-items: stretch;
        gap: 12px;
        .category,
        .summary,
        .read-more {
            display: none;
        }
    }

    .thumbnail {
        // 宽高比固定为 128x96px, align-self: center 使图片在卡片高度方向居中.
        // 建议 2: 圆角收小至 4px, 加轻微阴影增强层次感.
        float: none;
        flex: 0 0 128px;
        width: 128px;
        height: 96px;
        align-self: center;
        border-radius: 4px;
        box-shadow: var(--jpz-box-shadow-lighter);

        .thumbnail-img {
            height: 100%;
        }
    }

    .content {
        // 覆盖全局 height:100%, 依靠 flex stretch 撑满卡片高度,
        // 使 justify-content:space-between 将 PostMeta 始终置于底部.
        height: auto;
        margin-left: 0;
        flex: 1 1 auto;
        min-width: 0;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 8px;
    }

    .title {
        // 最多 3 行, 超出显示省略号; .pinned (float:left) 仅占首行,
        // 第 2、3 行文字回到左对齐顶格显示.
        font-size: 14px;
        font-weight: 600;
        line-height: 1.5em;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        line-clamp: 3;
        -webkit-line-clamp: 3;
        overflow: hidden;
        text-overflow: ellipsis;
        word-break: break-word;
        color: var(--jpz-text-color-primary);
    }
}
</style>
