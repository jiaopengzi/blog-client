<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-03-13 18:50:26
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-03-14 20:26:19
 * @FilePath     : \blog-client\src\views\admin\component\main\no-permission\index.vue
 * @Description  : 无权限页面
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->

<template>

  <div class="no-permission">
    <h1>无权限</h1>
    <p>如需访问,请联系管理员。</p>
  </div>

</template>
<script setup lang="ts">

defineOptions({ name: 'NoPermission' })

</script>
<style scoped lang="scss">
.no-permission {
  text-align: center;
  padding-top: 100px;
  font-size: 24px;
  color: $primary-color;

  h1 {
    font-size: 100px;
    margin: 0;
    font-weight: 700;
  }

  p {
    margin: 40px 0;
  }
}
</style>