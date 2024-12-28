/**
 * @Author       : jiaopengzi
 * @Date         : 2024-12-28 12:54:49
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-28 15:32:45
 * @FilePath     : \blog-client\src\views\admin\component\main\post-write\useSnapshot.ts
 * @Description  : 数据快照
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { ref, reactive, watch } from "vue"
import type { UpsertPostForm } from "./index"
import { deepClone, getUpdatedFields } from "@/utils/obj"
import { useUserStore } from "@/stores/user"

/**
 * 数据快照
 * @param postInfoForm 文章表单
 */
export function useSnapshot(postInfoForm: UpsertPostForm) {
    // 是否编辑状态
    const userStore = useUserStore()
    userStore.setIsEditing(true)

    // 快照
    const postInfoSnapshot = reactive<UpsertPostForm>(deepClone(postInfoForm))

    // 更新字段
    const updatedFields = reactive<Partial<UpsertPostForm>>({})

    // 是否更新
    const isUpdate = ref(false)

    // 更新状态和字段
    const updateStatus = () => {
        // 首先清空原有的更新字段
        Object.keys(updatedFields).forEach((key) => {
            delete updatedFields[key as keyof UpsertPostForm]
        })

        // 获取更新字段
        Object.assign(updatedFields, getUpdatedFields(postInfoSnapshot, postInfoForm, "id"))

        // 更新是否编辑状态
        isUpdate.value = Object.keys(updatedFields).length > 0
        userStore.setIsEditing(isUpdate.value)
    }

    // 更新快照
    const updateSnapshot = () => {
        Object.assign(postInfoSnapshot, deepClone(postInfoForm))
        updateStatus()
    }

    // 监听是否更新
    watch(
        () => postInfoForm,
        () => {
            updateStatus()
        },
        { deep: true },
    )

    return { isUpdate, updatedFields, updateSnapshot }
}
