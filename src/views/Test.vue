<template>
    <div class="cloud_wrap">
        <div class="tagcloud-all">
            <a v-for="(item, i) in info.tagList" :key="i" :href="item.url" rel="external nofollow"
                :style="'color:' + item.color + ';top: 0;left: 0;filter:none;'">{{ item.name }}</a>
        </div>
    </div>
</template>
  
<script lang="ts" setup>
import { nextTick, onMounted, reactive } from 'vue';

interface Info<T> {
    tagList: T[],
    config: T
}
const info: Info<any> = reactive({
    tagList: [],
    config: {
        radius: 120,
        dtr: Math.PI / 180,
        d: 300,
        mcList: [],
        active: false,
        lasta: 1,
        lastb: 1,
        distr: true,
        tspeed: 5, // 控制旋转速度
        size: 250,
        mouseX: 0,
        mouseY: 0,
        howElliptical: 1,
        oList: null,
        oA: null,
        sa: 0,
        ca: 0,
        sb: 0,
        cb: 0,
        sc: 0,
        cc: 0
    }
});

// 生成随机数
function getRandomNum() {
    return Math.floor(Math.random() * (255 + 1));
};
// 三角函数角度计算
function sineCosine(a: number, b: number, c: number) {
    info.config.sa = Math.sin(a * info.config.dtr);
    info.config.ca = Math.cos(a * info.config.dtr);
    info.config.sb = Math.sin(b * info.config.dtr);
    info.config.cb = Math.cos(b * info.config.dtr);
    info.config.sc = Math.sin(c * info.config.dtr);
    info.config.cc = Math.cos(c * info.config.dtr);
}
// 设置初始定位
function positionAll() {
    nextTick(() => {
        let phi = 0;
        let theta = 0;
        let max = info.config.mcList.length;
        let aTmp = [];
        let oFragment = document.createDocumentFragment();
        // 随机排序
        for (let i = 0; i < info.tagList.length; i++) {
            aTmp.push(info.config.oA[i]);
        }
        aTmp.sort(() => {
            return Math.random() < 0.5 ? 1 : -1;
        });
        for (let i = 0; i < aTmp.length; i++) {
            oFragment.appendChild(aTmp[i]);
        }
        info.config.oList.appendChild(oFragment);
        for (let i = 1; i < max + 1; i++) {
            if (info.config.distr) {
                phi = Math.acos(-1 + (2 * i - 1) / max);
                theta = Math.sqrt(max * Math.PI) * phi;
            } else {
                phi = Math.random() * (Math.PI);
                theta = Math.random() * (2 * Math.PI);
            }
            // 坐标变换
            info.config.mcList[i - 1].cx = info.config.radius * Math.cos(theta) * Math.sin(phi);
            info.config.mcList[i - 1].cy = info.config.radius * Math.sin(theta) * Math.sin(phi);
            info.config.mcList[i - 1].cz = info.config.radius * Math.cos(phi);
            info.config.oA[i - 1].style.left = info.config.mcList[i - 1].cx + info.config.oList.offsetWidth / 2 - info.config.mcList[i - 1].offsetWidth / 2 + 'px';
            info.config.oA[i - 1].style.top = info.config.mcList[i - 1].cy + info.config.oList.offsetHeight / 2 - info.config.mcList[i - 1].offsetHeight / 2 + 'px';
        }
    })
}
// 坐标更新 让标签动起来
function update() {
    nextTick(() => {
        let a;
        let b;
        if (info.config.active) {
            a = (-Math.min(Math.max(-info.config.mouseY, -info.config.size), info.config.size) / info.config.radius) * info.config.tspeed;
            b = (Math.min(Math.max(-info.config.mouseX, -info.config.size), info.config.size) / info.config.radius) * info.config.tspeed;
        } else {
            a = info.config.lasta * 0.98;
            b = info.config.lastb * 0.98;
        }
        info.config.lasta = a;
        info.config.lastb = b;
        if (Math.abs(a) <= 0.01 && Math.abs(b) <= 0.01) {
            return
        }
        let c = 0;
        sineCosine(a, b, c);
        for (let j = 0; j < info.config.mcList.length; j++) {
            let rx1 = info.config.mcList[j].cx;
            let ry1 = info.config.mcList[j].cy * info.config.ca + info.config.mcList[j].cz * (-info.config.sa);
            let rz1 = info.config.mcList[j].cy * info.config.sa + info.config.mcList[j].cz * info.config.ca;
            let rx2 = rx1 * info.config.cb + rz1 * info.config.sb;
            let ry2 = ry1;
            let rz2 = rx1 * (-info.config.sb) + rz1 * info.config.cb;
            let rx3 = rx2 * info.config.cc + ry2 * (-info.config.sc);
            let ry3 = rx2 * info.config.sc + ry2 * info.config.cc;
            let rz3 = rz2;
            info.config.mcList[j].cx = rx3;
            info.config.mcList[j].cy = ry3;
            info.config.mcList[j].cz = rz3;
            let per = info.config.d / (info.config.d + rz3);
            info.config.mcList[j].x = (info.config.howElliptical * rx3 * per) - (info.config.howElliptical * 2);
            info.config.mcList[j].y = ry3 * per;
            info.config.mcList[j].scale = per;
            info.config.mcList[j].alpha = per;
            info.config.mcList[j].alpha = (info.config.mcList[j].alpha - 0.6) * (10 / 6);
        }
        doPosition();
        depthSort();
    })
}
function doPosition() {
    nextTick(() => {
        let l = info.config.oList.offsetWidth / 2;
        let t = info.config.oList.offsetHeight / 2;
        for (let i = 0; i < info.config.mcList.length; i++) {
            info.config.oA[i].style.left = info.config.mcList[i].cx + l - info.config.mcList[i].offsetWidth / 2 + 'px';
            info.config.oA[i].style.top = info.config.mcList[i].cy + t - info.config.mcList[i].offsetHeight / 2 + 'px';
            info.config.oA[i].style.fontSize = Math.ceil(12 * info.config.mcList[i].scale / 2) + 8 + 'px';
            // info.config.oA[i].style.filter = "alpha(opacity=" + 100 * info.config.mcList[i].alpha + ")";
            info.config.oA[i].style.opacity = info.config.mcList[i].alpha;
        }
    })
}
function depthSort() {
    nextTick(() => {
        const aTmp = [];
        for (let i = 0; i < info.config.oA.length; i++) {
            aTmp.push(info.config.oA[i]);
        }
        aTmp.sort(function (vItem1, vItem2) {
            if (vItem1.cz > vItem2.cz) {
                return -1;
            } else if (vItem1.cz < vItem2.cz) {
                return 1;
            } else {
                return 0;
            }
        });
        for (let i = 0; i < aTmp.length; i++) {
            aTmp[i].style.zIndex = i;
        }
    })
}
// 生成随机颜色
function query(tagListOrg: any[]) {
    if (!Array.isArray(tagListOrg)) {
        return;
    }
    // 给tagList添加随机颜色
    tagListOrg.forEach((item: any) => {
        item.color = "rgb(" + getRandomNum() + "," + getRandomNum() + "," + getRandomNum() + ")";
    })
    info.tagList = tagListOrg;
    onReady();
}
// 生成标签云
function onReady() {
    nextTick(() => {
        info.config.oList = document.querySelector('.tagcloud-all');
        info.config.oA = info.config.oList.getElementsByTagName('a')
        // var oTag = null;
        for (var i = 0; i < info.config.oA.length; i++) {
            const oTag: any = {};
            oTag.offsetWidth = info.config.oA[i].offsetWidth;
            oTag.offsetHeight = info.config.oA[i].offsetHeight;
            info.config.mcList.push(oTag);
        }
        sineCosine(0, 0, 0);
        positionAll();
        info.config.oList.onmouseover = () => {
            info.config.active = true;
        }
        info.config.oList.onmouseout = () => {
            info.config.active = false;
        }
        info.config.oList.onmousemove = (event: any) => {
            const oEvent: any = window.event || event;
            info.config.mouseX = oEvent.clientX - (info.config.oList.offsetLeft + info.config.oList.offsetWidth / 2);
            info.config.mouseY = oEvent.clientY - (info.config.oList.offsetTop + info.config.oList.offsetHeight / 2);
            info.config.mouseX /= 5;
            info.config.mouseY /= 5;
        }
        setInterval(() => {
            update()
        }, 30);
    })
}

onMounted(() => {
    nextTick(() => {
        const tagListOrg = [
            { name: '标签1', url: 'www.baidu.com' },
            { name: '标签2', url: 'www.baidu.com' },
            { name: '标签3', url: 'www.baidu.com' },
            { name: '标签4', url: 'www.baidu.com' },
            { name: '标签5', url: 'www.baidu.com' },
            { name: '标签6', url: 'www.baidu.com' },
            { name: '标签7', url: 'www.baidu.com' },
            { name: '标签8', url: 'www.baidu.com' },
            { name: '标签9', url: 'www.baidu.com' },
            { name: '标签10', url: 'www.baidu.com' },
            { name: '标签11', url: 'www.baidu.com' },
            { name: '标签12', url: 'www.baidu.com' },
            { name: '标签13', url: 'www.baidu.com' },
            { name: '标签14', url: 'www.baidu.com' },
            { name: '标签15', url: 'www.baidu.com' },
            { name: '标签16', url: 'www.baidu.com' },
            { name: '标签16', url: 'www.baidu.com' },
            { name: '标签16', url: 'www.baidu.com' },
            { name: '标签16', url: 'www.baidu.com' },
            { name: '标签16', url: 'www.baidu.com' },
            { name: '标签16', url: 'www.baidu.com' },
            { name: '标签16', url: 'www.baidu.com' },
            { name: '标签16', url: 'www.baidu.com' },
            { name: '标签16', url: 'www.baidu.com' },
            { name: '标签16', url: 'www.baidu.com' },
            { name: '标签16', url: 'www.baidu.com' },
            { name: '标签16', url: 'www.baidu.com' },
            { name: '标签16', url: 'www.baidu.com' },
            { name: '标签16', url: 'www.baidu.com' },
            { name: '标签17', url: 'www.baidu.com' }
        ];
        query(tagListOrg)
    })
})
</script>
  
<style lang="scss" scoped>
.cloud_wrap {
    width: 100%;
    height: 100%;

    // 标签云
    .tagcloud-all {
        height: 100%;
        position: relative;

        a {
            position: absolute;
            top: 0px;
            left: 0px;
            color: #fff;
            font-weight: bold;
            text-decoration: none;
            padding: 3px 6px;

            &:hover {
                color: #FF0000;
                letter-spacing: 2px;
            }
        }
    }
}
</style>
  