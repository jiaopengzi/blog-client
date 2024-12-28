/**
 * @Author       : jiaopengzi
 * @Date         : 2024-12-28 12:28:21
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-28 12:28:21
 * @FilePath     : \blog-client\src\views\admin\component\main\post-write\utils.ts
 * @Description  :
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

// 时间快捷选项
export const generateShortcuts = (useDisplay: string) => {
    return [
        {
            text: `5分钟后${useDisplay}`,
            value: () => {
                const date = new Date()
                date.setMinutes(date.getMinutes() + 5)
                return date
            },
        },
        {
            text: `1小时后${useDisplay}`,
            value: () => {
                const date = new Date()
                date.setHours(date.getHours() + 1)
                return date
            },
        },
        {
            text: `1天后${useDisplay}`,
            value: () => {
                const date = new Date()
                date.setDate(date.getDate() + 1)
                return date
            },
        },
        {
            text: `7天后${useDisplay}`,
            value: () => {
                const date = new Date()
                date.setDate(date.getDate() + 7)
                return date
            },
        },
        {
            text: `30天后${useDisplay}`,
            value: () => {
                const date = new Date()
                date.setDate(date.getDate() + 30)
                return date
            },
        },
    ]
}
