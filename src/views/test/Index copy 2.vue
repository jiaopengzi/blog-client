<template>
    <div class="edit-container">
        <div class="leftBox">
            <textarea wrap="off" cols="2" id="leftNum" disabled
                onscroll="document.getElementById('rightNum').scrollTop = this.scrollTop;"></textarea>
        </div>
        <textarea @input="handleTextareaInput" id="rightNum" v-model="areaText"
            onscroll="document.getElementById('leftNum').scrollTop = this.scrollTop;" spellcheck="false"
            class="area-content"></textarea>
    </div>
</template>
  
<script  setup>
import { ref } from 'vue';

const areaText = ref('');
const num = ref('');
function handleTextareaInput(e) {
    let str = e.target.value;
    str = str.replace(/\r/gi, '');
    str = str.split('\n');
    let n = str.length;
    let lineBbj = document.getElementById('leftNum');
    for (let i = 1; i <= n; i++) {
        if (document.all) {
            num.value += i + '\r\n'; //判断浏览器是否是IE
        } else {
            num.value += i + '\n';
        }
    }
    lineBbj.value = num.value;
    num.value = '';
}
</script>

  
<style scoped>
.edit-container {
    border: 1px solid #f5f7fa;
    height: 570px;
    display: flex;
    padding: 10px 10px 10px 0;
    background-color: #f5f7fa;
}

.leftBox {
    height: 100%;
    text-align: left;
}

.area-content {
    padding: 10px 8px;
    width: 100%;
    height: 100%;
    font-size: 13px;
    line-height: 24px;
    color: rgba(0, 0, 0, 0.85);
    font-family: Consolas;
    border: none;
    background: #ffffff;
    box-sizing: border-box;
    outline: none;
    resize: none;
}

#leftNum {
    overflow: hidden;
    padding: 10px 4px;
    height: 100%;
    width: 100%;
    line-height: 24px;
    font-size: 13px;
    text-align: right;
    color: rgba(0, 0, 0, 0.25);
    font-weight: bold;
    resize: none;
    outline: none;

    border: 0;
    background: #f5f7fa;
    box-sizing: border-box;
}
</style>
  