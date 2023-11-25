<!-- eslint-disable vue/multi-word-component-names -->
<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-08-04 10:54:19
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-11-25 14:46:07
 * @FilePath     : \blog-client\src\components\pc\FooterPC.vue
 * @Description  : 底部 PC端
 * @blog         : https://jiaopengzi.com
 * Copyright (c) 2023 by jiaopengzi, All Rights Reserved. 
-->

<template>
  <footer>
    <div class="footer-mian">
      <div class="footer-l">
        <h3>本站简介</h3>
        <div>
          我们主要玩：Power BI、Power Pivot、Power Query、Power BI Report
          Server及DAX等相关数据分析的内容。
        </div>
      </div>
      <div class="footer-m">
        <ul>
          <li class="footer-m-li">
            <img src="https://jiaopengzi.com/wp-content/uploads/2020/03/weixin.png" alt="微信" />
            <span>微信</span>
          </li>
          <li class="footer-m-li">
            <img src="https://jiaopengzi.com/wp-content/uploads/2021/11/weixingongzhonghao.png" alt="公众号" />
            <span>公众号</span>
          </li>
          <li class="footer-m-li">
            <img src="https://jiaopengzi.com/wp-content/uploads/2021/12/qq1618582.png" alt="QQ:1618582" />
            <span>QQ:1618582</span>
          </li>
        </ul>
      </div>
      <div class="footer-r">
        <h3>焦棚子</h3>
        <div>Copyright © 焦棚子 版权所有</div>

        <div>
          <a href="https://www.beian.gov.cn/portal/recordQuery">川公网安备 51019002002570号</a>
        </div>

        <div><a href="https://beian.miit.gov.cn/">蜀ICP备20003928号-1</a></div>
      </div>
    </div>
  </footer>
</template>
<script setup lang="ts">
// 动态计算垂直方向的滚动条宽度
import { onMounted, ref } from 'vue'

const scrollbarWidth = ref(0)

/**
 * @description: 获取滚动条宽度
 * @return 返回滚动条宽度
 */
const getScrollBarWidth = () => {
  const outer = document.createElement('div') // 外部容器
  outer.style.visibility = 'hidden' // 设置为隐藏
  outer.style.overflow = 'scroll' // 内容超出时显示滚动条
  document.body.appendChild(outer) // 将容器添加到页面中

  const inner = document.createElement('div') // 内部元素
  outer.appendChild(inner) // 将内部元素添加到外部容器中

  const scrollbarWidth = outer.offsetWidth - inner.offsetWidth // 计算滚动条宽度

  outer.parentNode?.removeChild(outer) // 移除创建的元素
  return scrollbarWidth // 返回滚动条宽度
}

/**
 * @description: 在页面加载完成后，计算滚动条宽度并设置到根元素中
 * @return  void
 */
onMounted(() => {
  scrollbarWidth.value = getScrollBarWidth()
  document.documentElement.style.setProperty('--scrollbar-y-width', `${scrollbarWidth.value}px`)
})
</script>

<style scoped lang="scss">
footer {
  height: pc.$height-footer;
  background-color: light.$background-color-footer;
  display: relative;
  align-items: center;
  justify-content: center;
  z-index: 990;
  width: calc(pc.$width-page - pc.$scrollbar-y-width)
}

.footer-mian {
  width: pc.$width-page-main;
  display: flex;
  justify-content: space-around;
  align-items: flex-start;
  height: 100%;
  margin: 0 auto;
  color: #eee;
  font-size: 15px;
  /* 添加下面这一行 */
  flex-grow: 1;
}

/* 为 footer-l、footer-m 和 footer-r 添加 flex: 1 三等分*/
.footer-l,
.footer-m,
.footer-r {
  flex: 1;
}

.footer-l {
  text-align: left;
  padding-top: 40px;
  line-height: 1.2;
  /* 设置合适的行间距值 */
}

.footer-l div {
  margin: auto 20px;
}

.footer-m {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.footer-m img {
  width: 80px;
  height: 80px;
}

.footer-m ul {
  display: flex;
  justify-content: center;
  align-items: center;
}

h3 {
  margin-bottom: 20px;
  font-weight: 600;
  /* 居中显示 */
  text-align: center;
}

.footer-m-li {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0 20px;
}

.footer-m-li span {
  margin-top: 5px;
  /* 设置合适的间隙值 */
}

.footer-r {
  text-align: center;
  padding-top: 40px;
}

.footer-r div {
  margin-bottom: 10px;
}

.footer-r a {
  color: #eee;
}

.footer-r a:hover {
  background-color: transparent;
}
</style>
