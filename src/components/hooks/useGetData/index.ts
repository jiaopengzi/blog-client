/**
 * @Author       : jiaopengzi
 * @Date         : 2024-09-28 18:28:18
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-04 21:31:10
 * @FilePath     : \blog-client\src\components\hooks\useGetData\index.ts
 * @Description  : 页面数据获取钩子
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { ref, onBeforeMount, onMounted, watch } from "vue"
import { useRoute } from "vue-router"

/**
 * @description: 页面数据获取钩子,取消 watch 首次加载
 * @param getDataOnBeforeMount 在挂载前获取数据的函数数组
 * @param getDataOnRouteChange 路由变化时获取数据的函数数组, 默认为 getDataOnBeforeMount
 */
export function useGetData(
    getDataOnBeforeMount: Array<() => Promise<void>>,
    getDataOnRouteChange?: Array<() => Promise<void>>,
) {
    const route = useRoute()
    const isInitialLoad = ref(true) // 每次调用时创建新的标志变量实例

    const executeFunctions = async (functions: Array<() => Promise<void>>) => {
        await Promise.all(functions.map((fn) => fn()))
    }

    onBeforeMount(async () => {
        await executeFunctions(getDataOnBeforeMount)
    })
}
