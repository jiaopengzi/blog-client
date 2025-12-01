<!--
 * @FilePath     : \blog-client\src\components\common\post-item-main\index.vue
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
 * @Description  : 单个主文章组件
-->

<template>
    <div class="post-item">
        <!-- 左上角提示符 -->
        <div class="top-left-tip"></div>

        <!-- 右上角提示符 -->
        <div class="top-right-tip" v-if="topRightTip">{{ topRightTip }}</div>

        <!-- 左上角分类 -->
        <el-button class="category" plain @click="clickCategory(postData.categories[0]!)">{{ postData.categories[0]!.name }}</el-button>

        <!-- 缩略图 -->
        <div class="thumbnail">
            <el-image :src="postData.thumbnail" class="thumbnail-img" loading="lazy" @click="postId(postData.id)"> </el-image>
        </div>

        <!-- 文章摘要内容 -->
        <div class="content">
            <!-- 标题 -->
            <h2 class="title-row">
                <span class="pinned" v-if="postData.is_pinned">置顶</span><span class="pinned" v-if="postData.post_status === PostStatusCode.Private">私密</span
                ><span class="title" @click="postId(postData.id)">{{ postData.post_title }}</span>
            </h2>

            <!-- 摘要文字 -->
            <div class="summary">
                <p>{{ postData.seo_description.slice(0, postListSummaryTruncate) }} ...</p>
            </div>

            <!-- 作者 日志 访问量 -->
            <PostMeta :meta="postMeta" @author-id="clickAuthorId" />
        </div>

        <!-- 阅读跳转 -->
        <el-button class="read-more" plain @click="postId(postData.id)">阅读全文</el-button>
    </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia"
import { computed } from "vue"

import { type PostResPagination, PostStatusCode } from "@/api/post/common"
import { type PostCategory } from "@/api/postCategory/view"
import PostMeta, { type PostMetaProps } from "@/components/common/post-meta"
import { DeviceType, useDeviceStore } from "@/stores/device"

defineOptions({ name: "PostItemMain" })

const { postData, postListSummaryTruncate = 100 } = defineProps<{
    postData: PostResPagination
    postListSummaryTruncate?: number
}>()

// 设备类型
const deviceStore = useDeviceStore()
const { device } = storeToRefs(deviceStore)
// 文章元数据
const postMeta = computed(() => {
    const data: PostMetaProps = {
        created_at: postData.created_at,
        formatStr: "YYYY-MM-DD",
        view_count: postData.view_count,
        author_avatar: postData.author_info.user_avatar,
        author_display_name: postData.author_info.user_display_name,
        avatar_size: 24, // 头像大小，默认 24px
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
    (event: "author-id", val: string): void
}>()

// 点击分类
const clickCategory = (val: PostCategory) => {
    emit("clickCategory", val)
}

// 点击文章
const postId = (val: string) => {
    emit("postId", val)
}

// 点击作者
const clickAuthorId = (val: string) => {
    emit("author-id", val)
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
    display: flex;
    align-items: center; // 垂直居中
    margin: 0;
    font-size: 14px;
    font-weight: 500;
    color: var(--jpz-text-color-primary);
    border: 0;
    padding: 0;
    line-height: 2em;
    overflow: hidden;
    text-overflow: ellipsis;
}

.title {
    cursor: pointer;
    flex: 1; // 使标题占据剩余空间
    display: flex;
    align-items: center; // 垂直居中
}

// 当鼠标移动到 .title 上时, .title 的颜色变为 var(--jpz-color-primary)
.title:hover {
    color: var(--jpz-color-primary);
}

.pinned {
    padding: 0 6px;
    margin-right: 5px;
    background-color: var(--jpz-color-secondary);
    color: var(--jpz-text-color-primary);
    border-radius: 2px;
    font-size: 0.9em;
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

        .tip,
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
        font-size: 16px;
        font-weight: 700;
        height: 2em;
        -webkit-line-clamp: 1; // 限制行数为1
    }

    .summary {
        height: 2em;
        -webkit-line-clamp: 4; // 限制行数为4
    }
}

@include respond-to("pad") {
    .post-item {
        height: 75px;

        .tip,
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
        height: 4em;
        -webkit-line-clamp: 2; // 限制行数为2
    }
}

@include respond-to("phone") {
    .post-item {
        height: 75px;

        .tip,
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
        height: 4em;
        -webkit-line-clamp: 2; // 限制行数为2
    }
}
</style>
