/**
 * @Author       : jiaopengzi
 * @Date         : 2024-12-30 18:11:19
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-30 18:13:19
 * @FilePath     : \blog-client\src\views\test\useTest.ts
 * @Description  :
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { watch } from "vue"
import { useRoute } from "vue-router"

export function useTest() {
    const route = useRoute()

    // 监控 route.fullPath 的变化并执行操作
    watch(
        () => route.fullPath,
        async (newVal, oldVal) => {
            console.log("watch=====>oldVal", oldVal)
            console.log("watch=====>newVal", newVal)
        },
    )
}
