<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-01-11 17:20:59
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-01-11 17:27:38
 * @FilePath     : \blog-client\src\components\common\base\alert-tip\index.vue
 * @Description  : 弹窗提示
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->


<template>
    <el-alert :title="MsgTitle[props.typeAlert]" :type="props.typeAlert" :description="props.descriptionAlert" show-icon />
</template>
  
<script setup lang="ts">
import { MsgType, MsgTitle } from '@/components/common/alert-tip'

defineOptions({ name: 'AlertTip' })

const props = defineProps<{
    typeAlert: MsgType
    descriptionAlert: string
}>()
</script>
<style lang="scss" scoped>
.el-alert {
    margin: 20px 0 0;
}

.el-alert:first-child {
    margin: 0;
}
</style>
  