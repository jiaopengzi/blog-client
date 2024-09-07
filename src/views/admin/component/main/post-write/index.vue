<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-01-18 10:04:52
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-09-07 17:46:35
 * @FilePath     : \blog-client\src\views\admin\component\main\post-write\index.vue
 * @Description  : 写文章
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->

<template>
    <el-container direction="vertical">


        <el-button type="primary" class="add-media">
            <Icon :name="IconKeys.Media" custom-class="add-media-icon" /> <span>添加媒体</span>
        </el-button>

        <EditorPost />

        <el-form class="post-info" label-position="top" label-width="200px" :model="postInfo" v-show="!isFullScreen">
            <el-form-item label="标题">
                <el-input v-model="postInfo.title" placeholder="添加标题" />
            </el-form-item>
            <el-form-item label="SEO自定义文章标题，留空则为文章标题。">
                <el-input v-model="postInfo.seoTitle" />
            </el-form-item>
            <el-form-item label="SEO文章描述，留空则自动截取首段一定字数作为文章描。">
                <el-input v-model="postInfo.seoDescription" autosize type="textarea" />
            </el-form-item>
            <el-form-item label="SEO文章关键词，多个关键词用英文半角逗号隔开，留空则自动将文章标签做为关键词。">
                <el-input v-model="postInfo.seoKeyWord" />
            </el-form-item>
            <el-form-item label="手动设置缩略图,如果没有则随机显示一张图片。">
                <el-input v-model="postInfo.thumbnail" />
            </el-form-item>
            <el-form-item label="销售价格 为空则为免费。">
                <el-input v-model="postInfo.price" />
            </el-form-item>
            <el-form-item label="别名，留空则使用默认ID值。">
                <el-input v-model="postInfo.price" />
            </el-form-item>
        </el-form>
        <AddTag ref="addTagRef" :tag-list-in="postInfo.tagList" @update-tag-list="updateTagListIn" />
        <ul>
            <li v-for="(item, index) in si" :key="index">
                <SwitchGroup :switch-item="item" :span-word-count="nameMaxLength" @update-status="updateStatus" />
            </li>
        </ul>
        <el-button type="primary" class="add-media">
            <Icon :name="IconKeys.Media" custom-class="add-media-icon" /> <span>发布</span>
        </el-button>
    </el-container>
</template>
<script lang="ts" setup>
import { reactive, defineAsyncComponent } from 'vue';
import { EditorPost } from '@/components/editor/core'
import { useEditorStore } from '@/stores/editor'
import { storeToRefs } from 'pinia'
import { IconKeys } from '@/components/common/icons'
import type { SwitchItem, SwitchItemLabel } from '@/components/common/switch-group'
import { AadminSideMenu } from '@/views/admin/component/aside'

// import AddTag from '@/components/common/add-tag'
// import SwitchGroup from '@/components/common/switch-group'
const AddTag = defineAsyncComponent(() => import('@/components/common/add-tag'))
const SwitchGroup = defineAsyncComponent(() => import('@/components/common/switch-group'))


defineOptions({ name: AadminSideMenu.PostWrite })

// const addTagRef = useTemplateRef <InstanceType<typeof AddTag>>("addTagRef")
const editorStore = useEditorStore()
const { isFullScreen } = storeToRefs(editorStore)

const postInfo = reactive({
    title: '',
    seoTitle: '',
    seoDescription: '',
    seoKeyWord: '',
    thumbnail: '',
    price: '',
    tagList: ["标签1", "标签2", "标签3"],
})


const updateTagListIn = (tagList: string[]) => {
    postInfo.tagList = tagList
    if (tagList) {
        console.log("标签", tagList)
    } else {
        console.log("标签", postInfo.tagList)
    }

}

const label: SwitchItemLabel = {
    labelTrue: "免费",
    labelFalse: "付费",
}

const si: SwitchItem[] = reactive([
    {
        name: "admin",
        status: true,
        label: label,
    },
    {
        name: "editor",
        status: true,
        label: label,

    }, {
        name: "viewer",
        status: true,
        label: label,
    }
])

const updateStatus = (item: SwitchItem) => {
    const index = si.findIndex((i) => i.name === item.name)
    si[index].status = item.status
    console.log("si", si)
}

// 计算 name 最大长度
const nameMaxLength = Math.max(...si.map((item) => (item.name ?? '').length))

</script>

<style scoped lang="scss">
.add-media {
    display: flex;
    justify-content: center;
    align-items: center;

    margin: 4px 4px;
    width: 100px;
    height: 40px;
    line-height: 40px;
    font-weight: 700;

    span {
        margin-left: 4px;
    }

    .add-media-icon {
        font-size: 20px;
        fill: var(--text-color);
    }

}

.post-info {
    // margin: 10px 20px;
    padding: 10px 20px;
    width: calc(100% - 40px);
    height: 100%;
    overflow: auto;
}
</style>