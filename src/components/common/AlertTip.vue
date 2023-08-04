<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-07-14 20:27:27
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-07-16 19:45:38
 * @FilePath     : \vuestudy\src\components\common\AlertTip.vue
 * @Description  : alert 提示
 * blog: https://jiaopengzi.com
 * Copyright (c) 2023 by jiaopengzi, All Rights Reserved. 
-->
<template>
  <el-alert :title="MsgTitle[typeAlert]" :type="typeAlert" :description="descriptionAlert" show-icon />
</template>

<script setup lang="ts">
import { MsgType, MsgTitle } from '@/components/common/index.ts'

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
