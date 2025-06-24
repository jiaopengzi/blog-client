<!--
 * FilePath    : blog-client\src\views\admin\component\main\notification\component\view\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 通知展示组件
-->

<template>
    <div class="view-page">
        <el-form
            :label-position="labelPosition"
            label-width="100px"
            ref="viewFormRef"
            :model="viewData"
            :rules="rules"
            class="view-form"
            :size="formSize"
            status-icon
        >
            <el-form-item v-if="isShowId" label="ID" prop="id">
                <el-input v-model="viewDataAc.id" disabled />
            </el-form-item>
            <el-form-item label="分类" prop="category">
                <el-select v-model="viewDataAc.category" clearable placeholder="请选择分类">
                    <el-option v-for="item in optionsCategory" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
            </el-form-item>

            <el-form-item v-if="isShowMore" label="接收者" prop="to_list">
                <el-input-tag clearable v-model="toList" placeholder="请输入接收者信息-选填" />
                <RolesTag :items="userCountItems" @click="toListRolesTagClick" />
            </el-form-item>
            <el-form-item v-if="isShowMore" label="排除接受者" prop="exclude_to_list">
                <el-input-tag clearable v-model="excludeToList" placeholder="请输入排除接受者信息-必填" />
                <RolesTag :items="userCountItems" @click="excludeToListRolesTagClick" />
            </el-form-item>
            <el-form-item label="主题" prop="subject">
                <el-input v-model="viewDataAc.subject" placeholder="请输通知主题-必填" />
            </el-form-item>
            <el-form-item label="内容" prop="content">
                <el-input v-model="viewDataAc.content" type="textarea" placeholder="请输入通知内容-选填" :rows="5" />
            </el-form-item>
            <el-form-item label="格式" prop="format">
                <el-select v-model="viewDataAc.format" clearable placeholder="请选择通知格式">
                    <el-option v-for="item in optionsFormat" :key="item.value" :label="NotificationFormatDisplay[item.value]" :value="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item v-if="isShowMore" label="推送时间" prop="push_time">
                <el-date-picker
                    v-model="viewDataAc.push_time.Time"
                    type="datetime"
                    placeholder="请选择推送时间"
                    :shortcuts="generateShortcuts('推送')"
                    :default-time="defaultTime"
                />
            </el-form-item>
            <el-form-item v-if="isShowMore" label="推送" prop="push_status">
                <el-radio-group disabled v-model="viewDataAc.push_status">
                    <el-radio v-for="item in optionsPushStatus" :key="item.value" :value="item.value">
                        {{ NotificationPushStatusDisplay[item.value] }}
                    </el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="启用" prop="status">
                <el-radio-group v-model="viewDataAc.status">
                    <el-radio v-for="item in optionsStatus" :key="item.value" :value="item.value">
                        {{ NotificationStatusDisplay[item.value] }}
                    </el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>

        <div class="btn-submit">
            <el-button type="primary" :loading="btnLoading" @click="submitForm(viewFormRef as FormInstance)">{{ btnSubmitDisplay }}</el-button>
            <el-button v-if="isShowSendTest" type="primary" :loading="btnLoadingSendTest" @click="sendTest">发送测试</el-button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { FormInstance } from "element-plus" // 需要全部安装 npm i element-plus -S
import { onBeforeMount, reactive, ref, toRefs, useTemplateRef, watch } from "vue"

import {
    getNotificationCategoryOptions,
    getNotificationFormatOptions,
    getNotificationPushStatusOptions,
    getNotificationStatusOptions,
    NotificationCategory,
    NotificationFormatDisplay,
    NotificationPushStatusDisplay,
    NotificationStatusDisplay,
} from "@/api/notification/common"
import { notificationSendTestAPI, type NotificationSendTestRequest } from "@/api/notification/sendTest"
import { handleResErr, ResponseCode } from "@/api/response"
import { getUserCountGroupByRoleAPI, type UserCountGroupByRole } from "@/api/user/getUserCountGroupByRole"
import RolesTag from "@/components/common/roles-tag"
import { generateShortcuts } from "@/utils/dateTime"
import { MessageUtil } from "@/utils/message"

import { useFormValidation } from "./hooks"
import type { ViewForm } from "./types"

defineOptions({ name: "CommonView" })

// props
const {
    viewData,
    btnSubmitDisplay = "提交",
    isShowId = false,
    btnLoading = false,
    isShowSendTest = false,
} = defineProps<{
    viewData: ViewForm // 展示信息
    btnSubmitDisplay?: string // 提交按钮显示文字
    isShowId?: boolean // 是否显示ID
    btnLoading?: boolean // 提交按钮加载状态
    isShowSendTest?: boolean // 是否显示发送测试按钮
}>()

// emits
const emit = defineEmits<{
    (event: "submit-data", value: ViewForm): void // 提交数据
}>()

// 表单label位置 top | left | right
const labelPosition = ref("left")

// 表单大小 '' | 'large' | 'default' | 'small'
const formSize = ref("large")

// 表单实例
const viewFormRef = useTemplateRef<FormInstance>("viewFormRef")

// 定义 v-model 的数据
const viewDataAc = reactive<ViewForm>(viewData)

const optionsCategory = getNotificationCategoryOptions()
const optionsFormat = getNotificationFormatOptions()
const optionsStatus = getNotificationStatusOptions()
const optionsPushStatus = getNotificationPushStatusOptions()

const isShowMore = ref<boolean>(false)
const toList = ref<string[]>(viewDataAc.to_list ? viewDataAc.to_list.split(",").map((item) => item.trim()) : [])
const excludeToList = ref<string[]>(viewDataAc.exclude_to_list ? viewDataAc.exclude_to_list.split(",").map((item) => item.trim()) : [])

// 默认时间为当前日期
const defaultTime = new Date()

// 获取用户数量分组信息
const userCountItems = reactive<UserCountGroupByRole[]>([])
const getUserCountItems = async () => {
    await getUserCountGroupByRoleAPI().then((res) => {
        if (res.data.code === ResponseCode.GetUserCountGroupByRolesSuccess) {
            Object.assign(userCountItems, res.data.data)
        }
    })
}
/**
 * 对字符串数组进行去重，并返回去重前后的长度
 */
const deduplicateStringArrayWithCount = (list: string[] | undefined) => {
    if (!list || !Array.isArray(list)) {
        return { countOld: 0, countNew: 0 }
    }

    const countOld = list.length // 去重前长度
    const uniqueValues = new Set(list) // 去重
    list = Array.from(uniqueValues)
    const countNew = list.length // 去重后长度
    return { countOld, countNew }
}

// 判断 toList 中是否包含有 excludeToList 的内容
// 如果有的话将其从 toList 和 excludeToList 中移除, 并提示用户
const checkToListAndExcludeToList = () => {
    if (!toList.value || !excludeToList.value) return

    // 找到 toList 中存在于 excludeToList 的元素
    const intersection = toList.value.filter((item) => excludeToList.value.includes(item))

    if (intersection.length > 0) {
        // 如果有交集，则从 toList 和 excludeToList 中移除这些元素
        intersection.forEach((item) => {
            const indexInToList = toList.value.indexOf(item)
            if (indexInToList > -1) {
                toList.value.splice(indexInToList, 1)
            }

            const indexInExcludeToList = excludeToList.value.indexOf(item)
            if (indexInExcludeToList > -1) {
                excludeToList.value.splice(indexInExcludeToList, 1)
            }
        })

        MessageUtil.warning(`接收者和排除接收者中不能包含相同的角色: ${intersection.join(", ")}`, 6000)
    }
}

watch(
    () => toList.value,
    async (newValue) => {
        // 获取去重前后的长度
        const { countOld, countNew } = deduplicateStringArrayWithCount(newValue)

        // 如果去重前后长度不相同，更新 toList
        if (countOld !== countNew) {
            toList.value = newValue
        }

        if (!newValue || newValue.length === 0) {
            viewDataAc.to_list = ""
            return
        }
        viewDataAc.to_list = newValue.join(",")

        // 检查 toList 和 excludeToList 是否有交集
        checkToListAndExcludeToList()

        // 手动校验
        await viewFormRef.value?.validateField("to_list")
    },
    {
        immediate: true, // 立即执行一次
        deep: true, // 深度监听
    },
)

watch(
    () => excludeToList.value,
    async (newValue) => {
        // 获取去重前后的长度
        const { countOld, countNew } = deduplicateStringArrayWithCount(newValue)

        // 如果去重前后长度不相同，更新 excludeToList
        if (countOld !== countNew) {
            excludeToList.value = newValue
        }

        if (!newValue || newValue.length === 0) {
            viewDataAc.exclude_to_list = ""
            return
        }
        viewDataAc.exclude_to_list = newValue.join(",")

        // 检查 toList 和 excludeToList 是否有交集
        checkToListAndExcludeToList()

        // 手动校验
        await viewFormRef.value?.validateField("exclude_to_list")
    },
    {
        immediate: true, // 立即执行一次
        deep: true, // 深度监听
    },
)

watch(
    () => viewDataAc.category,
    (newValue) => {
        if (newValue === NotificationCategory.ScheduledTask) {
            isShowMore.value = true
        } else {
            isShowMore.value = false
            // 如果不是 ScheduledTask 则清空 to_list 和 exclude_to_list
            toList.value = []
            excludeToList.value = []
            viewDataAc.to_list = ""
            viewDataAc.exclude_to_list = ""
        }
    },
    {
        immediate: true, // 立即执行一次
        deep: true, // 深度监听
    },
)

// 处理角色标签点击事件
const handleRolesTagClick = (item: UserCountGroupByRole, list: string[]): string[] => {
    // 判断 item.role_name 是否已经存在于 toListArray 中
    if (list.includes(item.role_name)) {
        // 移除角色
        const index = list.indexOf(item.role_name)
        if (index > -1) {
            list.splice(index, 1)
        }

        // 更新 to_list
        return list
    } else {
        // 在头部添加角色
        list.unshift(item.role_name)
        // 更新 to_list
        return list
    }
}

// 处理 to_list 和 exclude_to_list 的角色标签点击事件
const toListRolesTagClick = async (item: UserCountGroupByRole) => {
    // 当清空的时, toList.value 可能为 undefined 或 null, 将其初始化为空数组
    if (toList.value == undefined || toList.value == null) {
        toList.value = []
    }

    const toListArray = handleRolesTagClick(item, toList.value)
    toList.value = toListArray
    viewDataAc.to_list = toListArray.join(",")
}

const excludeToListRolesTagClick = async (item: UserCountGroupByRole) => {
    // 当清空的时, excludeToList.value 可能为 undefined 或 null, 将其初始化为空数组
    if (excludeToList.value == undefined || excludeToList.value == null) {
        excludeToList.value = []
    }

    const excludeToListArray = handleRolesTagClick(item, excludeToList.value)
    excludeToList.value = excludeToListArray
    viewDataAc.exclude_to_list = excludeToListArray.join(",")
}

// hooks
const { addRules, editRules } = useFormValidation({
    form: toRefs(viewDataAc),
    userCountItems,
})

// 根据是否显示ID来判断使用哪个rules
const rules = isShowId ? editRules : addRules

const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate(async (valid) => {
        if (valid) {
            emit("submit-data", viewData)
        }
    })
}

// 测试通知
const btnLoadingSendTest = ref(false)

// 发送测试通知
const sendTest = async () => {
    btnLoadingSendTest.value = true
    const req: NotificationSendTestRequest = {
        id: viewDataAc.id!, // 通知ID
    }

    const res = await notificationSendTestAPI(req)
    if (res.data.code === ResponseCode.NotificationSendTestSuccess) {
        btnLoadingSendTest.value = false
        MessageUtil.success(res.data.msg, 6000)
    } else {
        btnLoadingSendTest.value = false
        MessageUtil.error(handleResErr(res), 6000)
    }
}

// 初始化获取用户数量分组信息
onBeforeMount(async () => {
    await getUserCountItems()
})
</script>

<style lang="scss" scoped>
.view-page {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.view-form {
    width: 600px;
}

.btn-submit {
    text-align: center;
}

.btn-submit .el-form-item {
    display: inline-block;
}
</style>
