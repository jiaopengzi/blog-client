<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-03-20 13:58:49
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-03-20 16:28:08
 * @FilePath     : \blog-client\src\views\admin\component\main\user-all\index.vue
 * @Description  : 所有用户页面
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->

<template>
    <BaseTable :data="filterTableData" :pagination="pagination" :table-column="cols" :dialog-visible="dialogVisible"
        :is-show-delete-all="false" @update-current-page="updateCurrentPage" @update-page-sizes="updatePageSizes"
        @edit-row="editRow" @delete-row="deleteRow" @delete-rows="deleteRows" @update-search="updateSearch"
        @update-selection="updateSelection" @update-dialog-visible="updateDialogVisible">

        <template #btns>
            <el-button type="primary" @click="handleAdd">
                新增
            </el-button>
        </template>

        <template #add-item-title>
            <span class="dialog-title">新增用户</span>
        </template>

        <template #add-item>
            <div>编辑人员</div>
        </template>
    </BaseTable>
</template>

<script lang="ts" setup>
import { ref, computed, reactive, onMounted } from 'vue'
import BaseTable from '@/components/common/base-table'
import type { Pagination } from '@/components/common'
import type { User, TableData, TableColumn } from '@/components/common/base-table'
import { debounce } from '@/utils/debounce'
import { AadminSideMenu } from '@/views/admin/component/aside'
import { IconKeys } from '@/components/common/icons'
import { ShowMsgTip } from '@/utils/message'



// eslint-disable-next-line vue/multi-word-component-names
defineOptions({ name: AadminSideMenu.UserAll })


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
        label: '头像',
        width: 150,
        align: 'center',
        isImg: true,
    },
    {
        prop: 'user_name',
        label: '用户名',
        sortable: true,
        width: 150,
        align: 'center',
    },
    {
        prop: 'nickname',
        label: '昵称',
        sortable: true,
        width: 150,
        align: 'center',
    },
    {
        prop: 'email',
        label: '邮箱',
        sortable: true,
        width: 150,
        align: 'center',
    },
    {
        prop: 'role',
        label: '角色',
        sortable: true,
        width: 150,
        align: 'center',
    },
    {
        prop: 'status',
        label: '状态',
        sortable: true,
        width: 150,
        align: 'center',
    },
    {
        prop: 'post',
        label: '文章数量',
        sortable: true,
        width: 150,
        align: 'center',
    },
    {
        prop: 'createdAt',
        label: '注册时间',
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


const dialogVisible = ref(false)

const handleAdd = () => {
    dialogVisible.value = !dialogVisible.value
    console.log("99999999999999999999")
}



const updateCurrentPage = (val: number) => {
    pagination.currentPage = val
    console.log("1", val)
}

const updatePageSizes = (val: number) => {
    pagination.pageSize = val
    console.log("2", val)
}

const editRow = (index: number, row: TableData) => {
    console.log("3", index, row)
}

const deleteRow = (index: number, row: TableData) => {
    console.log("4", index, row)
}

const deleteRows = (rows: TableData[]) => {
    console.log("5", rows)
}

const updateSearch = debounce((val: string) => {
    search.value = val
    console.log("6", val)
}, 300)

const updateSelection = (rows: TableData[]) => {
    console.log("7", rows)
}

// 关闭上传对话框时清空上传文件列表
const updateDialogVisible = (val: boolean) => {
    if (!val) {
        dialogVisible.value = val
    }
}

const user: User[] = reactive([
    {
        id: 1,
        fileName: 'Power BI',
        author: 'Power BI',
        uploadDate: '2021-12-12',
        description: 'Power BI',
        slug: 'power-bi',
        img: {
            url: 'https://jiaopengzi.com/wp-content/uploads/2022/01/%E7%84%A6%E6%A3%9A%E5%AD%90_avatar-64x64.png',
        }
    },
    {
        id: 1,
        fileName: 'Power BI',
        author: 'Power BI',
        uploadDate: '2021-12-12',
        description: 'Power BI',
        slug: 'power-bi',
        img: {
            url: 'https://jiaopengzi.com/wp-content/uploads/2022/01/%E7%84%A6%E6%A3%9A%E5%AD%90_avatar-64x64.png',
        }
    },

    {
        id: 1,
        fileName: 'Power BI',
        author: 'Power BI',
        uploadDate: '2021-12-12',
        description: 'Power BI',
        slug: 'power-bi',
        img: {
            url: 'https://jiaopengzi.com/wp-content/uploads/2022/01/%E7%84%A6%E6%A3%9A%E5%AD%90_avatar-64x64.png',
        }
    },

])

const filterTableData = computed(() =>
user.filter(
        (data) =>
            !search.value ||
            data.user_name.toLowerCase().includes(search.value.toLowerCase())
    )
)

onMounted(() => {

})

</script>

<style scoped lang="scss">
.icon-upload-filled {
    font-size: 6em;
    fill: $primary-color;
}

:deep(.el-upload-list) {
    li {
        // 上下边距
        margin: 30px 0;
        padding: 0;
    }
}

.dialog-title {
    font-size: 20px;
    font-weight: 700;
}

.el-upload__text {
    // font-size: 16px;
    font-weight: 500;
}

.el-upload__tip_title {
    margin: 10px 0;
}
</style>