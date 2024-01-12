/**
 * @Author       : jiaopengzi
 * @Date         : 2023-08-04 21:31:44
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-08-04 21:36:15
 * @FilePath     : \blog-client\src\utils\IP.ts
 * @Description  : 获取公网IP地址
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

import axios from 'axios'

export async function getPublicIp(): Promise<string> {
  try {
    const response = await axios.get('https://api.ipify.org?format=json')
    return response.data.ip
  } catch (error) {
    console.error('获取公网IP地址失败:', error)
    return '127.0.0.1'
  }
}
