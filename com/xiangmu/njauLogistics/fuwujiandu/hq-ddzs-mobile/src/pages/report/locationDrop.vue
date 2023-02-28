<template>
  <ul class="contendEditSelectList" :style="{ '--ddTop': pos + 'px' }">
    <li
      v-for="item in list"
      :key="item.id"
      class="div_flex selectItem font-s"
      code="item"
      @click="itemClick(item)"
    >
      <span class="no-wrap name">{{ item.name }}</span>
    </li>
  </ul>
</template>
<script>
export default {
  props: {
    selectDataList: {
      type: Array,
      default: () => []
    },
    nodeText: {
      type: String
    },
    pos: {
      type: Number,
      default: 116
    }
  },
  data() {
    return {
      selectItemIndex: "",
      list: [...this.selectDataList]
    };
  },
  methods: {
    itemClick(obj) {
      this.$emit("itemClick", obj);
    }
  },
  watch: {
    nodeText(v, old) {
      let str = v.trim();
      this.list = this.selectDataList.filter(s => s.name.indexOf(str) > -1);
    }
  }
};
</script>
<style lang="scss" scope>
.contendEditSelectList {
  width: 80%;
  max-height: 400px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 3px 6px 0px rgba(74, 81, 93, 0.25);
  border-radius: 2px;
  border: 1px solid rgba(217, 217, 217, 1);
  position: absolute;
  top: var(--ddTop);
  left: 24px;
  z-index: 99;
  padding: 0;
  margin: 0;
  overflow-y: scroll;
  overflow-x: hidden;

  .selectItem {
    width: 100%;
    height: 20px;
    margin: $fixed_side;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    &:hover {
      color: #ff9900;
    }
    &.on {
      color: #ff9900;
    }
  }
}
</style>
