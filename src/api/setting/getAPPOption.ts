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

export interface GetAPPOptionResponse {
    // logo 相关
    logo: APPOptionItem // logo
    favicon: APPOptionItem // favicon

    // 文章相关
    carousel_interval: APPOptionItem // 轮播图间隔 默认 5秒
    post_text_truncate: APPOptionItem // 文章文字截断 100字
    post_summary_truncate: APPOptionItem // 文章摘要截断 80字
    history_today_enable: APPOptionItem // 历史上今天
    reading_mode_enable: APPOptionItem // 阅读模式
    word_count_enable: APPOptionItem // 文章字数
    reading_time_enable: APPOptionItem // 阅读时间
    show_create_time_enable: APPOptionItem // 显示创建时间
    show_category_enable: APPOptionItem // 显示分类
    show_like_enable: APPOptionItem // 显示点赞
    show_favorite_enable: APPOptionItem // 显示收藏
    show_tags_enable: APPOptionItem // 显示标签
    show_copyright_enable: APPOptionItem // 版权信息开启
    show_copyright_info: APPOptionItem // 版权信息
    article_footer_info_enable: APPOptionItem // 文末固定信息开启
    article_footer_info: APPOptionItem // 文末固定信息

    // 互动相关
    like_enable: APPOptionItem // 点赞
    favorite_enable: APPOptionItem // 收藏
    share_enable: APPOptionItem // 分享
    poster_enable: APPOptionItem // 海报
    link_enable: APPOptionItem // 链接

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

    // seo 相关
    seo_title: APPOptionItem // seo title
    seo_keywords: APPOptionItem // seo KeyWords
    seo_description: APPOptionItem // seo Description
    custom_home_title: APPOptionItem // 自定义网站首页title
    custom_home_subtitle: APPOptionItem // 自定义网站首页副标题
    separator: APPOptionItem // 分隔符
    sitemap: APPOptionItem // 站点地图
    footer_statistics_code: APPOptionItem // 页脚添加同步统计代码

    // 备案相关
    beian_mps_icon: APPOptionItem // 公网安备图标
    beian_mps_id: APPOptionItem // 公网安备号
    beian_mps_link: APPOptionItem // 公网安备查询链接
    beian_miit_icon: APPOptionItem // 域名备案小图标
    beian_miit_id: APPOptionItem // 域名备案号
    beian_miit_link: APPOptionItem // 工信部备案查询链接

    // 样式相关
    custom_style_css: APPOptionItem // 定制风格颜色css
}

// 获取网站配置
export function getAPPOptionAPI(): ResPromise<Res<GetAPPOptionResponse>> {
    const urlStr = routerGroup + "/setting/get-app-option"
    return request({
        url: urlStr,
        method: "get",
    })
}
