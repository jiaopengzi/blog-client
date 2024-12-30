/**
 * @Author       : jiaopengzi
 * @Date         : 2024-12-30 11:52:27
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-30 11:54:01
 * @FilePath     : \blog-client\src\views\admin\component\aside\types.ts
 * @Description  : 类型
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import type { MenuItemMap, MenuItemMapWithIndex } from "@/components/common/recursive-menu-item"

// 管理后台菜单项枚举 注意使用大驼峰命名
export enum AdminSideMenu {
    "Dashboard" = "Dashboard",
    "Post" = "Post",
    "PostAll" = "PostAll",
    "PostWrite" = "PostWrite",
    "PostTag" = "PostTag",
    "PostCategory" = "PostCategory",
    "Media" = "Media",
    "Link" = "Link",
    "LinkAll" = "LinkAll",
    "LinkAdd" = "LinkAdd",
    "LinkCategory" = "LinkCategory",
    "Page" = "Page",
    "PageAll" = "PageAll",
    "PageAdd" = "PageAdd",
    "Comment" = "Comment",
    "Announcement" = "Announcement",
    "AnnouncementAll" = "AnnouncementAll",
    "AnnouncementPublish" = "AnnouncementPublish",
    "AnnouncementCategory" = "AnnouncementCategory",
    "Video" = "Video",
    "VideoAll" = "VideoAll",
    "VideoPublish" = "VideoPublish",
    "VideoCategory" = "VideoCategory",
    "Shop" = "Shop",
    "Product" = "Product",
    "Order" = "Order",
    "MemberManagement" = "MemberManagement",
    "ShortLink" = "ShortLink",
    "ShortLinkAll" = "ShortLinkAll",
    "ShortLinkAdd" = "ShortLinkAdd",
    "User" = "User",
    "UserView" = "UserView",
    "LoginLog" = "LoginLog",
    "PermissionRole" = "PermissionRole",
    "Setting" = "Setting",
    "Notification" = "Notification",
    "Backup" = "Backup",
}

// admin管理后台菜单项映射表
export type AdminMenuItemMap = MenuItemMap<AdminSideMenu>
// admin管理后台菜单项映射表 包含 index 属性
export type AdminMenuItemMapWithIndex = MenuItemMapWithIndex<AdminSideMenu>
