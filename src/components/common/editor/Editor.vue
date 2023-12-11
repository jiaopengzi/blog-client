<!-- eslint-disable vue/multi-word-component-names -->
<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-12-02 10:33:32
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-12-11 17:39:51
 * @FilePath     : \blog-client\src\components\common\editor\Editor.vue
 * @Description  : 编辑器
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved. 
-->
<template>
    <div class="layout">
        <div class="toolbar" ref="toolbarRef">
            <button class="toolbar-btn" v-for="(constant, index) in constantKeys" :key="index"
                @click="handleEditorButtonClick(constant)"
                :title="MardkdownEditorCommandsOrder[constant].tip + ' <' + MardkdownEditorCommandsOrder[constant].hotKey + '>'">
                <Icon :name="constant" customClass="iconfont" />
            </button>
        </div>
        <div class="md-container">
            <div v-show="tocShow" class="md-toc md-container-item" v-html="tocHtml" @click="handleDelegateClick">
            </div>
            <div v-show="editorShow" class="md-editor md-container-item">
                <div ref="editorHost" id="editorHost"></div>
            </div>
            <div v-show="previewShow" class="md-preview md-container-item" v-html="preview" @click="handleDelegateClick">
            </div>
        </div>
    </div>
    <!-- 参考:https://github.com/element-plus/element-plus/blob/dev/packages/components/image/src/image.vue -->
    <el-image-viewer v-if="isShowElImageViewer" @close="closeElImageViewer" :url-list="imgUrls" />
</template>
  
<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue';
import type { Extension } from '@codemirror/state'
import type { ViewUpdate } from '@codemirror/view';
import { EditorView, EditorState, customSetup } from '@/pkg/codemirror/setup';
import { editorInsertFormatContent } from '@/components/common/editor/command/insert'
import { MardkdownEditorCommandsOrder } from '@/components/common/editor/command/constant'
import type { MardkdownEditorCommandsOrderKeyType } from '@/components/common/editor/command/constant'
import axios from 'axios'
import { initializeClipboard } from '@/components/common/editor/editor'
import { shiftArray } from '@/utils/img';
import { useMagicKeys } from '@vueuse/core'
import { useEditorStore } from '@/stores/editor'
import { storeToRefs } from 'pinia'
import { scrollToElementSmoothly } from '@/utils/scroll'


// 获取用户信息
const editorStore = useEditorStore()


const { tocMarkdown, tocHtml, tocShow, tocScrollTop,
    editor, editorShow, editorScrollTop, eidtorFullScreen,
    preview, previewShow, previewScrollTop, previewFullScreen,
    imgUrls, isShowElImageViewer, scrollHideViewStr, scrollHideHtmlStr, editorDocumentTop } = storeToRefs(editorStore)

const editorHost = ref<HTMLElement | null>(null);

// 判断所有 key，只要 MardkdownEditorCommandsOrder 对应的 key 的 isShow 为 false，就从 keys 中删除 否则就保留
const constantKeys: MardkdownEditorCommandsOrderKeyType[] = Object.keys(MardkdownEditorCommandsOrder).filter(key => MardkdownEditorCommandsOrder[key].isShow)
const toolbarRef = ref<HTMLElement | null>(null); // 工具栏
const toolbarHeight = ref(0); // 工具栏高度

/**
 * @description: 初始化 output
 */
const initializeEditor = async () => {
    const res = await axios.get('src/assets/example/markdown.md');
    console.log('res1', 1)
    editorStore.updateEditorStore(res.data)
}

const handleEditorButtonClick = (constant: MardkdownEditorCommandsOrderKeyType) => {
    if (constant === "preview") {
        editorShow.value = !editorShow.value
        return
    }
    if (constant === 'desktop') {
        previewShow.value = !previewShow.value
        return
    }
    if (constant === 'toc') {
        tocShow.value = !tocShow.value
        return
    }
    editorInsertFormatContent(cmView, MardkdownEditorCommandsOrder[constant]);
}



let cmView: EditorView

const initializeCodeMirror = () => {
    editorHost.value = document.getElementById('editorHost') as HTMLElement // 获取编辑器宿主容器
    console.log('editorStore.getEditor2', editorStore.getEditor)
    const state = EditorState.create({
        doc: editor.value || '',
        extensions: [customSetup, updateDocInfo],
    });

    cmView = new EditorView({
        state,
        parent: editorHost.value!,
    });

    editorDocumentTop.value = cmView.documentTop // 获取编辑器顶部距离文档顶部的距离
    cmView.scrollDOM.addEventListener("scroll", handleEditorScroll)// 监听滚动事件
}


// 更新编辑器内容
const updateDocInfo: Extension = EditorView.updateListener.of(
    (viewUpdate: ViewUpdate) => {
        if (viewUpdate.docChanged) {
            const { state } = viewUpdate.view;
            const newDoc = state.doc.toString()
            if (newDoc !== editor.value) {
                editorStore.updateEditorStore(newDoc)
            }
        }
    }
)


// 监听编辑器内容变化
// watch(editor, () => {
//     // console.log('wathc input', new Date().toISOString())
//     cmView.dispatch({
//         changes: {
//             from: 0,
//             to: cmView.state.doc.length,
//             insert: editor.value,
//         },
//     })
// })


// 监听工具栏高度变化
watch(toolbarRef, () => {
    updateToolbarHeight();
}, { deep: true });


/**
 * @description: 更新工具栏高度 
 */
function updateToolbarHeight() {
    if (toolbarRef.value) {
        toolbarHeight.value = toolbarRef.value.clientHeight;
        document.documentElement.style.setProperty('--toolbar-height', `${toolbarHeight.value}px`);
    }
}


/**
 * @description: 处理预览容器中的按钮点击事件
 * @param preElement 预览容器中的按钮元素
 */
const handlePreClick = (preElement: HTMLElement) => {
    if (preElement) {
        preElement.click();
    }
}

/**
 * @description: 更新图片查看器的图片
 * @param imgElement 图片元素
 */
const updateImageViewer = (imgElement: HTMLImageElement) => {
    editorStore.setImgUrls(shiftArray(imgUrls.value, imgElement.src))
    editorStore.setIsShowElImageViewer(true)
};


/**
 * @description: 处理委托点击事件 
 * @param event  点击事件   
 */
const handleDelegateClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement; // 获取点击的目标元素
    const previewContainer = document.querySelector('.md-preview') as HTMLElement // 获取预览容器
    const tocContainer = document.querySelector('.md-toc') as HTMLElement // 获取目录容器

    // 处理 preview 容器中的点击事件
    if (previewContainer) {
        if (target.tagName.toLowerCase() === 'button') {
            // 处理预览容器中的按钮点击事件
            const preElement = target.nextElementSibling as HTMLElement;
            handlePreClick(preElement);
        } else if (target.tagName.toLowerCase() === 'img' && 'src' in target) {
            // 处理预览容器中的图片点击事件
            const imgElement = target as HTMLImageElement;
            updateImageViewer(imgElement);
        }

    }

    // 处理 toc 容器中的点击事件
    if (tocContainer) {
        const headingElement = target as HTMLHeadingElement; // 类型断言为标题元素
        if (!headingElement) return // 如果不是标题元素就直接返回

        const index = Array.from(tocContainer.children).indexOf(headingElement) // 获取当前元素在父元素中的索引

        // 1、处理 editor 的滚动
        const line = cmView.state.doc.line(tocMarkdown.value[index].markdownLineNumber) // 获取当前元素在编辑器中的行数

        // 跳转选中目标行
        cmView.dispatch({
            selection: {
                anchor: line.from,
                head: line.from,
            },
            effects: EditorView.scrollIntoView( // 滚动到当前行
                line.from,
                {
                    y: "start",
                    yMargin: 0
                }
            )
        })

        // 2、处理 preview 的滚动
        const headings = Array.from(previewContainer.querySelectorAll('h1,h2,h3,h4,h5,h6')) // 获取预览容器中的所有标题元素
        const targetHeading = headings[index] as HTMLElement // 获取目标heading元素
        scrollToElementSmoothly(targetHeading, previewContainer) // 平滑滚动到目标元素

    }
}


/**
 * @description: 关闭图片查看器
 */
const closeElImageViewer = () => {
    editorStore.setIsShowElImageViewer(false)
}


/**
 * @description: 注册快捷键
 */
const keys = useMagicKeys() // 使用 useMagicKeys() 之后，就可以通过 keys 来获取键盘按键的状态了
const registerHotKeys = () => {
    Object.entries(MardkdownEditorCommandsOrder).forEach((item) => {
        const hotKey = item[1]?.hotKey
        if (hotKey) {
            watch(keys[hotKey], (v) => {
                if (v)
                    editorInsertFormatContent(cmView, MardkdownEditorCommandsOrder[item[0]])
            })
        }
    })
}

/**
 * @description: 处理编辑器滚动事件 
 */
const handleEditorScroll = () => {

    const previewElement = document.querySelector(".md-preview") as HTMLElement// 获取预览容器
    editorScrollTop.value = editorDocumentTop.value - cmView.documentTop // 获取编辑器顶部距离文档顶部的距离

    // 滚动条在顶部时附近时
    if (editorScrollTop.value <= 4) {
        previewElement.scrollTop = 0
        return
    }

    const hideTopBlockInfo = cmView.lineBlockAtHeight(editorScrollTop.value) // 获取不可见部分的信息
    const hideMarkdown = cmView.state.sliceDoc(0, hideTopBlockInfo.from) // 不可见部分的 markdown

    editorStore.setScrollHideViewStr(hideMarkdown) // store 存储不可见部分的 markdown
    editorStore.updateScrollHide() // 更新 store 中的 scroll 得到最新的 html
    const hideDom = new DOMParser().parseFromString(scrollHideHtmlStr.value, 'text/html') // 隐藏的markdown解析出来的html转换为dom
    const editorDoms = hideDom.body.querySelectorAll('*') // 获取隐藏的markdown解析出来的html转换为dom中的所有元素 注意要在 body 中寻找

    const previewDoms = previewElement.querySelectorAll('*') // 获取预览容器中的所有元素
    // const length = Math.min(editorDoms.length, previewDoms.length)// 避免数组越界 取小
    const tagetElement = previewDoms[editorDoms.length] // 获取预览容器中的所有元素中的第一个元素

    if (tagetElement) {
        tagetElement.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" }) // 滚动到对应的元素
    }
}

onMounted(() => {
    initializeEditor() // 初始化 output
    initializeCodeMirror() // 初始化 CodeMirror
    updateToolbarHeight(); // 初始化工具栏高度
    initializeClipboard() // 初始化 ClipboardJS
    registerHotKeys() // 注册快捷键
});


</script>
  
<style scoped lang="scss">
@include respond-to('pc') {
    .layout {
        width: pc.$width-page-main;
    }

    .toolbar {
        width: pc.$width-page-main;
        min-height: pc.$editor-toolbar-height;
        margin-top: pc.$editor-toolbar-margin-top;
        margin-bottom: pc.$editor-toolbar-margin-top;
    }

    .toolbar-btn {
        width: calc(100% / 25); // 每个按钮占据容器的10%
        height: pc.$editor-toolbar-height;
    }

    .iconfont {
        font-size: 24px;
    }

    .md-container {
        //  分别左边一个编辑器，右边一个预览
        width: pc.$width-page-main;
        height: pc.$editor-md-container-height;
    }

    .md-container-item {
        height: pc.$editor-md-container-height;
        flex: 1 1 0; // 1 1 0 代表 flex-grow: 1; flex-shrink: 1; flex-basis: 0; 均分
    }

    :deep(.cm-editor) {
        height: pc.$editor-md-container-height;
    }

    :deep(.cm-panel) {
        height: pc.$editor-bottom-panel-height;
    }


}

@include respond-to('phone') {
    .layout {
        width: 100%;
    }

    .toolbar {
        width: 100%;
        min-height: phone.$editor-toolbar-height;
        margin-top: phone.$editor-toolbar-margin-top;
        margin-bottom: phone.$editor-toolbar-margin-top;
    }

    .toolbar-btn {
        height: phone.$editor-toolbar-height;
    }

    .iconfont {
        font-size: 20px;
    }

    .md-container {
        //  分别左边一个编辑器，右边一个预览
        width: 100%;
        flex-direction: column;
        height: pc.$editor-md-container-height;
    }

    .md-container-item {
        height: phone.$editor-md-container-height;
    }

    .md-editor {
        width: 100%;
    }

    :deep(.cm-editor) {
        height: phone.$editor-md-container-height;
    }

    :deep(.cm-panel) {
        height: phone.$editor-bottom-panel-height
    }

    .md-preview {
        display: none;
    }

}

.layout {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100vh; // 设置容器高度为视口高度
}

.toolbar {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; // 自动换行
    align-items: center;
    justify-content: left;
    border-bottom: 1px solid #ccc;
}

.toolbar-btn {
    border: none;
    background-color: transparent;
    cursor: pointer;
    outline: none;
}

.iconfont {
    fill: #333;
}

.md-container {
    // flex-grow: 1; // 自动撑满剩下的空间
    display: flex;
}

.md-container-item {
    // 元素内显示滚动条
    overflow: auto;
}

.md-editor {
    border: 1px solid #ccc;
    background-color: #fff;
}

.editor-host {
    display: none;
}


:deep(.cm-content) {
    font-size: 14px;
    line-height: 1.5;
    font-weight: 500;
}

:deep(.cm-gutters) {
    background-color: #fff;
}

:deep(.cm-panel) {
    margin: 5px;
    font-size: 14px;
    line-height: 1.5;
    color: #555;
}

.md-preview {
    font-size: 14px;
    line-height: 1.5;
    color: #333;
    word-break: break-all;
    // 元素内显示滚动条
    overflow: auto;
    padding-left: 10px;
    padding-right: 10px;
    background-color: $background-color-content;
}
</style>
  