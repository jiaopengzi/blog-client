<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-08-04 10:54:19
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-10-04 15:50:35
 * @FilePath     : \blog-client\src\components\common\AlertTip.vue
 * @Description  : 弹窗提示
 * @blog         : https://jiaopengzi.com
 * Copyright (c) 2023 by jiaopengzi, All Rights Reserved. 
-->

<template>
  <el-alert :title="MsgTitle[typeAlert]" :type="typeAlert" :description="descriptionAlert" show-icon />
</template>

<script setup lang="ts">
import { MsgType, MsgTitle } from '@/components/common/index'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps<{
  typeAlert: MsgType
  descriptionAlert: string
}>()

</script>
<style lang="less" scoped>
.el-alert {
  margin: 20px 0 0;
}

.el-alert:first-child {
  margin: 0;
}
</style>
