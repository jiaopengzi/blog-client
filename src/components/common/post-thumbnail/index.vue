<!--
 * FilePath    : blog-client-nuxt\src\components\common\post-thumbnail\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 文章缩略图 (P0-5 nuxt4-good: @nuxt/image IPX 优化版)
-->

<!--
 * 补充说明:
 * 原 el-image 原图直出 → useImage() 构建 /_ipx 地址(png→webp, quality 80), 服务端转换后再下发
 * 加载失败回退首字母占位(等价原 el-image 的 error 插槽)
 * 本项目 components:false 禁用了 NuxtImg 自动注册, 故走 useImage composable(模块 addImports 不受 components 配置影响), 用原生 <img> 承载
-->

<template>
    <div class="post-thumbnail" :class="`post-thumbnail--${theme}`">
        <img v-if="hasSrc && !loadFailed" :src="thumbSrc" class="post-thumbnail__image" :loading="loading" alt="" @click="emitClick" @error="handleError" />
        <button v-else type="button" class="post-thumbnail__fallback" @click="emitClick">
            <span class="post-thumbnail__initial">{{ initial }}</span>
        </button>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue"

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

const { getImage } = useImage()

const hasSrc = computed(() => Boolean(src.trim()))

// IPX 转换失败(如源图 404/格式不支持)时回退原图地址, 由 <img> 的 error 再走首字母占位
const loadFailed = ref(false)

const thumbSrc = computed(() => {
    if (!hasSrc.value) {
        return ""
    }

    try {
        return getImage(src, { modifiers: { format: "webp", quality: 80 } }).url
    } catch {
        return src
    }
})

// 切换文章数据(列表复用组件)时重置失败态
watch(
    () => src,
    () => {
        loadFailed.value = false
    },
)

const handleError = () => {
    loadFailed.value = true
}

/**
 * emitClick 透传缩略图点击事件, 保持父组件交互语义一致
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
    object-fit: cover;
    cursor: pointer;
    transition: transform 0.3s ease;

    &:hover {
        transform: scale(1.2);
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
    // H3(占位符打磨): 收敛字号降低视觉权重, 与标题层级协调
    font-size: 32px;
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
