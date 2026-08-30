<!--
 * FilePath    : blog-client-nuxt\src\components\views\admin\component\main\app-nav\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 导航
-->

<template>
    <div class="components">
        <el-button class="head" type="primary" @click="submitForm">保存</el-button>
        <el-button class="head" type="primary" @click="handleAdd">增加</el-button>
        <el-button class="head" type="primary" @click="toggleDisabledDrag" v-if="isShowDrag">{{ isDisabledDrag ? "开启拖拽" : "关闭拖拽" }}</el-button>
        <div class="description" v-if="isShowDrag">导航项可以拖拽排序，在输入的时候无法选中文字，请关闭拖拽排序</div>
        <el-collapse v-model="activeNames">
            <VueDraggable v-model="navList" :animation="150" @end="onEnd" :disabled="isDisabledDrag">
                <el-collapse-item v-for="(item, i) in navList" :key="item.index" :name="item.index">
                    <template #title>
                        <h4 class="collapse-title">{{ item.text }}</h4>
                    </template>
                    <NavItem
                        :ref="
                            (el) => {
                                if (el) navItemRefs[i] = el as NavItemFormRef
                            }
                        "
                        :form-data="item"
                        :label-width="160"
                        :form-width="800"
                        @handle-delete="handleDelete"
                    />
                </el-collapse-item>
            </VueDraggable>
        </el-collapse>
    </div>
    <div v-if="isEmpty" class="no-data">
        <el-empty description="暂无导航" />
    </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia"
import { computed, onBeforeMount, reactive, ref } from "vue"
import { VueDraggable } from "vue-draggable-plus"

import { OptionType } from "@/api/common"
import { handleResErr, ResponseCode } from "@/api/response"
import { type UpdateAPPOption, updateAPPOptionAPI, type UpdateAPPOptionRequest } from "@/api/setting/updateAPPOption"
import { IconKeys } from "@/components/common/icons"
import { RouteNames } from "@/router"
import { useOptionsStore } from "@/stores/options" // 网站配置选项
import { invalidateSsrRenderCache } from "@/utils/ssrCache"
import { MessageUtil } from "@/utils/message"
import { adminMenuItemMap } from "@/components/views/admin/component/aside"

import NavItem, { type NavItemFormRef } from "./nav-item"

defineOptions({ name: RouteNames.SettingAPPNav })

useHead({
    title: adminMenuItemMap[RouteNames.SettingAPPNav].text,
})

// 获取网站配置选项
const optionsStore = useOptionsStore()

const navItemRefs = reactive<{ [key: number]: NavItemFormRef | undefined }>({})

const { navList } = storeToRefs(optionsStore)

// payload 瘦身适配 (bugfix 260825-03): navList (含禁用项) 不再随 SSR payload 注水,
// 后台导航管理需要全量列表, 为空时 (首次访问 / 从公开页站内切入) 从服务器拉取全量配置补齐
onBeforeMount(async () => {
    if (navList.value.length === 0) {
        await optionsStore.update(true)
    }
})

const isShowDrag = computed(() => navList.value.length > 1)

const onEnd = () => {
    // 拖拽结束后按新顺序更新 navList 的 index
    navList.value = navList.value.map((item, i) => {
        item.index = `${i + 1}`
        return item
    })
}

// 是否禁用拖拽
const isDisabledDrag = ref(true)

// 切换是否禁用拖拽
const toggleDisabledDrag = () => {
    isDisabledDrag.value = !isDisabledDrag.value
}

const isEmpty = computed(() => navList.value.length === 0)
const activeNames = ref<string[]>([])

const handleAdd = () => {
    navList.value.push({
        index: `${navList.value.length + 1}`,
        text: "新增",
        href: "/",
        parentIndex: "",
        icon: {
            name: "" as IconKeys,
            src: "",
            style: "",
        },
        is_enabled: true,
    })
}

const handleDelete = (index: string) => {
    const indexTar = navList.value.findIndex((item) => item.index === index)
    if (indexTar !== -1) {
        navList.value.splice(indexTar, 1)
    }
}

// 验证所有表单
const validateForms = async (): Promise<boolean[]> => {
    const promises: Promise<boolean>[] = []

    // 添加每个 form 的验证
    for (const key in navItemRefs) {
        if (navItemRefs[key]) {
            promises.push(navItemRefs[key].validateForm())
        }
    }

    // 等待所有验证完成
    return await Promise.all(promises)
}

// 验证数据, navList 列表中是否存在重复的 index
const validateData = async (): Promise<boolean> => {
    const indexList: string[] = []
    for (const item of navList.value) {
        if (indexList.includes(item.index)) {
            MessageUtil.error("导航索引重复: " + item.index)
            return false
        }
        indexList.push(item.index)
    }
    return true
}

// 打开所有折叠面板
const openAllCollapse = () => {
    activeNames.value = navList.value.map((item) => item.index)
}

const submitForm = async () => {
    // 校验表单
    const validList = await validateForms()

    // 如果有一个表单不通过, 则不提交
    if (validList.some((item) => !item)) {
        openAllCollapse()
        return
    }

    // 校验数据
    if (!(await validateData())) {
        openAllCollapse()
        return
    }

    // 将 navList 转成字符串
    const navListStr = JSON.stringify(navList.value)

    const reqNav: UpdateAPPOption = {
        key: "nav",
        value: navListStr,
        type: OptionType.JSON,
    }

    // 更新网站配置选项
    const req = { options: [reqNav] } as UpdateAPPOptionRequest
    const res = await updateAPPOptionAPI(req)
    if (res.data.code === ResponseCode.UpdateAPPOptionSuccess) {
        optionsStore.update(true) // 强制刷新
        // feature01(260829-08): 导航影响所有 SSR 页直出的页头/页脚, 保存成功后
        // 立即清空 swr 渲染缓存, 下次请求按新导航重新 SSR
        await invalidateSsrRenderCache()
        MessageUtil.success("更新成功")
    } else {
        MessageUtil.error(handleResErr(res))
    }
}
</script>

<style lang="scss" scoped>
.components {
    padding-top: 10px;
    padding-left: 10px;
    width: 960px;
}

.description {
    color: var(--jpz-text-color-regular);
    font-size: 14px;
    margin: 20px 0;
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

.no-data {
    width: 100%;
    height: calc(100% - pc.$height-header);
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
