/**
 * @Author       : jiaopengzi
 * @Date         : 2024-09-28 18:28:18
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-09-28 19:00:15
 * @FilePath     : \blog-client\src\components\hooks\useGetData\index.ts
 * @Description  : 页面数据获取钩子
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { ref, onBeforeMount, watch } from "vue"
import { useRoute } from "vue-router"

/**
 * @description: 页面数据获取钩子,取消 watch 首次加载
 * @param getDataOnBeforeMount 在挂载前获取数据的函数
 * @param getDataOnRouteChange 路由变化时获取数据的函数
 */
export function useGetData(
    getDataOnBeforeMount: () => Promise<void>, // 初始化时获取数据
    getDataOnRouteChange: () => Promise<void>, // 路由变化时获取数据
) {
    const route = useRoute()
    const isInitialLoad = ref(true) // 每次调用时创建新的标志变量实例

    onBeforeMount(async () => {
        await getDataOnBeforeMount()
        isInitialLoad.value = false
    })

    watch(
        () => route.fullPath,
        async () => {
            if (isInitialLoad.value) {
                // 跳过首次加载
                return
            }
            await getDataOnRouteChange()
        },
    )
}
