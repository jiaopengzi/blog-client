/*
 * FilePath    : blog-client-nuxt\src\stores\options.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 网站配置选项
 */

import { acceptHMRUpdate, defineStore } from "pinia"

import { getIpInfoAPI, type IpInfoRes } from "@/api/helper/ipInfo"
import { ResponseCode } from "@/api/response"
import { getAPPOptionAPI, type GetAPPOptionResponse } from "@/api/setting/getAPPOption"
import { PayType, type PayTypeEnable } from "@/api/pay/common"
import { getPayConfigStatusAPI, type GetPayConfigStatusResponse } from "@/api/setting/getPayConfigStatus"
import { type CarouselItem } from "@/components/common/carousel-manage/types"
import { type HeadProps } from "@/components/common/head-tag/types"
import { type SlideVerifyImgItem } from "@/components/common/slide-verify-manage/types"
import { type NavItemProps } from "@/components/views/admin/component/main/app-nav/nav-item/types"

import { LocalStorageKey } from "./local"

// SSR 守卫 (计划 1.7): 服务端无 localStorage, 读写替换为 no-op 替身; SSR 下按"未加载"处理,
// 客户端首轮 initStores 时通过 update(true) 强制从服务器拉取
const safeLocalStorage: Storage =
    typeof localStorage !== "undefined"
        ? localStorage
        : ({
              getItem: () => null,
              setItem: () => {},
              removeItem: () => {},
              clear: () => {},
              key: () => null,
              get length() {
                  return 0
              },
          } as unknown as Storage)

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

// 轮播图信息
export interface CarouselInfo {
    enable: boolean // 是否启用轮播图
    interval: number // 轮播间隔时间, 默认 3000 单位 毫秒
    items: CarouselItem[] // 轮播图项目
}

// 滑动验证信息
export interface SlideVerifyInfo {
    enable: boolean // 是否启用滑动验证
    imgs: SlideVerifyImgItem[] // 滑动验证图片列表
}

// 视频水印信息
export interface VideoWatermark {
    logo_enable: boolean // 视频水印 logo 是否开启
    logo_url: string // 视频水印 logo url
    logo_style: object // 视频水印 logo 样式
    text_enable: boolean // 视频水印文字是否开启
    text_default: string // 视频水印文字默认内容
    text_style: object // 视频水印文字样式
}

// 网站配置选项
export interface OptionsStore {
    app_options: GetAPPOptionResponse // 网站配置选项数据
    footer: FooterInfo // 底部信息
    isLoadedOptions: boolean // 是否加载完成网站配置选项
    head: HeadProps // 头部信息
    navList: NavItemProps[] // 导航列表
    navObj: Record<string, NavItemProps> // 导航对象
    navActiveIndex: string // 当前激活的导航索引
    ipInfo: IpInfoRes // ip 信息
    wechatPayStatus: boolean // 微信支付状态
    alipayStatus: boolean // 支付宝支付状态
    is_remove_first_h1: boolean // 是否移除文章内容中的第一个 h1 标签
    carousel: CarouselInfo // 轮播图信息
    slide_verify_enable: boolean // 滑动验证是否启用
    show_slide_verify: boolean // 是否显示滑动验证
    slide_verify_imgs: SlideVerifyImgItem[] // 滑动验证图片列表
    post_list_summary_truncate: number // 文章列表摘要截断 默认 100 字
    custom_style_css: string // 自定义样式 CSS
    footer_statistics_code: string // 底部统计代码
    video_watermark: VideoWatermark // 视频水印信息
}

/**
 * 公开端渲染链路直接读取的配置键白名单(payload 瘦身, bugfix 260825-03).
 * 全量配置约 90 个键, 其中仅以下键被公开组件经 app_options.* 直接读取;
 * 其余键(后台专用 subscribe_*、carousel_manage、nav 原始 JSON 等)只被后台配置表单使用,
 * 不随每个 SSR 页面的 pinia payload 注水重复传输. 后台表单已改为自取全量(见 app-option/index.vue).
 * 新增公开端读取键时, 必须同步补充到本白名单, 否则该键在 payload 中缺失.
 */
const PUBLIC_APP_OPTION_KEYS = [
    "logo", // 页头 logo(getLogo / 分享海报)
    "favicon", // 站点图标(updateFavicon / 分享海报)
    "like_enable", // 点赞交互开关(useInteraction)
    "star_enable", // 收藏交互开关(useInteraction)
    "share_poster_enable", // 分享海报开关(useInteraction)
    "link_enable", // 链接交互开关(useInteraction)
    "show_like_enable", // 文章 meta 点赞展示(post-meta)
    "show_star_enable", // 文章 meta 收藏展示(post-meta)
    "word_count_enable", // 文章 meta 字数/阅读时长(post-meta)
    "immersion_read_enable", // 沉浸阅读(post-meta)
    "show_category_enable", // 详情分类展示(category-tag)
    "show_tags_enable", // 详情标签展示(category-tag)
    "show_copyright_enable", // 详情版权展示(copyright)
    "show_copyright_info", // 详情版权内容(copyright)
    "post_footer_info_enable", // 详情文末内容开关(bottom-same)
    "post_footer_info", // 详情文末内容(bottom-same)
    "is_remove_first_h1", // 移除首个 h1(update/updateFromServer 派生字段来源)
    "post_list_summary_truncate", // 列表摘要截断(派生字段来源)
    "custom_style_css", // 自定义 CSS(派生字段来源)
    // 注意: footer_statistics_code 不在白名单. 统计脚本经派生字段 footer_statistics_code
    // 单独注水, 白名单内再存一份会造成 payload 重复传输(约 680B); update(false) 的
    // localStorage 回放改为"存在才覆盖", 兼容旧版本全量缓存(见 update 实现).
] as const satisfies readonly (keyof GetAPPOptionResponse)[]

/**
 * 从全量配置中挑出公开端渲染链路需要的键, 其余键不进 pinia payload.
 * @param raw 后端返回的全量配置.
 * @returns 仅含白名单键的瘦身配置(类型仍标注为全量: 公开端只读白名单键, 后台表单自取全量).
 */
function pickPublicAppOptions(raw: GetAPPOptionResponse): GetAPPOptionResponse {
    const slim = {} as Partial<GetAPPOptionResponse>
    for (const key of PUBLIC_APP_OPTION_KEYS) {
        const item = raw[key]
        if (item) {
            slim[key] = item
        }
    }
    return slim as GetAPPOptionResponse
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
        ipInfo: {} as IpInfoRes,
        wechatPayStatus: false,
        alipayStatus: false,
        is_remove_first_h1: false,
        carousel: {
            enable: false,
            interval: 3000,
            items: [],
        },
        slide_verify_enable: false,
        show_slide_verify: false,
        slide_verify_imgs: [],
        post_list_summary_truncate: 100,
        custom_style_css: "",
        footer_statistics_code: "",
        video_watermark: {
            logo_enable: false,
            logo_url: "",
            logo_style: {},
            text_enable: false,
            text_default: "",
            text_style: {},
        },
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
            return this.app_options?.logo?.value ?? ""
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

        // 获取 ip 信息
        getIpInfo(): IpInfoRes {
            return this.ipInfo
        },

        // 获取微信支付状态
        getWechatPayStatus(): boolean {
            return this.wechatPayStatus
        },

        // 获取支付宝支付状态
        getAlipayStatus(): boolean {
            return this.alipayStatus
        },

        // 获取是否移除文章内容中的第一个 h1 标签
        getIsRemoveFirstH1(): boolean {
            return this.is_remove_first_h1
        },

        // 获取轮播图信息
        getCarousel(): CarouselInfo {
            return this.carousel
        },

        // 获取滑动验证是否启用
        getSlideVerifyEnable(): boolean {
            return this.slide_verify_enable
        },

        // 获取是否显示滑动验证
        getShowSlideVerify(): boolean {
            // 是否启用滑动验证
            if (!this.slide_verify_enable) {
                return false
            }

            // 判断是否有滑动验证图片
            if (!this.slide_verify_imgs || this.slide_verify_imgs.length === 0) {
                return false
            }
            return this.show_slide_verify
        },

        // 获取滑动验证图片列表
        getSlideVerifyImgs(): SlideVerifyImgItem[] {
            return this.slide_verify_imgs
        },

        // 获取文章列表摘要截断
        getPostListSummaryTruncate(): number {
            return this.post_list_summary_truncate
        },

        // 获取自定义样式 CSS
        getCustomStyleCss(): string {
            return this.custom_style_css
        },

        // 获取底部统计代码
        getFooterStatisticsCode(): string {
            return this.footer_statistics_code
        },

        // 是否显示底部统计组件
        isShowFooterStatistics(): boolean {
            return !!this.footer_statistics_code?.trim()
        },

        // 获取视频水印信息
        getVideoWatermark(): VideoWatermark {
            return this.video_watermark
        },

        // 获取支付方式是否启用
        getPayTypeEnable(): PayTypeEnable {
            return {
                [PayType.Alipay]: this.alipayStatus,
                [PayType.WechatPay]: this.wechatPayStatus,
            }
        },
    },

    actions: {
        // 获取网站配置, 参数为是否强制从服务器获取, 默认为 false
        async update(is_get_from_server: boolean = false): Promise<void> {
            if (is_get_from_server) {
                await this.updateFromServer()
                return
            }

            // 从本地获取网站配置
            const app_options = safeLocalStorage.getItem(LocalStorageKey.OptionsApp)
            if (app_options) {
                this.app_options = JSON.parse(app_options) as GetAPPOptionResponse
                this.isLoadedOptions = true
                // bugfix(260827 app-nav 报错): 本地缓存可能为瘦身版/旧版, 部分键缺失时
                // 无防护访问 .value 会抛 "Cannot read properties of undefined (reading 'value')"
                this.is_remove_first_h1 = this.app_options.is_remove_first_h1?.value === "true"
                this.post_list_summary_truncate = parseInt(this.app_options.post_list_summary_truncate?.value) || 100
                this.custom_style_css = this.app_options.custom_style_css?.value || ""
                // payload 瘦身(bugfix 260825-03): 新版 localStorage 的瘦身 app_options 不含
                // footer_statistics_code(统计脚本走派生字段单独注水), 仅当旧版本全量缓存中存在
                // 该键时才覆盖, 避免把 payload 水合得到的统计代码清空.
                if (this.app_options.footer_statistics_code?.value !== undefined) {
                    this.footer_statistics_code = this.app_options.footer_statistics_code.value
                }
            }

            // 从本地获取头部信息
            const head = safeLocalStorage.getItem(LocalStorageKey.OptionsHeadInfo)
            if (head) {
                this.head = JSON.parse(head) as HeadProps
            }

            // 从本地获取导航列表
            const navList = safeLocalStorage.getItem(LocalStorageKey.OptionsNavList)
            if (navList) {
                this.navList = JSON.parse(navList) as NavItemProps[]
            }

            // 从本地获取导航对象
            const navObj = safeLocalStorage.getItem(LocalStorageKey.OptionsNavObj)
            if (navObj) {
                this.navObj = JSON.parse(navObj) as Record<string, NavItemProps>
            }

            // 从本地获取底部信息
            const footer = safeLocalStorage.getItem(LocalStorageKey.OptionsFooterInfo)
            if (footer) {
                this.footer = JSON.parse(footer) as FooterInfo
            }

            // 从本地获取支付类型开启状态
            const payTypeEnable = safeLocalStorage.getItem(LocalStorageKey.PayTypeEnable)
            if (payTypeEnable) {
                const enableObj = JSON.parse(payTypeEnable) as PayTypeEnable
                this.wechatPayStatus = enableObj[PayType.WechatPay]
                this.alipayStatus = enableObj[PayType.Alipay]
            }

            // 从本地获取轮播图信息
            const carousel = safeLocalStorage.getItem(LocalStorageKey.OptionsCarousel)
            if (carousel) {
                this.carousel = JSON.parse(carousel) as CarouselInfo
            }

            // 从本地获取滑动验证信息
            const slideVerify = safeLocalStorage.getItem(LocalStorageKey.OptionsSlideVerify)
            if (slideVerify) {
                const slideVerifyInfo = JSON.parse(slideVerify) as SlideVerifyInfo
                this.slide_verify_enable = slideVerifyInfo.enable
                this.slide_verify_imgs = slideVerifyInfo.imgs
            }

            // 从本地获取视频水印信息
            const videoWatermark = safeLocalStorage.getItem(LocalStorageKey.OptionsVideoWatermark)
            if (videoWatermark) {
                this.video_watermark = JSON.parse(videoWatermark) as VideoWatermark
            }
        },

        // 从服务器获取网站配置
        async updateFromServer() {
            const res = await getAPPOptionAPI()
            if (res.data.code === ResponseCode.GetAPPOptionSuccess) {
                // 先保存全量原始配置用于格式化派生字段, 格式化完成后替换为白名单瘦身版(见下方)
                const rawOptions = res.data.data
                this.app_options = rawOptions

                // head 格式化后存储本地
                this.head = await formatHeadInfo(this.app_options)

                // navList 格式化后存储本地
                // bugfix(260827 app-nav 报错): 后端未配置 nav 键时无防护访问 .value 会抛
                // "Cannot read properties of undefined (reading 'value')", 容错为空列表
                this.navList = await formatNavList(this.app_options.nav?.value)

                // navObj 格式化后存储本地
                this.navObj = await formatNavObj(this.navList)

                // footer 格式化后存储本地
                this.footer = await formatFooterInfo(this.app_options)

                this.isLoadedOptions = true

                this.is_remove_first_h1 = this.app_options.is_remove_first_h1?.value === "true"

                // 自定义样式 CSS
                this.custom_style_css = this.app_options.custom_style_css?.value || ""

                // 底部统计代码
                this.footer_statistics_code = this.app_options.footer_statistics_code?.value || ""

                // 轮播图项目格式化后存储本地
                this.carousel = await formatCarouselInfo(this.app_options)

                // 滑动验证格式化后存储本地
                const slideVerifyInfo = await formatSlideVerify(this.app_options)
                this.slide_verify_enable = slideVerifyInfo.enable
                this.slide_verify_imgs = slideVerifyInfo.imgs

                // 视频水印信息格式化后存储本地
                this.video_watermark = await formatVideoWatermark(this.app_options)

                this.post_list_summary_truncate = parseInt(this.app_options.post_list_summary_truncate?.value) || 100

                // payload 瘦身(bugfix 260825-03): 派生字段已全部格式化完成,
                // 将 app_options 替换为白名单瘦身版. SSR 页面的 pinia payload 不再携带
                // 后台专用配置键(约 70 个键的 {key,value,type} 冗余结构 + nav 原始 JSON 等),
                // 每个 SSR 页注水体积显著下降. 后台配置表单已改为自取全量(见 app-option/index.vue).
                this.app_options = pickPublicAppOptions(rawOptions)

                // 存入本地(存白名单后的瘦身版, 与 update(false) 的本地回放读取保持一致)
                safeLocalStorage.setItem(LocalStorageKey.OptionsApp, JSON.stringify(this.app_options))
            }

            // 更新支付配置状态
            await this.updatePayConfig()
        },

        // 从服务器获取网站配置
        async updatePayConfig() {
            // 获取支付配置状态
            const res = await getPayConfigStatusAPI()
            if (res.data.code === ResponseCode.GetPayConfigStatusSuccess) {
                const payConfigData = res.data.data as GetPayConfigStatusResponse
                this.wechatPayStatus = payConfigData.wechat_pay
                this.alipayStatus = payConfigData.alipay
            } else {
                this.wechatPayStatus = false
                this.alipayStatus = false
            }

            // 存入本地
            safeLocalStorage.setItem(
                LocalStorageKey.PayTypeEnable,
                JSON.stringify({ [PayType.WechatPay]: this.wechatPayStatus, [PayType.Alipay]: this.alipayStatus }),
            )
        },

        // 初始化头部信息
        async initHead(is_get_from_server: boolean = false): Promise<void> {
            if (is_get_from_server) {
                await this.updateFromServer()
                return
            }

            // 从本地获取头部信息
            const head = safeLocalStorage.getItem(LocalStorageKey.OptionsHeadInfo)
            if (head) {
                this.head = JSON.parse(head) as HeadProps
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
            }
        },

        // 设置导航激活索引
        setNavActiveIndex(index: string): void {
            this.navActiveIndex = index
        },

        // 更新 ip 信息
        async updateIpInfo(): Promise<void> {
            const res = await getIpInfoAPI()
            if (res.status === 200 && res.data.status === "success") {
                this.ipInfo = res.data
            }
        },

        // 开启滑动验证
        async openSlideVerify(): Promise<void> {
            // 判断是否启用滑动验证
            if (!this.slide_verify_enable) {
                this.show_slide_verify = false
                return
            }

            // 如果没有滑动验证图片, 则不允许开启
            if (!this.slide_verify_imgs || this.slide_verify_imgs.length === 0) {
                this.show_slide_verify = false
                return
            }

            this.show_slide_verify = true
        },

        // 关闭滑动验证
        async closeSlideVerify(): Promise<void> {
            this.show_slide_verify = false
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

    // 存入本地
    safeLocalStorage.setItem(LocalStorageKey.OptionsFooterInfo, JSON.stringify({ left, middle, right }))

    return {
        left,
        middle,
        right,
    }
}

const formatHeadInfo = async (data: GetAPPOptionResponse): Promise<HeadProps> => {
    const title = data.custom_home_title?.value + data.separator?.value + data.custom_home_subtitle?.value
    const headInfo: HeadProps = {
        title: title,
        description: data.seo_description?.value,
        keywords: data.seo_keywords?.value,
        type: "article",
        locale: "zh-CN",
        author: "jiaopengzi",
        siteName: data.custom_home_title?.value, // 站名仅主标题 (不带副标题), 供列表页 title 拼接使用
        url: "https://jiaopengzi.com",
        releaseDate: new Date().toISOString(),
    }

    // 存入本地
    safeLocalStorage.setItem(LocalStorageKey.OptionsHeadInfo, JSON.stringify(headInfo))

    return headInfo
}

// 将导航字符串转换为数组
const formatNavList = async (navStr: string | undefined | null): Promise<NavItemProps[]> => {
    // 如果 navStr 为空, 则返回空数组
    if (!navStr) return []

    // 将字符串转换为 json 对象
    const navList = JSON.parse(navStr)

    // 将 navList 按照 index 升序排序
    // oxlint-disable-next-line unicorn/no-array-sort
    const navListOrder = navList.sort((a: NavItemProps, b: NavItemProps) => {
        // 将 index 转换为数字
        const indexA = parseInt(a.index) || 0
        const indexB = parseInt(b.index) || 1
        return indexA - indexB
    })

    // 存入本地
    safeLocalStorage.setItem(LocalStorageKey.OptionsNavList, JSON.stringify(navListOrder))

    return navListOrder
}

// 将导航数组转换为对象
const formatNavObj = async (navList: NavItemProps[]): Promise<Record<string, NavItemProps>> => {
    const navObj: Record<string, NavItemProps> = {}
    navList.forEach((nav) => {
        // 跳过未启用的导航
        if (!nav.is_enabled) {
            return
        }

        // 判断 nav 中 parentIndex 是否存在, 如果不存在, 则设置为空字符串
        if (!nav.parentIndex) {
            nav.parentIndex = ""
        }

        navObj[nav.index] = nav
    })

    // 存入本地
    safeLocalStorage.setItem(LocalStorageKey.OptionsNavObj, JSON.stringify(navObj))

    return navObj
}

// 格式化轮播图信息
const formatCarouselInfo = async (data: GetAPPOptionResponse): Promise<CarouselInfo> => {
    // 是否启用轮播图
    const carouselEnable = data.carousel_enable?.value === "true"

    // 轮播图间隔
    const carouselInterval = parseInt(data.carousel_interval?.value) || 3

    // 轮播图具体项目
    let carouselItems: CarouselItem[] = []

    // 解析轮播图项目 JSON 字符串
    try {
        carouselItems = JSON.parse(data.carousel_manage?.value) as CarouselItem[]
    } catch (e) {
        console.error("JSON parse error:", e)
        carouselItems = []
    }

    // 构建轮播图信息对象
    const carouselInfo: CarouselInfo = {
        enable: carouselEnable,
        interval: carouselInterval,
        items: carouselItems,
    }

    // 存入本地
    safeLocalStorage.setItem(LocalStorageKey.OptionsCarousel, JSON.stringify(carouselInfo))

    return carouselInfo
}

// 格式化滑动验证信息
const formatSlideVerify = async (data: GetAPPOptionResponse): Promise<SlideVerifyInfo> => {
    // 滑动验证图片列表
    let slideVerifyImgs: SlideVerifyImgItem[] = []
    let slideVerifyEnable = false

    // 解析滑动验证图片列表 JSON 字符串
    try {
        slideVerifyEnable = JSON.parse(data.slide_verify_enable?.value) as boolean
        slideVerifyImgs = JSON.parse(data.slide_verify_imgs?.value) as SlideVerifyImgItem[]
    } catch (e) {
        console.error("JSON parse error:", e)
        slideVerifyEnable = false
        slideVerifyImgs = []
    }

    // 构造 SlideVerifyInfo
    const slideVerifyInfo: SlideVerifyInfo = {
        enable: slideVerifyEnable,
        imgs: slideVerifyImgs,
    }

    // 存入本地
    safeLocalStorage.setItem(LocalStorageKey.OptionsSlideVerify, JSON.stringify(slideVerifyInfo))

    return slideVerifyInfo
}

// 格式化视频水印信息
const formatVideoWatermark = async (data: GetAPPOptionResponse): Promise<VideoWatermark> => {
    // 构造 VideoWatermark
    const videoWatermark: VideoWatermark = {
        logo_enable: data.video_watermark_logo_enable?.value === "true",
        logo_url: data.video_watermark_logo_url?.value,
        logo_style: {},
        text_enable: data.video_watermark_text_enable?.value === "true",
        text_default: data.video_watermark_text_default?.value,
        text_style: {},
    }

    // 将 logo_style JSON 字符串转换为对象
    try {
        videoWatermark.logo_style = JSON.parse(data.video_watermark_logo_style?.value || "{}")
    } catch (e) {
        console.error("JSON parse error:", e)
        videoWatermark.logo_style = {}
    }

    // 将 text_style JSON 字符串转换为对象
    try {
        videoWatermark.text_style = JSON.parse(data.video_watermark_text_style?.value || "{}")
    } catch (e) {
        console.error("JSON parse error:", e)
        videoWatermark.text_style = {}
    }

    // 存入本地
    safeLocalStorage.setItem(LocalStorageKey.OptionsVideoWatermark, JSON.stringify(videoWatermark))

    return videoWatermark
}

// 允许开发环境下进行热更新 HMR (Hot Module Replacement)
if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useOptionsStore, import.meta.hot))
}
