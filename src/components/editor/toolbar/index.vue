<!-- eslint-disable vue/multi-word-component-names -->
<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-12-12 13:02:01
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-12-26 23:13:31
 * @FilePath     : \blog-client\src\components\common\editor\toolbar\index.vue
 * @Description  : 工具栏组件
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved. 
-->

<template>
    <div ref="toolbarRef" id="toolbar">
        <el-tooltip v-for="(btn, index) in props.toobarBtns" :key="index" effect="dark" :content="btn.display"
            :hide-after="0">
            <button class="toolbar-btn" :key="index" @click="emitToolbarBtnClicked(btn.name)">
                <Icon :name="btn.icon" customClass="iconfont" />
            </button>
        </el-tooltip>
    </div>
</template>
  
<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue';
import { CommandsKey } from '@/components/editor/command'
import type { ToolbarProps } from '@/components/editor/toolbar'

// eslint-disable-next-line vue/multi-word-component-names
defineOptions({ name: "Toolbar" })

// 定义 props 
const props = defineProps<ToolbarProps>();

// 设置 iconNumberPerLine 默认值为 20
// const iconNumberPerLine = ref<number>(props.iconNumberPerLine || 20);

// 子组件 传参
const emit = defineEmits<{
    (e: 'toolbar-btn-clicked', name: CommandsKey): void
}>()

const toolbarRef = ref<HTMLElement | null>(null); // 工具栏
const toolbarHeight = ref(0); // 工具栏高度


function emitToolbarBtnClicked(name: CommandsKey) {
    // 触发自定义事件 "onToolbarBtnClicked"，将 name 传递给父组件
    emit('toolbar-btn-clicked', name)
}

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

// const toolbarClass = computed(() => getClassName('toolbar', 'toolbar-fs', false));
// const toolbarBtnClass = computed(() => getClassName('toolbar-btn', 'toolbar-btn-fs', false));


// const setToolbarIconNumberPerLine = () => {
//     // 初始化编辑器宽度和高度
//     if (toolbarRef.value) {
//         toolbarRef.value.style.setProperty('--icon-number-per-line', `${iconNumberPerLine.value}`);
//     }
// }

onMounted(async () => {// 初始化 CodeMirror
    // setToolbarIconNumberPerLine() // 初始化工具栏每行显示的按钮个数
    updateToolbarHeight()// 初始化工具栏高度
})

defineExpose({
    root: toolbarRef
})

</script>
  
<style scoped lang="scss">
#toolbar {
    display: flex;
    flex-wrap: wrap; // 自动换行
    align-items: center;
    // justify-content: left;
    border-bottom: 1px solid #ccc;
    min-height: pc.$editor-toolbar-height;
    margin-top: pc.$editor-toolbar-margin-top;
    margin-bottom: pc.$editor-toolbar-margin-top;

    .toolbar-btn {
        border: none;
        background-color: transparent;
        cursor: pointer;
        outline: none;
        height: pc.$editor-toolbar-height;
        // 通过计算每个按钮的 margin-left 和 margin-right 来实现每行显示的按钮个数
        margin: 0 calc((100% - 24px * var(--icon-number-per-line)) / var(--icon-number-per-line) / 2);
        padding: 0;
    }
}

.iconfont {
    font-size: 24px;
    fill: #333;
}
</style>
  