/**
 * @Author       : jiaopengzi
 * @Date         : 2024-01-13 13:36:09
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-01-13 13:39:44
 * @FilePath     : \blog-client\openDocument.js
 * @Description  : 打开指定的文档 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
 */


import child_process from 'child_process'

const url = 'https://jiaopengzi.com'
let cmd = ''
// console.log(process.platform)
switch (process.platform) {
  case 'win32':
    cmd = 'start'
    child_process.exec(cmd + ' ' + url)
    break

  case 'darwin':
    cmd = 'open'
    child_process.exec(cmd + ' ' + url)
    break
}
