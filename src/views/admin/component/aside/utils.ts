/**
 * @Author       : jiaopengzi
 * @Date         : 2024-12-30 11:52:45
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-30 14:50:17
 * @FilePath     : \blog-client\src\views\admin\component\aside\utils.ts
 * @Description  : 工具
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { IconKeys } from "@/components/common/icons" // 图标名称枚举
import { toKebabCase } from "@/utils/namingConversion"
import { PermissionNames } from "@/utils/permissionRole" // 权限名称枚举

import { type AdminMenuItemMap, type AdminMenuItemMapWithIndex,AdminSideMenu } from "./types"

const adminMenuItemMap: AdminMenuItemMap = {
    [AdminSideMenu.Dashboard]: {
        display: "仪表板",
        icon: {
            name: IconKeys.Dashboard,
            class: "icon-menu",
        },
    },
    [AdminSideMenu.Post]: {
        display: "文章",
        icon: {
            name: IconKeys.Post,
            class: "icon-menu",
        },
        components: AdminSideMenu.PostAll,
    },
    [AdminSideMenu.PostAll]: {
        display: "所有文章",
        parentIndex: AdminSideMenu.Post,
    },
    [AdminSideMenu.PostWrite]: {
        display: "写文章",
        parentIndex: AdminSideMenu.Post,
    },
    [AdminSideMenu.PostTag]: {
        display: "标签",
        parentIndex: AdminSideMenu.Post,
    },
    [AdminSideMenu.PostCategory]: {
        display: "分类",
        parentIndex: AdminSideMenu.Post,
    },
    [AdminSideMenu.Media]: {
        display: "媒体",
        icon: {
            name: IconKeys.Media,
            class: "icon-menu",
        },
    },
    [AdminSideMenu.Link]: {
        display: "链接",
        icon: {
            name: IconKeys.Link,
            class: "icon-menu",
        },
    },
    [AdminSideMenu.LinkAll]: {
        display: "所有链接",
        parentIndex: AdminSideMenu.Link,
    },
    [AdminSideMenu.LinkAdd]: {
        display: "新增链接",
        parentIndex: AdminSideMenu.Link,
    },
    [AdminSideMenu.LinkCategory]: {
        display: "链接分类",
        parentIndex: AdminSideMenu.Link,
    },
    [AdminSideMenu.Page]: {
        display: "页面",
        icon: {
            name: IconKeys.Page,
            class: "icon-menu",
        },
    },
    [AdminSideMenu.PageAll]: {
        display: "所有页面",
        parentIndex: AdminSideMenu.Page,
    },
    [AdminSideMenu.PageAdd]: {
        display: "新增页面",
        parentIndex: AdminSideMenu.Page,
    },
    [AdminSideMenu.Comment]: {
        display: "评论",
        icon: {
            name: IconKeys.Comment,
            class: "icon-menu",
        },
    },
    [AdminSideMenu.Announcement]: {
        display: "公告",
        icon: {
            name: IconKeys.Announcement,
            class: "icon-menu",
        },
    },
    [AdminSideMenu.AnnouncementAll]: {
        display: "所有公告",
        parentIndex: AdminSideMenu.Announcement,
    },
    [AdminSideMenu.AnnouncementPublish]: {
        display: "发布公告",
        parentIndex: AdminSideMenu.Announcement,
    },
    [AdminSideMenu.AnnouncementCategory]: {
        display: "公告分类",
        parentIndex: AdminSideMenu.Announcement,
    },
    [AdminSideMenu.Video]: {
        display: "视频",
        icon: {
            name: IconKeys.Video,
            class: "icon-menu",
        },
    },
    [AdminSideMenu.VideoAll]: {
        display: "所有视频",
        parentIndex: AdminSideMenu.Video,
    },
    [AdminSideMenu.VideoPublish]: {
        display: "发布视频",
        parentIndex: AdminSideMenu.Video,
    },
    [AdminSideMenu.VideoCategory]: {
        display: "视频分类",
        parentIndex: AdminSideMenu.Video,
    },
    [AdminSideMenu.Shop]: {
        display: "商城",
        icon: {
            name: IconKeys.Shop,
            class: "icon-menu",
        },
    },
    [AdminSideMenu.Product]: {
        display: "产品",
        parentIndex: AdminSideMenu.Shop,
    },
    [AdminSideMenu.Order]: {
        display: "订单",
        parentIndex: AdminSideMenu.Shop,
    },
    [AdminSideMenu.MemberManagement]: {
        display: "会员管理",
        parentIndex: AdminSideMenu.Shop,
    },
    [AdminSideMenu.ShortLink]: {
        display: "短连接",
        icon: {
            name: IconKeys.ShortLink,
            class: "icon-menu",
        },
    },
    [AdminSideMenu.ShortLinkAll]: {
        display: "所有短连接",
        parentIndex: AdminSideMenu.ShortLink,
    },
    [AdminSideMenu.ShortLinkAdd]: {
        display: "新增短连接",
        parentIndex: AdminSideMenu.ShortLink,
    },
    [AdminSideMenu.User]: {
        display: "用户",
        icon: {
            name: IconKeys.User,
            class: "icon-menu",
        },
        components: AdminSideMenu.UserView,
    },
    [AdminSideMenu.UserView]: {
        display: "所有用户",
        parentIndex: AdminSideMenu.User,
        permissionName: PermissionNames.UserView,
        params: {
            roleName: "role-name",
            search: "search",
            pageSize: "page-size",
            currentPage: "current-page",
        },
    },
    [AdminSideMenu.LoginLog]: {
        display: "登录日志",
        parentIndex: AdminSideMenu.User,
    },
    [AdminSideMenu.PermissionRole]: {
        display: "权限角色",
        parentIndex: AdminSideMenu.User,
        permissionName: PermissionNames.PermissionRole,
    },
    [AdminSideMenu.Setting]: {
        display: "网站配置",
        icon: {
            name: IconKeys.Setting,
            class: "icon-menu",
        },
    },
    [AdminSideMenu.Notification]: {
        display: "通知",
        icon: {
            name: IconKeys.Notification,
            class: "icon-menu",
        },
    },
    [AdminSideMenu.Backup]: {
        display: "备份",
        icon: {
            name: IconKeys.Backup,
            class: "icon-menu",
        },
        permissionName: PermissionNames.Backup,
    },
}

// 获取菜单数据
export function getAdminMenuItemMap() {
    return adminMenuItemMap
}

/**
 * @description: 生成包含 index 属性的及修改 parentIndex 属性的菜单项映射表
 * @param menuItemMap 菜单项映射表
 * @param parentPath 前缀路径
 * @return MenuItemMapWithIndex 菜单项映射表
 */
export function generateAdminMenuItemMapWithIndex(
    menuItemMap: AdminMenuItemMap,
    parentPath: string,
): AdminMenuItemMapWithIndex {
    const result: Partial<AdminMenuItemMapWithIndex> = {} // 生成的菜单项映射表

    // 递归生成菜单项映射表
    function createIndex(itemKey: AdminSideMenu, parentIndex?: string) {
        const currentItem = menuItemMap[itemKey] // 当前菜单项
        const kebabItemKey = toKebabCase(itemKey) // 菜单项转换为小写短横线连接形式
        // const newIndex = `${parentIndex ? parentIndex : parentPath}/${kebabItemKey}` // 包含上级菜单项索引的当前菜单项索引
        // // 如果 currentItem 中包含 params 属性，则添加到索引中
        // if (currentItem.params) {
        //   const params = Object.values(currentItem.params)
        //     .map((param) => `:${param}?`)
        //     .join('/')
        //   kebabItemKey += `/${params}`
        // }
        const newIndex = `${parentPath}/${kebabItemKey}` // 不包含上级菜单项索引的当前菜单项索引
        const newParentIndex = parentIndex || parentPath // 父菜单项索引

        // 将新增的 / 更新的属性添加到当前结果对象中 保证点击菜单项时路由跳转正确 不会重复叠加路由
        result[itemKey] = {
            ...currentItem,
            index: `/${newIndex}`, // 添加 / 前缀，确保正确的路由跳转
            ...(currentItem.parentIndex !== undefined && { parentIndex: `/${newParentIndex}` }), // 如果存在父级索引，则添加到属性中并添加 / 前缀
        }

        // 遍历子菜单项并进行递归调用
        for (const childKey in menuItemMap) {
            if (menuItemMap[childKey as AdminSideMenu].parentIndex === itemKey) {
                createIndex(childKey as AdminSideMenu, newIndex)
            }
        }
    }

    // 生成顶级菜单项映射表
    for (const key in menuItemMap) {
        if (!menuItemMap[key as AdminSideMenu].parentIndex) {
            createIndex(key as AdminSideMenu)
        }
    }

    return result as AdminMenuItemMapWithIndex
}

export const adminMenuItemMapWithIndex = generateAdminMenuItemMapWithIndex(
    adminMenuItemMap,
    "admin",
)

// 根据 adminMenuItemMapWithIndex 将 index 作为 key 内容作为 value 生成菜单项映射表
export const adminMenuItemMapWithIndexMap = Object.fromEntries(
    Object.entries(adminMenuItemMapWithIndex).map(([key, value]) => [value.index, value]),
)
