<!--
 * FilePath    : blog-client-nuxt\src\pages\admin\[...slug].vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : admin 子页动态映射 (阶段 6)
-->

<!--
 * 补充说明:
 * 与 SPA routeAdmin 同逻辑: route.path → adminMenuItemMapWithIndexMap →
 * components 或菜单 key → kebab → 组件路径
 * src/components/views/admin/component/main/<kebab>/index.vue
 * import.meta.glob 预注册全部主视图 (静态可分析, 构建可靠)
 * 未知子路径在 middleware/admin.global.ts 守卫内重定向到 /not-found (路由不激活),
 * 占位模板仅作守卫未覆盖场景的兜底
-->

<script setup lang="ts">
import { type Component, computed, defineAsyncComponent } from "vue"

import { adminMenuItemMapWithIndex, adminMenuItemMapWithIndexMap } from "@/components/views/admin/component/aside"
import { toKebabCase } from "@/utils/namingConversion"

// admin 全屏区无默认布局
definePageMeta({ layout: false })

const route = useRoute()

// 预注册全部 admin 主视图 (key 为相对本文件的路径)
const viewModules = import.meta.glob("../../components/views/admin/component/main/**/index.vue")

// 异步组件缓存: defineAsyncComponent 每次调用都会产生新的组件身份, 若在 computed 内直接创建,
// 路由失效 (如 query 变化触发路由对象更新) 时 <component :is> 会重新挂载子视图,
// 页面状态被清空且增量刷新逻辑失效 (与 SPA 静态路由表下组件常驻的行为不一致)
// 按组件路径缓存包装结果, 保证同一路径复用同一组件身份
const asyncComponentCache = new Map<string, Component>()

// 当前路径对应的组件加载器 (未命中菜单映射时为 null → 兜底占位)
const currentComponent = computed(() => {
    const menuItem = adminMenuItemMapWithIndexMap[route.path]
    if (!menuItem) {
        return null
    }

    // 找到该 index 对应的菜单 key (RouteNamesAdmin 枚举值为 kebab, 与组件目录名一致)
    const entry = Object.entries(adminMenuItemMapWithIndex).find(([, value]) => value.index === route.path)
    const key = entry ? entry[0] : ""
    if (!key) {
        return null
    }

    // SPA routeAdmin 同逻辑: 优先 components 字段, 否则菜单 key; toKebabCase 幂等
    const componentName = toKebabCase(menuItem.components ?? key)
    const globKey = Object.keys(viewModules).find((k) => k.endsWith(`/${componentName}/index.vue`))
    if (!globKey) {
        return null
    }

    // 复用已缓存的异步组件包装 (同一 globKey 同一身份), 避免 query 变化导致子视图重挂载
    let asyncComponent = asyncComponentCache.get(globKey)
    if (!asyncComponent) {
        asyncComponent = defineAsyncComponent(viewModules[globKey] as () => Promise<{ default: Component }>)
        asyncComponentCache.set(globKey, asyncComponent)
    }

    return asyncComponent
})
</script>

<template>
    <component :is="currentComponent" v-if="currentComponent" />
    <div v-else class="admin-page-missing">
        <h2>后台页面不存在</h2>
        <p>路径：{{ route.path }}</p>
    </div>
</template>

<style scoped lang="scss">
.admin-page-missing {
    padding: 2rem;
    color: var(--jpz-text-color-secondary);
}
</style>
