<template>
  <div class="main">
    <div v-if="!noIcon">
      <img
        :src="require(`@/assets/img/${item.icon}`)"
        class="first"
        v-for="(item, index) in tabs"
        :key="item.label"
        @click="click(item, index)"
      />
    </div>
    <div>
      <span
        :class="isSel(index) ? 'isSel' : 'notSel'"
        v-for="(item, index) in tabs"
        :key="item.label"
        @click="click(item, index)"
        :style="noIcon ? { width: 'auto' } : ''"
      >
        {{ item.label }}{{ noIcon ? `(${total}本)` : '' }}
      </span>
    </div>
    <div>
      <div v-for="(item, index) in tabs" :key="item.label" @click="click(item, index)" class="last">
        <img src="@/assets/img/v.svg" v-if="isSel(index)" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IconList',
  props: {
    tabs: {
      type: Array,
      default: () => [],
    },
    noIcon: {
      type: Boolean,
      default: false,
    },
    total: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    isSel() {
      return function(index) {
        return this.num === index;
      };
    },
  },
  data() {
    return {
      num: 0,
    };
  },
  methods: {
    click(item, index) {
      if (this.noIcon) return;
      this.num = index;
      this.$emit('genTab', item);
    },
  },
};
</script>

<style lang="scss" scoped>
.main {
  // width: 100%;
  padding: 0 $m-left;
  // padding: 0 $m-left;
  background: #ffffff;
  box-shadow: 0px 8px 8px rgba(235, 235, 235, 0.1);
  > div {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    text-align: center;
    .first {
      z-index: 999;

      width: 100rem;
      display: block;
      margin: 0 auto;
    }
    .last {
      z-index: 999;

      width: 100%;
      display: block;
      margin: 30rem auto 20rem;
    }
    span {
      z-index: 999;

      width: $arq * 100rem;
      margin: 15rem auto 0;
      display: block;
      line-height: 22rem;
      height: 22rem;
    }
    .notSel {
      @include fz(16rem);
    }
    .isSel {
      @include fz(16rem, $color-purple, 700);
    }
  }
}
</style>
