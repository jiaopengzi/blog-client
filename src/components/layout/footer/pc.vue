<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-01-12 10:16:52
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-02-28 12:38:42
 * @FilePath     : \blog-client\src\components\layout\footer\pc.vue
 * @Description  : 底部 PC端
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->

<template>
  <footer>
    <div class="footer-mian">
      <div class="footer-l">
        <h3>{{ footerData.left?.title }}</h3>
        <p>{{ footerData.left?.content }}</p>
      </div>
      <div class="footer-m">
        <ul>
          <li class="footer-m-li" v-for="(item, index) in footerData.middle" :key="index">
            <img :src="item.imgUrl" :alt="item.display" />
            <span>{{ item.display }}</span>
          </li>
        </ul>
      </div>
      <div class="footer-r">
        <div>
          <h3>{{ footerData.right?.title }}</h3>
          <p>{{ footerData.right?.content }}</p>
        </div>

        <div>
          <a href="https://beian.mps.gov.cn/">{{ footerData.right?.beianMPS }}</a>
        </div>

        <div>
          <a href="https://beian.miit.gov.cn/">{{ footerData.right?.beianMIIT }}</a>
        </div>
      </div>
    </div>
  </footer>
</template>
<script setup lang="ts">
// import { toRefs } from 'vue'
import type { FooterProps } from '@/components/layout/footer'

defineOptions({ name: 'FooterPC' })

const props = defineProps<{ footerData: FooterProps }>()
// const { footerData } = toRefs(props)
const { footerData } = props
</script>

<style scoped lang="scss">
footer {
  height: pc.$height-footer;
  background-color: $background-color-footer;
  display: relative;
  align-items: center;
  justify-content: center;
  z-index: 990;
  width: calc(pc.$width-page - pc.$scrollbar-y-width);
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
  p {
    margin: auto 20px;
  }
}

.footer-m {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 80px;
    height: 80px;
  }

  ul {
    display: flex;
    justify-content: center;
    align-items: center;

    li {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin: 0 20px;

      span {
        margin-top: 5px;
        /* 设置合适的间隙值 */
      }
    }
  }
}

h3 {
  margin-bottom: 20px;
  font-weight: 600;
  /* 居中显示 */
  text-align: center;
}

.footer-r {
  text-align: center;
  padding-top: 40px;

  div {
    margin-bottom: 10px;
  }

  a {
    color: #eee;

    :hover {
      background-color: transparent;
    }
  }
}
</style>
