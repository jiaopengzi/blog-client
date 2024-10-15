<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-10-15 18:26:04
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-10-15 19:10:30
 * @FilePath     : \blog-client\src\components\common\grid\index.vue
 * @Description  : 网格
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->

<template>
  <ul>
    <li v-for="(row, index) in paginationData">
      <div class="thumbnail" @click="handleDelegateClick">
        <img
          class="thumbnail-img"
          v-if="row.img?.url"
          :src="row.img.url"
          :style="imgStyle(row.img?.width, row.img?.height, row.img?.imgFit)"
        />
        <Icon
          v-else-if="row.img?.iconKeyName"
          :name="row.img?.iconKeyName"
          :style="iconStyle(row.img?.fontSize)"
        />
      </div>
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { ref, watchEffect, watch, useTemplateRef } from 'vue'
import type { ElTable } from 'element-plus'
import type { Pagination } from '@/components/common'
import { MsgType } from '@/components/common'
import type { TableData, TableColumn } from '@/components/common/base-table'
import { handleConfirmCommon } from '@/utils/confirm'
import { imgStyle, iconStyle } from '@/utils/style'

defineOptions({ name: 'BaseTable' })

// 数据
const { pagination } = defineProps<{
  pagination: Pagination<TableData> // 分页配置
}>()

// 事件
const emit = defineEmits<{
  (event: 'update-current-page', value: number): void // 更新当前页
  (event: 'update-page-size', value: number): void // 更新每页显示条数
  (event: 'edit-row', index: number, row: TableData): void // 编辑行
  (event: 'delete-row', index: number, row: TableData): void // 删除行
  (event: 'delete-rows', rows: TableData[]): void // 删除多行
  (event: 'update-search', value: string): void // 更新搜索关键字
  (event: 'update-selection', rows: TableData[]): void // 更新选择
  (event: 'add-item-update-dialog-visible', value: boolean): void // 更新添加元素对话框状态
  (event: 'edit-item-update-dialog-visible', value: boolean): void // 更新编辑元素对话框状态
}>()

const tableRef = useTemplateRef<InstanceType<typeof ElTable>>('tableRef') //表格实例
const paginationData = ref<Pagination<TableData>>(pagination) // 分页配置

// 点击事件委托,图片预览.
const handleDelegateClick = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (target.tagName.toLowerCase() === 'img' && 'src' in target) {
    console.log(1)
  }
}

// 更新分页配置
watchEffect(() => {
  paginationData.value = pagination
})
</script>

<style scoped lang="scss">
.container {
  margin: 10px;

  .btns {
    margin: 10px 0;
  }

  .search {
    margin: 0 0 10px 0;
    width: 250px;
  }

  .pagination-block {
    display: flex;
    justify-content: center;
    margin-top: 10px;
  }

  .dialog-footer button:first-child {
    margin-right: 10px;
  }

  .thumbnail {
    float: left;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    overflow: hidden;
  }

  .thumbnail-img {
    width: 100%;
    height: 100%;
    background-size: cover;
    transition: transform 0.3s ease;
  }

  .thumbnail:hover .thumbnail-img {
    transform: scale(1.2);
  }
}

// 图片 img
img {
  display: block;
  max-width: 100%; // 确保图片不超过父元素宽度
  width: auto; // 根据图片的实际尺寸进行缩放
  margin: 4px auto;
  border-radius: 4px;
  cursor: pointer;
  // box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);     // 阴影
}
</style>
