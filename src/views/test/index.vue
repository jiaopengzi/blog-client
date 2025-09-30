<template>
    <div class="container">
        <VideoTocTreeEdit :tree-list="dataSource" @tree-update="handleUpdate" />
    </div>
    <div>
        <VideoTocTreeDisplay :tree-list="dataSource" />
    </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"

import { type Tree } from "@/components/common/video-toc-tree-base"
import VideoTocTreeDisplay from "@/components/common/video-toc-tree-display"
import VideoTocTreeEdit from "@/components/common/video-toc-tree-edit"

defineOptions({ name: "MyTest" })

const dataSource = ref<Tree[]>([
    {
        id: 1,
        label: "目录",
        is_chapter: true,
    },
])

const handleUpdate = (val: Tree[]) => {
    dataSource.value = val
    console.log("============>val", val)
}
</script>

<style>
.container {
    margin-bottom: 20px;
    width: 1000px;
}
</style>
