<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-11-04 16:21:40
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-31 16:25:11
 * @FilePath     : \blog-client\src\views\admin\component\main\post-all\index.vue
 * @Description  : 文章管理 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->

<template>
    <section>
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
            height="calc(100vh - 270px)"
            @update-current-page="updateCurrentPage"
            @update-page-size="updatePageSize"
            @edit-row="editRow"
            @delete-rows="deleteRows"
            @update-search="updateSearch"
            @run-search="runSearch"
            @update-selection="handleSelection"
            @click-category="handleClickCategory"
            @click-tag="handleClickTag"
            @click-author="handleClickAuthor"
        >
            <template #btns>
                <el-button ref="addBtnRef" type="primary" @click="postWrite"> 写文章 </el-button>
            </template>

            <template #category>
                <!-- v-for 循环 postCountGroup生成 按钮 -->
                <div ref="categoryRef" class="category-group">
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
                <div ref="customFilterRef" class="custom-filter">
                    <!-- 按照作者 分类 标签 -->
                    <div
                        v-if="authorCategoryTag.size"
                        class="custom-filter-item author-category-tag"
                    >
                        <el-button
                            class="author-category-tag-item author-category-tag-btn"
                            type="primary"
                            size="small"
                            @click="clearAuthorCategoryTag"
                            >X</el-button
                        >
                        <el-input-tag
                            class="author-category-tag-item"
                            v-model="authorCategoryTag"
                            disabled
                        />
                    </div>

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
    </section>
</template>

<script lang="ts" setup>
import { ref, reactive, watch, computed } from "vue"
import type { TableData, TableColumn } from "@/components/common/base-table"
import { AdminSideMenu } from "@/views/admin/component/aside"
import {
    type PostResPaginationByAdmin,
    PostStatusCode,
    PostStatusDisplay,
    CustomFields,
    CustomFieldsDisplay,
} from "@/api/post/common"
import { type ViewPostByAdminRequest, viewPostByAdminAPI } from "@/api/post/viewByAdmin"
import { ResponseCode } from "@/api/response"
import BaseTable from "@/components/common/base-table"
import { type DeletePostRequest, deletePostAPI } from "@/api/post/delete"
import { useBaseTable } from "@/components/hooks/useBaseTable"
import { type QueryParamsRecord } from "@/api/request"
import { formatTime } from "@/utils/dateTime"
import router from "@/router"
import { queryKey as queryKeyWrite } from "@/views/admin/component/main/post-write"
import { queryKey } from "./index"
import type { TableImg } from "@/components/common"
import { useHeader } from "./hooks"
import { type PostCountGroupItem, type GroupType, groupList } from "./types"
import { useUserStore } from "@/stores/user"
import {
    type PostStatusOperation,
    type BatchOperationPostStatusRequest,
    batchOperationPostStatusAPI,
} from "@/api/post/batchOperationPostStatus"
import { confirmCommon } from "@/utils/confirm"
import { MsgType } from "@/components/common"
import { MessageUtil } from "@/utils/message"
import { useParams } from "@/components/hooks/useParams"
import type { PostTag } from "@/api/postTag/view"
import type { User } from "@/api/user/getUsers"

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

// 字符串类型的 key
const stringKeys: StringKeys<ViewPostByAdminRequest>[] = [
    "custom_filed",
    "custom_filed_max",
    "custom_filed_min",
    "key_word",
    "post_author",
    "post_category_id",
    "post_tag_id",
]

// 数字类型的 key
const numberKeys: NumberKeys<ViewPostByAdminRequest>[] = [
    "post_status",
    "year",
    "month",
    "current_page",
    "page_size",
]

// 布尔类型的 key
const booleanKeys: BooleanKeys<ViewPostByAdminRequest>[] = ["is_pinned", "is_recommended"]

// 不需要请求的参数
const noRequestKeys: QueryParamsRecord<queryKey> = { [queryKey.Group]: allGroup }

// 点击分类、标签、作者
const clickCategory = ref<string>("")
const clickTag = ref<string>("")
const clickAuthor = ref<string>("")

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
    updateQueryParamsAndRouter, // 更新查询参数和路由
} = useBaseTable<PostResPaginationByAdmin, ViewPostByAdminRequest, DeletePostRequest>(
    AdminSideMenu.PostAll,
    viewPostByAdminAPI,
    ResponseCode.PostViewByAdminSuccess,
    deletePostAPI,
    ResponseCode.PostDeleteSuccess,
    queryParams,
    { stringKeys, numberKeys, booleanKeys, noRequestKeys, tableImg },
)

// 更新查询参数
const updateData = async () => {
    await updateQueryParamsAndRouter(true)
    await updatePaginate()
}

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
        queryParams[queryKey.PostAuthor] = item.key
        Object.assign(queryParams, { [queryKey.PostAuthor]: item.key })
    }

    if (item.group === queryKey.PostStatus) {
        queryParams[queryKey.PostStatus] = Number(item.key)
        // Object.assign(queryParams, { [queryKey.PostStatus]: item.key })
    }

    if (item.group === queryKey.IsPinned) {
        Object.assign(queryParams, { [queryKey.IsPinned]: true })
    }

    if (item.group === queryKey.IsRecommended) {
        Object.assign(queryParams, { [queryKey.IsRecommended]: true })
    }

    // 清空
    clickAuthor.value = ""

    Object.assign(queryParams, {
        [queryKey.KeyWord]: search.value,
    })

    await updateData()
}

const handleClickCategory = async (item: PostTag) => {
    // 配置查询参数
    Object.assign(queryParams, {
        [queryKey.PostCategoryID]: item.id,
    })
    clickCategory.value = item.name

    await updateData()
}

const handleClickTag = async (item: PostTag) => {
    // 配置查询参数
    Object.assign(queryParams, {
        [queryKey.PostTagID]: item.id,
    })
    clickTag.value = item.name

    updateData()
}

const handleClickAuthor = async (author: User) => {
    // 配置查询参数
    Object.assign(queryParams, {
        [queryKey.PostAuthor]: author.id,
    })
    clickAuthor.value = author.user_name

    await updateData()
}

const authorCategoryTag = computed(() => {
    const authorCategoryTagSet = new Set<string>()
    if (clickCategory.value) {
        authorCategoryTagSet.add(clickCategory.value)
    }
    if (clickTag.value) {
        authorCategoryTagSet.add(clickTag.value)
    }
    if (clickAuthor.value) {
        authorCategoryTagSet.add(clickAuthor.value)
    }
    return authorCategoryTagSet
})

const clearAuthorCategoryTag = async () => {
    clickCategory.value = ""
    clickTag.value = ""
    clickAuthor.value = ""

    // 删除查询参数
    Object.keys(queryParams).forEach((key) => {
        if (key === queryKey.PostCategoryID || key === queryKey.PostTagID) {
            delete queryParams[key as keyof ViewPostByAdminRequest]
        }

        // 如果分組中显示的不是当前用户的文章，删除
        if (
            key === queryKey.PostAuthor &&
            activeGroup.value !== queryParams[key as keyof ViewPostByAdminRequest]
        ) {
            delete queryParams[key as keyof ViewPostByAdminRequest]
        }
    })

    await updateData()
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
        await updateData()
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
            await updateData()
        }
    },
)

// 执行搜索
const runSearch = async () => {
    await updateData()
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
                        MessageUtil.success(msg, 3000)
                        // 引入延迟，确保后端更新完成
                        await new Promise((resolve) => setTimeout(resolve, 1000))

                        await updatePaginate()
                        await getPostCountStatus()
                    } else {
                        MessageUtil.error(res.data.msg, 3000)
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
useParams(queryParams, search, pagination)
// 监控 queryParams
watch(
    () => search.value,
    (newVal) => {
        console.log("search postWrite===========>", newVal)
    },
)

// 将 params 解析回对应的响应式变量中(不需要请求)
const parseParamsNotLoaded = () => {
    // 在加载前将 params 解析回对应的响应式变量中
    const {
        post_author,
        post_status,
        year,
        month,
        custom_filed,
        custom_filed_min,
        custom_filed_max,
        is_pinned,
        is_recommended,
    } = queryParams

    if (post_author && post_author === userStore.getUserID) {
        activeGroup.value = post_author
    }

    if (post_status) {
        activeGroup.value = post_status.toString()
    }

    if (is_pinned) {
        activeGroup.value = queryKey.IsPinned
    }

    if (is_recommended) {
        activeGroup.value = queryKey.IsRecommended
    }

    postCountMonthSelect.value = year && month ? `${year}-${month}` : ""
    postCustomFieldsSelect.value = custom_filed || ""
    postCustomFieldsMin.value = custom_filed_min ? Number(custom_filed_min) : 0
    postCustomFieldsMax.value = custom_filed_max ? Number(custom_filed_max) : 100

    stopParseParamsNotLoaded()
}

// 监控 queryParams
const { stop: stopParseParamsNotLoaded } = watch(
    () => queryParams,
    () => {
        parseParamsNotLoaded()
    },
    { deep: true },
)

// 将 params 解析回对应的响应式变量中(需要请求)
const parseParamsHasLoaded = () => {
    // 在加载前将 params 解析回对应的响应式变量中
    const { post_author, post_category_id, post_tag_id } = queryParams

    // 解析作者
    if (post_author) {
        for (const item of pagination.records) {
            if (item.author_info.id === post_author) {
                clickAuthor.value = item.author_info.user_display_name
                break
            }
        }
    }

    // 解析分类
    if (post_category_id) {
        categoryLoop: for (const item of pagination.records) {
            for (const category of item.categories) {
                if (category.id === post_category_id) {
                    clickCategory.value = category.name
                    break categoryLoop
                }
            }
        }
    }

    // 解析标签
    if (post_tag_id) {
        tagLoop: for (const item of pagination.records) {
            for (const tag of item.tags) {
                if (tag.id === post_tag_id) {
                    clickTag.value = tag.name
                    break tagLoop
                }
            }
        }
    }

    stopParseParamsHasLoaded()
}

// 当 pagination.records 有数据时，解析 params,只需要执行一次
const { stop: stopParseParamsHasLoaded } = watch(
    () => pagination.records,
    (newRecords) => {
        if (newRecords.length > 0) {
            parseParamsHasLoaded()
        }
    },
)
</script>

<style scoped lang="scss">
.custom-filter {
    display: flex;
    align-items: center;
    // margin-right: 10px;

    .custom-filter-item {
        margin-right: 10px;
    }
}

.author-category-tag {
    display: flex;
    align-items: center;
    position: relative;

    .author-category-tag-item {
        margin-right: 10px;
    }

    // author-category-tag-btn 绝对定位到最右边垂直居中
    .author-category-tag-btn {
        position: absolute;
        right: 4px;
        top: 50%;
        transform: translateY(-50%);
        z-index: 1;
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
            color: var(--jpz-text-color-regular);
        }
    }
}

.operation {
    display: flex;
    align-items: center;
    margin-left: 20px;

    border-left: 1px solid var(--jpz-color-primary);
    padding-left: 30px;

    .operation-item {
        margin-right: 10px;
    }
}
</style>
