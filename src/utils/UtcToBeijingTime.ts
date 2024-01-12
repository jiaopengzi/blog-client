/**
 * @Author       : jiaopengzi
 * @Date         : 2023-10-09 16:07:26
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-01-12 20:49:00
 * @FilePath     : \blog-client\src\utils\utcToBeijingTime.ts
 * @Description  : UTC 转 北京时间
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

// moment-timezone 打包体积太大，使用 Intl.DateTimeFormat API 替代 保留原代码
// import moment from 'moment-timezone'

// export function convertToBeijingTime(
//   utcTimestamp: string,
//   timeZone: string = 'Asia/Shanghai',
//   formatStr: string = 'YYYY-MM-DD HH:mm:ss',
// ): string {
//   // 将输入时间转换为UTC时间
//   const utcTime = moment.utc(utcTimestamp)

//   // 将UTC时间转换为北京时间
//   const beijingTime = utcTime.tz(timeZone)

//   // 返回北京时间字符串
//   return beijingTime.format(formatStr)
// }

/**
 * @description: 将UTC时间转换为北京时间
 * @param utcTimestamp utc 时间戳
 * @param timeZone 时区 默认 Asia/Shanghai
 * @param formatStr 格式化字符串 默认 YYYY-MM-DD HH:mm:ss
 * @return
 */
export function convertToBeijingTime(
  utcTimestamp: string,
  timeZone: string = 'Asia/Shanghai',
  formatStr: string = 'YYYY-MM-DD HH:mm:ss',
): string {
  // 将 UTC 时间戳转换为 Date 对象
  const dateTime = new Date(utcTimestamp)

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
