/*
 * FilePath    : blog-client\src\views\admin\component\main\app-option\base\types.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 网站选项表单类型
 */

import { type CreateSetupType } from "@/pkg/codemirror"

export interface APPOptionFormRef extends HTMLElement {
    root: HTMLElement
    validateForm: () => Promise<boolean>
    formDataResult: APPOptionForm
}

// FormItems 每行表单项类型
export interface FormItems {
    label: string
    prop?: string
    type?: string
    placeholder?: string
    isImageInput?: boolean
    isCheckbox?: boolean
    isCategoryTitle?: boolean
    isCarouselManage?: boolean
    isSlideVerifyManage?: boolean
    textareaRows?: number
    customClass?: string
    editor?: {
        type: "javascript" | "css" | "html" | "markdown" | "json"
        createSetup: CreateSetupType
    }
}

export interface APPOptionForm {
    // logo 相关
    logo: string // logo
    favicon: string // favicon

    // 滑动验证相关
    slide_verify_enable: boolean // 滑动验证开启
    slide_verify_imgs: string // 滑动验证图片列表

    // 轮播图相关
    carousel_enable: boolean // 轮播图开启
    carousel_interval: number // 轮播图间隔 默认 3000 单位 毫秒
    carousel_manage: string // 轮播图管理

    // 文章相关
    post_list_summary_truncate: number // 文章列表摘要截断 默认 100 字
    history_today_enable: boolean // 历史上今天
    immersion_read_enable: boolean // 阅读模式
    read_time_enable: boolean // 阅读时间
    word_count_enable: boolean // 文章字数
    show_category_enable: boolean // 显示分类
    show_like_enable: boolean // 显示点赞
    show_star_enable: boolean // 显示收藏
    show_tags_enable: boolean // 显示标签
    show_copyright_enable: boolean // 版权信息开启
    show_copyright_info: string // 版权信息
    post_footer_info_enable: boolean // 文末固定信息开启
    post_footer_info: string // 文末固定信息

    // 视频水印
    video_watermark_logo_enable: boolean // 视频水印 logo 是否开启
    video_watermark_logo_url: string // 视频水印 logo url
    video_watermark_logo_style: string // 视频水印文字样式
    video_watermark_text_enable: boolean // 视频水印文字是否开启
    video_watermark_text_default: string // 视频水印文字默认内容
    video_watermark_text_style: string // 视频水印文字样式

    // 互动相关
    like_enable: boolean // 点赞
    star_enable: boolean // 收藏
    share_poster_enable: boolean // 海报分享
    link_enable: boolean // 链接分享

    // seo 相关
    seo_title: string // seo title
    seo_keywords: string // seo KeyWords
    seo_description: string // seo Description
    custom_home_title: string // 自定义网站首页title
    custom_home_subtitle: string // 自定义网站首页副标题
    separator: string // 分隔符
    sitemap: string // 站点地图
    footer_statistics_code: string // 页脚添加同步统计代码

    // 微信公众号
    wechat_official_account_app_id: string // 微信公众号 AppID
    wechat_official_account_app_secret: string // 微信公众号 AppSecret

    // 二维码相关
    wechat_official_account_qrcode: string // 微信公众号二维码
    wechat_qrcode: string // 微信二维码
    qq_qrcode: string // 微信二维码

    footer_left_title: string // 底部左侧标题
    footer_left_content: string // 底部左侧内容

    footer_right_title: string // 底部右侧标题
    footer_right_content: string // 底部右侧内容

    footer_qrcode1_enable: boolean // 底部二维码1是否开启
    footer_qrcode1: string // 底部二维码1
    footer_qrcode1_description: string // 底部二维码1显示描述

    footer_qrcode2_enable: boolean // 底部二维码2是否开启
    footer_qrcode2: string // 底部二维码2
    footer_qrcode2_description: string // 底部二维码2显示描述

    footer_qrcode3_enable: boolean // 底部二维码3是否开启
    footer_qrcode3: string // 底部二维码3
    footer_qrcode3_description: string // 底部二维码3显示描述

    // 备案相关
    beian_mps_icon: string // 公网安备图标
    beian_mps_id: string // 公网安备号
    beian_mps_link: string // 公网安备查询链接
    beian_miit_icon: string // 域名备案小图标
    beian_miit_id: string // 域名备案号
    beian_miit_link: string // 工信部备案查询链接

    // 样式相关
    custom_style_css: string // 定制风格颜css

    // 邮件通知管理
    subscribe_user_register_to_admin: boolean // 用户注册通知管理员
    subscribe_user_register_to_user: boolean // 用户注册通知用户
    subscribe_post_published_to_user: boolean // 文章发布通知用户
    subscribe_comment_to_admin: boolean // 评论通知管理员
    subscribe_comment_to_author: boolean // 评论通知作者
    subscribe_comment_to_post_author: boolean // 评论通知文章作者
    subscribe_comment_to_reply_to: boolean // 评论回复通知被回复用户
    subscribe_order_to_admin: boolean // 订单通知管理员
    subscribe_order_to_user: boolean // 订单通知用户
    subscribe_member_upgrade_to_admin: boolean // 会员升级通知管理员
    subscribe_member_upgrade_to_user: boolean // 会员升级通知用户
    subscribe_member_expire_to_admin: boolean // 会员即将到期通知管理员
    subscribe_member_expire_to_user: boolean // 会员即将到期通知用户
    subscribe_member_expired_to_admin: boolean // 会员已到期通知管理员
    subscribe_member_expired_to_user: boolean // 会员已到期通知用户
}
