<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-01-14 20:46:44
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-01-26 15:28:36
 * @FilePath     : \blog-client\src\views\test\menu.vue
 * @Description  : 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->

<template>
  <el-scrollbar>
    <el-menu :default-openeds="['1', '3']">

      <el-sub-menu index="1">
        <template #title>
          <Icon :name="IconKeys.Save" custom-class="icon-menu" /> <span> Navigator One</span>
        </template>

        <el-menu-item index="1-1">
          <Icon :name="IconKeys.Save" custom-class="icon-menu" /> <span> Option 1</span>
        </el-menu-item>

        <el-menu-item index="1-2">Option 2</el-menu-item>
        <el-menu-item index="1-3">Option 3</el-menu-item>

        <el-sub-menu index="1-4">
          <template #title>
            <span> Option4</span>
          </template>
          <el-menu-item index="1-4-1">Option 4-1</el-menu-item>
          <el-sub-menu index="1-4-2"> <template #title>
              <span> Option 4-2</span>
            </template>
            <el-menu-item index="1-4-2-1">Option 4-2-1</el-menu-item>
            <el-menu-item index="1-4-2-1">Option 4-2-2</el-menu-item>
          </el-sub-menu>
        </el-sub-menu>

      </el-sub-menu>
    </el-menu>
  </el-scrollbar>
</template>




<script lang="ts" setup>
import { reactive } from 'vue'
import { IconKeys } from '@/components/common/icons'

// eslint-disable-next-line vue/multi-word-component-names
defineOptions({ name: 'Admin' })



export interface Menu {
  [index: string]: {
    index: string;
    display: string;
    iconName?: IconKeys;
    iconClass?: string;
    parentIndex?: string;
  }
}

const menuData: Menu = reactive({
  "1": {
    index: '1',
    display: 'Navigator One',
    iconName: IconKeys.Save,
  },
  '1-1': {
    index: '1-1',
    display: 'Option 1',
    parentIndex: 'XX',
  },
  '1-2': {
    index: '1-2',
    display: 'Option 2',
    parentIndex: 'XX',
  },
  '1-3': {
    index: '1-3',
    display: 'Option 3',
    parentIndex: 'XX',
  },
  '1-4': {
    index: '1-4',
    display: 'Option 4',
    iconName: IconKeys.Save,
    parentIndex: 'XX',
  },
  '1-4-1': {
    index: '1-4-1',
    display: 'Option 4-1',
    parentIndex: '1-4',
  },
  '1-4-1-1': {
    index: '1-4-1-1',
    display: 'Option 4-1-1',
    parentIndex: '1-4-1',
  },
  '1-4-2-1': {
    index: '1-4-2',
    display: 'Option 4-1-1',
    parentIndex: '1-4-1',
  },
  '1-4-2-2': {
    index: '1-4-2',
    display: 'Option 4-1-1',
    parentIndex: '1-4-1',
  },
  '2': {
    index: '2',
    display: 'Navigator Two',
    iconName: IconKeys.Save,
  },
  '3': {
    index: '3',
    display: 'Navigator Three',
    iconName: IconKeys.Save,
  },
  '3-1': {
    index: '3-1',
    display: 'Option 3-1',
    parentIndex: '3',
  },
  '3-2': {
    index: '3-2',
    display: 'Option 3-2',
    parentIndex: '3',
  },
  '3-3': {
    index: '3-3',
    display: 'Option 3-3',
    parentIndex: '3',
  },

})

</script>

<style scoped lang="scss"></style>
