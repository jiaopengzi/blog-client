/**
 * @Author       : jiaopengzi
 * @Date         : 2024-08-29 16:27:59
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-08-29 16:46:23
 * @FilePath     : \blog-client\src\router\utils.ts
 * @Description  : 路由工具函数
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */
import router from '@/router'

// 分页查询参数键
export enum PaginationQueryKey {
  PageSize = 'page-size',
  CurrentPage = 'current-page'
}

/**
 * @description: 分页路由跳转
 * @param routeName 路由名称
 * @param pageSize 每页显示条数
 * @param currentPage 当前页
 * @param additionalParams 其他参数
 * @example paginationRouterPush('PostAll', 10, 1,  { 'file-type': 'pdf', 'search': 'example' })
 */
export function paginationRouterPush(
  routeName: string,
  pageSize: number,
  currentPage: number,
  additionalParams: Record<string, string | number>
) {
  const query: Record<string, string | number> = {
    [PaginationQueryKey.PageSize]: pageSize,
    [PaginationQueryKey.CurrentPage]: currentPage
  }

  // 过滤掉值为空字符串的参数
  Object.keys(additionalParams).forEach((key) => {
    const value = additionalParams[key]
    if (value !== '') {
      query[key] = value
    }
  })

  router.push({
    name: routeName,
    query: query
  })
}
