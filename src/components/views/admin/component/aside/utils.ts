/*
 * FilePath    : blog-client-nuxt\src\components\views\admin\component\aside\utils.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 工具
 */

import { IconKeys } from "@/components/common/icons" // 图标名称枚举
import { RouteNamesAdmin } from "@/router"
import { PermissionNames } from "@/api/permissionRole/permissionNames" // 权限名称枚举

import { type AdminMenuItemMap, type AdminMenuItemMapWithIndex } from "./types"

export const adminMenuItemMap: AdminMenuItemMap = {
    [RouteNamesAdmin.Dashboard]: {
        text: "仪表板",
        permissionName: PermissionNames.ViewDashboard,
        icon: {
            name: IconKeys.Dashboard,
            class: "icon-menu",
        },
    },
    [RouteNamesAdmin.Media]: {
        text: "媒体",
        permissionName: PermissionNames.ViewMedia,
        icon: {
            name: IconKeys.Media,
            class: "icon-menu",
        },
    },
    [RouteNamesAdmin.Post]: {
        text: "文章",
        permissionName: PermissionNames.ViewPost,
        icon: {
            name: IconKeys.Post,
            class: "icon-menu",
        },
        components: RouteNamesAdmin.PostAll,
    },
    [RouteNamesAdmin.PostAll]: {
        text: "所有文章",
        permissionName: PermissionNames.ViewPost,
        parentIndex: RouteNamesAdmin.Post,
    },
    [RouteNamesAdmin.PostWrite]: {
        text: "写文章",
        permissionName: PermissionNames.AddPost,
        parentIndex: RouteNamesAdmin.Post,
    },
    [RouteNamesAdmin.PostCategory]: {
        text: "分类",
        permissionName: PermissionNames.ViewCategory,
        parentIndex: RouteNamesAdmin.Post,
    },
    [RouteNamesAdmin.PostTag]: {
        text: "标签",
        permissionName: PermissionNames.ViewTag,
        parentIndex: RouteNamesAdmin.Post,
    },
    [RouteNamesAdmin.Comment]: {
        text: "评论",
        permissionName: PermissionNames.ViewComment,
        icon: {
            name: IconKeys.Comment,
            class: "icon-menu",
        },
    },
    [RouteNamesAdmin.PageAdmin]: {
        text: "页面",
        permissionName: PermissionNames.ViewPost,
        icon: {
            name: IconKeys.Page,
            class: "icon-menu",
        },
    },
    [RouteNamesAdmin.PageAll]: {
        text: "所有页面",
        permissionName: PermissionNames.ViewPost,
        parentIndex: RouteNamesAdmin.PageAdmin,
    },
    [RouteNamesAdmin.PageWrite]: {
        text: "新增页面",
        permissionName: PermissionNames.AddPost,
        parentIndex: RouteNamesAdmin.PageAdmin,
    },
    [RouteNamesAdmin.User]: {
        text: "用户",
        permissionName: PermissionNames.UserView,
        icon: {
            name: IconKeys.User,
            class: "icon-menu",
        },
        components: RouteNamesAdmin.UserView,
    },
    [RouteNamesAdmin.UserView]: {
        text: "所有用户",
        parentIndex: RouteNamesAdmin.User,
        permissionName: PermissionNames.UserView,
        params: {
            roleName: "role-name",
            search: "search",
            pageSize: "page-size",
            currentPage: "current-page",
        },
    },
    [RouteNamesAdmin.LoginLog]: {
        text: "登录日志",
        permissionName: PermissionNames.LoginLogView,
        parentIndex: RouteNamesAdmin.User,
    },
    [RouteNamesAdmin.PermissionRole]: {
        text: "权限角色",
        permissionName: PermissionNames.PermissionRole,
        parentIndex: RouteNamesAdmin.User,
    },
    [RouteNamesAdmin.Setting]: {
        text: "网站配置",
        permissionName: PermissionNames.AppOption,
        icon: {
            name: IconKeys.Setting,
            class: "icon-menu",
        },
    },
    [RouteNamesAdmin.SettingAPPNav]: {
        text: "导航",
        permissionName: PermissionNames.AppOption,
        parentIndex: RouteNamesAdmin.Setting,
    },
    [RouteNamesAdmin.SettingAPPOption]: {
        text: "选项",
        permissionName: PermissionNames.AppOption,
        parentIndex: RouteNamesAdmin.Setting,
    },
    [RouteNamesAdmin.SettingDatabase]: {
        text: "数据库",
        permissionName: PermissionNames.AppOption,
        parentIndex: RouteNamesAdmin.Setting,
    },
    [RouteNamesAdmin.SettingEmail]: {
        text: "邮箱",
        permissionName: PermissionNames.AppOption,
        parentIndex: RouteNamesAdmin.Setting,
    },
    [RouteNamesAdmin.SettingSocial]: {
        text: "社交登录",
        permissionName: PermissionNames.AppOption,
        parentIndex: RouteNamesAdmin.Setting,
    },
    [RouteNamesAdmin.SettingUpload]: {
        text: "文件上传",
        permissionName: PermissionNames.AppOption,
        parentIndex: RouteNamesAdmin.Setting,
    },
    [RouteNamesAdmin.Shop]: {
        text: "商城",
        permissionName: PermissionNames.Shop,
        icon: {
            name: IconKeys.Shop,
            class: "icon-menu",
        },
    },
    [RouteNamesAdmin.AccountKey]: {
        text: "账号密钥",
        permissionName: PermissionNames.Shop,
        parentIndex: RouteNamesAdmin.Shop,
    },
    [RouteNamesAdmin.AccountKeyAll]: {
        text: "产品",
        permissionName: PermissionNames.Shop,
        parentIndex: RouteNamesAdmin.AccountKey,
    },
    [RouteNamesAdmin.AccountKeyItem]: {
        text: "明细",
        permissionName: PermissionNames.Shop,
        parentIndex: RouteNamesAdmin.AccountKey,
    },
    [RouteNamesAdmin.Order]: {
        text: "订单",
        permissionName: PermissionNames.Shop,
        parentIndex: RouteNamesAdmin.Shop,
    },
    [RouteNamesAdmin.Membership]: {
        text: "会员",
        permissionName: PermissionNames.Shop,
        parentIndex: RouteNamesAdmin.Shop,
        components: RouteNamesAdmin.MembershipRole,
    },
    [RouteNamesAdmin.MembershipRole]: {
        text: "角色",
        permissionName: PermissionNames.Shop,
        parentIndex: RouteNamesAdmin.Membership,
    },
    [RouteNamesAdmin.MembershipUser]: {
        text: "用户",
        permissionName: PermissionNames.Shop,
        parentIndex: RouteNamesAdmin.Membership,
    },
    [RouteNamesAdmin.Coupon]: {
        text: "优惠券",
        permissionName: PermissionNames.Shop,
        parentIndex: RouteNamesAdmin.Shop,
    },
    [RouteNamesAdmin.PayConfig]: {
        text: "支付配置",
        permissionName: PermissionNames.Shop,
        parentIndex: RouteNamesAdmin.Shop,
    },
    [RouteNamesAdmin.BillingCenter]: {
        text: "计费中心",
        permissionName: PermissionNames.Shop,
        parentIndex: RouteNamesAdmin.Shop,
    },
    [RouteNamesAdmin.Notification]: {
        text: "通知",
        permissionName: PermissionNames.Notification,
        icon: {
            name: IconKeys.Notification,
            class: "icon-menu",
        },
    },
    [RouteNamesAdmin.Links]: {
        text: "链接",
        permissionName: PermissionNames.ViewLink,
        icon: {
            name: IconKeys.Link,
            class: "icon-menu",
        },
    },
}

// 获取菜单数据
export function getAdminMenuItemMap() {
    return adminMenuItemMap
}

/**
 * @description: 生成包含 index 属性并修改 parentIndex 属性的菜单项映射表
 * @param menuItemMap 菜单项映射表
 * @param parentPath 前缀路径
 * @return MenuItemMapWithIndex 菜单项映射表
 */
export function generateAdminMenuItemMapWithIndex(menuItemMap: AdminMenuItemMap, parentPath: string): AdminMenuItemMapWithIndex {
    const result: Partial<AdminMenuItemMapWithIndex> = {} // 生成的菜单项映射表

    // 递归生成菜单项映射表
    function createIndex(itemKey: RouteNamesAdmin, parentIndex?: string) {
        const currentItem = menuItemMap[itemKey] // 当前菜单项
        const newIndex = `${parentPath}/${itemKey}` // 不包含上级菜单项索引的当前菜单项索引
        const newParentIndex = parentIndex || parentPath // 父菜单项索引

        // 将新增 / 更新的属性添加到当前结果对象中, 保证点击菜单项时路由跳转正确, 不会重复叠加路由
        result[itemKey] = {
            ...currentItem,
            index: `/${newIndex}`, // 添加 / 前缀, 确保正确的路由跳转
            ...(currentItem.parentIndex !== undefined && { parentIndex: `/${newParentIndex}` }), // 如果存在父级索引, 则添加到属性中并添加 / 前缀
        }

        // 遍历子菜单项并进行递归调用
        for (const childKey in menuItemMap) {
            if (menuItemMap[childKey as RouteNamesAdmin].parentIndex === itemKey) {
                createIndex(childKey as RouteNamesAdmin, newIndex)
            }
        }
    }

    // 生成顶级菜单项映射表
    for (const key in menuItemMap) {
        if (!menuItemMap[key as RouteNamesAdmin].parentIndex) {
            createIndex(key as RouteNamesAdmin)
        }
    }

    return result as AdminMenuItemMapWithIndex
}

export const adminMenuItemMapWithIndex = generateAdminMenuItemMapWithIndex(adminMenuItemMap as AdminMenuItemMap, "admin")

// 根据 adminMenuItemMapWithIndex, 将 index 作为 key, 内容作为 value 生成菜单项映射表
export const adminMenuItemMapWithIndexMap = Object.fromEntries(Object.entries(adminMenuItemMapWithIndex).map(([, value]) => [value.index, value]))
