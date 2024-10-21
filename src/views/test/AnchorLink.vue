<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-10-21 10:44:50
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-10-21 10:45:06
 * @FilePath     : \blog-client\src\views\test\AnchorLink.vue
 * @Description  : 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->
<template>
    <a :href="`#${anchor}`" @click="scrollToAnchor">{{ text }}</a>
</template>

<script lang="ts" setup>
import { ref } from "vue"

interface Props {
    anchor: string
    text: string
}

const props = defineProps<Props>()

const scrollToAnchor = (event: Event) => {
    event.preventDefault()
    const element = document.getElementById(props.anchor)
    if (element) {
        element.scrollIntoView({ behavior: "smooth" })
    }
}
</script>

<style scoped lang="scss">
a {
    color: blue;
    text-decoration: underline;
    cursor: pointer;

    &:hover {
        color: darkblue;
    }
}
</style>
