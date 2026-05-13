/**
 * @FilePath     : \blog-client\src\utils\dateTime.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 格式化时间
 */

/**
 * @description: 格式化时间
 * @param utcTimestamp utc 时间戳字符串或 Date 对象
 * @param timeZone 时区 默认 Asia/Shanghai
 * @param formatStr 格式化字符串 默认 YYYY-MM-DD HH:mm:ss
 * @return
 */
export function formatTime(
    Timestamp: string | Date,
    timeZone: string = "Asia/Shanghai",
    formatStr: string = "YYYY-MM-DD HH:mm:ss",
    addHours = 0, // 默认不增加小时
): string {
    // 如果时间戳为空,则返回空字符串
    if (Timestamp === "") {
        return ""
    }

    // 将时间戳转换为 Date 对象,默认会转换为本地时间
    const dateTime = new Date(Timestamp)

    // 将 Date 对象的时间调整为 UTC 时间
    dateTime.setHours(dateTime.getHours() + addHours)

    // 使用 Intl.DateTimeFormat API 格式化时间
    const formatter = new Intl.DateTimeFormat("en-GB", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: timeZone,
    })

    // 格式化时间
    const formattedDateTime = formatter.format(dateTime).replace(",", "")

    // 返回时间字符串
    return formattedDateTime.replace(/(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2})/, (_, p1, p2, p3, p4, p5, p6) =>
        formatStr.replace("DD", p1).replace("MM", p2).replace("YYYY", p3).replace("HH", p4).replace("mm", p5).replace("ss", p6),
    )
}

/**
 * @description: 格式化时间
 * @param duration 时间间隔 秒数
 */
export function formatDurationTime(duration: number): string {
    const days = Math.floor(duration / 60 / 60 / 24) // 计算天数
    const hours = Math.floor((duration / 60 / 60) % 24) // 计算小时数
    const minutes = Math.floor((duration / 60) % 60) // 计算分钟数
    const seconds = Math.floor(duration % 60) // 计算秒数，并向下取整

    // 将小时、分钟和秒数补全为两位
    const hoursStr = hours.toString().padStart(2, "0")
    const minutesStr = minutes.toString().padStart(2, "0")
    const secondsStr = seconds.toString().padStart(2, "0")

    // 根据不同的时间段返回不同的时间格式
    if (days > 0) {
        return `${days}天 ${hoursStr}:${minutesStr}:${secondsStr}`
    } else if (hours > 0) {
        return `${hoursStr}:${minutesStr}:${secondsStr}`
    } else if (minutes > 0) {
        return `${minutesStr}:${secondsStr}`
    } else {
        return `${minutesStr}:${secondsStr}`
    }
}

/**
 * @description: 格式化持续时间为友好显示（最多展示两个最大单位）
 * @param seconds 秒数
 * @return 友好显示字符串，0 返回空
 */
export function displayDurationTime(seconds: number): string {
    if (seconds <= 0) return ""

    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)

    const parts: string[] = []
    if (days > 0) parts.push(`${days} 天`)
    if (hours > 0) parts.push(`${hours} 小时`)
    if (minutes > 0) parts.push(`${minutes} 分钟`)
    if (secs > 0 && parts.length < 2) parts.push(`${secs} 秒`)

    return parts.slice(0, 2).join(" ")
}

/**
 * @description: 将时间字符串转换为秒数
 * @param time 时间字符串 格式为 hh:mm:ss.sss
 * @return  {number} 秒数(三位小数,即毫秒)
 */
export function parseTime(time: string): number {
    const [hours, minutes, seconds] = time.split(":")
    return parseInt(hours!) * 3600 + parseInt(minutes!) * 60 + parseFloat(seconds!)
}

/**
 * @description: 将时间分段转换为秒数
 * @param hours 小时
 * @param minutes 分钟
 * @param seconds 秒
 * @param milliseconds 毫秒
 * @return  {number} 秒数(三位小数,即毫秒)
 */
export function parseTimeSegments(hours: string, minutes: string, seconds: string, milliseconds: string): number {
    return parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds) + parseInt(milliseconds) / 1000
}

/**
 * 补零函数
 */
const pad = (n: number) => String(n).padStart(2, "0")

/**
 * 格式化 Date 为本地 ISO 字符串
 * 输出格式：YYYY-MM-DDTHH:mm:ss±HH:MM (匹配 el-date-picker value-format="YYYY-MM-DDTHH:mm:ssZ")
 */
export const formatLocalISO = (date: Date): string => {
    const offset = -date.getTimezoneOffset()
    const sign = offset >= 0 ? "+" : "-"
    const oh = pad(Math.floor(Math.abs(offset) / 60))
    const om = pad(Math.abs(offset) % 60)
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}${sign}${oh}:${om}`
}

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
