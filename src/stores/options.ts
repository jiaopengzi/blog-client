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
import { type HeadProps } from "@/components/common/head-tag"
import { type NavItemProps } from "@/views/admin/component/main/app-nav/nav-item"

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
    isLoadedOptions: boolean
    head: HeadProps
    navList: NavItemProps[]
    navObj: Record<string, NavItemProps>
    navActiveIndex: string
}

// 创建一个空的选项存储
function createEmptyOptionsStore(): OptionsStore {
    return {
        app_options: {} as GetAPPOptionResponse,
        footer: {},
        isLoadedOptions: false,
        head: {},
        navList: [],
        navObj: {},
        navActiveIndex: "",
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

        // 是否加载完成
        isLoaded(): boolean {
            return this.isLoaded
        },

        // 获取头部信息
        getHeadInfo(): HeadProps {
            return this.head
        },

        // 获取 logo
        getLogo(): string {
            return this.app_options.logo?.value
        },

        // 获取导航信息
        getNavLost(): NavItemProps[] {
            return this.navList
        },

        getNavObj(): Record<string, NavItemProps> {
            return this.navObj
        },

        // 获取当前激活的导航索引
        getNavActiveIndex(): string {
            return this.navActiveIndex
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

                this.isLoadedOptions = true

                // head格式化后存储本地
                this.head = await formatHeadInfo(this.app_options)

                // navList 格式化后存储本地
                this.navList = await formatNavList(this.app_options.nav.value)

                // navObg 格式化后存储本地
                this.navObj = await formatNavObj(this.navList)
            }
        },

        // 增量更新 head 标签
        async updateHead(head: HeadProps): Promise<void> {
            // 用 head 对象的属性覆盖 this.head 对象的属性
            this.head = { ...this.head, ...head }
        },

        // 更新 favicon
        async updateFavicon(): Promise<void> {
            const faviconLink = document.getElementById("dynamic-favicon") as HTMLLinkElement

            if (faviconLink && this.app_options.favicon?.value) {
                const oldHref = faviconLink.href
                const neoHref = this.app_options.favicon.value

                // 如果新旧链接一样, 则不更新, 直接返回
                if (oldHref === neoHref) return

                faviconLink.href = neoHref

                // // 强制刷新
                // const timestamp = new Date().getTime()
                // faviconLink.href = `${neoHref}?v=${timestamp}`
            }
        },

        // 设置导航激活索引
        setNavActiveIndex(index: string): void {
            this.navActiveIndex = index
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

const formatHeadInfo = async (data: GetAPPOptionResponse): Promise<HeadProps> => {
    const title = data.custom_home_title?.value + data.separator?.value + data.custom_home_subtitle?.value
    return {
        title: title,
        description: data.seo_description?.value,
        keywords: data.seo_keywords?.value,
        type: "article",
        locale: "zh-CN",
        author: "jiaopengzi",
        siteName: title,
        url: "https://jiaopengzi.com",
        releaseDate: new Date().toISOString(),
    }
}

// 将导航字符串转换为数组
const formatNavList = async (navStr: string | undefined | null): Promise<NavItemProps[]> => {
    // 如果 navStr 为空, 则返回空数组
    if (!navStr) return []

    // 将字符串转换为 json 对象
    const navList = JSON.parse(navStr)

    // 将 navList 按照 index 升序排序
    const navListOrder = navList.sort((a: NavItemProps, b: NavItemProps) => {
        // 将 index 转换为字符数字
        const indexA = parseInt(a.index) || 0
        const indexB = parseInt(b.index) || 1
        return indexA - indexB
    })

    return navListOrder
}

// 将导航数组转换为对象
const formatNavObj = async (navList: NavItemProps[]): Promise<Record<string, NavItemProps>> => {
    const navObj: Record<string, NavItemProps> = {}
    navList.forEach((nav) => {
        // 筛选出未启用的导航
        if (!nav.is_enabled) {
            return
        }

        // 判断 nav 中 parentIndex 是否存在, 如果不存在, 则设置为空字符串
        if (!nav.parentIndex) {
            nav.parentIndex = ""
        }

        navObj[nav.index] = nav
    })
    return navObj
}

// 允许开发环境下进行热更新 HMR(Hot Module Replacement)
if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useOptionsStore, import.meta.hot))
}
