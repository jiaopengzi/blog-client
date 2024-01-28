<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-12-01 22:04:48
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-01-25 15:28:00
 * @FilePath     : \blog-client\src\views\test\table.vue
 * @Description  : 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->
<template>
  <BaseTable :data="filterTableData" :pagination="pagination" :table-column="cols"
    @update-current-page="updateCurrentPage" @update-page-sizes="updatePageSizes" @edit-row="editRow"
    @delete-row="deleteRow" @update-search="updateSearch" @update-selection="updateSelection" />
</template>

<script lang="ts" setup>
import { ref, computed, reactive } from 'vue'
import BaseTable from '@/components/common/base-table'
import type { Pagination } from '@/components/common'
import type { PostCategory, TableData, TableColumn } from '@/components/common/base-table'
import { debounce } from '@/utils/debounce'

defineOptions({ name: 'PostCategory' })

const cols: TableColumn[] = reactive([

  {
    prop: 'id',
    label: 'ID',
    sortable: true,
    width: 100,
    align: 'center',
  },
  {
    prop: 'img',
    label: '图片',
    width: 150,
    align: 'center',
    isImg: true,
  },
  {
    prop: 'name',
    label: '名称',
    sortable: true,
    width: 150,
    align: 'center',
  },
  {
    prop: 'description',
    label: '描述',
    sortable: true,
    width: 150,
    align: 'center',
  },
  {
    prop: 'parentID',
    label: '父级分类ID',
    sortable: true,
    width: 150,
    align: 'center',
  },
  {
    prop: 'parentName',
    label: '父级分类',
    sortable: true,
    width: 150,
    align: 'center',
  },
  {
    prop: 'slug',
    label: '别名',
    sortable: true,
    width: 150,
    align: 'center',
  },
  {
    prop: 'count',
    label: '文章数量',
    sortable: true,
    width: 150,
    align: 'center',
  },

])

const pagination: Pagination = reactive({
  totalPages: 10,
  currentPage: 1,
  pageSize: 5,
  pageSizes: [5, 10, 20, 30],
})

const search = ref('')

const updateCurrentPage = (val: number) => {
  pagination.currentPage = val
  console.log(val)
}

const updatePageSizes = (val: number) => {
  pagination.pageSize = val
  console.log(val)
}

const editRow = (index: number, row: TableData) => {
  console.log(index, row)
}

const deleteRow = (index: number, row: TableData) => {
  console.log(index, row)
}

const updateSearch = debounce((val: string) => {
  search.value = val
  console.log(val)
}, 300)

const updateSelection = (val: TableData[]) => {
  console.log(val)
}

const postCategory: PostCategory[] = reactive([
  {
    name: 'Power BI',
    description: 'Power BI',
    slug: 'power-bi',
    count: 0,
    id: 1,
    img: {
      url: 'https://jiaopengzi.com/wp-content/uploads/2022/01/%E7%84%A6%E6%A3%9A%E5%AD%90_avatar-64x64.png',
    }
  },
  {
    name: 'Power Pivot',
    description: 'Power Pivot',
    slug: 'power-pivot',
    count: 10,
    id: 2,
  },
  {
    name: 'Power Query',
    description: 'Power Query',
    slug: 'power-query',
    count: 40,
    id: 3,
  },
  {
    name: 'DAX',
    description: 'DAX',
    slug: 'dax',
    count: 40,
    id: 4,
    parentID: 1,
    parentName: 'Power BI',
  },
  {
    name: 'Power Query',
    description: 'Power Query',
    slug: 'power-query',
    count: 40,
    id: 3,
  },
  {
    name: 'Power Query',
    description: 'Power Query',
    slug: 'power-query',
    count: 40,
    id: 3,
  },
  {
    name: 'Power Query',
    description: 'Power Query',
    slug: 'power-query',
    count: 40,
    id: 3,
  },
  {
    name: 'Power Query',
    description: 'Power Query',
    slug: 'power-query',
    count: 40,
    id: 3,
  },
])

const filterTableData = computed(() =>
  postCategory.filter(
    (data) =>
      !search.value ||
      data.name.toLowerCase().includes(search.value.toLowerCase())
  )
)

</script>



