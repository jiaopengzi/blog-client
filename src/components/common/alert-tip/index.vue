<!--
 * @FilePath     : \blog-client\src\components\common\alert-tip\index.vue
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
 * @Description  : 弹窗提示
-->

<template>
    <el-alert :title="MsgTitle[props.typeAlert]" :type="props.typeAlert" :description="props.descriptionAlert" show-icon />
</template>

<script setup lang="ts">
import { MsgTitle, MsgType } from "@/components/common"

defineOptions({ name: "AlertTip" })

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
