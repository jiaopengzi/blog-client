<!--
 * FilePath    : blog-client\src\views\home\main-content\post-detail\component\bottom-same\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 文末固定内容
-->

<template>
    <div class="container" v-if="isShow" v-html="content"></div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia"
import { computed } from "vue"

import { convert } from "@/api/setting/getAPPOption"
import { useOptionsStore } from "@/stores/options"

defineOptions({ name: "DetailBottomSame" })

const optionsStore = useOptionsStore()

const { app_options: opt } = storeToRefs(optionsStore)

const isShow = computed(() => {
    if (opt.value) {
        return convert(opt.value.article_footer_info_enable)
    } else {
        return false
    }
})

const content = computed(() => {
    if (opt.value) {
        return convert(opt.value.article_footer_info)
    } else {
        return ""
    }
})
</script>

<style lang="scss" scoped>
.container {
    color: var(--jpz-text-color-primary);
    margin: 10px 0;
}
</style>
