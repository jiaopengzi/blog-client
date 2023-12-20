<!-- eslint-disable vue/multi-word-component-names -->
<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-12-02 10:33:32
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-12-19 17:33:25
 * @FilePath     : \blog-client\src\views\test\eidtorcode.vue
 * @Description  : codemirror 编辑器
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved. 
-->
<!-- <template>
  <div ref="codemirrorRef" id="my-codemirror"></div>
</template>

<script lang="ts" setup>
import { ref, onMounted} from 'vue';
import type { CodeEditorProps } from '@/components/common/eidtor/codemirror/Codemirror.vue'

// 定义 props 
const props = defineProps<CodeEditorProps>()
const codemirrorRef = ref<HTMLElement | null>(null)

const initializeCssVariable = () => {
  // 初始化编辑器宽度和高度
  if (codemirrorRef.value && props.width) {
      codemirrorRef.value.style.setProperty('--my-codemirror-width', `${props.width}`);
  }
  if (codemirrorRef.value && props.height) {
      codemirrorRef.value.style.setProperty('--my-codemirror-height', `${props.height}`);
  }
}

// 初始化
onMounted(() => {
  initializeCssVariable() // 初始化 css 变量
})

</script>
 -->
