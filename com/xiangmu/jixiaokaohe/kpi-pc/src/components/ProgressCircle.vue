<template>
  <div class="main">
    <div class="box">
      <div class="percent" :class="{'white': percent >= 70}">
        <p>剩余</p>
        <div>{{percent}}%</div>
      </div>
      <div id="water" class="water" :style="{'transform': 'translate(0,' + transformY + '%)'}">
        <svg viewBox="0 0 560 20" class="water_wave water_wave_front">
          <svg id="wave" version="1.1">
            <path
              d="M420,20 c21.5-0.4,38.8-2.5,51.1-4.5 c13.4-2.2,26.5-5.2,27.3-5.4 C514,6.5,518,4.7,528.5,2.7 c7.1-1.3,17.9-2.8,31.5-2.7 c0,0,0,0,0,0v20H420z"
            />
            <path
              d="M420,20 c-21.5-0.4-38.8-2.5-51.1-4.5 c-13.4-2.2-26.5-5.2-27.3-5.4C326,6.5,322,4.7,311.5,2.7C304.3,1.4,293.6-0.1,280,0c0,0,0,0,0,0v20H420z"
            />
            <path
              d="M140,20 c21.5-0.4,38.8-2.5,51.1-4.5 c13.4-2.2,26.5-5.2,27.3-5.4 C234,6.5,238,4.7,248.5,2.7 c7.1-1.3,17.9-2.8,31.5-2.7c0,0,0,0,0,0v20H140z"
            />
            <path
              d="M140,20 c-21.5-0.4-38.8-2.5-51.1-4.5 c-13.4-2.2-26.5-5.2-27.3-5.4 C46,6.5,42,4.7,31.5,2.7 C24.3,1.4,13.6-0.1,0,0 c0,0,0,0,0,0l0,20H140z"
            />
          </svg>
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    // 百分比
    percent: {
      type: Number,
      default: 35
    }
  },
  computed: {
    transformY() {
      return 100 - this.percent;
    }
  }
};
</script>

<style lang="scss" scoped>
.main {
  width: 80px;
  height: 80px;
  border: 3px solid #3f86f7;
  border-radius: 50%;
  padding: 1px;
}
.box {
  position: relative;
  height: 100%;
  width: 100%;
  background: #ffffff;
  border-radius: 50%;
  overflow: hidden;
  transform: rotate(0deg);
}
.percent {
  position: absolute;
  z-index: 100;
  text-align: center;
  width: 100%;
  top: 10px;
  left: 0;
  p {
    color: #999999;
    line-height: 20px;
  }
  &.white *{
    color: #ffffff;
  } 
}
.water {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 2;
  width: 100%;
  height: 100%;
  -webkit-transform: translate(0, 100%);
  transform: translate(0, 100%);
  background: #3f86f7;
}
.box .water_wave {
  width: 200%;
  position: absolute;
  bottom: 100%;
}
.box .water_wave_front {
  left: 0;
  fill: #3f86f7;
  margin-bottom: -0.5px;
  animation: wave-front 1s infinite linear;
}

@keyframes wave-front {
  100% {
    -webkit-transform: translate(-50%, 0);
    transform: translate(-50%, 0);
  }
}
</style>