<!--
 * FilePath    : blog-client-nuxt\src\components\common\avatar-initials\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 头像
-->

<template>
    <div class="avatar" :style="avatarBgStyle">
        <p v-if="!props.avatar">{{ initials }}</p>
    </div>
</template>

<script lang="ts" setup>
import { computed } from "vue"

import type { AvatarInitialsProps } from "./types"

defineOptions({ name: "AvatarInitials" })

// 定义 props 参数 name 和 avatar 两个参数, name 为必传参数, avatar 为可选参数
const props = defineProps<AvatarInitialsProps>()

const initials = computed(() => (props.name ? props.name.charAt(0).toUpperCase() : ""))

const avatarBgStyle = computed(() => ({
    width: props.size ? `${props.size}px` : "50px",
    height: props.size ? `${props.size}px` : "50px",
    "border-radius": props.size ? `${props.size / 2}px` : "25px",
    "font-size": props.size ? `${props.size / 2 + 3}px` : "28px",
    backgroundImage: props.avatar ? `url(${props.avatar})` : "",
    backgroundColor: !props.avatar ? "#bbb" : "",
}))
</script>

<style lang="scss" scoped>
.avatar {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #888;
    color: var(--jpz-color-primary);
    font-weight: 700;
    background-size: cover;
    background-repeat: no-repeat; // 使用 cover 值, 根据容器大小自适应
}
</style>
