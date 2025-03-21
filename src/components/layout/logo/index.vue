<!--
 * FilePath    : blog-client\src\components\layout\logo\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 头部 logo
-->

<template>
    <div class="logo-container">
        <router-link :to="{ name: RouteNames.Home }">
            <img class="logo" v-if="logo" :src="logo" :alt="RouteNames.Home" />
        </router-link>
    </div>
</template>

<script setup lang="ts">
import { RouteNames } from "@/router"
import { useOptionsStore } from "@/stores/options"

defineOptions({ name: "HeaderLogo" })

const optionsStore = useOptionsStore()
const logo = optionsStore.getLogo
</script>

<style scoped lang="scss">
.logo-container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    cursor: pointer;
    @include respond-to("pad") {
        margin-left: 10px;
    }
}

.logo {
    width: auto;
    @include respond-to("pc") {
        height: pc.$height-header-logo;
    }

    @include respond-to("pad") {
        height: pad.$height-header-logo;
    }

    @include respond-to("phone") {
        height: phone.$height-header-logo;
    }
}
</style>
