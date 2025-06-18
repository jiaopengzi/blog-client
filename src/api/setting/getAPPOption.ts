/*
 * FilePath    : blog-client\src\api\setting\getAPPOption.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 获取网站配置
 */

import { OptionType } from "@/api/common"
import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

// 配置项
export interface APPOptionItem {
    key: string
    value: string
    type: OptionType
}

// 根据 APPOptionItem 中的 type 将 value 转换为对应的类型
export const convert = (item: APPOptionItem): string | number | boolean | object => {
    switch (item.type) {
        case OptionType.String:
            return item.value
        case OptionType.Number:
            return parseFloat(item.value)
        case OptionType.Boolean:
            return item.value === "true"
        case OptionType.JSON:
            try {
                return JSON.parse(item.value)
            } catch (e) {
                console.error("JSON parse error:", e)
                return {}
            }
        default:
            return item.value
    }
}

export interface GetAPPOptionResponse {
    // logo 相关
    logo: APPOptionItem // logo
    favicon: APPOptionItem // favicon

    // 文章相关
    carousel_interval: APPOptionItem // 轮播图间隔 默认 5秒
    post_text_truncate: APPOptionItem // 文章文字截断 100字
    post_summary_truncate: APPOptionItem // 文章摘要截断 80字
    history_today_enable: APPOptionItem // 历史上今天
    immersion_read_enable: APPOptionItem // 沉浸阅读
    read_time_enable: APPOptionItem // 阅读时间
    word_count_enable: APPOptionItem // 文章字数
    show_category_enable: APPOptionItem // 显示分类
    show_like_enable: APPOptionItem // 显示点赞
    show_star_enable: APPOptionItem // 显示收藏
    show_tags_enable: APPOptionItem // 显示标签
    show_copyright_enable: APPOptionItem // 版权信息开启
    show_copyright_info: APPOptionItem // 版权信息
    post_footer_info_enable: APPOptionItem // 文末固定信息开启
    post_footer_info: APPOptionItem // 文末固定信息

    // 互动相关
    like_enable: APPOptionItem // 点赞
    star_enable: APPOptionItem // 收藏
    share_poster_enable: APPOptionItem // 海报分享
    link_enable: APPOptionItem // 链接

    // seo 相关
    seo_title: APPOptionItem // seo title
    seo_keywords: APPOptionItem // seo KeyWords
    seo_description: APPOptionItem // seo Description
    custom_home_title: APPOptionItem // 自定义网站首页title
    custom_home_subtitle: APPOptionItem // 自定义网站首页副标题
    separator: APPOptionItem // 分隔符
    sitemap: APPOptionItem // 站点地图
    footer_statistics_code: APPOptionItem // 页脚添加同步统计代码

    // 二维码相关
    wechat_official_account_qrcode: APPOptionItem // 微信公众号二维码
    wechat_qrcode: APPOptionItem // 微信二维码
    qq_qrcode: APPOptionItem // 微信二维码

    footer_left_title: APPOptionItem // 底部左侧标题
    footer_left_content: APPOptionItem // 底部左侧内容

    footer_right_title: APPOptionItem // 底部右侧标题
    footer_right_content: APPOptionItem // 底部右侧内容

    footer_qrcode1_enable: APPOptionItem // 底部二维码1是否开启
    footer_qrcode1: APPOptionItem // 底部二维码1
    footer_qrcode1_description: APPOptionItem // 底部二维码1显示描述

    footer_qrcode2_enable: APPOptionItem // 底部二维码2是否开启
    footer_qrcode2: APPOptionItem // 底部二维码2
    footer_qrcode2_description: APPOptionItem // 底部二维码2显示描述

    footer_qrcode3_enable: APPOptionItem // 底部二维码3是否开启
    footer_qrcode3: APPOptionItem // 底部二维码3
    footer_qrcode3_description: APPOptionItem // 底部二维码3显示描述

    // 备案相关
    beian_mps_icon: APPOptionItem // 公网安备图标
    beian_mps_id: APPOptionItem // 公网安备号
    beian_mps_link: APPOptionItem // 公网安备查询链接
    beian_miit_icon: APPOptionItem // 域名备案小图标
    beian_miit_id: APPOptionItem // 域名备案号
    beian_miit_link: APPOptionItem // 工信部备案查询链接

    // 样式相关
    custom_style_css: APPOptionItem // 定制风格颜色css

    // 样式相关
    nav: APPOptionItem // 导航栏

    // 邮件通知管理
    subscribe_user_register_to_admin: APPOptionItem // 用户注册通知管理员
    subscribe_user_register_to_user: APPOptionItem // 用户注册通知用户
    subscribe_post_published_to_user: APPOptionItem // 文章发布通知用户
    subscribe_comment_to_admin: APPOptionItem // 评论通知管理员
    subscribe_comment_to_author: APPOptionItem // 评论通知作者
    subscribe_comment_to_post_author: APPOptionItem // 评论通知文章作者
    subscribe_comment_to_reply_to: APPOptionItem // 评论回复通知被回复用户
    subscribe_order_to_admin: APPOptionItem // 订单通知管理员
    subscribe_order_to_user: APPOptionItem // 订单通知用户
    subscribe_member_upgrade_to_admin: APPOptionItem // 会员升级通知管理员
    subscribe_member_upgrade_to_user: APPOptionItem // 会员升级通知用户
    subscribe_member_expire_to_admin: APPOptionItem // 会员即将到期通知管理员
    subscribe_member_expire_to_user: APPOptionItem // 会员即将到期通知用户
    subscribe_member_expired_to_admin: APPOptionItem // 会员已到期通知管理员
    subscribe_member_expired_to_user: APPOptionItem // 会员已到期通知用户
}

// 获取网站配置
export function getAPPOptionAPI(): ResPromise<Res<GetAPPOptionResponse>> {
    const urlStr = routerGroup + "/setting/get-app-option"
    return request({
        url: urlStr,
        method: "get",
    })
}
