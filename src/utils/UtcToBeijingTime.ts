/**
 * @Author       : jiaopengzi
 * @Date         : 2023-10-09 16:07:26
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-10-31 17:02:56
 * @FilePath     : \blog-client\src\utils\UtcToBeijingTime.ts
 * @Description  : UTC 转 北京时间
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

import moment from 'moment-timezone'

/**
 * @description: 将UTC时间转换为北京时间
 * @param utcTimestamp utc时间戳
 * @param timeZone 时区 默认 Asia/Shanghai
 * @param formatStr 格式化字符串 默认 YYYY-MM-DD HH:mm:ss
 * @return
 */
export function convertToBeijingTime(
  utcTimestamp: string,
  timeZone: string = 'Asia/Shanghai',
  formatStr: string = 'YYYY-MM-DD HH:mm:ss',
): string {
  // 将输入时间转换为UTC时间
  const utcTime = moment.utc(utcTimestamp)

  // 将UTC时间转换为北京时间
  const beijingTime = utcTime.tz(timeZone)

  // 返回北京时间字符串
  return beijingTime.format(formatStr)
}
