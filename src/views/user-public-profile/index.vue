<template>
    <div class="page">
        <LayoutHeader :is-show-search="false" />
        <JBreadcrumb />
        <UserPublicProfile v-if="isValidUsername" />
        <LayoutFooter />
    </div>
</template>

<script setup lang="ts">
import { useHead } from "@unhead/vue"
import { useRoute, useRouter } from "vue-router"

import JBreadcrumb from "@/components/common/breadcrumb"
import LayoutFooter from "@/components/layout/footer"
import LayoutHeader from "@/components/layout/header"
import { RouteNames } from "@/router"
import { useBreadcrumbStore } from "@/stores/breadcrumb"
import { RegexPatterns } from "@/utils/regexPatterns"
import UserPublicProfile from "@/views/user-public-profile/component"

defineOptions({ name: "PageUserPublicProfile" })

const route = useRoute()
const router = useRouter()
const username = route.params.username as string
const isValidUsername = RegexPatterns.UserName.test(username)

/**
 * 校验公开用户页用户名格式, 非法时直接跳转到 404, 并避免进入后端请求流程.
 */
const redirectIfInvalidUsername = async (): Promise<void> => {
    if (!isValidUsername) {
        await router.replace({ name: RouteNames.NotFound })
    }
}

void redirectIfInvalidUsername()

useHead({
    title: `${username} - 用户信息`,
})

const breadcrumbStore = useBreadcrumbStore()

if (isValidUsername) {
    breadcrumbStore.updateItems(username, `/${username}`)
}
</script>

<style scoped lang="scss"></style>
