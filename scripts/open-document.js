/**
 * FilePath    : blog-client\scripts\open-document.js
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 打开指定URL
 */

import child_process from "child_process"

// const url = 'https://jiaopengzi.com'
// const urlDev = "http://localhost:7364"
const urlDev = "http://10.10.2.222:7364"
// const urlDev = "https://dev.jiaopengzi.com"
let cmd = ""
// console.log(process.platform)
switch (process.platform) {
    case "win32":
        cmd = "start"
        // child_process.exec(cmd + ' ' + url)
        child_process.exec(cmd + " " + urlDev)
        break

    case "darwin":
        cmd = "open"
        // child_process.exec(cmd + ' ' + url)
        child_process.exec(cmd + " " + urlDev)
        break
}
