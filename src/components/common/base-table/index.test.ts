/**
 * FilePath    : blog-client\src\components\common\base-table\index.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : BaseTable 组件行为测试
 */

import { flushPromises, mount } from "@vue/test-utils"
import { createPinia, setActivePinia } from "pinia"
import { computed, defineComponent, h, ref, watch } from "vue"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import type { Pagination } from "@/api/response"
import { useStatusStore } from "@/stores/status"

import BaseTable from "./index.vue"
import type { TableColumn, TableData } from "./types"

const { elMessageMock, confirmCommonMock, deleteConfirmCommonMock } = vi.hoisted(() => ({
    elMessageMock: vi.fn(),
    confirmCommonMock: vi.fn(),
    deleteConfirmCommonMock: vi.fn(),
}))
const tableVisibleData = ref<TableData[]>([])
const tableSelection = ref<TableData[]>([])

vi.mock("element-plus", async (importOriginal) => {
    const actual = await importOriginal<typeof import("element-plus")>()

    return {
        ...actual,
        ElMessage: elMessageMock,
    }
})

vi.mock("@/components/hooks/useDevice", () => ({
    /**
     * @description: 固定分页布局, 避免测试依赖设备状态.
     * @return 包含固定分页布局的设备信息.
     */
    useDevice: () => ({
        paginationLayout: computed(() => "total, prev, pager, next"),
    }),
}))

vi.mock("@/utils/confirm", () => ({
    confirmCommon: confirmCommonMock,
    deleteConfirmCommon: deleteConfirmCommonMock,
}))

/**
 * @description: 更新表格选择集.
 * @param row 当前行.
 * @param selected 是否选中.
 * @return 最新选择集.
 */
const updateSelection = (row: TableData, selected?: boolean): TableData[] => {
    const isSelected = tableSelection.value.includes(row)

    if (selected === false) {
        tableSelection.value = tableSelection.value.filter((item) => item !== row)
        return [...tableSelection.value]
    }

    if (!isSelected) {
        tableSelection.value = [...tableSelection.value, row]
    }

    return [...tableSelection.value]
}

const ElTableStub = defineComponent({
    name: "ElTable",
    props: {
        data: {
            type: Array,
            default: () => [],
        },
    },
    emits: ["selection-change", "sort-change"],
    /**
     * @description: 提供 BaseTable 依赖的最小表格实例能力.
     * @param props 组件属性.
     * @param context setup 上下文.
     * @return 渲染函数.
     */
    setup(props, { emit, slots, expose }) {
        watch(
            () => props.data as TableData[],
            (rows) => {
                if (tableVisibleData.value.length === 0) {
                    tableVisibleData.value = [...rows]
                }
            },
            { immediate: true },
        )

        expose({
            getSelectionRows: () => tableSelection.value,
            clearSelection: () => {
                tableSelection.value = []
                emit("selection-change", [])
            },
            toggleRowSelection: (row: TableData, selected?: boolean) => {
                emit("selection-change", updateSelection(row, selected))
            },
            store: {
                states: {
                    data: tableVisibleData,
                },
            },
        })

        return () =>
            h(
                "div",
                {
                    class: "el-table-stub",
                },
                slots.default?.(),
            )
    },
})

const SwitchGroupStub = defineComponent({
    name: "SwitchGroup",
    props: {
        switchItems: {
            type: Array,
            default: () => [],
        },
    },
    emits: ["update-status"],
    /**
     * @description: 渲染最小切换器桩.
     * @param _props 组件属性.
     * @param context setup 上下文.
     * @return 渲染函数.
     */
    setup(_props, { slots }) {
        return () => h("div", { class: "switch-group-stub" }, slots.default?.())
    },
})

const ElButtonStub = defineComponent({
    name: "ElButton",
    emits: ["click"],
    /**
     * @description: 渲染按钮桩并透传点击事件.
     * @param _props 组件属性.
     * @param context setup 上下文.
     * @return 渲染函数.
     */
    setup(_props, { emit, slots }) {
        return () =>
            h(
                "button",
                {
                    class: "el-button-stub",
                    onClick: () => emit("click"),
                },
                slots.default?.(),
            )
    },
})

const ElInputStub = defineComponent({
    name: "ElInput",
    props: {
        modelValue: {
            type: String,
            default: "",
        },
    },
    emits: ["update:modelValue"],
    /**
     * @description: 渲染输入框桩, 支持 v-model.
     * @param props 组件属性.
     * @param context setup 上下文.
     * @return 渲染函数.
     */
    setup(props, { emit }) {
        return () =>
            h("input", {
                class: "el-input-stub",
                value: props.modelValue,
                onInput: (event: Event) => emit("update:modelValue", (event.target as HTMLInputElement).value),
            })
    },
})

const ElPaginationStub = defineComponent({
    name: "ElPagination",
    emits: ["update:current-page", "update:page-size"],
    /**
     * @description: 提供可触发分页事件的桩组件.
     * @return 渲染函数.
     */
    setup() {
        return () => h("div", { class: "el-pagination-stub" })
    },
})

const ElCheckboxGroupStub = defineComponent({
    name: "ElCheckboxGroup",
    props: {
        modelValue: {
            type: Array,
            default: () => [],
        },
    },
    emits: ["update:modelValue", "change"],
    /**
     * @description: 渲染宫格选择组桩.
     * @param _props 组件属性.
     * @param context setup 上下文.
     * @return 渲染函数.
     */
    setup(_props, { slots }) {
        return () => h("div", { class: "el-checkbox-group-stub" }, slots.default?.())
    },
})

const ElCheckboxStub = defineComponent({
    name: "ElCheckbox",
    /**
     * @description: 渲染复选框桩.
     * @return 渲染函数.
     */
    setup() {
        return () => h("div", { class: "el-checkbox-stub" })
    },
})

const ElDialogStub = defineComponent({
    name: "ElDialog",
    /**
     * @description: 渲染对话框桩并保留插槽.
     * @param _props 组件属性.
     * @param context setup 上下文.
     * @return 渲染函数.
     */
    setup(_props, { slots }) {
        return () => h("div", { class: "el-dialog-stub" }, [slots.header?.(), slots.default?.()])
    },
})

/**
 * @description: 生成基础分页数据.
 * @param records 数据行.
 * @param total 总数.
 * @return 分页对象.
 */
const createPagination = (records: TableData[], total: number = records.length): Pagination<TableData> => ({
    records,
    current_page: 1,
    page_size: 10,
    page_sizes: [10, 20, 50],
    page_count: 1,
    total,
})

/**
 * @description: 生成默认列配置.
 * @return 表格列数组.
 */
const createColumns = (): TableColumn[] => [
    {
        prop: "title",
        label: "标题",
    },
]

/**
 * @description: 生成默认数据行.
 * @return 数据行数组.
 */
const createRows = (): TableData[] =>
    [
        { id: "1", title: "第一条", img: { url: "https://example.com/1.png" } },
        { id: "2", title: "第二条", img: { url: "https://example.com/2.png" } },
    ] as TableData[]

/**
 * @description: 获取最近一次事件载荷.
 * @param wrapper 组件包装器.
 * @param eventName 事件名.
 * @return 最近一次事件参数.
 */
const getLastEmission = (wrapper: ReturnType<typeof mount>, eventName: string) => {
    return wrapper.emitted(eventName)?.at(-1)
}

/**
 * @description: 挂载 BaseTable 并注入通用桩.
 * @param props 覆盖属性.
 * @return 组件包装器.
 */
const mountComponent = (props: Record<string, unknown> = {}) => {
    return mount(BaseTable, {
        props: {
            pagination: createPagination(createRows()),
            tableColumn: createColumns(),
            ...props,
        },
        global: {
            directives: {
                /**
                 * @description: 为测试提供空的单双击指令实现.
                 * @return void.
                 */
                "single-dbl-click": () => void 0,
            },
            stubs: {
                SwitchGroup: SwitchGroupStub,
                CustomCol: true,
                "j-icon": true,
                ElTable: ElTableStub,
                ElTableColumn: true,
                ElButton: ElButtonStub,
                ElInput: ElInputStub,
                ElPagination: ElPaginationStub,
                ElCheckboxGroup: ElCheckboxGroupStub,
                ElCheckbox: ElCheckboxStub,
                ElEmpty: true,
                ElDialog: ElDialogStub,
                ElImageViewer: true,
            },
        },
    })
}

beforeEach(() => {
    vi.useFakeTimers()
    setActivePinia(createPinia())
    elMessageMock.mockReset()
    confirmCommonMock.mockReset()
    deleteConfirmCommonMock.mockReset()
    tableVisibleData.value = []
    tableSelection.value = []
})

afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
    vi.clearAllMocks()
})

describe("BaseTable", () => {
    it("挂载后会同步当前可见行", async () => {
        const rows = createRows()
        const wrapper = mountComponent({
            pagination: createPagination(rows),
        })

        await flushPromises()

        expect(getLastEmission(wrapper, "update-visible-rows")?.[0]).toEqual(rows)
    })

    it("搜索关键字变化时会截断到 50 个字符, 点击搜索按钮会触发 run-search", async () => {
        const wrapper = mountComponent({
            isShowSearch: true,
        })

        const input = wrapper.find(".el-input-stub")
        await input.setValue("x".repeat(60))
        await flushPromises()

        const updateSearchPayload = getLastEmission(wrapper, "update-search")?.[0]
        expect(updateSearchPayload).toHaveLength(50)

        const searchButton = wrapper.findAll(".el-button-stub").find((button) => button.text() === "搜索")
        expect(searchButton).toBeTruthy()

        await searchButton!.trigger("click")

        expect(wrapper.emitted("run-search")).toHaveLength(1)
    })

    it("搜索结果为空时会拦截首次分页事件并恢复分页开关", async () => {
        const wrapper = mountComponent({
            searchStr: "关键字",
            pagination: createPagination([], 0),
        })
        const statusStore = useStatusStore()

        await flushPromises()
        expect(statusStore.disablePagination).toBe(true)

        const pagination = wrapper.findComponent(ElPaginationStub)
        pagination.vm.$emit("update:current-page", 3)
        await flushPromises()

        expect(statusStore.disablePagination).toBe(false)
        expect(wrapper.emitted("update-current-page")).toBeUndefined()

        pagination.vm.$emit("update:current-page", 4)
        await flushPromises()

        expect(getLastEmission(wrapper, "update-current-page")?.[0]).toBe(4)
    })

    it("未选择任何行时批量删除会给出提示", async () => {
        const wrapper = mountComponent({
            isShowDeleteAll: true,
        })

        const deleteButton = wrapper.findAll(".el-button-stub").find((button) => button.text().includes("删除"))
        expect(deleteButton).toBeTruthy()

        await deleteButton!.trigger("click")

        expect(elMessageMock).toHaveBeenCalledWith({
            type: "info",
            message: "请选择需要删除的数据",
        })
        expect(wrapper.emitted("delete-rows")).toBeUndefined()
    })

    it("存在选择项且提供自定义确认文案时, 会走自定义确认并发出删除事件", async () => {
        const rows = createRows()
        tableSelection.value = [rows[0]!]
        confirmCommonMock.mockImplementation((message: string, callback: () => void) => {
            callback()
            return Promise.resolve()
        })

        const wrapper = mountComponent({
            isShowDeleteAll: true,
            deleteConfirmMessage: "确认删除已选数据?",
            pagination: createPagination(rows),
        })

        const deleteButton = wrapper.findAll(".el-button-stub").find((button) => button.text().includes("删除"))
        await deleteButton!.trigger("click")

        expect(confirmCommonMock).toHaveBeenCalledWith("确认删除已选数据?", expect.any(Function), expect.any(Function))
        expect(getLastEmission(wrapper, "delete-rows")?.[0]).toEqual([rows[0]])
    })

    it("排序后会优先同步表格当前可见顺序", async () => {
        const rows = createRows()
        const wrapper = mountComponent({
            pagination: createPagination(rows),
        })

        tableVisibleData.value = [rows[1]!, rows[0]!]

        const table = wrapper.findComponent(ElTableStub)
        table.vm.$emit("sort-change")
        await flushPromises()

        expect(getLastEmission(wrapper, "update-visible-rows")?.[0]).toEqual([rows[1], rows[0]])
    })

    it("宫格模式下点击编辑按钮会透传编辑事件并打开编辑弹窗", async () => {
        const rows = createRows()
        const wrapper = mountComponent({
            isShowEdit: true,
            showListOrGridStatus: false,
            pagination: createPagination(rows),
        })

        const editButton = wrapper.findAll(".el-button-stub").find((button) => button.text() === "编辑")
        expect(editButton).toBeTruthy()

        await editButton!.trigger("click")

        expect(getLastEmission(wrapper, "edit-row")).toEqual([0, rows[0]])
        expect(getLastEmission(wrapper, "edit-item-update-dialog-visible")?.[0]).toBe(true)
    })

    it("列表宫格开关变化时会透传最新状态", async () => {
        const wrapper = mountComponent({
            isShowListOrGrid: true,
            showListOrGridStatus: true,
        })

        wrapper.findComponent(SwitchGroupStub).vm.$emit("update-status", [{ status: false }])
        await flushPromises()

        expect(getLastEmission(wrapper, "update-show-list-or-grid-status")?.[0]).toBe(false)
    })

    it("外部 showListOrGridStatus 变化时会同步切换按钮状态", async () => {
        const wrapper = mountComponent({
            isShowListOrGrid: true,
            showListOrGridStatus: true,
        })

        const getSwitchStatus = () => {
            const switchItems = wrapper.findComponent(SwitchGroupStub).props("switchItems") as Array<{ status: boolean }>
            return switchItems[0]?.status
        }

        expect(getSwitchStatus()).toBe(true)

        await wrapper.setProps({
            showListOrGridStatus: false,
        })
        await flushPromises()

        expect(getSwitchStatus()).toBe(false)
    })
})
