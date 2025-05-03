<!--
 * FilePath    : blog-client\src\views\test\index.vue
 * Description : 测试页面
-->
<template>
    <PosterShare :data="data" :is-show="isShow" />
    <button @click="clickBtn">分享</button>
</template>

<script lang="ts" setup>
import { ref } from "vue"

import PosterShare from "@/components/common/poster-share"

defineOptions({ name: "MyTest" })
const isShow = ref(false)

const clickBtn = () => {
    isShow.value = !isShow.value
}
const data = {
    logoSrc: "https://image.jiaopengzi.com/blog/uploads/logo/logo-108.ico",
    imgSrc: "https://image.jiaopengzi.com/blog/202310161114143.png",
    titleText: "185_技巧_Power Query(M)语言快捷输入之搜狗输入法设置自定义短语",
    urlText: "https://jiaopengzi.com/?post_id=81355993295946462",
    qrCodeSrc: "http://10.10.2.222:7364/api/v1/uploads/2025/05/03/p-1-1260b876.png",
}
</script>

<style scoped lang="scss"></style>
