<template>
    <div>
        <VideoTocItem />
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue"

import VideoTocItem from "@/components/common/video-toc-chapter"

defineOptions({ name: "MyTest" })

const items = ref([
    { order: 1, text: "介绍", orderTotal: 3 },
    { order: 2, text: "安装", orderTotal: 3 },
    { order: 3, text: "使用", orderTotal: 3 },
])
</script>
