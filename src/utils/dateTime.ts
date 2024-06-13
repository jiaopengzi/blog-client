/**
 * @Author       : jiaopengzi
 * @Date         : 2023-10-09 16:07:26
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-06-13 14:51:13
 * @FilePath     : \blog-client\src\utils\dateTime.ts
 * @Description  : UTC 转 北京时间
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

/**
 * @description: 将UTC时间转换为北京时间
 * @param utcTimestamp utc 时间戳
 * @param timeZone 时区 默认 Asia/Shanghai
 * @param formatStr 格式化字符串 默认 YYYY-MM-DD HH:mm:ss
 * @return
 */
export function convertToBeijingTime(
  Timestamp: string,
  timeZone: string = 'Asia/Shanghai',
  formatStr: string = 'YYYY-MM-DD HH:mm:ss',
  addHours = -8, // 默认减去8小时, 东八区 数据库存储的北京时间
): string {
  // 将时间戳转换为 Date 对象,默认会转换为本地时间
  const dateTime = new Date(Timestamp)

  // 将 Date 对象的时间调整为 UTC 时间
  dateTime.setHours(dateTime.getHours() + addHours)

  // 使用 Intl.DateTimeFormat API 格式化时间
  const formatter = new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: timeZone,
  })

  // 格式化时间
  const formattedDateTime = formatter.format(dateTime).replace(',', '')

  // 返回北京时间字符串
  return formattedDateTime.replace(
    /(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2})/,
    (_, p1, p2, p3, p4, p5, p6) =>
      formatStr
        .replace('DD', p1)
        .replace('MM', p2)
        .replace('YYYY', p3)
        .replace('HH', p4)
        .replace('mm', p5)
        .replace('ss', p6),
  )
}
