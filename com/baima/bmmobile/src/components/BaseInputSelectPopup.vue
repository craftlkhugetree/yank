<template>
  <van-popup v-model="config" position="right" :style="{ height: '100%' }">
    <div class="user-select">
      <van-search v-model="query" placeholder="请输入名称" input-align="left" @input="searchName"></van-search>
      <div class="user-list">
        <van-cell
          v-for="item in list"
          :key="item.id"
          @click="selectItem(item)"
          :value-class="{'add-item': item.add}"
        >{{item.xmmc}}-{{item.xmbh}}{{item.add}}</van-cell>
      </div>
    </div>
  </van-popup>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      query: "",
      list: []
    };
  },
  props: {
    showPicker: Boolean
  },
  computed: {
    // 搭配父组件.sync实现子组件修改父组件的值
    config: {
      get() {
        return this.showPicker;
      },
      set(val) {
        this.$emit("update:showPicker", val);
      }
    }
  },
  methods: {
    // 搜索名称
    searchName() {
      let query = this.query;
      if (query !== "") {
        this.loading = true;
        this.common
          .getProjectNameList(query)
          .then(res => {
            this.loading = false;
            let data = [
              {
                xmmc: query,
                id: "",
                xmbh: "",
                add: "(新增)"
              }
            ];
            this.list = data.concat(res);
          })
          .catch(err => {
            this.loading = false;
            this.list = [];
          });
      } else {
        this.list = [];
      }
    },
    // 选中
    selectItem(item) {
      this.$emit("selectItem", item);
    }
  }
};
</script>

<style lang="scss" scoped>
.add-item {
  color: #00b09b;
}
</style>