/**
 * @FilePath     : \blog-client\src\views\admin\component\aside\utils.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 工具
 */

import { IconKeys } from "@/components/common/icons" // 图标名称枚举
import { RouteNamesAdmin } from "@/router"
// import { toKebabCase } from "@/utils/namingConversion"
import { PermissionNames } from "@/stores/permissionRole" // 权限名称枚举

import { type AdminMenuItemMap, type AdminMenuItemMapWithIndex } from "./types"

export const adminMenuItemMap: AdminMenuItemMap = {
    [RouteNamesAdmin.Dashboard]: {
        display: "仪表板",
        icon: {
            name: IconKeys.Dashboard,
            class: "icon-menu",
        },
    },
    [RouteNamesAdmin.Post]: {
        display: "文章",
        icon: {
            name: IconKeys.Post,
            class: "icon-menu",
        },
        components: RouteNamesAdmin.PostAll,
    },
    [RouteNamesAdmin.PostAll]: {
        display: "所有文章",
        parentIndex: RouteNamesAdmin.Post,
    },
    [RouteNamesAdmin.PostWrite]: {
        display: "写文章",
        parentIndex: RouteNamesAdmin.Post,
    },
    [RouteNamesAdmin.PostTag]: {
        display: "标签",
        parentIndex: RouteNamesAdmin.Post,
    },
    [RouteNamesAdmin.PostCategory]: {
        display: "分类",
        parentIndex: RouteNamesAdmin.Post,
    },
    [RouteNamesAdmin.Media]: {
        display: "媒体",
        icon: {
            name: IconKeys.Media,
            class: "icon-menu",
        },
    },
    [RouteNamesAdmin.Link]: {
        display: "链接",
        icon: {
            name: IconKeys.Link,
            class: "icon-menu",
        },
    },
    [RouteNamesAdmin.LinkAll]: {
        display: "所有链接",
        parentIndex: RouteNamesAdmin.Link,
    },
    [RouteNamesAdmin.LinkAdd]: {
        display: "新增链接",
        parentIndex: RouteNamesAdmin.Link,
    },
    [RouteNamesAdmin.LinkCategory]: {
        display: "链接分类",
        parentIndex: RouteNamesAdmin.Link,
    },
    [RouteNamesAdmin.Page]: {
        display: "页面",
        icon: {
            name: IconKeys.Page,
            class: "icon-menu",
        },
    },
    [RouteNamesAdmin.PageAll]: {
        display: "所有页面",
        parentIndex: RouteNamesAdmin.Page,
    },
    [RouteNamesAdmin.PageAdd]: {
        display: "新增页面",
        parentIndex: RouteNamesAdmin.Page,
    },
    [RouteNamesAdmin.Comment]: {
        display: "评论",
        icon: {
            name: IconKeys.Comment,
            class: "icon-menu",
        },
    },
    [RouteNamesAdmin.Announcement]: {
        display: "公告",
        icon: {
            name: IconKeys.Announcement,
            class: "icon-menu",
        },
    },
    [RouteNamesAdmin.AnnouncementAll]: {
        display: "所有公告",
        parentIndex: RouteNamesAdmin.Announcement,
    },
    [RouteNamesAdmin.AnnouncementPublish]: {
        display: "发布公告",
        parentIndex: RouteNamesAdmin.Announcement,
    },
    [RouteNamesAdmin.AnnouncementCategory]: {
        display: "公告分类",
        parentIndex: RouteNamesAdmin.Announcement,
    },
    [RouteNamesAdmin.Video]: {
        display: "视频",
        icon: {
            name: IconKeys.Video,
            class: "icon-menu",
        },
    },
    [RouteNamesAdmin.VideoAll]: {
        display: "所有视频",
        parentIndex: RouteNamesAdmin.Video,
    },
    [RouteNamesAdmin.VideoPublish]: {
        display: "发布视频",
        parentIndex: RouteNamesAdmin.Video,
    },
    [RouteNamesAdmin.VideoCategory]: {
        display: "视频分类",
        parentIndex: RouteNamesAdmin.Video,
    },
    [RouteNamesAdmin.Shop]: {
        display: "商城",
        icon: {
            name: IconKeys.Shop,
            class: "icon-menu",
        },
    },
    [RouteNamesAdmin.Product]: {
        display: "产品",
        parentIndex: RouteNamesAdmin.Shop,
    },
    [RouteNamesAdmin.Order]: {
        display: "订单",
        parentIndex: RouteNamesAdmin.Shop,
    },
    [RouteNamesAdmin.MemberManagement]: {
        display: "会员管理",
        parentIndex: RouteNamesAdmin.Shop,
    },
    [RouteNamesAdmin.ShortLink]: {
        display: "短连接",
        icon: {
            name: IconKeys.ShortLink,
            class: "icon-menu",
        },
    },
    [RouteNamesAdmin.ShortLinkAll]: {
        display: "所有短连接",
        parentIndex: RouteNamesAdmin.ShortLink,
    },
    [RouteNamesAdmin.ShortLinkAdd]: {
        display: "新增短连接",
        parentIndex: RouteNamesAdmin.ShortLink,
    },
    [RouteNamesAdmin.User]: {
        display: "用户",
        icon: {
            name: IconKeys.User,
            class: "icon-menu",
        },
        components: RouteNamesAdmin.UserView,
    },
    [RouteNamesAdmin.UserView]: {
        display: "所有用户",
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
        display: "登录日志",
        parentIndex: RouteNamesAdmin.User,
    },
    [RouteNamesAdmin.PermissionRole]: {
        display: "权限角色",
        parentIndex: RouteNamesAdmin.User,
        permissionName: PermissionNames.PermissionRole,
    },
    [RouteNamesAdmin.Setting]: {
        display: "网站配置",
        icon: {
            name: IconKeys.Setting,
            class: "icon-menu",
        },
    },
    [RouteNamesAdmin.SettingAPPOption]: {
        display: "选项",
        parentIndex: RouteNamesAdmin.Setting,
    },
    [RouteNamesAdmin.SettingDatabase]: {
        display: "数据库",
        parentIndex: RouteNamesAdmin.Setting,
    },
    [RouteNamesAdmin.SettingEmail]: {
        display: "邮箱",
        parentIndex: RouteNamesAdmin.Setting,
    },
    [RouteNamesAdmin.SettingSocial]: {
        display: "社交登录",
        parentIndex: RouteNamesAdmin.Setting,
    },
    [RouteNamesAdmin.SettingUpload]: {
        display: "文件上传",
        parentIndex: RouteNamesAdmin.Setting,
    },
    [RouteNamesAdmin.Notification]: {
        display: "通知",
        icon: {
            name: IconKeys.Notification,
            class: "icon-menu",
        },
    },

    [RouteNamesAdmin.Backup]: {
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
export function generateAdminMenuItemMapWithIndex(menuItemMap: AdminMenuItemMap, parentPath: string): AdminMenuItemMapWithIndex {
    const result: Partial<AdminMenuItemMapWithIndex> = {} // 生成的菜单项映射表

    // 递归生成菜单项映射表
    function createIndex(itemKey: RouteNamesAdmin, parentIndex?: string) {
        const currentItem = menuItemMap[itemKey] // 当前菜单项
        // const kebabItemKey = toKebabCase(itemKey) // 菜单项转换为小写短横线连接形式
        // const newIndex = `${parentIndex ? parentIndex : parentPath}/${kebabItemKey}` // 包含上级菜单项索引的当前菜单项索引
        // // 如果 currentItem 中包含 params 属性，则添加到索引中
        // if (currentItem.params) {
        //   const params = Object.values(currentItem.params)
        //     .map((param) => `:${param}?`)
        //     .join('/')
        //   kebabItemKey += `/${params}`
        // }
        // const newIndex = `${parentPath}/${kebabItemKey}` // 不包含上级菜单项索引的当前菜单项索引
        const newIndex = `${parentPath}/${itemKey}` // 不包含上级菜单项索引的当前菜单项索引
        const newParentIndex = parentIndex || parentPath // 父菜单项索引

        // 将新增的 / 更新的属性添加到当前结果对象中 保证点击菜单项时路由跳转正确 不会重复叠加路由
        result[itemKey] = {
            ...currentItem,
            index: `/${newIndex}`, // 添加 / 前缀，确保正确的路由跳转
            ...(currentItem.parentIndex !== undefined && { parentIndex: `/${newParentIndex}` }), // 如果存在父级索引，则添加到属性中并添加 / 前缀
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

// 根据 adminMenuItemMapWithIndex 将 index 作为 key 内容作为 value 生成菜单项映射表
export const adminMenuItemMapWithIndexMap = Object.fromEntries(Object.entries(adminMenuItemMapWithIndex).map(([key, value]) => [value.index, value]))
