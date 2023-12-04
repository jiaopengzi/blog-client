<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-08-04 10:54:19
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-11-25 14:49:07
 * @FilePath     : \blog-client\src\components\phone\FooterPhone.vue
 * @Description  :  底部 移动端
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved. 
-->

<template>
  <footer>
    <div class="footer-mian">
      <div class="footer-l">
        <h3 class="footer-l-h3">本站简介</h3>
        <p class="footer-l-p">
          我们主要玩：Power BI、Power Pivot、Power Query、Power BI Report
          Server及DAX等相关数据分析的内容。
        </p>
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
<script setup lang="ts"></script>
<style scoped lang="scss">
footer {
  background-color: $background-color-footer;
  display: relative;
  align-items: center;
  justify-content: center;
  z-index: 990;
  width: calc(phone.$width-page - phone.$scrollbar-y-width);
}

.footer-mian {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  margin: 0;
  color: #eee;
  font-size: 15px;
  background-color: $background-color-footer;
  border-top: 2px solid #ebebeb;
}

.footer-l {
  width: 100%;
  /* 设置合适的行间距值 */
  margin-bottom: 5%;
}

.footer-l-h3 {
  text-align: center;
  line-height: 1.5;
  padding-top: 5%;
  margin: 0;
}

.footer-l-p {
  text-align: left;
  line-height: 1.5;
  padding: 5%;
}

.footer-m {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 5%;
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
  width: 100%;
  text-align: center;
  margin-top: 3%;
  margin-bottom: 3%;
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
