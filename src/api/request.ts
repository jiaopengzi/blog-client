/**
 * @Author       : jiaopengzi
 * @Date         : 2023-08-04 10:54:19
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-08-11 16:53:24
 * @FilePath     : \blog-client\src\api\request.ts
 * @Description  : axios封装
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

import axios from 'axios'

//1. 创建axios对象
const service = axios.create()

//2. 请求拦截器
service.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    Promise.reject(error)
  }
)

//3. 响应拦截器
service.interceptors.response.use(
  (response) => {
    //判断code码
    return response.data
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default service
