/*
 * FilePath    : blog-client\src\views\admin\component\main\notification\component\view\hooks.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 表单验证
 */

import type { FormRules } from "element-plus" // 需要全部安装 npm i element-plus -S
import { type Reactive, reactive, type Ref, watch } from "vue"

import { type PgSqlDateTime } from "@/api/common"
import { NotificationCategory, NotificationFormat, NotificationPushStatus, NotificationStatus } from "@/api/notification/common"
import { type UserCountGroupByRole } from "@/api/user/getUserCountGroupByRole"
import { RegexPatterns } from "@/utils/regexPatterns"

import type { ViewForm } from "./types"

// 表单验证选项
interface FormValidationOptions {
    form: {
        id?: Ref<string | undefined> // ID
        to_list?: Ref<string | undefined> // 通知接收人列表,逗号分隔
        exclude_to_list?: Ref<string | undefined> // 排除的接收人列表,逗号分隔
        subject?: Ref<string> // 通知主题
        content?: Ref<string> // 通知内容
        push_time?: Ref<PgSqlDateTime | undefined> // 过期时间
        push_status?: Ref<NotificationPushStatus | undefined> // 是否已推送, 1未推送,2推送中,3已推送
        category?: Ref<NotificationCategory> // 通知类别
        status?: Ref<NotificationStatus> // 状态 1禁用, 2启用
        format?: Ref<NotificationFormat> // 通知格式 1html, 2纯文本
    }
    userCountItems: Reactive<UserCountGroupByRole[]>
}

// 表单验证
export function useFormValidation(options: FormValidationOptions): {
    addRules: FormRules<ViewForm>
    editRules: FormRules<ViewForm>
} {
    const { userCountItems } = options

    // 将 userCountItems 中的角色名称放到 set 中，方便快速查找
    const userCountSet = new Set(userCountItems.map((item) => item.role_name))
    watch(
        () => userCountItems,
        (newItems) => {
            userCountSet.clear()
            newItems.forEach((item) => {
                userCountSet.add(item.role_name)
            })
        },
        { immediate: true, deep: true }, // 立即执行并深度监听,
    )

    // 检查标签名称是否可用
    function checkToListValidator(rule: unknown, value: string, callback: (error?: string | Error | undefined) => void): void {
        // 将 接收人列表转换为数组
        const toListArray = value.split(",").map((item) => item.trim())

        // 历遍 toListArray 检查每个接收人, 是否符合邮箱或者角色
        for (const item of toListArray) {
            // 如果是空,则是清空操作
            if (item === "") {
                callback()
                return
            }

            if (!RegexPatterns.Email.test(item) && !userCountSet.has(item)) {
                callback(new Error(`"${item}" 不符合邮箱格式或角色名称`))
                return
            }
        }

        callback() // 验证通过
    }

    const addRules = reactive<FormRules<ViewForm>>({
        category: [{ required: true, message: "请选择分类", trigger: "blur" }],
        subject: [{ required: true, message: "请输入主题", trigger: "blur" }],
        content: [{ required: true, message: "请输入通知内容", trigger: "change" }],
        to_list: [
            { required: true, message: "接收者不能为空", trigger: "blur" },
            { validator: checkToListValidator, trigger: "change" },
        ],
        exclude_to_list: [{ validator: checkToListValidator, trigger: "change" }],
        push_time: [{ required: true, message: "请选择推送时间", trigger: "blur" }],
    })

    /**
     * @description: 表单校验规则
     * @return  FormRules<EditMediaForm> 表单校验规则 trigger: 'blur' 表示失去焦点时校验 'change' 表示值改变时校验
     */
    const editRules = reactive<FormRules<ViewForm>>({
        id: [{ required: true, message: "id 不能为空", trigger: "blur" }],
        category: [{ required: true, message: "请选择分类", trigger: "blur" }],
        subject: [{ required: true, message: "请输入主题", trigger: "blur" }],
        content: [{ required: true, message: "请输入通知内容", trigger: "change" }],
        to_list: [
            { required: true, message: "接收者不能为空", trigger: "blur" },
            { validator: checkToListValidator, trigger: "change" },
        ],
        exclude_to_list: [{ validator: checkToListValidator, trigger: "change" }],
        push_time: [{ required: true, message: "请选择推送时间", trigger: "blur" }],
    })

    return {
        addRules,
        editRules,
    }
}
