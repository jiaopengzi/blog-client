/**
 * @Author       : jiaopengzi
 * @Date         : 2025-01-08 10:46:47
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2025-01-15 13:10:04
 * @FilePath     : \blog-client\src\router\types.ts
 * @Description  :
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 */

// public 路由名称
export enum RouteNamesPublic {
    Home = "home",
    Setup = "setup",
    Test = "test",
    Test1 = "test1",
    NotFound = "not-found",
    Login = "login",
    SocialQQLoginCallback = "social-qq-login-callback",
    SocialQQBindCallback = "social-qq-bind-callback",
    SocialWeChatLoginCallback = "social-wechat-login-callback",
    SocialWeChatBindCallback = "social-wechat-bind-callback",
    Register = "register",
    RegisterAdmin = "register-admin",
    ResetPassword = "reset-password",
    UserInfo = "user-info",
    PostPublic = "post-public",
    VideoPublic = "video-public",
    Doc = "doc",
    Tool = "tool",
    Vip = "vip",
    Admin = "admin",
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
    Link = "link",
    LinkAll = "link-all",
    LinkAdd = "link-add",
    LinkCategory = "link-category",
    Page = "page",
    PageAll = "page-all",
    PageAdd = "page-add",
    Comment = "comment",
    Announcement = "announcement",
    AnnouncementAll = "announcement-all",
    AnnouncementPublish = "announcement-publish",
    AnnouncementCategory = "announcement-category",
    Video = "video",
    VideoAll = "video-all",
    VideoPublish = "video-publish",
    VideoCategory = "video-category",
    Shop = "shop",
    Product = "product",
    Order = "order",
    MemberManagement = "member-management",
    ShortLink = "short-link",
    ShortLinkAll = "short-link-all",
    ShortLinkAdd = "short-link-add",
    User = "user",
    UserView = "user-view",
    LoginLog = "login-log",
    PermissionRole = "permission-role",
    Setting = "setting",
    // SettingDatabase = "database",
    // SettingEmail = "email",
    // SettingSocial = "social",
    // SettingUpload = "upload",
    Notification = "notification",
    Backup = "backup",
}

// 枚举转换为对象
const routeNamesPublic = {
    ...RouteNamesPublic,
}

const routeNamesAdmin = {
    ...RouteNamesAdmin,
}

// 合并对象
const mergedRouteNames = {
    ...routeNamesPublic,
    ...routeNamesAdmin,
}

// 将合并后的对象转换为枚举
export const RouteNames = mergedRouteNames as typeof RouteNamesPublic & typeof RouteNamesAdmin

// RouteNames 类型
export type RouteNames = (typeof RouteNames)[keyof typeof RouteNames]
