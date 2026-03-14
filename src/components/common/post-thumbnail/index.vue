<!--
 * @FilePath     : \blog-client\src\components\common\post-thumbnail\index.vue
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 文章缩略图
-->

<template>
    <div class="post-thumbnail" :class="`post-thumbnail--${theme}`">
        <el-image v-if="hasSrc" :src="src" class="post-thumbnail__image" :loading="loading" @click="emitClick">
            <template #error>
                <button type="button" class="post-thumbnail__fallback" @click="emitClick">
                    <span class="post-thumbnail__initial">{{ initial }}</span>
                </button>
            </template>
        </el-image>
        <button v-else type="button" class="post-thumbnail__fallback" @click="emitClick">
            <span class="post-thumbnail__initial">{{ initial }}</span>
        </button>
    </div>
</template>

<script lang="ts" setup>
import { computed } from "vue"

defineOptions({ name: "PostThumbnail" })

const {
    src = "",
    initial,
    theme = "main",
    loading = "lazy",
} = defineProps<{
    src?: string
    initial: string
    theme?: "main" | "aside"
    loading?: "lazy" | "eager"
}>()

const emit = defineEmits<{
    (event: "click"): void
}>()

const hasSrc = computed(() => Boolean(src.trim()))

/**
 * emitClick 透传缩略图点击事件, 保持父组件交互语义一致.
 */
const emitClick = () => {
    emit("click")
}
</script>

<style lang="scss" scoped>
.post-thumbnail {
    width: 100%;
    height: 100%;
}

.post-thumbnail__image {
    width: 100%;
    height: 100%;
    display: block;
    cursor: pointer;

    &:hover {
        :deep(.el-image__inner) {
            transform: scale(1.2);
        }
    }

    :deep(.el-image__inner) {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
    }

    :deep(.el-image__wrapper) {
        width: 100%;
        height: 100%;
    }
}

.post-thumbnail__fallback {
    width: 100%;
    height: 100%;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    border: none;
    cursor: pointer;
    color: rgb(248 250 252);
}

.post-thumbnail--main .post-thumbnail__fallback {
    background: linear-gradient(160deg, var(--jpz-post-thumbnail-main-bg-start), var(--jpz-post-thumbnail-main-bg-end));
}

.post-thumbnail--aside .post-thumbnail__fallback {
    background: linear-gradient(160deg, var(--jpz-post-thumbnail-aside-bg-start), var(--jpz-post-thumbnail-aside-bg-end));
}

.post-thumbnail__initial {
    line-height: 1;
    font-weight: 800;
}

.post-thumbnail--main .post-thumbnail__initial {
    font-size: 42px;
    letter-spacing: 0.08em;
}

.post-thumbnail--aside .post-thumbnail__initial {
    font-size: 28px;
}

@include respond-to("pad") {
    .post-thumbnail--main .post-thumbnail__initial {
        font-size: 26px;
    }
}

@include respond-to("phone") {
    .post-thumbnail--main .post-thumbnail__initial {
        font-size: 26px;
    }
}
</style>
