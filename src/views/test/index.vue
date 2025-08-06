<template>
    <MyTest01 :is-show="isShow" />
    <button @click="toggleShow">Toggle MyTest01</button>
</template>

<script lang="ts" setup>
import MyTest01 from "./MyTest01.vue"
defineOptions({ name: "TestTest" })

let isShow = true
const toggleShow = () => {
    isShow = !isShow
}
</script>

<style scoped lang="scss"></style>
