<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-12-12 15:43:59
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-12-15 22:21:14
 * @FilePath     : \blog-client\src\views\test\toolbar1.vue
 * @Description  : 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved. 
-->
<!-- eslint-disable vue/multi-word-component-names -->
<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-12-01 22:04:48
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-12-12 15:39:29
 * @FilePath     : \blog-client\src\views\test\Index.vue
 * @Description  : 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved. 
-->
<!-- App.vue -->
<template>
  <div class="toolbar">
    <Toolbar :toobar-btns="toobarBtns()" :icon-number-per-line="10" @toolbar-btn-clicked="onToolbarBtnClicked" />
  </div>
</template>

<script lang="ts" setup>

import Toolbar from '@/components/common/editor/Toolbar.vue'
import { MardkdownEditorCommandsOrder } from '@/components/common/editor/command/constant'
import type { MardkdownEditorCommandsOrderKeyType } from '@/components/common/editor/command/constant'
// 判断所有 key，只要 MardkdownEditorCommandsOrder 对应的 key 的 isShow 为 false，就从 keys 中删除 否则就保留
const constantKeys: MardkdownEditorCommandsOrderKeyType[] = Object.keys(MardkdownEditorCommandsOrder).filter(key => MardkdownEditorCommandsOrder[key].isShow)
// 根据 constantKeys 生成 toobarBtns
const toobarBtns = () => {
  return constantKeys.map(key => {
    return {
      name: key as string,
      display: MardkdownEditorCommandsOrder[key].tip + " <" + MardkdownEditorCommandsOrder[key].hotKey + ">",
      icon: key as string
    }
  })

}
console.log(toobarBtns())
const onToolbarBtnClicked = (name: string) => {
  console.log(name)
}

</script>

<style scoped lang="scss">
.toolbar {
  // width: 600px;
  width: 100vw;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}
</style>
