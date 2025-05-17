<!--
 * FilePath    : blog-client\src\views\home\main-content\post-detail\component\copyright\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 版权信息
-->

<template>
    <div class="copyright" v-if="isShow">
        <AvatarInitials class="avatar" :avatar="data.author.avatar" :name="data.author.name" :size="data.author.size" />
        <div class="text">
            <p class="info">{{ copyrightInfo }}</p>
            <p class="post">{{ copyrightPost }}</p>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia"
import { computed } from "vue"

import { convert } from "@/api/setting/getAPPOption"
import AvatarInitials from "@/components/common/avatar-initials"
import { useOptionsStore } from "@/stores/options"

import type { CopyrightProps } from "./types"

defineOptions({ name: "DetailCopyright" })

// 定义 props
const { data } = defineProps<{ data: CopyrightProps }>()

const optionsStore = useOptionsStore()

const { app_options: opt } = storeToRefs(optionsStore)

const isShow = computed(() => {
    if (opt.value) {
        return convert(opt.value.show_copyright_enable)
    } else {
        return false
    }
})

const copyrightInfo = computed(() => {
    if (opt.value) {
        return convert(opt.value.show_copyright_info)
    } else {
        return ""
    }
})

const copyrightPost = computed(() => {
    const parts = []
    if (data.title) parts.push(`文章标题：${data.title}`)
    if (data.url) parts.push(`链接：${data.url}`)
    return parts.length ? `${parts.join("，")}。` : ""
})
</script>

<style lang="scss" scoped>
.copyright {
    // 网格布局
    display: grid;
    grid-template-columns: 40px 1fr; // 头像和文字的比例
    grid-template-rows: 1fr; // 头像和文字的高度相同
    grid-gap: 10px;
    align-items: center;
    margin-top: 10px;
    background-color: var(--jpz-bg-color);
    width: 100%;
    border-radius: 3px;
}

.avatar {
    margin: 10px;
}

.text {
    margin: 10px;
    font-size: 14px;
    line-height: 1.5;
    font-weight: 700;
    color: var(--jpz-text-color-secondary);
}
</style>
