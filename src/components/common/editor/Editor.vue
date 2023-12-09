<!-- eslint-disable vue/multi-word-component-names -->
<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-12-02 10:33:32
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-12-09 23:43:50
 * @FilePath     : \blog-client\src\components\common\editor\Editor.vue
 * @Description  : 编辑器
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved. 
-->
<template>
    <div class="layout">
        <div class="toolbar" ref="toolbarRef">
            <button class="editor-btn" v-for="(constant, index) in constantKeys" :key="index"
                @click="handleEditorButtonClick(constant)"
                :title="MardkdownEditorCommandsOrder[constant].tip + ' <' + MardkdownEditorCommandsOrder[constant].hotKey + '>'">
                <Icon :name="constant" customClass="iconfont" />
            </button>
        </div>
        <div class="in-out">
            <div v-show="tocContentShow" class="toc in-out-item" v-html="tocContent"></div>
            <div v-show="editorContentShow" class="editor-in in-out-item">
                <div ref="editorHost" id="editorHost"></div>
            </div>
            <div v-show="previewContentShow" class="editor-out in-out-item" v-html="previewContent"
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

// 获取用户信息
const editorStore = useEditorStore()

let { tocContent, tocContentShow, tocScrollTop, editorContent, editorContentShow, editorScrollTop, eidtorFullScreen, previewContent, previewContentShow, previewScrollTop, previewFullScreen, imgUrls, isShowElImageViewer } = storeToRefs(editorStore)

console.log("editorStore初始化", editorStore)
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
    editorInsertFormatContent(view, MardkdownEditorCommandsOrder[constant]);
}

const editorHost = ref<HTMLElement | null>(null);

// 判断所有 key，只要 MardkdownEditorCommandsOrder 对应的 key 的 isShow 为 false，就从 keys 中删除 否则就保留
const constantKeys: MardkdownEditorCommandsOrderKeyType[] = Object.keys(MardkdownEditorCommandsOrder).filter(key => MardkdownEditorCommandsOrder[key].isShow)
const toolbarRef = ref<HTMLElement | null>(null); // 工具栏
const toolbarHeight = ref(0); // 工具栏高度

let view: EditorView

const initializeCodeMirror = () => {
    editorHost.value = document.getElementById('editorHost');
    const state = EditorState.create({
        doc: editorContent.value || '',
        extensions: [customSetup, updateDocInfo],
    });

    view = new EditorView({
        state,
        parent: editorHost.value!,
    });

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
);


const initializeOutput = async () => {
    const res = await axios.get('src/assets/example/markdown.md');
    editorStore.updateEditorStore(res.data)
}

watch(editorContent, () => {
    console.log('wathc input', new Date().toISOString())
    view.dispatch({
        changes: {
            from: 0,
            to: view.state.doc.length,
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

// 使用事件委托处理点击事件
const handleDelegateClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement;

    // 根据目标元素类型触发对应的处理函数
    if (target.tagName.toLowerCase() === 'button') {
        const preElement = target.nextElementSibling as HTMLElement;
        handlePreClick(preElement);
    } else if (target.tagName.toLowerCase() === 'img' && 'src' in target) {
        const imgElement = target as HTMLImageElement;
        updateImageViewer(imgElement);
    }
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
                    editorInsertFormatContent(view, MardkdownEditorCommandsOrder[item[0]])
            })
        }
    })
}


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
    }

    .iconfont {
        font-size: 24px;
    }

    .in-out {
        //  分别左边一个编辑器，右边一个预览
        display: flex;
        width: pc.$width-page-main;
    }

    .in-out-item {
        flex: 1 1 0; // 1 1 0 代表 flex-grow: 1; flex-shrink: 1; flex-basis: 0; 均分
    }

    .editor-in {
        max-height: calc(100vh - pc.$editor-toolbar-height - pc.$editor-bottom-panel-height - 4px);
    }

    :deep(.cm-editor) {
        max-height: calc(100vh - pc.$editor-toolbar-height - pc.$editor-bottom-panel-height - 4px);
    }

    :deep(.cm-content) {
        min-height: calc(100vh - pc.$editor-toolbar-height - 2 * pc.$editor-bottom-panel-height - 16px);
    }

    :deep(.cm-panel) {
        height: pc.$editor-bottom-panel-height;
    }

    .editor-out {
        max-height: calc(100vh - pc.$editor-toolbar-height - pc.$editor-bottom-panel-height - 4px);
    }

}

@include respond-to('phone') {
    .layout {
        width: 100%;
    }


    .toolbar {
        width: 100%;
        min-height: phone.$editor-toolbar-height;
    }

    .iconfont {
        font-size: 20px;
    }

    .in-out {
        //  分别左边一个编辑器，右边一个预览
        display: flex;
        flex-direction: column;
        width: 100%;
    }

    .editor-in {
        width: 100%;
        // 实时获取 .toolbar 高度
        height: calc(100vh - var(--toolbar-height) - phone.$editor-bottom-panel-height - 5px);
    }

    :deep(.cm-editor) {
        height: calc(100vh - var(--toolbar-height) - phone.$editor-bottom-panel-height - 5px);
    }

    :deep(.cm-content) {
        height: calc(100vh - var(--toolbar-height) - 2 * phone.$editor-bottom-panel-height - 15px);
    }

    :deep(.cm-panel) {
        height: phone.$editor-bottom-panel-height
    }

    .editor-out {
        display: none;
    }

}

.layout {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
}

.toolbar {
    margin-top: 10px;
    margin-bottom: 10px;
    display: flex;
    flex-wrap: wrap; // 自动换行
    border-bottom: 1px solid #ccc;
}

.editor-btn {
    border: none;
    background-color: transparent;
    cursor: pointer;
    outline: none;
}

.iconfont {
    fill: #333;
}

.editor-in {
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

.editor-out {
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
  