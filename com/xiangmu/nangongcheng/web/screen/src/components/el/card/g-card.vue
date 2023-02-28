<template>
  <div ref="gcard" class="g-card" :class="isSecondPage ? 'bgcard' : ''">
    <!-- <div class="g-card" :class="isSecondPage ? 'bgcard' : ''" :style="pd ? {'padding-bottom': `calc(100vh - ${pd + 'rem'})`} : ''"> -->
    <slot />
    <!-- <teleport to="body">
      <img
        v-if="canPre"
        src="@/assets/img/ppre.svg"
        @click="handleCurrentChange('pre')"
        class="pre"
        style="    position: absolute;
    bottom: 0;
    left: 0;"
      />
      <img
        v-if="canNext"
        src="@/assets/img/pnext.svg"
        @click="handleCurrentChange('next')"
        class="next"
        style="    position: absolute;
    bottom: 0;
    right: 0;"
      />
    </teleport> -->
    <img
      v-if="canPre"
      src="@/assets/img/ppre.svg"
      @click="handleCurrentChange('pre')"
      class="pre"
    />
    <img
      v-if="canNext"
      src="@/assets/img/pnext.svg"
      @click="handleCurrentChange('next')"
      class="next"
    />
  </div>
</template>

<script>
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'GCard',
  components: {
    teleport: () => import('@/components/tp'),
  },
  props: {
    isSecondPage: {
      type: Boolean,
      default: false,
    },
    /**
     * 数据回调钩子,回调第一个参数是返回值,返回子组件
     */
    resHook: {
      type: Function,
      default: null,
    },
    /**
     * 接口参数
     */
    params: {
      type: Object,
      default: () => ({}),
    },
    /**
     * 高度
     */
    getList: {
      type: Function,
      required: true,
      default: () => Promise.resolve(),
    },
    limit: {
      type: Number,
      default: 3,
    },
    page: {
      type: Number,
      default: 1,
    },
  },

  data() {
    return {
      //=====================================表格参数====================================//
      tableData: [], //--------------------------------------------------------表格数据
      total: 0, //-------------------------------------------------------------数据总数
      pageNum: 1,
      el: {},
      load: false,
    };
  },
  computed: {
    canPre() {
      return this.pageNum > 1;
    },
    canNext() {
      return this.total > this.pageNum * this.limit;
    },
    // pd() {
    //   let el = this.el;
    //   let obj = (el && el[0] && el[0].getBoundingClientRect && el[0].getBoundingClientRect()) || {};
    //   console.log(obj.bottom);
    //   return obj.bottom || 0;
    // },
  },
  watch: {
    params: {
      handler() {
        this.getData(1);
      },
      deep: true,
    },
  },
  mounted() {
    this.init();
    // let timer = setInterval(() => {
    //   let el = document.getElementsByClassName('g-card')
    //   if(el && el[0]) {
    //     this.el = el;
    //     clearInterval(timer)
    //   }
    // }, 100)
  },
  methods: {
    //初始化
    init() {
      this.pageNum = this.page;
      this.getData();
    },
    //获取数据
    getData(page) {
      this.load = true;
      const params = Object.assign(this.params, {
        page: page || this.page,
        limit: this.limit,
      });
      // g-card不v-if的话，pageNum是延续的，搜索时应当置1
      if (page === 1 || !page) {
        this.pageNum = 1;
      }
      setTimeout(() => {
        this.load = false;
      }, 3000);
      this.getList(params).then(res => {
        if (res && res.code === '000000') {
          this.total = res.total || 0;
          if (this.resHook) {
            this.resHook(res, this);
          } else {
            const data = res.items || res.data;
            this.tableData = data;
          }
        }
        this.load = false;
      });
    },
    // 改变页码
    handleCurrentChange(type) {
      if (type === 'next') {
        this.pageNum++;
      } else if (type === 'pre') {
        this.pageNum--;
      }
      this.getData(this.pageNum);
      let classN = this.$refs.gcard.classList;
      if (classN && classN.value && classN.value.indexOf('in-out') === -1) {
        classN.add('in-out');
        setTimeout(() => {
          classN.remove('in-out');
        }, 1000);
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.bgcard {
  width: 100%;
  // background: url('~@/assets/img/2-card.svg') no-repeat center center;
  // background-size: cover;
  padding: 0 $m-left;
}
.in-out {
  -webkit-animation-name: in;
  -webkit-animation-duration: 2s;
  // -webkit-animation-iteration-count: 1;
  -webkit-animation-delay: 0s;
}
@-webkit-keyframes in {
  0% {
    opacity: 0.1;
    
  }
  50% {
    opacity: 0.5;
    -webkit-transform: translate3d(0, 0, -50%);
    transform: translate3d(0, 0, -50%);
  }
  100% {
    opacity: 1;
  }
}
</style>
