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
        text: "仪表板",
        icon: {
            name: IconKeys.Dashboard,
            class: "icon-menu",
        },
    },
    [RouteNamesAdmin.Post]: {
        text: "文章",
        icon: {
            name: IconKeys.Post,
            class: "icon-menu",
        },
        components: RouteNamesAdmin.PostAll,
    },
    [RouteNamesAdmin.PostAll]: {
        text: "所有文章",
        parentIndex: RouteNamesAdmin.Post,
    },
    [RouteNamesAdmin.PostWrite]: {
        text: "写文章",
        parentIndex: RouteNamesAdmin.Post,
    },
    [RouteNamesAdmin.PostTag]: {
        text: "标签",
        parentIndex: RouteNamesAdmin.Post,
    },
    [RouteNamesAdmin.PostCategory]: {
        text: "分类",
        parentIndex: RouteNamesAdmin.Post,
    },
    [RouteNamesAdmin.Media]: {
        text: "媒体",
        icon: {
            name: IconKeys.Media,
            class: "icon-menu",
        },
    },
    [RouteNamesAdmin.Link]: {
        text: "链接",
        icon: {
            name: IconKeys.Link,
            class: "icon-menu",
        },
    },
    [RouteNamesAdmin.LinkAll]: {
        text: "所有链接",
        parentIndex: RouteNamesAdmin.Link,
    },
    [RouteNamesAdmin.LinkAdd]: {
        text: "新增链接",
        parentIndex: RouteNamesAdmin.Link,
    },
    [RouteNamesAdmin.LinkCategory]: {
        text: "链接分类",
        parentIndex: RouteNamesAdmin.Link,
    },
    [RouteNamesAdmin.Page]: {
        text: "页面",
        icon: {
            name: IconKeys.Page,
            class: "icon-menu",
        },
    },
    [RouteNamesAdmin.PageAll]: {
        text: "所有页面",
        parentIndex: RouteNamesAdmin.Page,
    },
    [RouteNamesAdmin.PageAdd]: {
        text: "新增页面",
        parentIndex: RouteNamesAdmin.Page,
    },
    [RouteNamesAdmin.Comment]: {
        text: "评论",
        icon: {
            name: IconKeys.Comment,
            class: "icon-menu",
        },
    },
    [RouteNamesAdmin.Announcement]: {
        text: "公告",
        icon: {
            name: IconKeys.Announcement,
            class: "icon-menu",
        },
    },
    [RouteNamesAdmin.AnnouncementAll]: {
        text: "所有公告",
        parentIndex: RouteNamesAdmin.Announcement,
    },
    [RouteNamesAdmin.AnnouncementPublish]: {
        text: "发布公告",
        parentIndex: RouteNamesAdmin.Announcement,
    },
    [RouteNamesAdmin.AnnouncementCategory]: {
        text: "公告分类",
        parentIndex: RouteNamesAdmin.Announcement,
    },
    [RouteNamesAdmin.Video]: {
        text: "视频",
        icon: {
            name: IconKeys.Video,
            class: "icon-menu",
        },
    },
    [RouteNamesAdmin.VideoAll]: {
        text: "所有视频",
        parentIndex: RouteNamesAdmin.Video,
    },
    [RouteNamesAdmin.VideoPublish]: {
        text: "发布视频",
        parentIndex: RouteNamesAdmin.Video,
    },
    [RouteNamesAdmin.VideoCategory]: {
        text: "视频分类",
        parentIndex: RouteNamesAdmin.Video,
    },
    [RouteNamesAdmin.Shop]: {
        text: "商城",
        icon: {
            name: IconKeys.Shop,
            class: "icon-menu",
        },
    },
    [RouteNamesAdmin.Product]: {
        text: "产品",
        parentIndex: RouteNamesAdmin.Shop,
    },
    [RouteNamesAdmin.Order]: {
        text: "订单",
        parentIndex: RouteNamesAdmin.Shop,
    },
    [RouteNamesAdmin.MemberManagement]: {
        text: "会员管理",
        parentIndex: RouteNamesAdmin.Shop,
    },
    [RouteNamesAdmin.ShortLink]: {
        text: "短连接",
        icon: {
            name: IconKeys.ShortLink,
            class: "icon-menu",
        },
    },
    [RouteNamesAdmin.ShortLinkAll]: {
        text: "所有短连接",
        parentIndex: RouteNamesAdmin.ShortLink,
    },
    [RouteNamesAdmin.ShortLinkAdd]: {
        text: "新增短连接",
        parentIndex: RouteNamesAdmin.ShortLink,
    },
    [RouteNamesAdmin.User]: {
        text: "用户",
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
        parentIndex: RouteNamesAdmin.User,
    },
    [RouteNamesAdmin.PermissionRole]: {
        text: "权限角色",
        parentIndex: RouteNamesAdmin.User,
        permissionName: PermissionNames.PermissionRole,
    },
    [RouteNamesAdmin.Setting]: {
        text: "网站配置",
        icon: {
            name: IconKeys.Setting,
            class: "icon-menu",
        },
    },
    [RouteNamesAdmin.SettingAPPNav]: {
        text: "导航",
        parentIndex: RouteNamesAdmin.Setting,
    },
    [RouteNamesAdmin.SettingAPPOption]: {
        text: "选项",
        parentIndex: RouteNamesAdmin.Setting,
    },
    [RouteNamesAdmin.SettingDatabase]: {
        text: "数据库",
        parentIndex: RouteNamesAdmin.Setting,
    },
    [RouteNamesAdmin.SettingEmail]: {
        text: "邮箱",
        parentIndex: RouteNamesAdmin.Setting,
    },
    [RouteNamesAdmin.SettingSocial]: {
        text: "社交登录",
        parentIndex: RouteNamesAdmin.Setting,
    },
    [RouteNamesAdmin.SettingUpload]: {
        text: "文件上传",
        parentIndex: RouteNamesAdmin.Setting,
    },
    [RouteNamesAdmin.Notification]: {
        text: "通知",
        icon: {
            name: IconKeys.Notification,
            class: "icon-menu",
        },
    },
    [RouteNamesAdmin.Backup]: {
        text: "备份",
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
export const adminMenuItemMapWithIndexMap = Object.fromEntries(Object.entries(adminMenuItemMapWithIndex).map(([, value]) => [value.index, value]))
