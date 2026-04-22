/*
 * FilePath    : blog-client\src\components\common\post-upsert\useSnapshot.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 数据快照，用于跟踪文章编辑状态
 */

import { type Reactive, reactive, ref, watch } from "vue"

import { useUserStore } from "@/stores/user"
import { deepClone, getUpdatedFields } from "@/utils/obj"

import type { UpsertPostForm } from "./types"

/**
 * 数据快照
 * @param postInfoForm 文章表单
 */
export function useSnapshot(postInfoForm: Reactive<UpsertPostForm>) {
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
    const updateSnapshot = async () => {
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

    return { isUpdate, updatedFields, updateSnapshot, updateStatus }
}
