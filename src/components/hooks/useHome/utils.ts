/**
 * @FilePath     : \blog-client\src\components\hooks\useHome\utils.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 工具
 */

import { ref } from "vue"

export function useUtils() {
    const paginationBlockVisibleCount = ref(1) // 分页块出现次数
    const pageSizeTemp = ref(10) // 临时每页显示条数

    // 重置分页配置
    const resetPaginationConf = () => {
        paginationBlockVisibleCount.value = 1
        pageSizeTemp.value = 10
    }

    return {
        paginationBlockVisibleCount,
        pageSizeTemp,
        resetPaginationConf,
    }
}
