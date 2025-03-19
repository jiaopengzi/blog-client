/*
 * FilePath    : blog-client\src\stores\options.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 网站配置选项
 */

import { acceptHMRUpdate, defineStore } from "pinia"

import { ResponseCode } from "@/api/response"
import { getAPPOptionAPI, type GetAPPOptionResponse } from "@/api/setting/getAPPOption"

export interface FooterLeftInfo {
    title?: string
    content?: string
}

export interface FooterMiddleImage {
    imgUrl: string
    display?: string
}

export interface FooterRightInfo {
    title?: string
    content?: string
    beian_mps_icon: string // 公网安备图标
    beian_mps_id: string // 公网安备号
    beian_mps_link: string // 公网安备查询链接
    beian_miit_icon: string // 域名备案小图标
    beian_miit_id: string // 域名备案号
    beian_miit_link: string // 工信部备案查询链接
}

// 底部信息
export interface FooterInfo {
    left?: FooterLeftInfo
    middle?: FooterMiddleImage[]
    right?: FooterRightInfo
}

// 网站配置选项
export interface OptionsStore {
    app_options: GetAPPOptionResponse
    footer: FooterInfo
}

// 创建一个空的选项存储
function createEmptyOptionsStore(): OptionsStore {
    return {
        app_options: {} as GetAPPOptionResponse,
        footer: {},
    }
}

export const useOptionsStore = defineStore("options", {
    state: () => createEmptyOptionsStore(),

    getters: {
        // 获取网站配置
        getOptions(): GetAPPOptionResponse {
            return this.app_options
        },

        // 获取底部信息
        getFooterInfo(): FooterInfo {
            return this.footer
        },

        // 是否显示底部信息
        isShowFooter(): boolean {
            return !!this.footer.left?.title || !!this.footer.middle?.length || !!this.footer.right?.title
        },
    },

    actions: {
        // 获取网站配置, 参数为是否强制从服务器获取, 默认为false
        async update(is_get_from_server: boolean = false): Promise<void> {
            if (is_get_from_server) {
                await this.updateFromServer()
            }
        },

        // 从服务器获取网站配置
        async updateFromServer() {
            const res = await getAPPOptionAPI()
            if (res.data.code === ResponseCode.GetAPPOptionSuccess) {
                this.app_options = res.data.data

                // footer格式化后存储本地
                this.footer = await formatFooterInfo(this.app_options)
            }
        },
    },
})

// 格式化底部信息
export const formatFooterInfo = async (data: GetAPPOptionResponse): Promise<FooterInfo> => {
    // 左侧信息
    const left: FooterLeftInfo = {
        title: data.footer_left_title?.value,
        content: data.footer_left_content?.value,
    }

    // 中间图片
    const middle: FooterMiddleImage[] = []
    // 定义一个数组来存储不同的数字
    const qrcodeNumbers = [1, 2, 3]

    // 遍历数组
    qrcodeNumbers.forEach((num) => {
        const qrcodeEnableKey = `footer_qrcode${num}_enable` as keyof GetAPPOptionResponse
        const qrcodeKey = `footer_qrcode${num}` as keyof GetAPPOptionResponse
        const qrcodeDescriptionKey = `footer_qrcode${num}_description` as keyof GetAPPOptionResponse
        if (data[qrcodeEnableKey]?.value === "true") {
            middle.push({
                imgUrl: data[qrcodeKey]?.value,
                display: data[qrcodeDescriptionKey]?.value,
            })
        }
    })

    // 右侧信息
    const right: FooterRightInfo = {
        title: data.footer_right_title?.value,
        content: data.footer_right_content?.value,
        beian_mps_icon: data.beian_mps_icon?.value,
        beian_mps_id: data.beian_mps_id?.value,
        beian_mps_link: data.beian_mps_link?.value,
        beian_miit_icon: data.beian_miit_icon?.value,
        beian_miit_id: data.beian_miit_id?.value,
        beian_miit_link: data.beian_miit_link?.value,
    }

    return {
        left,
        middle,
        right,
    }
}

// 允许开发环境下进行热更新 HMR(Hot Module Replacement)
if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useOptionsStore, import.meta.hot))
}
