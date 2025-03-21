<!--
 * FilePath    : blog-client\src\components\common\nav-item\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 导航栏 item
-->

<template>
    <!-- 使用 a 标签 -->
    <a v-if="item.href" :href="item.href" :target="item.target" class="link">
        <span class="left link-text" v-if="item.text_position === 'left'">{{ item.text }}</span>
        <img v-if="item.icon_src" :src="item.icon_src" :alt="item.icon_alt" class="icon-img" />
        <span class="right link-text" v-if="item.text_position === 'right'">{{ item.text }}</span>
    </a>

    <!-- 使用router-link -->
    <router-link v-if="item.RouteName" :to="{ name: item.RouteName }" class="link">
        <span class="left link-text" v-if="item.text_position === 'left'">{{ item.text }}</span>
        <j-icon v-if="item.iconKey" :name="item.iconKey" :custom-class="`my-icon ${item.customClass}`" />
        <span class="right link-text" v-if="item.text_position === 'right'">{{ item.text }}</span>
    </router-link>
</template>

<script lang="ts" setup>
import { type NavItemProps } from "./types"

defineOptions({ name: "IconNav" })

const { item } = defineProps<{ item: NavItemProps }>()
</script>

<style scoped lang="scss">
.link {
    display: flex;
    align-items: center;
    text-decoration: none;
    padding-left: 8px;
    padding-right: 8px;
    color: var(--jpz-text-color-primary);

    &:hover {
        background-color: var(--jpz-color-secondary);
    }

    .icon-img {
        width: 20px;
        height: 20px;
        margin-right: 4px;
    }

    .link-text {
        display: flex;
        align-items: center;
    }
}

.my-icon {
    font-size: 20px;
    fill: var(--jpz-text-color-primary);
    margin-right: 4px;
}
</style>
