<!-- eslint-disable vue/multi-word-component-names -->
<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-12-02 10:33:32
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-12-02 19:34:00
 * @FilePath     : \blog-client\src\components\common\editor\Editor.vue
 * @Description  : 编辑器
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved. 
-->
<template>
    <div class="editor-container">
        <button class="editor-btn" v-for="(constant, index) in constantKeys" :key="index"
            @click="() => insert(view, MardkdownEditorCommandsOrder[constant])"
            :title="MardkdownEditorCommandsOrder[constant].tip">
            <Icon :name="constant" customClass="iconfont" />
        </button>
        <div ref="editorHost" id="editorHost"></div>
        <div class="output" v-html="output"></div>
    </div>
</template>
  
<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { EditorView, EditorState, customSetup } from '@/pkg/codemirror/setup';
import type { ViewUpdate } from '@codemirror/view';
import marked from '@/pkg/marked/new-marked';
import { insert } from '@/components/common/editor/command/insert'
import { MardkdownEditorCommandsOrder } from '@/components/common/editor/command/constant'
import type { MardkdownEditorCommandsOrderKeyType } from '@/components/common/editor/command/constant'

const editorHost = ref<HTMLElement | null>(null);
const output = ref('');
const props = defineProps({
    modelValue: String,
});

const emit = defineEmits(['update:modelValue']);

let view: EditorView

onMounted(() => {
    editorHost.value = document.getElementById('editorHost');
    const state = EditorState.create({
        doc: props.modelValue || '',
        extensions: [customSetup, EditorView.updateListener.of(updateDocInfo)],
    });

    view = new EditorView({
        state,
        parent: editorHost.value!,
    });
});

function updateDocInfo(viewUpdate: ViewUpdate): void {
    if (viewUpdate.selectionSet) {
        const { state } = viewUpdate.view;
        const newValue = marked.parse(state.doc.toString()).toString();
        if (newValue !== props.modelValue) {
            emit('update:modelValue', newValue);
        }
    }
}

// 判断所有 key，只要 MardkdownEditorCommandsOrder 对应的 key 的 isShow 为 false，就从 keys 中删除 否则就保留
const constantKeys: MardkdownEditorCommandsOrderKeyType[] = Object.keys(MardkdownEditorCommandsOrder).filter(key => MardkdownEditorCommandsOrder[key].isShow)

</script>
  
<style scoped lang="scss">
@include respond-to('pc') {
    .editor-container {
        width: 600px;
    }

}

@include respond-to('phone') {
    .editor-container {
        width: 100%;
    }

}

.editor-container {
    // display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 10px;
}

.editor-host {
    display: none;
}

.editor-btn {
    border: none;
    background-color: transparent;
    cursor: pointer;
    outline: none;
    margin-right: 10px;
}



:deep(.cm-content) {
    outline: none;
    overflow: auto;
    padding: 10px;
    box-sizing: border-box;
    font-size: 14px;
    line-height: 1.5;
    color: #333;
    background-color: red;
}

:deep(.cm-gutter) {
    background-color: red;
}

:deep(.cm-panel) {
    background-color: red;
}
</style>
  