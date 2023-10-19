<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-10-05 15:37:38
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-10-19 12:00:27
 * @FilePath     : \blog-client\src\components\common\InitialAvatar.vue
 * @Description  : 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved. 
-->
<template>
    <div class="avatar" :style="avatarBgStyle">
        <p v-if="!props.avatar">{{ initials }}</p>
    </div>
</template>
  
<script lang="ts" setup>
import { computed } from 'vue';

// 定义props 参数 name 和 avatar 两个参数 name 为必传参数 avatar 为可选参数
const props = defineProps({
    name: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        required: false,
    },
});

const initials = computed(() => (props.name ? props.name.charAt(0).toUpperCase() : '')); // 获取首字母

const avatarBgStyle = computed(() => ({
    backgroundImage: props.avatar ? `url(${props.avatar})` : '', // 设置背景图片
    backgroundColor: !props.avatar ? '#888' : '', // 设置背景颜色
}));
</script>
  
<style lang="less" scoped>
.avatar {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50px;
    height: 50px;
    border-radius: 25px;
    background-color: #888;
    color: @primary-color;
    font-size: 28px;
    font-weight: 700;
    background-size: cover;
    /* 使用cover值，根据容器大小自适应 */
    background-repeat: no-repeat;
}
</style>
  
  