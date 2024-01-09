<!-- eslint-disable vue/multi-word-component-names -->
<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-12-01 22:04:48
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-01-09 14:49:07
 * @FilePath     : \blog-client\src\views\test\Index字体.vue
 * @Description  : 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved. 
-->
<!-- App.vue -->
<template>
  <li>勾股定理: <span class="katex">
      <img
        src="data:image/png;base64,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">
    </span>
  </li>
</template>

<script lang="ts" setup>


</script>
<style scoped lang="scss">
li {
  margin: 0px;
  padding: 0px;
  border-width: 0px;
  list-style-type: disc;

  span {
    margin: 0px;
    padding: 0px;
    border-width: 0px;
    color: rgb(30, 40, 88);
    text-rendering: auto;
    text-indent: 0px;

    img {
      display: inline-block;
      // vertical-align: middle;
      // vertical-align: bottom;
      // vertical-align: text-bottom;
      vertical-align: text-top;
      margin: 0px;
      padding: 0px;
      border-width: 0px;
      max-width: 100%;
      width: auto;
      border-radius: 4px;
      cursor: pointer;
      border-color: currentcolor;
      border-style: none;
      max-height: none;
      min-height: 0px;
      min-width: 0px;
    }
  }
}
</style>