<!-- eslint-disable vue/multi-word-component-names -->
<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-12-02 10:33:32
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-12-07 13:23:04
 * @FilePath     : \blog-client\src\views\test\Index.vue
 * @Description  : 编辑器
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved. 
-->
<template>
  <div class="layout">
    <div class="toolbar" ref="toolbarRef">
      <button class="editor-btn" v-for="(constant, index) in constantKeys" :key="index"
        @click="() => insert(view, MardkdownEditorCommandsOrder[constant])"
        :title="MardkdownEditorCommandsOrder[constant].tip">
        <Icon :name="constant" customClass="iconfont" />
      </button>
    </div>

    <div class="editor-in in-out-item">
      <div ref="editorHost" id="editorHost"></div>
    </div>

  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { EditorView, EditorState, customSetup } from '@/pkg/codemirror/setup';
import { insert } from '@/components/common/editor/command/insert'
import { MardkdownEditorCommandsOrder } from '@/components/common/editor/command/constant'
import type { MardkdownEditorCommandsOrderKeyType } from '@/components/common/editor/command/constant'


const editorHost = ref<HTMLElement | null>(null);
const input = ref('');

const constantKeys: MardkdownEditorCommandsOrderKeyType[] = Object.keys(MardkdownEditorCommandsOrder).filter(key => MardkdownEditorCommandsOrder[key].isShow)
const toolbarRef = ref<HTMLElement | null>(null); // 工具栏

let view: EditorView

const initializeCodeMirror = () => {
  editorHost.value = document.getElementById('editorHost');
  const state = EditorState.create({
    doc: input.value || '',
    extensions: [customSetup],
  });

  view = new EditorView({
    state,
    parent: editorHost.value!,
  });
}

const keydownHandler = (event: KeyboardEvent) => {
  if (event.ctrlKey) {
    const digit = parseInt(event.key, 10);
    if (!isNaN(digit) && digit >= 1 && digit <= constantKeys.length) {
      event.preventDefault();
      const command = MardkdownEditorCommandsOrder[constantKeys[digit - 1]];
      insert(view, command);
    }
  }
};


onMounted(() => {
  initializeCodeMirror() // 初始化 CodeMirror
  window.addEventListener('keydown', keydownHandler);
});
onUnmounted(() => {
  window.removeEventListener('keydown', keydownHandler);
});
</script>

<style scoped lang="scss">
@include respond-to('pc') {
  .layout {
    width: pc.$width-page-main;
  }

  .toolbar {
    width: pc.$width-page-main;
    height: pc.$editor-toolbar-height;
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
