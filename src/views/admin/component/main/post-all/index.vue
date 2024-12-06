<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-11-04 16:21:40
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-06 10:20:31
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
        @run-search="runSearch"
        @update-selection="handleSelection"
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
                    @click="handlePostStatusOperation"
                    v-show="postOperationSelect"
                    >更改</el-button
                >
            </div>
        </template>
    </BaseTable>
</template>

<script lang="ts" setup>
import { ref, reactive, watch, nextTick, onBeforeMount } from "vue"
import type { TableData, TableColumn } from "@/components/common/base-table"
import { AdminSideMenu } from "@/views/admin/component/aside"
import {
    type PostInfoRes,
    PostStatusCode,
    PostStatusDisplay,
    CustomFields,
    CustomFieldsDisplay,
} from "@/api/post/common"
import { type ViewPostByAdminRequest, viewPostByAdminAPI } from "@/api/post/viewByAdmin"
import { ResponseCode } from "@/api/responseCode"
import BaseTable from "@/components/common/base-table"
import { type DeletePostRequest, deletePostAPI } from "@/api/post/delete"
import { useBaseTable, type QueryRecord } from "@/components/hooks/useBaseTable"
import { formatTime } from "@/utils/dateTime"
import router from "@/router"
import { queryKey as queryKeyWrite } from "@/views/admin/component/main/post-write"
import { queryKey } from "./index"
import { type TableImg, type NumberKeys } from "@/components/common"
import { useHeader } from "./hooks"
import { type PostCountGroupItem, groupList, type GroupType } from "./index"
import { useUserStore } from "@/stores/user"
import {
    type PostStatusOperation,
    type BatchOperationPostStatusRequest,
    batchOperationPostStatusAPI,
} from "@/api/post/batchOperationPostStatus"
import { confirmCommon } from "@/utils/confirm"
import { MsgType } from "@/components/common"
import { ShowMsgTip } from "@/utils/message"
import { useParams } from "@/components/hooks/useParams"

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
        label: "浏览",
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

// 可以批量操作的状态
const postBatchOperations = ref([
    PostStatusCode.Draft,
    PostStatusCode.Private,
    PostStatusCode.Publish,
])

const postStatusOperationList = ref<PostStatusOperation[]>([])

const postOperationSelect = ref<PostStatusCode>()
const postCountMonthSelect = ref("")
const postCustomFieldsSelect = ref("")
const postCustomFieldsMin = ref(0)
const postCustomFieldsMax = ref(100)

const userStore = useUserStore()

// 获取头部数据
const { postCountGroup, postCountMonth, allGroup, activeGroup, getPostCountStatus } = useHeader(
    userStore.getUserID,
)

// 表格图片配置
const tableImg: TableImg = {
    width: 96,
    height: 96,
    svgFontSize: 50,
}

// 查询参数
const queryParams = reactive({} as ViewPostByAdminRequest)

// 查询参数中的数字类型参数
const queryNumberParams: NumberKeys<ViewPostByAdminRequest>[] = ["post_status", "year", "month"]

// 不需要请求的参数
const noRequest: QueryRecord<queryKey> = { [queryKey.Group]: allGroup }

// 处理 postCountGroup 点击事件
const handlePostCountByGroup = async (item: PostCountGroupItem) => {
    activeGroup.value = item.key
    // 清空重置
    Object.keys(queryParams).forEach((key) => {
        if (groupList.includes(key as GroupType)) {
            delete queryParams[key as keyof ViewPostByAdminRequest]
        }
    })

    // 配置查询参数
    if (item.group === queryKey.Group) {
        Object.assign(queryParams, { [queryKey.Group]: item.key })
    }

    if (item.group === queryKey.PostAuthor) {
        Object.assign(queryParams, { [queryKey.PostAuthor]: item.key })
    }

    if (item.group === queryKey.PostStatus) {
        Object.assign(queryParams, { [queryKey.PostStatus]: item.key })
    }

    Object.assign(queryParams, {
        [queryKey.KeyWord]: search.value,
    })

    await nextTick()
    updateQueryAndRouter(true)
}

// 监控 postCountMonthSelect
watch(postCountMonthSelect, async (newVal) => {
    if (newVal) {
        const [year, month] = newVal.split("-")
        queryParams.year = Number(year)
        queryParams.month = Number(month)
    } else {
        delete queryParams.year
        delete queryParams.month
        await nextTick()
        updateQueryAndRouter(true)
    }
})

// 监控 postCustomFieldsSelect
watch(
    [postCustomFieldsSelect, postCustomFieldsMin, postCustomFieldsMax],
    async ([newSelect, newMin, newMax], [oldSelect, oldMin, oldMax]) => {
        queryParams.custom_filed_min = oldMin.toString()
        queryParams.custom_filed_max = oldMax.toString()

        if (newSelect !== oldSelect) {
            queryParams.custom_filed = newSelect as CustomFields
        }

        if (newMin !== oldMin) {
            queryParams.custom_filed_min = newMin.toString()
        }

        if (newMax !== oldMax) {
            queryParams.custom_filed_max = newMax.toString()
        }

        if (newSelect === void 0) {
            delete queryParams.custom_filed
            delete queryParams.custom_filed_min
            delete queryParams.custom_filed_max
            await nextTick()
            updateQueryAndRouter(true)
        }
    },
)

// useBaseTable hooks 使用
const {
    addItemDialogVisible, // 添加对话框是否可见
    editItemDialogVisible, // 编辑对话框是否可见
    search, // 搜索关键字
    pagination, // 分页数据
    updateCurrentPage, // 更新当前页
    updatePageSize, // 更新每页显示条数
    updateSearch, // 更新搜索关键字
    deleteRows, // 删除行
    updatePaginate, // 更新分页
    updateQueryAndRouter, // 更新查询参数和路由
    params,
} = useBaseTable<PostInfoRes, ViewPostByAdminRequest, DeletePostRequest>(
    AdminSideMenu.PostAll,
    viewPostByAdminAPI,
    ResponseCode.PostViewByAdminSuccess,
    deletePostAPI,
    ResponseCode.PostDeleteSuccess,
    { queryParams, queryNumberParams, tableImg, noRequest },
)

// 执行搜索
const runSearch = () => {
    updateQueryAndRouter(true)
}

// 批量操作
const handlePostStatusOperation = async () => {
    if (postStatusOperationList.value.length > 0) {
        confirmCommon(
            "确认更改?",

            // 确认后的操作
            () => {
                // 构造请求参数
                const req: BatchOperationPostStatusRequest = {
                    operation_list: postStatusOperationList.value,
                }

                batchOperationPostStatusAPI(req).then(async (res) => {
                    if (res.data.code === ResponseCode.PostStatusBatchOperationSuccess) {
                        const msg = res.data.msg + "，请稍后刷新页面查看最新数据"
                        ShowMsgTip(MsgType.success, msg, 3000)

                        // 引入延迟，确保后端更新完成
                        await new Promise((resolve) => setTimeout(resolve, 1000))

                        await updatePaginate()
                        await getPostCountStatus()
                    } else {
                        ShowMsgTip(MsgType.error, res.data.msg, 3000)
                    }
                })
            },

            // 取消后的操作
            () => {},
        )
    } else {
        ElMessage({
            type: MsgType.info,
            message: "请选择需要更改的数据",
        })
    }
}

// 处理选择行
const handleSelection = async (rows: TableData[]) => {
    // 先清空
    postStatusOperationList.value = []

    rows.flatMap((item) => {
        if ("id" in item) {
            postStatusOperationList.value.push({
                id: item.id.toString(),
                post_status: postOperationSelect.value as PostStatusCode,
            })
        }
    })
}

// 监控 postOperationSelect 更改
watch(postOperationSelect, async (newVal) => {
    if (newVal) {
        // 更新 postStatusOperationList 状态更改为 newVal
        postStatusOperationList.value = postStatusOperationList.value.map((item) => {
            item.post_status = newVal
            return item
        })
    }
})

// 写文章
const postWrite = () => {
    router.push({ name: AdminSideMenu.PostWrite })
}

// 编辑文章
const editRow = (index: number, row: TableData) => {
    // 编辑文章
    router.push({
        name: AdminSideMenu.PostWrite,
        query: { [queryKeyWrite.ID]: row.id },
    })
}

// 通用将 params 解析回对应的响应式变量中
useParams(params, search, pagination)

onBeforeMount(() => {
    // 在加载前将 params 解析回对应的响应式变量中
    const {
        post_author,
        post_status,
        year,
        month,
        custom_filed,
        custom_filed_min,
        custom_filed_max,
    } = params

    if (post_author) {
        activeGroup.value = post_author
    }
    if (post_status) {
        activeGroup.value = post_status.toString()
    }

    postCountMonthSelect.value = year && month ? `${year}-${month}` : ""
    postCustomFieldsSelect.value = custom_filed || ""
    postCustomFieldsMin.value = custom_filed_min ? Number(custom_filed_min) : 0
    postCustomFieldsMax.value = custom_filed_max ? Number(custom_filed_max) : 100
})
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
