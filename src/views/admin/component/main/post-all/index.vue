<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-11-04 16:21:40
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-04 19:55:20
 * @FilePath     : \blog-client\src\views\admin\component\main\post-all\index.vue
 * @Description  : 标签管理
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->

<template>
    <BaseTable
        :pagination="pagination"
        :table-column="cols"
        :add-item-dialog-visible="addItemDialogVisible"
        :edit-item-dialog-visible="editItemDialogVisible"
        :is-show-delete-all="true"
        :is-show-search="true"
        :search-str="search"
        :is-show-edit="true"
        :row-style="{ height: '96px' }"
        tags-item-max-height="96px"
        @update-current-page="updateCurrentPage"
        @update-page-size="updatePageSize"
        @edit-row="editRow"
        @delete-rows="deleteRows"
        @update-search="updateSearch"
    >
        <template #btns>
            <el-button type="primary" @click="postWrite"> 写文章 </el-button>
        </template>

        <template #category>
            <!-- v-for 循环 postCountGroup生成 按钮 -->
            <div class="category">
                <el-button
                    v-for="item in postCountGroup"
                    :key="item.key"
                    :class="{ active: item.key === activeGroup }"
                    @click="handlePostCountByGroup(item)"
                >
                    {{ item.display }} ({{ item.count }})
                </el-button>
            </div>
        </template>

        <template #custom-filter>
            <div class="custom-filter">
                <!-- 按照月份筛选 -->
                <div class="custom-filter-item">
                    <el-select
                        v-model="postCountMonthSelect"
                        placeholder="全部日期"
                        clearable
                        style="width: 130px"
                    >
                        <el-option
                            v-for="item in postCountMonth"
                            :key="`${item.year}-${item.month}(${item.count})`"
                            :label="`${item.year}-${item.month.toString().padStart(2, '0')}(${item.count})`"
                            :value="`${item.year}-${item.month}`"
                        />
                    </el-select>
                </div>

                <!-- 自定义字段筛选 -->
                <div class="custom-filter-item custom-fields">
                    <el-select
                        class="custom-fields-item"
                        v-model="postCustomFieldsSelect"
                        placeholder="自定义筛选"
                        clearable
                        style="width: 130px"
                    >
                        <el-option
                            v-for="item in CustomFields"
                            :key="item"
                            :label="CustomFieldsDisplay[item]"
                            :value="item"
                        />
                    </el-select>
                    <div class="custom-fields-item" v-show="postCustomFieldsSelect">
                        <span>最小值:</span>
                        <el-input-number
                            v-model="postCustomFieldsMin"
                            controls-position="right"
                            :min="0"
                            :max="9999999999999"
                            style="width: 130px"
                        />
                    </div>

                    <div class="custom-fields-item" v-show="postCustomFieldsSelect">
                        <span>最大值:</span>
                        <el-input-number
                            v-model="postCustomFieldsMax"
                            controls-position="right"
                            :min="1"
                            :max="9999999999999"
                            style="width: 130px"
                        />
                    </div>
                </div>
            </div>
        </template>

        <template #operation>
            <!-- 批量操作 -->
            <div class="operation">
                <el-select
                    class="operation-item"
                    v-model="postOperationSelect"
                    placeholder="批量更改"
                    clearable
                    style="width: 140px"
                >
                    <el-option
                        v-for="item in postBatchOperations"
                        :key="item"
                        :label="`更改为：${PostStatusDisplay[item] || item}`"
                        :value="item"
                    />
                </el-select>
                <el-button
                    class="operation-item"
                    type="primary"
                    @click="search"
                    v-show="postOperationSelect"
                    >更改</el-button
                >
            </div>
        </template>
    </BaseTable>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue"
import type { TableData, TableColumn } from "@/components/common/base-table"
import { AdminSideMenu } from "@/views/admin/component/aside"
import {
    type PostInfoRes,
    PostStatusCode,
    PostStatusDisplay,
    CustomFields,
    CustomFieldsDisplay,
} from "@/api/post/common"
import { type ViewPostByAdminRequest, viewPostByAdminRequestAPI } from "@/api/post/viewByAdmin"
import { ResponseCode } from "@/api/responseCode"
import BaseTable from "@/components/common/base-table"
import { useGetData } from "@/components/hooks/useGetData"
import { type DeletePostRequest, deletePostAPI } from "@/api/post/delete"
import { useBaseTable, type QueryRecord, type Options } from "@/components/hooks/useBaseTable"
import { formatTime } from "@/utils/dateTime"
import router from "@/router"
import { queryKey as queryKeyWrite } from "@/views/admin/component/main/post-write"
import { type TableImg } from "@/components/common"
import { useHeader } from "./hooks"
import { type PostCountGroup } from "./index"
import { useUserStore } from "@/stores/user"

defineOptions({ name: AdminSideMenu.PostAll })

const cols: TableColumn[] = reactive([
    {
        prop: "id",
        label: "ID",
        sortable: true,
        width: 100,
        align: "center",
    },
    {
        prop: "thumbnail",
        label: "图片",
        width: 130,
        align: "center",
        isImg: true,
    },
    {
        prop: "post_title",
        label: "标题",
        sortable: true,
        width: 180,
        align: "center",
        isHeading: true,
    },
    {
        prop: "categories",
        label: "分类",
        sortable: true,
        width: 180,
        align: "center",
        isCategories: true,
    },
    {
        prop: "tags",
        label: "标签",
        sortable: true,
        width: 180,
        align: "center",
        isTags: true,
    },
    {
        prop: "price",
        label: "价格",
        sortable: true,
        minWidth: 80,
        align: "center",
    },
    {
        prop: "view_count",
        label: "查看",
        sortable: true,
        minWidth: 80,
        align: "center",
    },
    {
        prop: "like_count",
        label: "点赞",
        sortable: true,
        minWidth: 80,
        align: "center",
    },
    {
        prop: "collect_count",
        label: "收藏",
        sortable: true,
        minWidth: 80,
        align: "center",
    },
    {
        prop: "comment_count",
        label: "评论",
        sortable: true,
        minWidth: 80,
        align: "center",
    },
    {
        prop: "author_info",
        label: "作者",
        sortable: true,
        minWidth: 120,
        align: "center",
        isAuthor: true,
    },
    {
        prop: "post_status",
        label: "状态",
        sortable: true,
        minWidth: 120,
        align: "center",
        formatter: (row: TableData) => {
            if ("post_status" in row) {
                const display = PostStatusDisplay[row.post_status as PostStatusCode]
                // 判断是否为定时或者过期
                if (row.post_status === PostStatusCode.Future && row.post_push_time?.Time) {
                    return `${display}(${formatTime(row.post_push_time.Time)})`
                }

                if (row.post_status === PostStatusCode.Expired && row.post_expired_time?.Time) {
                    return `${display}(${formatTime(row.post_expired_time.Time)})`
                }

                return display
            }
        },
    },
    {
        prop: "created_at",
        label: "创建时间",
        sortable: true,
        minWidth: 120,
        align: "center",
    },
])

const userStore = useUserStore()

const {
    postCountGroup,
    postCountMonth,
    allGroup,
    activeGroup,
    getPostCountAuthor,
    getPostCountStatus,
    getPostCountMonth,
} = useHeader(userStore.getUserID)

// 表格图片配置
const tableImg: TableImg = {
    width: 96,
    height: 96,
    svgFontSize: 50,
}

// url query key
enum queryKey {
    Group = "group",
    PostAuthor = "post_author",
    PostStatus = "post_status",
    Year = "year",
    Month = "month",
    PostCategoryID = "post_category_id",
    PostTagID = "post_tag_id",
    CustomFiled = "custom_filed",
    CustomFiledMin = "custom_filed_min",
    CustomFiledMax = "custom_filed_max",
    KeyWord = "key_word",
}

// 查询参数
const queryParams = reactive({} as ViewPostByAdminRequest)

// 不需要请求的参数
const noRequest: QueryRecord<queryKey> = { [queryKey.Group]: allGroup }

// hooks 使用
const {
    addItemDialogVisible, // 添加对话框是否可见
    editItemDialogVisible, // 编辑对话框是否可见
    search, // 搜索关键字
    pagination, // 分页数据
    updateCurrentPage, // 更新当前页
    updatePageSize, // 更新每页显示条数
    updateSearch, // 更新搜索关键字
    updatePaginate, // 更新分页数据
    deleteRows, // 删除行
    updatePaginateOnBeforeMount, // 更新分页数据
} = useBaseTable<PostInfoRes, ViewPostByAdminRequest, DeletePostRequest>(
    AdminSideMenu.PostAll,
    viewPostByAdminRequestAPI,
    ResponseCode.PostViewByAdminSuccess,
    deletePostAPI,
    ResponseCode.PostDeleteSuccess,
    { queryParams, tableImg },
)

const postBatchOperations = ref([
    PostStatusCode.Draft,
    PostStatusCode.Private,
    PostStatusCode.Publish,
])

const postOperationSelect = ref("")
const postCountMonthSelect = ref("")
const postCustomFieldsSelect = ref("")
const postCustomFieldsMin = ref(0)
const postCustomFieldsMax = ref(100)

const handlePostCountByGroup = async (item: PostCountGroup) => {
    activeGroup.value = item.key
    // 添加路由跳转
    Object.assign(queryParams, {
        [queryKey.Group]: item.key,
        [queryKey.KeyWord]: search.value,
    })
}

const postWrite = () => {
    router.push({ name: AdminSideMenu.PostWrite })
}

const editRow = (index: number, row: TableData) => {
    // 编辑文章
    router.push({
        name: AdminSideMenu.PostWrite,
        query: { [queryKeyWrite.ID]: row.id },
    })
}

// 获取数据
useGetData(
    [updatePaginateOnBeforeMount, getPostCountAuthor, getPostCountStatus, getPostCountMonth],
    [updatePaginate],
)
</script>

<style scoped lang="scss">
.category {
    margin-top: 10px;
    display: flex;
    align-items: center;

    .el-button {
        position: relative;
        // 背景透明
        background-color: transparent;
        // 无边框
        border: none;

        &.active {
            font-weight: bold;
            color: $primary-color;
        }

        &::after {
            content: "";
            position: absolute;
            right: -8px;
            top: 50%;
            transform: translateY(-50%);
            height: 61.8%;
            border-right: 1px solid $primary-color;
        }

        &:last-child::after {
            display: none;
        }
    }
}

.custom-filter {
    display: flex;
    align-items: center;
    // margin-right: 10px;

    .custom-filter-item {
        margin-right: 10px;
    }
}

.custom-fields {
    display: flex;
    align-items: center;
    // margin-right: 10px;

    .custom-fields-item {
        span {
            margin: 0 4px;
            font-size: 14px;
        }
    }
}

.operation {
    display: flex;
    align-items: center;
    margin-left: 20px;

    border-left: 1px solid $primary-color;
    padding-left: 30px;

    .operation-item {
        margin-right: 10px;
    }
}
</style>
