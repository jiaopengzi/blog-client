/**
 * @Author       : jiaopengzi
 * @Date         : 2024-01-17 20:33:58
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-01-26 15:15:01
 * @FilePath     : \blog-client\src\views\admin\component\aside\index.ts
 * @Description  :
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */
import { IconKeys } from '@/components/common/icons' // 图标名称枚举
import { toKebabCase } from '@/utils/naming-conversion'

import type { MenuItemMap, MenuItemMapWithIndex } from '@/components/common/recursive-menu-item'

// 管理后台菜单项枚举 注意使用大驼峰命名
export enum AadminSideMenu {
  'Dashboard' = 'Dashboard',
  'Post' = 'Post',
  'PostAll' = 'PostAll',
  'PostWrite' = 'PostWrite',
  'PostTag' = 'PostTag',
  'PostCategory' = 'PostCategory',
  'Media' = 'Media',
  'Link' = 'Link',
  'LinkAll' = 'LinkAll',
  'LinkAdd' = 'LinkAdd',
  'LinkCategory' = 'LinkCategory',
  'Page' = 'Page',
  'PageAll' = 'PageAll',
  'PageAdd' = 'PageAdd',
  'Comment' = 'Comment',
  'Announcement' = 'Announcement',
  'AnnouncementAll' = 'AnnouncementAll',
  'AnnouncementPublish' = 'AnnouncementPublish',
  'AnnouncementCategory' = 'AnnouncementCategory',
  'Video' = 'Video',
  'VideoAll' = 'VideoAll',
  'VideoPublish' = 'VideoPublish',
  'VideoCategory' = 'VideoCategory',
  'Shop' = 'Shop',
  'Product' = 'Product',
  'Order' = 'Order',
  'MemberManagement' = 'MemberManagement',
  'ShortLink' = 'ShortLink',
  'ShortLinkAll' = 'ShortLinkAll',
  'ShortLinkAdd' = 'ShortLinkAdd',
  'User' = 'User',
  'UserAll' = 'UserAll',
  'UserAdd' = 'UserAdd',
  'LoginLog' = 'LoginLog',
  'Config' = 'Config',
  'Notification' = 'Notification',
  'Backup' = 'Backup',
}

export type AdminMenuItemMap = MenuItemMap<AadminSideMenu>
export type AdminMenuItemMapWithIndex = MenuItemMapWithIndex<AadminSideMenu>

const adminMenuItemMap: AdminMenuItemMap = {
  [AadminSideMenu.Dashboard]: {
    display: '仪表板',
    icon: {
      name: IconKeys.Dashboard,
      class: 'icon-menu',
    },
  },
  [AadminSideMenu.Post]: {
    display: '文章',
    icon: {
      name: IconKeys.Post,
      class: 'icon-menu',
    },
  },
  [AadminSideMenu.PostAll]: {
    display: '所有文章',
    parentIndex: AadminSideMenu.Post,
  },
  [AadminSideMenu.PostWrite]: {
    display: '写文章',
    parentIndex: AadminSideMenu.Post,
  },
  [AadminSideMenu.PostTag]: {
    display: '标签',
    parentIndex: AadminSideMenu.Post,
  },
  [AadminSideMenu.PostCategory]: {
    display: '分类',
    parentIndex: AadminSideMenu.Post,
  },
  [AadminSideMenu.Media]: {
    display: '媒体',
    icon: {
      name: IconKeys.Media,
      class: 'icon-menu',
    },
  },
  [AadminSideMenu.Link]: {
    display: '链接',
    icon: {
      name: IconKeys.Link,
      class: 'icon-menu',
    },
  },
  [AadminSideMenu.LinkAll]: {
    display: '所有链接',
    parentIndex: AadminSideMenu.Link,
  },
  [AadminSideMenu.LinkAdd]: {
    display: '新增链接',
    parentIndex: AadminSideMenu.Link,
  },
  [AadminSideMenu.LinkCategory]: {
    display: '链接分类',
    parentIndex: AadminSideMenu.Link,
  },
  [AadminSideMenu.Page]: {
    display: '页面',
    icon: {
      name: IconKeys.Page,
      class: 'icon-menu',
    },
  },
  [AadminSideMenu.PageAll]: {
    display: '所有页面',
    parentIndex: AadminSideMenu.Page,
  },
  [AadminSideMenu.PageAdd]: {
    display: '新增页面',
    parentIndex: AadminSideMenu.Page,
  },
  [AadminSideMenu.Comment]: {
    display: '评论',
    icon: {
      name: IconKeys.Comment,
      class: 'icon-menu',
    },
  },
  [AadminSideMenu.Announcement]: {
    display: '公告',
    icon: {
      name: IconKeys.Announcement,
      class: 'icon-menu',
    },
  },
  [AadminSideMenu.AnnouncementAll]: {
    display: '所有公告',
    parentIndex: AadminSideMenu.Announcement,
  },
  [AadminSideMenu.AnnouncementPublish]: {
    display: '发布公告',
    parentIndex: AadminSideMenu.Announcement,
  },
  [AadminSideMenu.AnnouncementCategory]: {
    display: '公告分类',
    parentIndex: AadminSideMenu.Announcement,
  },
  [AadminSideMenu.Video]: {
    display: '视频',
    icon: {
      name: IconKeys.Video,
      class: 'icon-menu',
    },
  },
  [AadminSideMenu.VideoAll]: {
    display: '所有视频',
    parentIndex: AadminSideMenu.Video,
  },
  [AadminSideMenu.VideoPublish]: {
    display: '发布视频',
    parentIndex: AadminSideMenu.Video,
  },
  [AadminSideMenu.VideoCategory]: {
    display: '视频分类',
    parentIndex: AadminSideMenu.Video,
  },
  [AadminSideMenu.Shop]: {
    display: '商城',
    icon: {
      name: IconKeys.Shop,
      class: 'icon-menu',
    },
  },
  [AadminSideMenu.Product]: {
    display: '产品',
    parentIndex: AadminSideMenu.Shop,
  },
  [AadminSideMenu.Order]: {
    display: '订单',
    parentIndex: AadminSideMenu.Shop,
  },
  [AadminSideMenu.MemberManagement]: {
    display: '会员管理',
    parentIndex: AadminSideMenu.Shop,
  },
  [AadminSideMenu.ShortLink]: {
    display: '短连接',
    icon: {
      name: IconKeys.ShortLink,
      class: 'icon-menu',
    },
  },
  [AadminSideMenu.ShortLinkAll]: {
    display: '所有短连接',
    parentIndex: AadminSideMenu.ShortLink,
  },
  [AadminSideMenu.ShortLinkAdd]: {
    display: '新增短连接',
    parentIndex: AadminSideMenu.ShortLink,
  },
  [AadminSideMenu.User]: {
    display: '用户',
    icon: {
      name: IconKeys.User,
      class: 'icon-menu',
    },
  },
  [AadminSideMenu.UserAll]: {
    display: '所有用户',
    parentIndex: AadminSideMenu.User,
  },
  [AadminSideMenu.UserAdd]: {
    display: '新增用户',
    parentIndex: AadminSideMenu.User,
  },
  [AadminSideMenu.LoginLog]: {
    display: '登录日志',
    parentIndex: AadminSideMenu.User,
  },
  [AadminSideMenu.Config]: {
    display: '网站配置',
    icon: {
      name: IconKeys.Config,
      class: 'icon-menu',
    },
  },
  [AadminSideMenu.Notification]: {
    display: '通知',
    icon: {
      name: IconKeys.Notification,
      class: 'icon-menu',
    },
  },
  [AadminSideMenu.Backup]: {
    display: '备份',
    icon: {
      name: IconKeys.Backup,
      class: 'icon-menu',
    },
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
  function createIndex(itemKey: AadminSideMenu, parentIndex?: string) {
    const currentItem = menuItemMap[itemKey] // 当前菜单项
    const kebabItemKey = toKebabCase(itemKey) // 菜单项转换为小写短横线连接形式
    const newIndex = `${parentIndex ? parentIndex : parentPath}/${kebabItemKey}` // 新索引值
    const newParentIndex = parentIndex || parentPath // 父菜单项索引

    // 将新增的 / 更新的属性添加到当前结果对象中 保证点击菜单项时路由跳转正确 不会重复叠加路由
    result[itemKey] = {
      ...currentItem,
      index: `/${newIndex}`, // 添加 / 前缀，确保正确的路由跳转
      ...(currentItem.parentIndex !== undefined && { parentIndex: `/${newParentIndex}` }), // 如果存在父级索引，则添加到属性中并添加 / 前缀
    }

    // 遍历子菜单项并进行递归调用
    for (const childKey in menuItemMap) {
      if (menuItemMap[childKey as AadminSideMenu].parentIndex === itemKey) {
        createIndex(childKey as AadminSideMenu, newIndex)
      }
    }
  }

  // 生成顶级菜单项映射表
  for (const key in menuItemMap) {
    if (!menuItemMap[key as AadminSideMenu].parentIndex) {
      createIndex(key as AadminSideMenu)
    }
  }

  return result as AdminMenuItemMapWithIndex
}

export const adminMenuItemMapWithIndex = generateAdminMenuItemMapWithIndex(
  adminMenuItemMap,
  'admin',
)

export { default } from './index.vue'
