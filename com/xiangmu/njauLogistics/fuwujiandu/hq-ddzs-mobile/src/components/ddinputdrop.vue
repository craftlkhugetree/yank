<template>
  <ul class="contendEditSelectList">
    <li
      v-for="item in list"
      :key="item.id"
      class="div_flex selectItem font-s"
      code="item"
      @click="itemClick(item)"
    >
      <span class="no-wrap name">#{{ item.name }}#</span>
      <span class="font-s tips">{{ item.count }}</span>
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
      this.$emit("itemClick", obj.name);
    }
  },
  watch: {
    nodeText(v, old) {
      console.log(v, old);
      let str = v.replace(/#/g, "");
      this.list = this.selectDataList.filter(s => s.name.indexOf(str) > -1);
    }
  }
};
</script>
<style lang="scss" scope>
.contendEditSelectList {
  width: 100%;
  max-height: 300px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 3px 6px 0px rgba(74, 81, 93, 0.25);
  border-radius: 2px;
  border: 1px solid rgba(217, 217, 217, 1);
  position: absolute;
  top: 126;
  z-index: 99;
  padding: 0;
  margin: 0;
  overflow-y: scroll;

  .selectItem {
    cursor: pointer;
    height: 20px;
    margin: $fixed_mb;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #006457;
    &:hover {
      color: #ff9900;
    }
    &.on {
      color: #ff9900;
    }
    .name {
      width: 80%;
    }
    .tips {
      text-align: left;
      color: #8c8c8c;
      margin-left: auto;
    }
  }
}
</style>
