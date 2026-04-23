/**
 * @FilePath     : \blog-client\src\stores\local.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 本地存储键名
 */

export enum LocalStorageKey {
    DashboardTrendSelection = "dashboard_trend_selection", // 仪表盘趋势图筛选项
    IsCollapse = "is_collapse", // 侧边栏是否折叠
    IsShowDashboardStats = "is_show_dashboard_stats", // 仪表盘统计信息是否显示敏感数值
    IsShowListOrGridAtMedia = "is_show_list_or_grid_at_media", // 媒体列表是否显示为列表或网格
    MediaAddIsEncrypt = "media_add_is_encrypt", // 新增媒体文件：视频是否加密
    MediaAddIsNoFree = "media_add_is_no_free", // 新增媒体文件：视频是否收费
    IsShowSeoAtPostWrite = "is_show_seo_at_post_write", // 文章写作是否显示SEO设置
    SearchHistory = "search_history", // 搜索历史
    ThemePreset = "theme_preset", // 主题预设
    OptionsApp = "options_app", // 应用配置
    OptionsHeadInfo = "options_head_info", // 头部信息
    OptionsNavList = "options_nav_list", // 导航列表
    OptionsCarousel = "options_carousel", // 轮播图
    OptionsNavObj = "options_nav_obj", // 导航object
    OptionsFooterInfo = "options_footer_info", // 底部信息
    OptionsSlideVerify = "options_slide_verify", // 滑动验证
    OptionsVideoWatermark = "options_video_watermark", // 视频水印
    PostDetailEditEnable = "post_detail_edit_enable", // 文章详情编辑是否启用
    PayTypeEnable = "pay_type_enable", // 支付类型是否启用
    EditorDefaultsPowerBi = "editor_defaults_power_bi", // 编辑器 PowerBI 插入默认值
    EditorDefaultsWechatCaptcha = "editor_defaults_wechat_captcha", // 编辑器 WechatCaptcha 插入默认值
    ThumbnailAutoInsertEnable = "thumbnail_auto_insert_enable", // 缩略图自动插入是否启用
    ThumbnailAutoInsertIndex = "thumbnail_auto_insert_index", // 缩略图自动插入位置
}
