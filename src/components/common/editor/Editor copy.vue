<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-12-11 09:35:04
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-12-11 13:35:11
 * @FilePath     : \blog-client\src\components\common\editor\Editor copy.vue
 * @Description  : 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved. 
-->
<!-- eslint-disable vue/multi-word-component-names -->
<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-12-02 10:33:32
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-12-11 13:33:31
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
            <div v-show="tocContentShow" class="md-toc md-container-item" v-html="tocContent" @click="handleDelegateClick">
            </div>
            <div v-show="editorContentShow" class="md-editor md-container-item">
                <div ref="editorHost" id="editorHost"></div>
            </div>
            <div v-show="previewContentShow" class="md-preview md-container-item" v-html="previewContent"
                @click="handleDelegateClick">
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
import { findHeadingLines } from '@/utils/lineNumbers'


// 获取用户信息
const editorStore = useEditorStore()

let { tocContent, tocContentShow, tocScrollTop, editorContent, editorContentShow, editorScrollTop, eidtorFullScreen, previewContent, previewContentShow, previewScrollTop, previewFullScreen, imgUrls, isShowElImageViewer, scrollViewStr, scrollHtmlStr, editorDocumentTop } = storeToRefs(editorStore)

const handleEditorButtonClick = (constant: MardkdownEditorCommandsOrderKeyType) => {
    if (constant === "preview") {
        editorContentShow.value = !editorContentShow.value
        return
    }
    if (constant === 'desktop') {
        previewContentShow.value = !previewContentShow.value
        return
    }
    if (constant === 'toc') {
        tocContentShow.value = !tocContentShow.value
        return
    }
    editorInsertFormatContent(cmView, MardkdownEditorCommandsOrder[constant]);
}

const editorHost = ref<HTMLElement | null>(null);

// 判断所有 key，只要 MardkdownEditorCommandsOrder 对应的 key 的 isShow 为 false，就从 keys 中删除 否则就保留
const constantKeys: MardkdownEditorCommandsOrderKeyType[] = Object.keys(MardkdownEditorCommandsOrder).filter(key => MardkdownEditorCommandsOrder[key].isShow)
const toolbarRef = ref<HTMLElement | null>(null); // 工具栏
const toolbarHeight = ref(0); // 工具栏高度

let cmView: EditorView

const initializeCodeMirror = () => {
    editorHost.value = document.getElementById('editorHost') as HTMLElement // 获取编辑器宿主容器
    const state = EditorState.create({
        doc: editorContent.value || '',
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
            if (newDoc !== editorContent.value) {
                editorStore.updateEditorStore(newDoc)
            }
        }
    }
)


const initializeOutput = async () => {
    const res = await axios.get('src/assets/example/markdown.md');
    editorStore.updateEditorStore(res.data)
}

watch(editorContent, () => {
    console.log('wathc input', new Date().toISOString())
    cmView.dispatch({
        changes: {
            from: 0,
            to: cmView.state.doc.length,
            insert: editorContent.value,
        },
    });
});

watch(toolbarRef, () => {
    updateToolbarHeight();
}, { deep: true });

function updateToolbarHeight() {
    if (toolbarRef.value) {
        toolbarHeight.value = toolbarRef.value.clientHeight;
        // console.log(toolbarHeight.value);
        // Set the value of the CSS variable for toolbar height
        document.documentElement.style.setProperty('--toolbar-height', `${toolbarHeight.value}px`);
    }
}

// 处理pre元素的点击事件
const handlePreClick = (preElement: HTMLElement) => {
    if (preElement) {
        preElement.click();
    }
};

// 更新图片查看器状态
const updateImageViewer = (imgElement: HTMLImageElement) => {
    editorStore.setImgUrls(shiftArray(imgUrls.value, imgElement.src))
    editorStore.setIsShowElImageViewer(true)
};


const getParentWithClass = (element: HTMLElement, className: string) => {
    let currentElement = element;
    while (currentElement) {
        if (currentElement.classList.contains(className)) {
            return currentElement;
        }
        currentElement = currentElement.parentElement as HTMLElement;
    }
    return null;
};


// 使用事件委托处理点击事件
const handleDelegateClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement;

    const tocParent = getParentWithClass(target, 'md-toc');
    const editorParent = getParentWithClass(target, 'md-editor');
    const previewParent = getParentWithClass(target, 'md-preview');

    if (previewParent) {
        // 根据目标元素类型触发对应的处理函数
        if (target.tagName.toLowerCase() === 'button') {
            const preElement = target.nextElementSibling as HTMLElement;
            handlePreClick(preElement);
        } else if (target.tagName.toLowerCase() === 'img' && 'src' in target) {
            const imgElement = target as HTMLImageElement;
            updateImageViewer(imgElement);
        }

    }
    if (tocParent) {
        // if (target.tagName.toLowerCase().match(/^h[1-6]$/)) {// 正则匹配 h1 ~ h6
        //     const headingElement = target as HTMLHeadingElement; // 类型断言
        //     // 判断 headingElement 在 md-toc 中的索引 需要注意内容中可能有多个相同的 heading
        //     const index = Array.from(tocParent.children).indexOf(headingElement)

        //     let indexList: number[] = []
        //     Array.from(tocParent.children).filter((item, index) => {
        //         const itemElement = item as HTMLHeadingElement
        //         if (itemElement.innerText === headingElement.innerText) {
        //             indexList.push(index)
        //         }
        //     })
        //     indexList.indexOf(index)

        //     const lines = findHeadingLines(view.state.doc.toString(), headingElement.innerText)
        //     console.log('lineNumber', lines[indexList.indexOf(index)])
        //     const firstLine = view.state.doc.line(lines[indexList.indexOf(index)]);
        //     console.log('from', firstLine.from)
        //     view.dispatch({
        //         selection: {
        //             anchor: firstLine.from,
        //             head: firstLine.from,
        //         },
        //     })

        //     // 获取元素坐标
        //     // const rect = view.coordsAtPos(firstLine.from);
        //     const rect = view.coordsAtPos(firstLine.from);
        //     if (rect) {
        //         const docTop = view.dom.getBoundingClientRect().top;
        //         const scrollOffset = view.scrollDOM.scrollTop;

        //         const scrollTopRelativeToDocument = rect.top - docTop + scrollOffset;
        //         console.log('scrollTopRelativeToDocument', scrollTopRelativeToDocument);

        //         view.scrollDOM.scrollTo({ top: scrollTopRelativeToDocument, behavior: 'auto' }) // auto | smooth | instant
        //     }

        //     // 寻找 heading 元素 在 md-preview 中的位置
        //     const previewElement = document.querySelector('.preview') as HTMLElement
        //     previewElement?.querySelectorAll('h1,h2,h3,h4,h5,h6').forEach((item, index) => {
        //         const itemElement = item as HTMLHeadingElement
        //         if (itemElement.innerHTML === headingElement.innerHTML) {
        //             // 获取 itemElement 在 md-preview 中的位置 并滚动到对应位置
        //             previewElement.scrollTop = itemElement.offsetTop - previewElement.offsetTop
        //         }
        //     })

        // }
        if (target.tagName.toLowerCase().match(/^h[1-6]$/)) {
            const headingElement = target as HTMLHeadingElement; // 类型断言
            const index = Array.from(tocParent.children).indexOf(headingElement)

            let indexList: number[] = []
            Array.from(tocParent.children).filter((item, index) => {
                const itemElement = item as HTMLHeadingElement
                if (itemElement.innerText === headingElement.innerText) {
                    indexList.push(index)
                }
            })
            indexList.indexOf(index)

            const lines = findHeadingLines(cmView.state.doc.toString(), headingElement.innerText)
            console.log('lineNumber', lines[indexList.indexOf(index)])
            const firstLine = cmView.state.doc.line(lines[indexList.indexOf(index)]);
            console.log('from', firstLine.from)
            cmView.dispatch({
                selection: {
                    anchor: firstLine.from,
                    head: firstLine.from,
                },
            })

            // 获取元素坐标
            // const rect = view.coordsAtPos(firstLine.from);
            const rect = cmView.coordsAtPos(firstLine.from);
            if (rect) {
                const docTop = cmView.dom.getBoundingClientRect().top;
                const scrollOffset = cmView.scrollDOM.scrollTop;

                const scrollTopRelativeToDocument = rect.top - docTop + scrollOffset;
                console.log('scrollTopRelativeToDocument', scrollTopRelativeToDocument);

                cmView.scrollDOM.scrollTo({ top: scrollTopRelativeToDocument, behavior: 'smooth' }) // auto | smooth | instant
                // view.scrollDOM.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
            }

            // Find the corresponding heading in '.preview'
            const previewElement = document.querySelector('.md-preview') as HTMLElement;
            const headings = Array.from(previewElement.querySelectorAll('h1,h2,h3,h4,h5,h6'));
            const targetHeadingIndex = headings.findIndex((item) =>
                (item as HTMLHeadingElement).innerHTML === headingElement.innerHTML
            );
            if (targetHeadingIndex !== -1) {
                const targetHeading = headings[targetHeadingIndex] as HTMLElement;
                scrollToElementSmoothly(targetHeading, previewElement);
            }
        }
    }
}

const scrollToElementSmoothly = (element: HTMLElement, container: HTMLElement) => {
    let targetScrollTop = element.offsetTop - container.offsetTop;
    const observer = new IntersectionObserver(
        (entries) => {
            // 检查目标元素是否与视口相交
            if (entries[0].isIntersecting) {
                container.scrollTop = targetScrollTop;
                observer.disconnect() // 停止观察
            } else {
                container.scrollTop += (targetScrollTop - container.scrollTop) * 0.1 // 滚动到目标元素
                requestAnimationFrame(() => {
                    scrollToElementSmoothly(element, container) // 继续观察
                })
            }
        },
        { root: container } // 观察 container
    );

    observer.observe(element) // 开始观察
};

const closeElImageViewer = () => {
    editorStore.setIsShowElImageViewer(false)
};


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

    editorStore.setScrollViewStr(hideMarkdown) // store 存储不可见部分的 markdown
    editorStore.updateScroll() // 更新 store 中的 scroll 得到最新的 html
    const hideDom = new DOMParser().parseFromString(scrollHtmlStr.value, 'text/html') // 隐藏的markdown解析出来的html转换为dom
    const editorDoms = hideDom.body.querySelectorAll('*') // 获取隐藏的markdown解析出来的html转换为dom中的所有元素 注意要在 body 中寻找

    const previewDoms = previewElement.querySelectorAll('*') // 获取预览容器中的所有元素
    // const length = Math.min(editorDoms.length, previewDoms.length)// 避免数组越界 取小
    const tagetElement = previewDoms[editorDoms.length] // 获取预览容器中的所有元素中的第一个元素

    if (tagetElement) {
        tagetElement.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" }) // 滚动到对应的元素
    }

};

onMounted(() => {
    initializeCodeMirror() // 初始化 CodeMirror
    initializeOutput() // 初始化 output
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
  