
<template>
  <el-scrollbar>
    <el-menu :default-openeds="['2', '3']" :collapse="isCollapse" @select="handleSelect" @open="handleOpen"
      @close="handleClose" class="el-menu-vertical">
      <recursive-menu-item v-for="(item, key) in topLevelMenuItems" :key="key" :menu-item-map="menuData"
        :menu-item="item" />
    </el-menu>
  </el-scrollbar>
</template>


<script lang="ts" setup>
import { ref, reactive, computed } from 'vue'
import { IconKeys } from '@/components/common/icons'
import RecursiveMenuItem from './RecursiveMenuItem.vue' // 引入递归菜单组件
import type { MenuItemMap } from './RecursiveMenuItem.vue' // 引入递归菜单组件
// eslint-disable-next-line vue/multi-word-component-names
defineOptions({ name: 'Admin' })

const isCollapse = ref(true)


const menuData: MenuItemMap = reactive({
  "dashboard": {
    "index": "dashboard",
    "display": "仪表板sadfa撒旦法师打发水电费撒旦法撒旦法师打发的算法是打发三大发啥打法上",
    icon: {
      name: IconKeys.dashboard,
      class: "icon-menu"
    }
  },
  "post": {
    "index": "post",
    "display": "文章",
    icon: {
      name: IconKeys.post,
      class: "icon-menu"
    }
  },
  "all-post": {
    "index": "all-post",
    "display": "所有文章",
    "parentIndex": "post"
  },
  "write-post": {
    "index": "write-post",
    "display": "写文章",
    "parentIndex": "post"
  },
  "tag-post": {
    "index": "tag-post",
    "display": "标签",
    "parentIndex": "post"
  },
  "category-post": {
    "index": "category-post",
    "display": "分类",
    "parentIndex": "post"
  },
  "media": {
    "index": "media",
    "display": "媒体",
    icon: {
      name: IconKeys.media,
      class: "icon-menu"
    }
  },
  "all-media": {
    "index": "all-media",
    "display": "所有媒体",
    "parentIndex": "media"
  },
  "add-media": {
    "index": "add-media",
    "display": "新增文件",
    "parentIndex": "media"
  },
  "link": {
    "index": "link",
    "display": "链接",
    icon: {
      name: IconKeys.link,
      class: "icon-menu"
    }
  },
  "all-link": {
    "index": "all-link",
    "display": "所有链接",
    "parentIndex": "link"
  },
  "add-link": {
    "index": "add-link",
    "display": "新增链接",
    "parentIndex": "link"
  },
  "link-category": {
    "index": "link-category",
    "display": "链接分类",
    "parentIndex": "link"
  },
  "page": {
    "index": "page",
    "display": "页面",
    icon: {
      name: IconKeys.page,
      class: "icon-menu"
    }
  },
  "所有页面": {
    "index": "all-pages",
    "display": "所有页面",
    "parentIndex": "page"
  },
  "add-page": {
    "index": "add-page",
    "display": "新增页面",
    "parentIndex": "page"
  },
  "comment": {
    "index": "comment",
    "display": "评论",
    icon: {
      name: IconKeys.comment,
      class: "icon-menu"
    }
  },
  "announcement": {
    "index": "announcement",
    "display": "公告",
    icon: {
      name: IconKeys.announcement,
      class: "icon-menu"
    }
  },
  "all-announcement": {
    "index": "all-announcement",
    "display": "所有公告",
    "parentIndex": "announcement"
  },
  "publish-announcement": {
    "index": "publish-announcement",
    "display": "发布公告",
    "parentIndex": "announcement"
  },
  "announcement-category": {
    "index": "announcement-category",
    "display": "公告分类",
    "parentIndex": "announcement"
  },
  "video": {
    "index": "video",
    "display": "视频",
    icon: {
      name: IconKeys.video,
      class: "icon-menu"
    },
  },
  "all-video": {
    "index": "all-video",
    "display": "所有视频",
    "parentIndex": "video"
  },
  "publish-video": {
    "index": "publish-video",
    "display": "发布视频",
    "parentIndex": "video"
  },
  "video-category": {
    "index": "video-category",
    "display": "视频分类",
    "parentIndex": "video"
  },
  "shop": {
    "index": "shop",
    "display": "商城",
    icon: {
      name: IconKeys.shop,
      class: "icon-menu"
    }
  },
  "product": {
    "index": "product",
    "display": "产品",
    "parentIndex": "shop"
  },
  "order": {
    "index": "order",
    "display": "订单",
    "parentIndex": "shop"
  },
  "member-management": {
    "index": "member-management",
    "display": "会员管理",
    "parentIndex": "shop"
  },
  "short-link": {
    "index": "short-link",
    "display": "短连接",
    icon: {
      name: IconKeys['short-link'],
      class: "icon-menu"
    }
  },
  "所有短连接": {
    "index": "all-short-links",
    "display": "所有短连接",
    "parentIndex": "short-links"
  },
  "add-short-link": {
    "index": "add-short-link",
    "display": "新增短连接",
    "parentIndex": "short-link"
  },
  "user": {
    "index": "user",
    "display": "用户",
    icon: {
      name: IconKeys.user,
      class: "icon-menu"
    }
  },
  "all-user": {
    "index": "all-user",
    "display": "所有用户",
    "parentIndex": "user"
  },
  "add-user": {
    "index": "add-user",
    "display": "新增用户",
    "parentIndex": "user"
  },
  "login-log": {
    "index": "login-log",
    "display": "登录日志",
    "parentIndex": "user"
  },
  "config": {
    "index": "config",
    "display": "网站配置",
    icon: {
      name: IconKeys.config,
      class: "icon-menu"
    }
  },
  "notification": {
    "index": "notification",
    "display": "通知",
    icon: {
      name: IconKeys.notification,
      class: "icon-menu"
    }
  },
  "backup": {
    "index": "backup",
    "display": "备份",
    icon: {
      name: IconKeys.backup,
      class: "icon-menu"
    }
  },
  "collapse-menu": {
    "index": "collapse-menu",
    "display": "收起菜单",
    icon: {
      name: IconKeys.collapse,
      class: "icon-menu"
    }
  },
})


// 计算顶级菜单项
const topLevelMenuItems = computed(() => Object.values(menuData).filter((item) => !item.parentIndex))

const handleSelect = (index: string, keyPath: string[]) => {
  console.log(index, keyPath)
  if (index === 'collapse-menu') {
    isCollapse.value = !isCollapse.value
  }
}

const handleOpen = (index: string, keyPath: string[]) => {
  console.log(index, keyPath)
}
const handleClose = (index: string, keyPath: string[]) => {
  console.log(index, keyPath)
}

</script>

<style scoped lang="scss">
.el-menu-vertical {
  max-width: 200px;
  height: 100vh;
  overflow: hide;
}

:deep(.icon-menu) {
  fill: $primary-color;
  font-size: 1.1em;
}
</style>
