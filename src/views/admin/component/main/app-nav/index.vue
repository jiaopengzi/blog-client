<!--
 * FilePath    : blog-client\src\views\admin\component\main\app-nav\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 导航
-->

<template>
    <div class="components">
        <el-button class="head" type="primary" @click="submitForm">保存</el-button>
        <el-collapse>
            <el-collapse-item v-for="item in navData" :key="item.index" :name="item.index">
                <template #title>
                    <h4 class="collapse-title">{{ item.text }}</h4>
                </template>
                <NavItem ref="formRef" :form-data="item" :rules="rules" :label-width="160" :form-width="800" />
            </el-collapse-item>
        </el-collapse>
    </div>
</template>

<script lang="ts" setup>
import { useHead } from "@unhead/vue"
import type { FormRules } from "element-plus"
import { storeToRefs } from "pinia"
import { reactive, useTemplateRef } from "vue"

import { handleResErr, ResponseCode } from "@/api/response"
import { type GetAPPOptionResponse } from "@/api/setting/getAPPOption"
import { type UpdateAPPOption, updateAPPOptionAPI, type UpdateAPPOptionRequest } from "@/api/setting/updateAPPOption"
import { imageURLRequiredValidatorFunc } from "@/components/common/base-config-form"
import { IconKeys } from "@/components/common/icons"
import { checkIconKeys } from "@/components/common/icons"
import { RouteNames } from "@/router"
import { useOptionsStore } from "@/stores/options" // 网站配置选项
import { MessageUtil } from "@/utils/message"
import { adminMenuItemMap } from "@/views/admin/component/aside"

import NavItem, { type NavItemFormRef, type NavItemProps } from "./nav-item"

defineOptions({ name: RouteNames.SettingAPPNav })

useHead({
    title: adminMenuItemMap[RouteNames.SettingAPPNav].text,
})

// 获取网站配置选项
const optionsStore = useOptionsStore()

const formRef = useTemplateRef<NavItemFormRef>("formRef")

const { app_options: optionDataSrc } = storeToRefs(optionsStore)

const navData = reactive<NavItemProps[]>([
    {
        index: "1",
        text: "首页",
        href: "admin/post-all",
        parentIndex: "",
        icon: {
            name: IconKeys.H1,
            src: "http://10.10.2.222:7364/api/v1/uploads/2025/03/22/s-1-ac79f0db.svg",
            style: "width: 24px; height: 24px; fill: red; font-size: 24px;",
        },
        is_enabled: true,
    },
    {
        index: "2",
        text: "Power BI",
        href: "admin/post-all",
        parentIndex: "",
        icon: {
            name: IconKeys.Demo,
            src: "http://10.10.2.222:7364/api/v1/uploads/2025/03/22/s-1-ac79f0db.svg",
            style: "width: 24px; height: 24px; fill: red; font-size: 24px;",
        },
        is_enabled: true,
    },
    {
        index: "3",
        text: "视频课",
        href: "admin/post-all",
        parentIndex: "",
        icon: {
            name: IconKeys.Video,
            src: "http://10.10.2.222:7364/api/v1/uploads/2025/03/22/s-1-ac79f0db.svg",
            style: "width: 24px; height: 24px; fill: red; font-size: 24px;",
        },
        is_enabled: true,
    },
    {
        index: "4",
        text: "文档",
        href: "admin/post-all",
        parentIndex: "",
        icon: {
            name: IconKeys.Doc,
            src: "http://10.10.2.222:7364/api/v1/uploads/2025/03/22/s-1-ac79f0db.svg",
            style: "width: 24px; height: 24px; fill: red; font-size: 24px;",
        },
        is_enabled: true,
    },
    {
        index: "5",
        text: "加入vip",
        text_style: "color: red;",
        href: "admin/post-all",
        parentIndex: "",
        icon: {
            name: IconKeys.Vip,
            src: "http://10.10.2.222:7364/api/v1/uploads/2025/03/22/s-1-ac79f0db.svg",
            style: "width: 24px; height: 24px; fill: red; font-size: 24px;",
        },
        is_enabled: true,
    },
    {
        index: "6",
        text: "DAX",
        href: "admin/post-all",
        parentIndex: "1",
        icon: {
            name: IconKeys.Bold,
            src: "http://10.10.2.222:7364/api/v1/uploads/2025/03/22/s-1-ac79f0db.svg",
            style: "width: 24px; height: 24px; fill: red; font-size: 24px;",
        },
        is_enabled: true,
    },
])

const submitForm = async () => {
    // // 校验表单
    // if (formRef.value) {
    //     if (!(await formRef.value.validateForm())) {
    //         return
    //     }
    // }
    // const reqList: UpdateAPPOption[] = []
    // const optionDataTar = formRef.value?.formDataResult
    // // 循环历遍 optionData 的所有属性
    // for (const key in optionDataTar) {
    //     if (Object.prototype.hasOwnProperty.call(optionDataTar, key)) {
    //         const valTar = optionDataTar[key as keyof APPOptionForm]
    //         const itemSrc = optionDataSrc.value[key as keyof GetAPPOptionResponse]
    //         // 判断是否更新
    //         const valSrc = optionDataSrc.value[key as keyof GetAPPOptionResponse].value
    //         if (valTar.toString() !== valSrc) {
    //             reqList.push({
    //                 key: key as keyof APPOptionForm,
    //                 value: valTar.toString(),
    //                 type: itemSrc.type,
    //             })
    //         }
    //     }
    // }
    // const req = { options: reqList } as UpdateAPPOptionRequest
    // const res = await updateAPPOptionAPI(req)
    // if (res.data.code === ResponseCode.UpdateAPPOptionSuccess) {
    //     optionsStore.update(true) // 强制刷新
    //     MessageUtil.success("更新成功")
    // } else {
    //     MessageUtil.error(handleResErr(res), 10000)
    // }
}

const rules = reactive<FormRules<NavItemProps>>({
    index: [
        {
            required: true,
            message: "请输入索引",
            trigger: "blur",
        },
    ],
    text: [
        {
            required: true,
            message: "请输入文字",
            trigger: "blur",
        },
    ],
    href: [
        {
            required: true,
            message: "请输入目的",
            trigger: "blur",
        },
    ],
    parentIndex: [
        {
            required: false,
            trigger: "blur",
        },
    ],
    "icon.name": [
        {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            validator: (rule: any, value: any, callback: any) => {
                const isIconKey = checkIconKeys(value as IconKeys)
                if (value === "") {
                    callback()
                } else if (!isIconKey) {
                    callback(new Error("请输入正确的内置图标"))
                } else {
                    callback()
                }
            },
            trigger: "blur",
        },
    ],
    "icon.src": [
        {
            validator: imageURLRequiredValidatorFunc,
            trigger: "blur",
        },
    ],
})
</script>

<style lang="scss" scoped>
.components {
    padding-top: 10px;
    padding-left: 10px;
    width: 960px;
}

.head {
    margin-bottom: 10px;
}

.collapse-title {
    font-size: 14px;
    font-weight: 700;
    color: var(--jpz-text-color-regular);
    padding-left: 10px;
}
</style>
