<template>
    <div class="page">
        <LayoutHeader />
        <JBreadcrumb />
        <UserPublicProfile />
        <LayoutFooter />
    </div>
</template>

<script setup lang="ts">
import { useHead } from "@unhead/vue"
import { useRoute } from "vue-router"

import JBreadcrumb from "@/components/common/breadcrumb"
import LayoutFooter from "@/components/layout/footer"
import LayoutHeader from "@/components/layout/header"
import { useBreadcrumbStore } from "@/stores/breadcrumb"
import UserPublicProfile from "@/views/user-public-profile/component"

defineOptions({ name: "PageUserPublicProfile" })

const route = useRoute()
const username = route.params.username as string

useHead({
    title: `${username} - 用户信息`,
})

const breadcrumbStore = useBreadcrumbStore()
breadcrumbStore.updateItems(username, `/${username}`)
</script>

<style scoped lang="scss"></style>
