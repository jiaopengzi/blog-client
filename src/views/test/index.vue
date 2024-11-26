<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-09-29 10:52:39
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-11-26 21:53:27
 * @FilePath     : \blog-client\src\views\test\index.vue
 * @Description  : 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->
<template>
    <el-table
        :data="tableData"
        style="width: 100%"
        table-layout="auto"
        :row-style="{ height: '96px' }"
    >
        <el-table-column prop="date" label="Date" width="180" />
        <el-table-column prop="name" label="Name" width="180" />
        <el-table-column prop="address" label="Address" width="180" />
    </el-table>
</template>

<script lang="ts" setup>
const tableData = [
    {
        date: "2016-05-03",
        name: "Tom",
        address:
            "No. 189, Grove St, Los Angeles三大法师打发是的法师打发谁撒的发生代发撒旦法师打发撒旦法是的发生代发收到撒的发生代发撒旦法师打发三大发啥打法",
    },
    {
        date: "2016-05-02",
        name: "Tom",
        address: "No. 189, Grove St, Los Angeles",
    },
    {
        date: "2016-05-04",
        name: "Tom",
        address: "No. 189, Grove St, Los Angeles",
    },
    {
        date: "2016-05-01",
        name: "Tom",
        address: "No. 189, Grove St, Los Angeles",
    },
]
</script>
