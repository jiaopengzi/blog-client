/*
 * FilePath    : blog-client\src\views\admin\component\main\app-option\base\types.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 网站选项表单类型
 */

export interface APPOptionFormRef extends HTMLElement {
    root: HTMLElement
    validateForm: () => Promise<boolean>
    formDataResult: APPOptionForm
}

export interface APPOptionForm {
    // logo 相关
    logo: string // logo
    favicon: string // favicon

    // 文章相关
    carousel_interval: number // 轮播图间隔 默认 5秒
    post_text_truncate: number // 文章文字截断 100字
    post_summary_truncate: number // 文章摘要截断 80字
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
    custom_style_css: string // 定制风格颜色css
}
