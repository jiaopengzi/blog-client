<!--
 * FilePath    : blog-client\src\views\admin\component\main\membership-user\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 会员用户列表
-->

<template>
    <section class="membership-user-page">
        <BaseTable
            :pagination="pagination"
            :table-column="cols"
            :add-item-dialog-visible="addItemDialogVisible"
            :edit-item-dialog-visible="editItemDialogVisible"
            :is-show-search="true"
            :search-str="search"
            :loading-delete="loadingDelete"
            height="calc(100vh - 230px)"
            :is-show-cursor-pointer="true"
            :is-show-user-name="true"
            :avatar-width="40"
            :is-show-user-email="true"
            :is-show-user-display-name="true"
            @update-current-page="updateCurrentPage"
            @update-page-size="updatePageSize"
            @update-search="updateSearch"
            @run-search="runSearch"
            @click-author="handleClickAuthor"
        >
            <template #custom-filter>
                <div class="custom-filter">
                    <FilterTagClear v-if="tags.size" class="custom-filter-item" :tags="userMembership" @clear="clearAuthorCategoryTag" />
                </div>
            </template>
        </BaseTable>
    </section>
</template>

<script lang="ts" setup>
import { useHead } from "@unhead/vue"
import { computed, reactive, ref, watch } from "vue"

import type { MembershipUserRes } from "@/api/membership/common"
import { type ViewMembershipUserRequest, viewMembershipUserAPI } from "@/api/membership/userView"
import type { QueryParamsRecord } from "@/api/request"
import { ResponseCode } from "@/api/response"
import type { User } from "@/api/user/getUsers"
import type { TableColumn, TableData } from "@/components/common/base-table"
import BaseTable from "@/components/common/base-table/index.vue"
import FilterTagClear from "@/components/common/filter-tag-clear"
import { useBaseTable } from "@/components/hooks/useBaseTable"
import { useParams } from "@/components/hooks/useParams"
import { RouteNames } from "@/router"
import { formatTime } from "@/utils/dateTime"
import { adminMenuItemMap } from "@/views/admin/component/aside"

defineOptions({ name: RouteNames.MembershipUser })

useHead({
    title: adminMenuItemMap[RouteNames.MembershipUser].text,
})

enum queryKey {
    UserID = "user_id",
}

const cols: TableColumn[] = reactive([
    {
        prop: "id",
        label: "ID",
        sortable: true,
        minWidth: 180,
        align: "center",
        isCopyText: true,
    },
    {
        prop: "user_info",
        label: "用户",
        minWidth: 220,
        align: "center",
        isUser: true,
    },
    {
        prop: "role",
        label: "会员角色",
        sortable: true,
        minWidth: 140,
        align: "center",
        isHeading: true,
    },
    {
        prop: "membership_id",
        label: "会员ID",
        sortable: true,
        minWidth: 180,
        align: "center",
        isCopyText: true,
    },
    {
        prop: "order_id",
        label: "订单ID",
        sortable: true,
        minWidth: 180,
        align: "center",
        isCopyText: true,
    },
    // {
    //     prop: "user_info",
    //     label: "订阅状态",
    //     sortable: true,
    //     minWidth: 120,
    //     align: "center",
    //     formatter: (row: TableData) => {
    //         if ("user_info" in row) {
    //             return "subscribe_status" in row.user_info && row.user_info.subscribe_status === 1 ? "已订阅" : "未订阅"
    //         }

    //         return "-"
    //     },
    // },
    {
        prop: "created_at",
        label: "开通时间",
        sortable: true,
        minWidth: 180,
        align: "center",
    },
    {
        prop: "expire_time",
        label: "过期时间",
        sortable: true,
        minWidth: 180,
        align: "center",
        formatter: (row: TableData) => {
            if ("expire_time" in row) {
                if (!row.expire_time || row.expire_time.Valid === false || row.expire_time.Time === null) {
                    return "永久有效"
                }

                return formatTime(row.expire_time.Time)
            }

            return "-"
        },
    },
])

const queryParams = reactive<ViewMembershipUserRequest>({} as ViewMembershipUserRequest)

const stringKeys: StringKeys<ViewMembershipUserRequest>[] = ["key_word", "user_id"]
const numberKeys: NumberKeys<ViewMembershipUserRequest>[] = ["current_page", "page_size"]
const noRequestKeys: QueryParamsRecord<queryKey> = {}

const clickAuthor = ref("")
const userMembership = ref<string[]>([])

const tags = computed(() => {
    const userMembershipSet = new Set<string>()

    if (clickAuthor.value) {
        userMembershipSet.add(clickAuthor.value)
    }

    return userMembershipSet
})

watch(tags, (newVal) => {
    userMembership.value = Array.from(newVal)
})

const { addItemDialogVisible, editItemDialogVisible, search, pagination, updateCurrentPage, updatePageSize, updateSearch, updateRouterPush, loadingDelete } =
    useBaseTable<MembershipUserRes, ViewMembershipUserRequest, never>({
        routeName: RouteNames.MembershipUser,
        viewAPI: viewMembershipUserAPI,
        viewResCode: ResponseCode.MembershipUserViewSuccess,
        queryParams,
        options: { stringKeys, numberKeys, noRequestKeys },
    })

const runSearch = async () => {
    await updateRouterPush()
}

const handleClickAuthor = async (author: User) => {
    Object.assign(queryParams, {
        user_id: author.id,
    })
    clickAuthor.value = author.user_name

    await updateRouterPush()
}

const clearAuthorCategoryTag = async () => {
    clickAuthor.value = ""
    delete queryParams.user_id

    await updateRouterPush()
}

useParams(queryParams, pagination, search)
</script>

<style scoped lang="scss">
.custom-filter {
    display: flex;
    align-items: center;

    .custom-filter-item {
        margin-right: 10px;
    }
}

.membership-user-page {
    margin-top: 40px;
}
</style>
