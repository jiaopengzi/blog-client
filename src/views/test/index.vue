<template>
    <!-- 编辑器 -->
    <PosterShare class="poster-share" :data="dataPosterShare" />
</template>
<script setup lang="ts">
defineOptions({ name: "MyTest" })
import PosterShare from "@/components/common/poster-share"

const dataPosterShare = {
    logoSrc: "http://10.10.2.222:7364/api/v1/uploads/2026/03/10/p-15-e657695a.png", // 优先使用 favicon, 其次是 logo, 如果都没有则传空字符串
    imgSrc: "https://image.jiaopengzi.com/hello-world.png",
    titleText: "Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World 中文中文中文中文",
    urlText: "http://10.10.2.222:7364/?post_id=1001",
}
</script>

<style scoped lang="scss">
.content {
    padding: 20px;
}
</style>
