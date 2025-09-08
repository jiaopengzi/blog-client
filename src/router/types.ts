/**
 * @FilePath     : \blog-client\src\router\types.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 路由名称
 */

// public 路由名称
export enum RouteNamesDefault {
    Home = "home",
    Search = "search",
    Detail = "detail",
    Setup = "setup",
    Test = "test",
    Test1 = "test1",
    NotFound = "not-found",
    Login = "login",
    LinkList = "link-list",
    Register = "register",
    RegisterAdmin = "register-admin",
    ResetPassword = "reset-password",
    UserInfo = "user-info",
    Checkout = "checkout",
    Unsubscribe = "unsubscribe",
    Page = "page",
    // PostPublic = "post-public",
    // VideoPublic = "video-public",
    // Doc = "doc",
    // Tool = "tool",
    // Vip = "vip",
    Admin = "admin",
}

// public 路由名称
export enum RouteNamesSocial {
    SocialQQLoginCallback = "social-qq-login-callback",
    SocialQQBindCallback = "social-qq-bind-callback",
    SocialWeChatLoginCallback = "social-wechat-login-callback",
    SocialWeChatBindCallback = "social-wechat-bind-callback",
}

// 后台管理路由名称
export enum RouteNamesAdmin {
    Dashboard = "dashboard",
    Post = "post",
    PostAll = "post-all",
    PostWrite = "post-write",
    PostTag = "post-tag",
    PostCategory = "post-category",
    Media = "media",
    Links = "links",
    // LinkAll = "link-all",
    // LinkAdd = "link-add",
    // LinkCategory = "link-category",
    PageAdmin = "page-admin",
    PageAll = "page-all",
    PageWrite = "page-write",
    Comment = "comment",
    // Announcement = "announcement",
    // AnnouncementAll = "announcement-all",
    // AnnouncementPublish = "announcement-publish",
    // AnnouncementCategory = "announcement-category",
    Video = "video",
    VideoAll = "video-all",
    VideoPublish = "video-publish",
    VideoCategory = "video-category",
    Shop = "shop",
    // Product = "product",
    AccountKey = "account-key",
    AccountKeyAll = "account-key-all",
    AccountKeyItem = "account-key-item",
    Order = "order",
    Membership = "membership",
    Coupon = "coupon",
    PayConfig = "pay-config",
    // ShortLink = "short-link",
    // ShortLinkAll = "short-link-all",
    // ShortLinkAdd = "short-link-add",
    User = "user",
    UserView = "user-view",
    LoginLog = "login-log",
    PermissionRole = "permission-role",
    Setting = "setting",
    SettingAPPNav = "app-nav",
    SettingAPPOption = "app-option",
    SettingDatabase = "database",
    SettingEmail = "email",
    SettingSocial = "social",
    SettingUpload = "upload",
    Notification = "notification",
    Backup = "backup",
}

// 枚举转换为对象
const routeNamesDefault = {
    ...RouteNamesDefault,
}

const routeNamesSocial = {
    ...RouteNamesSocial,
}

const routeNamesAdmin = {
    ...RouteNamesAdmin,
}

// 合并对象
const mergedRouteNames = {
    ...routeNamesDefault,
    ...routeNamesSocial,
    ...routeNamesAdmin,
}

// 将合并后的对象转换为枚举
export const RouteNames = mergedRouteNames as typeof RouteNamesDefault & typeof RouteNamesSocial & typeof RouteNamesAdmin

// RouteNames 类型
export type RouteNames = (typeof RouteNames)[keyof typeof RouteNames]
