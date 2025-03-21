<!--
 * FilePath    : blog-client\src\views\admin\component\main\app-option\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 网站选项
-->

<template>
    <div class="components">
        <el-button class="head" type="primary" @click="submitForm">保存</el-button>
        <BaseForm ref="formRef" title="网站选项" :form-data="optionData" :rules="rules" :form-items="formItems" :label-width="160" :form-width="800" />
        <el-button class="foot" type="primary" @click="submitForm">保存</el-button>
    </div>
</template>

<script lang="ts" setup>
import { useHead } from "@unhead/vue"
import type { FormRules } from "element-plus"
import { storeToRefs } from "pinia"
import { onBeforeMount, reactive, useTemplateRef } from "vue"

import { OptionType } from "@/api/common"
import { handleResErr, ResponseCode } from "@/api/response"
import { type GetAPPOptionResponse } from "@/api/setting/getAPPOption"
import { type UpdateAPPOption, updateAPPOptionAPI, type UpdateAPPOptionRequest } from "@/api/setting/updateAPPOption"
import { imageURLRequiredValidatorFunc } from "@/components/common/base-config-form"
import { RouteNames } from "@/router"
import { useOptionsStore } from "@/stores/options" // 网站配置选项
import { MessageUtil } from "@/utils/message"
import { adminMenuItemMap } from "@/views/admin/component/aside"

import BaseForm, { type APPOptionForm, type APPOptionFormRef } from "./base"

defineOptions({ name: RouteNames.SettingAPPOption })

useHead({
    title: adminMenuItemMap[RouteNames.SettingAPPOption].text,
})

// 获取网站配置选项
const optionsStore = useOptionsStore()

const formRef = useTemplateRef<APPOptionFormRef>("formRef")

const { app_options: optionDataSrc } = storeToRefs(optionsStore)
const optionData = reactive<APPOptionForm>({} as APPOptionForm)

const submitForm = async () => {
    // 校验表单
    if (formRef.value) {
        if (!(await formRef.value.validateForm())) {
            return
        }
    }
    const reqList: UpdateAPPOption[] = []
    const optionDataTar = formRef.value?.formDataResult
    // 循环历遍 optionData 的所有属性
    for (const key in optionDataTar) {
        if (Object.prototype.hasOwnProperty.call(optionDataTar, key)) {
            const valTar = optionDataTar[key as keyof APPOptionForm]
            const itemSrc = optionDataSrc.value[key as keyof GetAPPOptionResponse]
            // 判断是否更新
            const valSrc = optionDataSrc.value[key as keyof GetAPPOptionResponse].value
            if (valTar.toString() !== valSrc) {
                reqList.push({
                    key: key as keyof APPOptionForm,
                    value: valTar.toString(),
                    type: itemSrc.type,
                })
            }
        }
    }
    const req = { options: reqList } as UpdateAPPOptionRequest
    const res = await updateAPPOptionAPI(req)
    if (res.data.code === ResponseCode.UpdateAPPOptionSuccess) {
        optionsStore.update(true) // 强制刷新
        MessageUtil.success("更新成功")
    } else {
        MessageUtil.error(handleResErr(res), 10000)
    }
}

const rules = reactive<FormRules<APPOptionForm>>({
    logo: [
        {
            validator: imageURLRequiredValidatorFunc,
            trigger: "blur",
        },
    ],
    favicon: [
        {
            validator: imageURLRequiredValidatorFunc,
            trigger: "blur",
        },
    ],
    wechat_official_account_qrcode: [
        {
            validator: imageURLRequiredValidatorFunc,
            trigger: "blur",
        },
    ],
    wechat_qrcode: [
        {
            validator: imageURLRequiredValidatorFunc,
            trigger: "blur",
        },
    ],
    qq_qrcode: [
        {
            validator: imageURLRequiredValidatorFunc,
            trigger: "blur",
        },
    ],

    beian_mps_icon: [
        {
            validator: imageURLRequiredValidatorFunc,
            trigger: "blur",
        },
    ],
    beian_miit_icon: [
        {
            validator: imageURLRequiredValidatorFunc,
            trigger: "blur",
        },
    ],
})

const formItems = [
    // logo 相关
    { label: "logo", isCategoryTitle: true },
    { label: "logo", prop: "logo", isImageInput: true },
    { label: "favicon", prop: "favicon", isImageInput: true },

    // 文章相关
    { label: "文章", isCategoryTitle: true },
    { label: "轮播图间隔(秒)", prop: "carousel_interval" },
    { label: "文章文字截断(字数)", prop: "post_text_truncate" },
    { label: "文章摘要截断(字数)", prop: "post_summary_truncate" },
    { label: "显示历史上今天", prop: "history_today_enable", isCheckbox: true },
    { label: "显示阅读模式", prop: "reading_mode_enable", isCheckbox: true },
    { label: "显示文章字数", prop: "word_count_enable", isCheckbox: true },
    { label: "显示阅读时间", prop: "reading_time_enable", isCheckbox: true },
    { label: "显示创建时间", prop: "show_create_time_enable", isCheckbox: true },
    { label: "显示分类", prop: "show_category_enable", isCheckbox: true },
    { label: "显示点赞", prop: "show_like_enable", isCheckbox: true },
    { label: "显示收藏", prop: "show_favorite_enable", isCheckbox: true },
    { label: "显示标签", prop: "show_tags_enable", isCheckbox: true },
    { label: "显示版权信息", prop: "show_copyright_enable", isCheckbox: true },
    { label: "版权信息", prop: "show_copyright_info", isCheckbox: true },
    { label: "显示文末固定信息", prop: "article_footer_info_enable", isCheckbox: true },
    { label: "文末固定信息", prop: "article_footer_info", isCheckbox: true },

    // 互动相关
    { label: "互动", isCategoryTitle: true },
    { label: "开启点赞", prop: "like_enable", isCheckbox: true },
    { label: "开启收藏", prop: "favorite_enable", isCheckbox: true },
    { label: "开启分享", prop: "share_enable", isCheckbox: true },
    { label: "开启海报", prop: "poster_enable", isCheckbox: true },
    { label: "开启分享链接", prop: "link_enable", isCheckbox: true },

    // seo 相关
    { label: "SEO", isCategoryTitle: true },
    { label: "SEO 标题", prop: "seo_title" },
    { label: "SEO 关键词", prop: "seo_keywords" },
    { label: "SEO 描述", prop: "seo_description" },
    { label: "首页主标题", prop: "custom_home_title" },
    { label: "首页副标题", prop: "custom_home_subtitle" },
    { label: "标题分隔符", prop: "separator" },
    { label: "站点地图", prop: "sitemap", type: "textarea" },
    { label: "页脚统计代码", prop: "footer_statistics_code", type: "textarea" },

    // 二维码相关
    { label: "二维码", isCategoryTitle: true },
    { label: "微信公用号", prop: "wechat_official_account_qrcode", isImageInput: true },
    { label: "微信", prop: "wechat_qrcode", isImageInput: true },
    { label: "QQ", prop: "qq_qrcode", isImageInput: true },

    { label: "底部标题和内容", isCategoryTitle: true },
    { label: "左侧标题", prop: "footer_left_title" },
    { label: "左侧内容", prop: "footer_left_content", type: "textarea" },

    { label: "右侧标题", prop: "footer_right_title" },
    { label: "右侧内容", prop: "footer_right_content", type: "textarea" },

    { label: "底部二维码1", isCategoryTitle: true },
    { label: "开启", prop: "footer_qrcode1_enable", isCheckbox: true },
    { label: "二维码", prop: "footer_qrcode1", isImageInput: true },
    { label: "描述", prop: "footer_qrcode1_description" },

    { label: "底部二维码2", isCategoryTitle: true },
    { label: "开启", prop: "footer_qrcode2_enable", isCheckbox: true },
    { label: "二维码", prop: "footer_qrcode2", isImageInput: true },
    { label: "描述", prop: "footer_qrcode2_description" },

    { label: "底部二维码3", isCategoryTitle: true },
    { label: "开启", prop: "footer_qrcode3_enable", isCheckbox: true },
    { label: "二维码", prop: "footer_qrcode3", isImageInput: true },
    { label: "描述", prop: "footer_qrcode3_description" },

    // 备案相关
    { label: "备案信息", isCategoryTitle: true },
    { label: "公网安备图标", prop: "beian_mps_icon", isImageInput: true },
    { label: "公网安备号", prop: "beian_mps_id" },
    { label: "公网安备查询链接", prop: "beian_mps_link" },
    { label: "域名备案图标", prop: "beian_miit_icon", isImageInput: true },
    { label: "域名备案号", prop: "beian_miit_id" },
    { label: "工信部备案查询链接", prop: "beian_miit_link" },

    // 样式相关
    { label: "样式相关", isCategoryTitle: true },
    { label: "自定义 CSS", prop: "custom_style_css", type: "textarea" },
]

onBeforeMount(async () => {
    const data = optionDataSrc.value
    // 循环历遍 data 的所有属性
    for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
            const item = data[key as keyof APPOptionForm]
            // 根据 item 的类型，将其转换为对应的类型
            if (item.type === OptionType.Boolean) {
                ;(optionData[key as keyof APPOptionForm] as boolean) = item.value === "true"
            } else {
                ;(optionData[key as keyof APPOptionForm] as string) = item.value
            }
        }
    }
})
</script>

<style lang="scss" scoped>
.components {
    padding-top: 10px;
    padding-left: 10px;
}

.head {
    margin-bottom: 10px;
}

.foot {
    margin: 10px 0;
}

.btn-submit {
    text-align: center;
}

.callback-description {
    margin: 10px 0;
    color: var(--jpz-text-color-secondary);
    font-size: 14px;

    // 行间距
    p {
        margin: 10px 0;
    }

    .strong {
        color: var(--jpz-text-color-regular);
        font-weight: 700;
    }
}
</style>
