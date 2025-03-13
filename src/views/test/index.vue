<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-09-29 10:52:39
 * @LastEditors  : Please set LastEditors
 * @LastEditTime : 2025-03-13 17:53:38
 * @FilePath     : \blog-client\src\views\test\index.vue
 * @Description  : 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->
<template>
    <div class="container">
        <ImageInput v-model="u" />
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue"

import ImageInput from "@/components/common/image-input"

defineOptions({ name: "MyTest" })

const u = ref("http://10.10.2.222:7364/api/v1/uploads/2025/03/13/j-3-08959f82.jpg")
</script>

<style scoped lang="scss">
// 让视频播放器水平垂直居中
.container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}
</style>
