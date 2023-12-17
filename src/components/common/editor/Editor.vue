<!-- eslint-disable vue/multi-word-component-names -->
<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-12-02 10:33:32
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-12-18 00:15:36
 * @FilePath     : \blog-client\src\components\common\editor\Editor.vue
 * @Description  : 编辑器
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved. 
-->
<template>
    <div :class="layoutClass">
        <!-- 工具栏 -->
        <div :class="toolbarClass">
            <Toolbar :toobar-btns="toobarBtns()" :icon-number-per-line="20" @toolbar-btn-clicked="toolbarBtnClicked" />
        </div>

        <div :class="mdContainerClass">

            <div :class="tocClass" v-show="tocShow">
                <!-- 导航栏 -->
                <Toc :headings="tocHtml" @heading-clicked="tocHeadingClicked" />
            </div>

            <div ref="cmContainerRef" :class="editorClass" v-show="editorShow">
                <!-- 编辑器 -->
                <Codemirror ref="codemirrorRef" :codemirrorDoc="editor" :height="cmHeight" @handle-scroll="handleScroll"
                    @update-editor-doc="updateEditorDoc" />
            </div>
            <div :class="previewClass" v-show="previewShow">
                <!-- 预览 -->
                <Preview ref="previewRef" :preview="previewData" :height="cmHeight" @show-image-viewer="showImageViewer"
                    @close-image-viewer="closeImageViewer" />
            </div>
        </div>
    </div>
</template>
  
<script lang="ts" setup>
import { ref, reactive, onBeforeMount, watchEffect, computed, onMounted, nextTick } from 'vue';
import { MardkdownEditorCommandsOrder } from '@/components/common/editor/command/constant'
import type { MardkdownEditorCommandsOrderKeyType } from '@/components/common/editor/command/constant'
import { ShowMsgTip } from '@/utils/message';
import Toolbar from '@/components/common/editor/Toolbar.vue'
import Toc from '@/components/common/editor/Toc.vue'
import Codemirror from '@/components/common/editor/Codemirror.vue'
import Preview from '@/components/common/editor/Preview.vue'
import { setIsFullScreenClassName } from '@/components/common/editor/editor'

import { useEditorStore } from '@/stores/editor'
import { storeToRefs } from 'pinia'

// 获取用户信息
const editorStore = useEditorStore()

interface CodemirrorRef extends HTMLElement {
    runCommand: (commandName: MardkdownEditorCommandsOrderKeyType) => void,
    scrollIntoViewLine: (line: number) => void,
}

interface PreviewRef extends HTMLElement {
    navigateToHeading: (index: number) => void,
    navigateToElement: (index: number) => void,
}

const cmContainerRef = ref<HTMLElement | null>(null) //编辑器容器
const codemirrorRef = ref<CodemirrorRef | null>(null) //编辑器
const previewRef = ref<PreviewRef | null>(null) // 预览容器

const { tocMarkdown, tocHtml, tocShow,
    editor, editorShow,
    preview, previewShow,
    imgUrls: imgUrlsStore, isShowElImageViewer: isShowElImageViewerStore,
    isAsyncScroll, isFullScreen } = storeToRefs(editorStore)

// 判断所有 key，只要 MardkdownEditorCommandsOrder 对应的 key 的 isShow 为 false，就从 keys 中删除 否则就保留
const constantKeys: MardkdownEditorCommandsOrderKeyType[] = Object.keys(MardkdownEditorCommandsOrder).filter(key => MardkdownEditorCommandsOrder[key].isShow)


// 工具栏按钮
const toobarBtns = () => {
    return constantKeys.map(key => {
        return {
            name: key as string,
            display: MardkdownEditorCommandsOrder[key].tip + " <" + MardkdownEditorCommandsOrder[key].hotKey + ">" as string,
            icon: key as string
        }
    })
}


/**
 * @description: 处理工具栏按钮点击事件     
 * @param name 工具栏按钮对应的常量
 */
const toolbarBtnClicked = (name: string) => {
    console.log(name)
    if (name === "preview") {
        editorShow.value = !editorShow.value
        if (!editorShow.value) {
            previewShow.value = true
        }
        return
    }
    if (name === 'desktop') {
        previewShow.value = !previewShow.value
        if (!previewShow.value) {
            editorShow.value = true
        }
        return
    }
    if (name === 'toc') {
        tocShow.value = !tocShow.value
        return
    }
    if (name === 'scroll') {
        isAsyncScroll.value = !isAsyncScroll.value
        if (isAsyncScroll.value) {
            ShowMsgTip(ShowMsgTip.MsgType.success, '同步滚动')
        } else {
            ShowMsgTip(ShowMsgTip.MsgType.info, '异步滚动')
        }
        return
    }
    if (name === 'fullscreen') {
        isFullScreen.value = !isFullScreen.value
        return
    }

    // 调用 codemirrorRef 中的 runCommand 函数
    codemirrorRef.value?.runCommand(name)

}


/**
 * @description: 目录导航点击事件
 * @param index 点击的目录索引
 */
const tocHeadingClicked = (index: number) => {
    isAsyncScroll.value = false // 点击目录时候关闭异步滚动
    codemirrorRef.value?.scrollIntoViewLine(tocMarkdown.value[index].markdownLineNumber) // 跳转编辑器选中目标行
    previewRef.value?.navigateToHeading(index) // 跳转预览选中目标行
}

const cmHeight = ref<string | undefined>(void 0)

// 初始化 cmView 编辑器实例高度
const initializeCmHeight = (): void => {
    if (cmContainerRef.value) {
        // 读取 codemirror 容器中的 css 变量 --md-editor-height 的值
        cmHeight.value = getComputedStyle(cmContainerRef.value).getPropertyValue('--md-editor-height');
    }
}

let curHideDoc = "" // store 存储不可见部分的 markdown

const handleScroll = (scrollTop: number, hideDoc: string) => {
    if (!isAsyncScroll.value) return // 如果不是异步滚动就直接返回

    // 滚动条在顶部时附近时
    // if (scrollTop <= 4 && previewRef.value) {
    //     previewRef.value.scrollTop = 0
    //     return
    // }


    // const newHideDoc = hideDoc // store 存储不可见部分的 markdown
    // if (newHideDoc.length > 0 && newHideDoc !== curHideDoc) {
    //     curHideDoc = newHideDoc
    //     console.log('handleScroll-父组件内', scrollTop, hideDoc.length)
    //     editorStore.setScrollHideViewStr(curHideDoc) // store 存储不可见部分的 markdown
    //     const hideDom = new DOMParser().parseFromString(editorStore.getScrollHideHtmlStr, 'text/html') // 隐藏的markdown解析出来的html转换为dom
    //     const els = hideDom.body.querySelectorAll('*') // 获取隐藏的markdown解析出来的html转换为dom中的所有元素 注意要在 body 中寻找
    //     previewRef.value?.navigateToElement(els.length) // 跳转预览选中目标行
    // }
}

const updateEditorDoc = (editorDoc: string) => {
    editorStore.updateEditorStore(editorDoc) // 更新 store 中的 editor
}


const previewData = reactive({
    html: preview.value,
    imgUrls: imgUrlsStore.value,
    isShowElImageViewer: isShowElImageViewerStore.value,
});

watchEffect(() => {
    previewData.html = preview.value;
    previewData.imgUrls = imgUrlsStore.value;
    previewData.isShowElImageViewer = isShowElImageViewerStore.value;
});


const showImageViewer = (imgUrls: string[], isShowElImageViewer: boolean) => {
    console.log(imgUrls)
    console.log(isShowElImageViewer)
    imgUrlsStore.value = imgUrls
    isShowElImageViewerStore.value = isShowElImageViewer
}

const closeImageViewer = (isShowElImageViewer: boolean) => {
    isShowElImageViewerStore.value = isShowElImageViewer
}


// 动态生成类名
const layoutClass = computed(() => setIsFullScreenClassName('md-layout', 'md-layout-fs', false, isFullScreen.value));
const toolbarClass = computed(() => setIsFullScreenClassName('md-toolbar', 'md-toolbar-fs', false, isFullScreen.value));
const mdContainerClass = computed(() => setIsFullScreenClassName('md-container', 'md-container-fs', false, isFullScreen.value));
const tocClass = computed(() => setIsFullScreenClassName('md-toc', 'md-toc-fs', true, isFullScreen.value));
const editorClass = computed(() => setIsFullScreenClassName('md-editor', 'md-editor-fs', true, isFullScreen.value));
const previewClass = computed(() => setIsFullScreenClassName('md-preview', 'md-preview-fs', true, isFullScreen.value));

// 初始化
onMounted(() => {
    initializeCmHeight() // 初始化编辑器实例高度
})

onBeforeMount(async () => {
    editorStore.getEditorDocFromApi("src/assets/example/markdown.md")
});

</script>
  
<style scoped lang="scss">
.md-layout {
    .md-container {
        // flex-grow: 1; // 自动撑满剩下的空间
        display: flex;

        .md-container-item {
            border-radius: 3px;
            // box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
        }

        .md-toc {
            overflow: auto;
            flex: 1 1 0; // 1 1 0 代表 flex-grow: 1; flex-shrink: 1; flex-basis: 0; 五分之一
        }

        .md-editor {
            overflow: hidden;
            flex: 2 1 0; // 2 1 0 代表 flex-grow: 2; flex-shrink: 1; flex-basis: 0; 五分之二
        }

        .md-preview {
            overflow: hidden;
            flex: 2 1 0; // 2 1 0 代表 flex-grow: 2; flex-shrink: 1; flex-basis: 0; 五分之二
        }
    }
}


@include respond-to('pc') {
    .md-layout {
        width: pc.$width-page-main;

        .md-container {
            width: pc.$width-page-main;
            height: pc.$editor-md-container-height;
        }

        .md-editor {
            --md-editor-height: #{pc.$editor-md-container-height}; // 设置 css 变量 引用scss变量 使用#{}包裹 插值语法将 SASS 变量插入到自定义属性中
        }

        .md-preview {
            height: pc.$editor-md-container-height;
        }
    }
}

@include respond-to('phone') {

    .md-layout {
        width: 100%;
    }

    .md-editor {
        --md-editor-height: 100%;
    }
}
</style>
  