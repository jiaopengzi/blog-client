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
            <img
              src="https://jiaopengzi.com/wp-content/uploads/2021/11/weixingongzhonghao.png"
              alt="公众号"
            />
            <span>公众号</span>
          </li>
          <li class="footer-m-li">
            <img
              src="https://jiaopengzi.com/wp-content/uploads/2021/12/qq1618582.png"
              alt="QQ:1618582"
            />
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

<style scoped lang="less">
footer {
  height: @height-footer-pc;
  /* 将底部固定在屏幕底部 */
  position: relative;

  /* 设置一个较高的 z-index 值以覆盖其他元素 */
  z-index: 990;
  background-color: @background-color-footer;
  width: @width-page-pc;
}

.footer-mian {
  width: @width-page-main-pc;
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
