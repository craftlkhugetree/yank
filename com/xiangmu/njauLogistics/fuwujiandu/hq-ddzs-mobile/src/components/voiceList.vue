<template>
  <div class="voice">
    <div class="font-s open" v-show="extract" @click="open">
      展开{{ list.length }}条语音
    </div>
    <div v-show="!extract">
      <div class="font-s open" @click="close" v-show="list && list.length > 1">
        收起
      </div>
      <div class="div_flex au" v-for="item in arr" :key="item.id">
        <div>
          <van-icon
            name="play-circle"
            class="play"
            v-if="item.play"
            @click="play(item)"
          />
          <van-icon
            name="pause-circle"
            class="pause"
            v-else
            @click="pause(item)"
          />
        </div>
        <div
          class="div_flex log"
          :style="{ '--ddw': 3 * item.duration + 'px' }"
        >
          <div
            v-for="k in item.bar"
            :key="k"
            class="bar"
            :class="k < item.curTime ? 'choose' : ''"
            :style="{ height: k % 3 === 0 ? '6px' : k % 2 === 0 ? '10px' : '' }"
          ></div>
        </div>
        <span class="duration">{{
          item.duration ? item.duration + "″" : ""
        }}</span>
        <audio
          :src="global.viewUrl + item.id"
          controls
          v-show="false"
          :id="item.id"
        />
        <i
          class="iconfont icon-delete del"
          @click.stop="del(item.id)"
          v-if="delV"
        ></i>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    list: Array,
    delV: Function
  },
  watch: {
    list: {
      handler(val) {
        this.extract = val && val.length > 1;
        this.arr = this.genArr(val);
      },
      immediate: true,
      deep: true
    }
  },
  computed: {},
  data() {
    return {
      extract: false,
      arr: this.genArr(this.list)
    };
  },
  methods: {
    play(item) {
      this.$set(item, "play", false);
      let audio = document.getElementById(item.id);
      audio.play();
      item.timer = setInterval(() => {
        this.$set(item, "curTime", ++item.curTime);
        if (item.curTime >= item.duration) {
          this.$set(item, "curTime", 0);
          this.pause(item);
        }
      }, 1000);
      this.arr.forEach(a => {
        if (a !== item) {
          this.pause(a);
        }
      });
    },
    pause(item) {
      if (!item.play) {
        this.$set(item, "play", true);
        let audio = document.getElementById(item.id);
        audio.pause();
        clearInterval(item.timer);
      }
    },
    genArr(res) {
      return res.map((t, index) => {
        let obj = {
          id: t,
          play: true,
          bar: [],
          curTime: 0,
          timer: null,
          duration: 0
        };
        let timer = setInterval(() => {
          var musicDom = document.getElementById(t); //获取audio对象
          if (musicDom) {
            musicDom.load();
            musicDom.onloadedmetadata = function() {
              let duration = parseInt(musicDom.duration);
              for (let i = 0; i < duration; i++) {
                obj.bar.push(i);
              }
              obj.duration = duration;
            };
            clearInterval(timer);
          }
        }, 500);
        return obj;
      });
    },
    del(id) {
      this.delV && this.delV(id);
    },
    close() {
      this.extract = true;
    },
    open() {
      this.extract = false;
    }
  },
  mounted() {},
  beforeDestroy() {
    clearInterval(this.timer);
  }
};
</script>
<style lang="scss" scoped>
.voice {
  padding: 0;
  width: 100%;
}
.del {
  margin-left: auto;
}
.open {
  font-size: 12px;
  line-height: 18px;
  height: 18px;
  margin: $fixed_mb 0;
  color: #006457;
}
.au {
  margin: $fixed_mb 0;
  .play {
    color: #bfbfbf;
    font-size: 16px;
    vertical-align: middle;
  }
  .pause {
    vertical-align: middle;
    font-size: 16px;
    color: $c-green;
  }
  .duration {
    font-family: "PingFang SC";
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
    color: #8c8c8c;
  }
  .log {
    margin: 0 $fixed_side;
    width: var(--ddw);
    justify-content: space-between;
    background: #fff;
    .bar {
      // height: 20px;
      height: 14px;
      width: 0.1px;
      border: 0.5px solid #bfbfbf;
      // margin-right: 1px;
    }
    .choose {
      border: 0.5px solid $c-green;
    }
  }
}
.mybox-leave-active,
.mybox-enter-active {
  transition: all 1s ease;
}
.mybox-leave-active,
.mybox-enter {
  height: 0px !important;
}
.mybox-leave,
.mybox-enter-active {
  height: auto;
}
</style>
