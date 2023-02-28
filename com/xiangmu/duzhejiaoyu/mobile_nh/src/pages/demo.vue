<template>
    <div>
        <ul class="fenye"
            v-infinite-scroll="loadMore"
            infinite-scroll-disabled="loading"
            infinite-scroll-distance="10">
            <li v-for="(item,i) in list" class="item-box" :key="i">{{ item }}</li>
        </ul>
    </div>
</template>
<script>
import { addAnimation } from '../util/animateTool'
export default {
    data () {
        return {
            loading:false,
            list:[1,2,3,4,5,6,7,8,9],
            pageSize:10
        }
    },
    methods: {
        loadMore() {
            this.loading = true;
            setTimeout(() => {
                let last = this.list[this.list.length - 1];
                for (let i = 1; i <= 10; i++) {
                    this.list.push(last + i);
                }
                // 添加加入的效果
                this.$nextTick(() => {
                    addAnimation({
                        className: '.item-box',
                        animationName: 'fadeInUp',
                        pageSize:this.pageSize
                    })
                })
                this.loading = false;
            }, 500);
        }
    },
    mounted() {

    }
}
</script>
<style>
.fenye>li{
    width: 100%;
    height: 100px;
    margin: 10px;
    background: red;
}
.overall {
  background: #f1f1f1;
}
.box {
  perspective: 1000;
  width: 300px;
  height: 600px;
  box-shadow: 0 0 5px #ccc;
  overflow-y: auto;
  overflow-x: hidden;
  background: rgb(63, 63, 63);
}
/* 螺旋显示 */
/* .lineRoll {
    transform-style: preserve-3d;
    opacity: 0;
    transform-origin: 50% 50%;
    transform: rotateY(180deg) scaleX(0.2);
} */
/* 螺旋显示 */
 /* .lineRoll {
     transform-style: preserve-3d;
     opacity: 0;
     background: rgb(63, 63, 63);
     transform: rotateX(50deg) rotateY(60deg);
} */
/* 平衡倾斜  */
/* .lineRoll {
    transform-style: preserve-3d;
    opacity: 0;
    background: rgb(63, 63, 63);
    transform-origin: 50% 100%;
    transform: rotateX(90deg) translateY(-50px);
} */
/* 平衡倾斜 */
/* .lineRoll {
    opacity: 0;
    transform: scale(0.2);
    background: #e9e8e8;
} */
/* 从左到右 */
/* .lineRoll {
    transform-style: preserve-3d;
    transform:translateX(-80%);
 } */
 .lineRoll {
    transform-style: preserve-3d;
    opacity: 0;
    background: rgb(63, 63, 63);
    transform-origin: 50% 100%;
    transform: rotateX(90deg) translateY(-50px);
}
 .line {
    box-sizing: border-box;
    height: 50px;
    background: #f1f1f1;
    line-height: 50px;
    opacity: 1;
    transition: 1s;
    font-weight: bold;
    position: relative;
    z-index: 5;
  }



.v-enter,.v-leave-to{
    opacity: 0;
}
.v-enter-active,.v-leave-active{
    transition: opacity .5s;
}
.navs {
    width: 100%;
    height: 3rem;
    background-color: #fff;
    position: fixed;
    display: flex;
    justify-content: space-around;
    z-index: 999;
}
.navs>li {
    box-sizing: border-box;
    padding-top: 0.5rem;
    color: #000;
    font-size: 0.7rem;
    text-align: center;
    position: relative;
    width: 25%;
}
.navs>li>div{
    position: absolute;
    width: 100%;
}
.navs>li>div>img {
    width: 1rem;
    height: 1rem;
}
.navs>li>div>span{
    display: block;
}
.isactive span {
    color: #70A9FF;
}
</style>