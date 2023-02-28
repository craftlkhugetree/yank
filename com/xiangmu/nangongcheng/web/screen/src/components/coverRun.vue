<template>
  <div class="main">
    <div class="left" v-show="canPre" @click="click('pre')">
      <img :src="require(`@/assets/img/${pic}left.svg`)" />
    </div>
    <div
      v-for="item in list"
      :key="item.id"
      :style="{ width: `${100 / unit - 3}%` }"
      class="middle"
    >
      <cover :img="item" height="132rem"></cover>
    </div>
    <div class="right" v-show="canNext" @click="click('next')">
      <img :src="require(`@/assets/img/${pic}right.svg`)" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'CoverRun',
  components: {
    cover: () => import('@/components/cover'),
  },
  props: {
    unit: {
      type: Number,
      default: 1,
    },
    fileList: {
      type: Array,
      default: () => [],
    },
    pic: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      list: [],
      page: 1,
    };
  },
  watch: {
    fileList(val) {
      if (val) {
        this.list = val.slice(0, this.unit);
      }
    },
  },
  computed: {
    canPre() {
      return this.page > 1;
    },
    canNext() {
      return this.fileList.length > this.page * this.unit;
    },
  },
  methods: {
    click(type) {
      let p = this.page;
      if (type === 'next') {
        this.page++;
        this.list = [...this.fileList.slice(p * this.unit, this.page * this.unit)];
      } else if (type === 'pre') {
        p = --this.page;
        this.list = [...this.fileList.slice((p - 1) * this.unit, p * this.unit)];
      }
    },
  },
  created() {
    this.list = this.fileList.slice(0, this.unit);
  },
};
</script>

<style lang="scss" scoped>
.main {
  width: 100%;
  height: 132rem;
  display: flex;
  align-items: center;
  //   justify-content: space-between;
  .middle {
    margin-left: 2%;
    // background-color: #000;
    // border: 1px #000 solid;
  }
  .left {
    width: 40rem;
    cursor: pointer;
    img {
      float: left;
    }
  }
  .right {
    width: 40rem;
    margin-left: auto;
    cursor: pointer;
    img {
      float: right;
    }
  }
}
</style>
