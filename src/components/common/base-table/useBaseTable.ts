/**
 * FilePath    : blog-client\src\components\common\base-table\useBaseTable.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : BaseTable 内部状态与交互逻辑
 */

import { storeToRefs } from "pinia"
import { nextTick, ref, useTemplateRef, watch } from "vue"

import type { PostCategory } from "@/api/postCategory/view"
import type { PostTag } from "@/api/postTag/view"
import type { User } from "@/api/user/getUsers"
import { MsgType } from "@/components/common"
import { useDevice } from "@/components/hooks/useDevice"
import { useStatusStore } from "@/stores/status"
import { confirmCommon, deleteConfirmCommon } from "@/utils/confirm"
import type { SingleDblClickBinding } from "@/utils/singleDblClickDirective"

import type { BaseTableEmits, BaseTableListExpose, BaseTableProps, TableData } from "./types"
import { createListOrGridSwitchItems, getListVisibleRows, getRowImg, truncateSearchKeyword } from "./utils"

/**
 * @description: 管理 BaseTable 的内部状态与交互逻辑.
 * @param props BaseTable 属性.
 * @param emit BaseTable 事件发射器.
 * @return BaseTable 模板所需的响应式状态与处理函数.
 */
export const useBaseTable = (props: BaseTableProps, emit: BaseTableEmits) => {
    const { paginationLayout } = useDevice()
    const listRef = useTemplateRef<BaseTableListExpose>("listRef")
    const search = ref(props.searchStr ?? "")
    const addItemDialogVisibleStatus = ref(false)
    const editItemDialogVisibleStatus = ref(false)
    const isShowElImageViewer = ref(false)
    const imgUrls = ref<string[]>([])
    const checkedRows = ref<TableData[]>([])
    const switchItemList = ref(createListOrGridSwitchItems(props.showListOrGridStatus ?? true))

    const statusStore = useStatusStore()
    const { disablePagination } = storeToRefs(statusStore)

    /**
     * @description: 获取当前实际可见行顺序.
     * @return 当前可见行数组.
     */
    const getVisibleRows = (): TableData[] => {
        return getListVisibleRows(props.showListOrGridStatus ?? true, props.pagination.records, listRef.value ?? null)
    }

    /**
     * @description: 向父层同步当前可见顺序.
     * @return void.
     */
    const syncVisibleRows = (): void => {
        emit("update-visible-rows", getVisibleRows())
    }

    /**
     * @description: 更新当前页, 并兼容分页临时禁用逻辑.
     * @param value 当前页.
     * @return void.
     */
    const updateCurrentPage = (value: number): void => {
        if (disablePagination.value) {
            statusStore.setDisablePagination(false)
            return
        }

        emit("update-current-page", value)
    }

    /**
     * @description: 更新每页条数, 并兼容分页临时禁用逻辑.
     * @param value 每页条数.
     * @return void.
     */
    const updatePageSize = (value: number): void => {
        if (disablePagination.value) {
            statusStore.setDisablePagination(false)
            return
        }

        emit("update-page-size", value)
    }

    /**
     * @description: 同步列表宫格切换状态.
     * @param items 切换项数组.
     * @return void.
     */
    const updateStatus = (items: Array<{ status: boolean }>): void => {
        if (switchItemList.value[0]) {
            switchItemList.value[0].status = items[0]?.status ?? switchItemList.value[0].status
        }

        emit("update-show-list-or-grid-status", items[0]!.status)
    }

    /**
     * @description: 处理列表图片单击, 打开图片预览.
     * @param event 鼠标事件.
     * @return void.
     */
    const handleSingleClick = (event: MouseEvent): void => {
        const target = event.target as HTMLElement
        if (target.tagName.toLowerCase() !== "img" || !("src" in target)) {
            return
        }

        const imgElement = target as HTMLImageElement
        imgUrls.value = [imgElement.src]
        isShowElImageViewer.value = true
        document.body.style.overflow = "hidden"
    }

    /**
     * @description: 处理宫格单击, 切换底层表格选中状态.
     * @param row 当前数据行.
     * @return void.
     */
    const handleSingleClickInGrid = (row: TableData): void => {
        const selection = listRef.value?.getSelectionRows() ?? []
        const index = selection.findIndex((item) => item === row)

        if (index === -1) {
            listRef.value?.toggleRowSelection(row)
            return
        }

        listRef.value?.toggleRowSelection(row, false)
    }

    /**
     * @description: 处理图片双击事件.
     * @param row 当前数据行.
     * @return void.
     */
    const handleDoubleClick = (row: TableData): void => {
        emit("double-click-row-by-picture", row)
    }

    /**
     * @description: 构造表格图片单双击绑定.
     * @param row 当前数据行.
     * @return 指令绑定对象.
     */
    const clickHandler = (row: TableData): SingleDblClickBinding => ({
        single: (event: MouseEvent) => handleSingleClick(event),
        double: () => handleDoubleClick(row),
        delay: 200,
    })

    /**
     * @description: 构造宫格图片单双击绑定.
     * @param row 当前数据行.
     * @return 指令绑定对象.
     */
    const clickInGridHandler = (row: TableData): SingleDblClickBinding => ({
        single: () => handleSingleClickInGrid(row),
        double: () => handleDoubleClick(row),
        delay: 200,
    })

    /**
     * @description: 处理表格排序变化并同步可见顺序.
     * @return Promise<void>.
     */
    const handleSortChange = async (): Promise<void> => {
        await nextTick()
        syncVisibleRows()
    }

    /**
     * @description: 关闭图片预览.
     * @return void.
     */
    const closeElImageViewer = (): void => {
        isShowElImageViewer.value = false
        document.body.style.overflow = "auto"
    }

    /**
     * @description: 关闭添加对话框.
     * @return void.
     */
    const addItemHandleDialogClose = (): void => {
        emit("add-item-update-dialog-visible", false)
    }

    /**
     * @description: 关闭编辑对话框.
     * @return void.
     */
    const editItemHandleDialogClose = (): void => {
        emit("edit-item-update-dialog-visible", false)
    }

    /**
     * @description: 触发搜索.
     * @return void.
     */
    const runSearch = (): void => {
        emit("run-search")
    }

    /**
     * @description: 处理编辑行为.
     * @param index 行索引.
     * @param row 当前数据行.
     * @return void.
     */
    const handleEdit = (index: number, row: TableData): void => {
        emit("edit-row", index, row)
        emit("edit-item-update-dialog-visible", true)
    }

    /**
     * @description: 处理分类点击.
     * @param item 分类数据.
     * @return void.
     */
    const handleCategoryClick = (item: PostCategory | PostTag): void => {
        emit("click-category", item)
    }

    /**
     * @description: 处理标签点击.
     * @param item 标签数据.
     * @return void.
     */
    const handleTagClick = (item: PostCategory | PostTag): void => {
        emit("click-tag", item)
    }

    /**
     * @description: 处理作者点击.
     * @param author 作者信息.
     * @return void.
     */
    const handleAuthorClick = (author: User): void => {
        emit("click-author", author)
    }

    /**
     * @description: 处理文章点击.
     * @param postID 文章 ID.
     * @return void.
     */
    const handlePostClick = (postID: string): void => {
        emit("post-click", postID)
    }

    /**
     * @description: 处理文章查看.
     * @param postID 文章 ID.
     * @return void.
     */
    const handleViewPost = (postID: string): void => {
        emit("view-post", postID)
    }

    /**
     * @description: 处理批量删除.
     * @return void.
     */
    const handleBatchDelete = (): void => {
        const selection = listRef.value?.getSelectionRows() ?? []
        if (!selection.length) {
            ElMessage({
                type: MsgType.info,
                message: "请选择需要删除的数据",
            })
            return
        }

        const doDelete = () => emit("delete-rows", selection)
        if (props.deleteConfirmMessage) {
            confirmCommon(props.deleteConfirmMessage, doDelete, () => {
                ElMessage({ type: MsgType.info, message: "取消删除" })
            })
            return
        }

        deleteConfirmCommon(doDelete)
    }

    /**
     * @description: 处理表格选中变化.
     * @param rows 当前选中行.
     * @return void.
     */
    const handleSelectionChange = (rows: TableData[]): void => {
        checkedRows.value = rows
        emit("update-selection", rows)
    }

    /**
     * @description: 处理宫格复选变化, 同步到底层表格选中态.
     * @param rows 当前选中行.
     * @return void.
     */
    const handleCheckedGridChange = (rows: TableData[]): void => {
        listRef.value?.clearSelection()
        rows.forEach((row) => {
            listRef.value?.toggleRowSelection(row, true)
        })
    }

    /**
     * @description: 判断宫格行是否已选中.
     * @param row 当前数据行.
     * @return 是否选中.
     */
    const isSelected = (row: TableData): boolean => checkedRows.value.includes(row)

    watch(
        () => [props.searchStr, props.pagination.total],
        ([searchStr, total]) => {
            if (searchStr && total === 0) {
                statusStore.setDisablePagination(true)
            }
        },
        { immediate: true },
    )

    watch(
        () => [props.addItemDialogVisible, props.editItemDialogVisible],
        ([addVisible, editVisible]) => {
            addItemDialogVisibleStatus.value = addVisible ?? false
            editItemDialogVisibleStatus.value = editVisible ?? false
        },
        { immediate: true },
    )

    watch(
        () => props.pagination.records,
        async () => {
            await nextTick()
            syncVisibleRows()
        },
        { immediate: true, deep: true },
    )

    watch(
        () => props.showListOrGridStatus,
        async (value) => {
            if (switchItemList.value[0]) {
                switchItemList.value[0].status = value ?? true
            }

            await nextTick()
            syncVisibleRows()
        },
        { immediate: true },
    )

    watch(
        () => props.searchStr,
        (value) => {
            search.value = value ?? ""
        },
    )

    watch(
        () => search.value,
        (value) => {
            emit("update-search", truncateSearchKeyword(value))
        },
    )

    return {
        paginationLayout,
        listRef,
        search,
        addItemDialogVisibleStatus,
        editItemDialogVisibleStatus,
        isShowElImageViewer,
        imgUrls,
        checkedRows,
        switchItemList,
        updateCurrentPage,
        updatePageSize,
        updateStatus,
        closeElImageViewer,
        clickHandler,
        clickInGridHandler,
        getRowImg,
        handleSortChange,
        addItemHandleDialogClose,
        editItemHandleDialogClose,
        runSearch,
        handleEdit,
        handleCategoryClick,
        handleTagClick,
        handleAuthorClick,
        handlePostClick,
        handleViewPost,
        handleBatchDelete,
        handleSelectionChange,
        handleCheckedGridChange,
        isSelected,
    }
}
