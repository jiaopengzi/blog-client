<template>
    <div>
        <VideoTocTreeEdit :tree-list="dataSource" />
    </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"

import VideoTocTreeEdit, { type Tree } from "@/components/common/video-toc-tree-edit"

defineOptions({ name: "MyTest" })

const dataSource = ref<Tree[]>([
    {
        id: 1,
        label: "目录",
        isChapter: true,
    },
])
</script>

<style></style>
