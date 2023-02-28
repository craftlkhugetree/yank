<template>
  <div class="select-box">
    <div
      class="select-box-title"
      @click="selectCollapse = !selectCollapse;config = !config;"
    >
      <span v-show="!value" style="color:#8c8e95">{{title}}</span>
      <span v-show="value" class="ellipsis">{{value}}</span>
      <van-icon name="arrow-down" v-show="selectCollapse" />
      <van-icon name="arrow-up" v-show="!selectCollapse" />
    </div>
    <van-popup v-model="config" position="right" :style="{ height: '100%' }">
      <div class="user-select">
        <van-search v-model="query" placeholder="请输入学院名称" input-align="left" @input="search"></van-search>
        <div class="user-list">
          <van-cell v-for="item in list" :key="item.id" @click="selectItem(item)">{{item.name}}</van-cell>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectCollapse: true,
      loading: false,
      query: "",
      list: []
    };
  },
  props: {
    title: String,
    value: String,
    top: String,
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
    // 搜索列表
    search() {
      let query = this.query;
      if (query !== "") {
        this.loading = true;
        this.common
          .getOrgList(query)
          .then(res => {
            this.loading = false;
            this.list = res;
            if ("公共资源".includes(query)) {
              this.list.push({
                id: "-1",
                name: "公共资源"
              });
            }
            this.list.push({
              id: "",
              name: "全部学院"
            })
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
      this.selectCollapse = !this.selectCollapse;
      this.config = !this.config;
    }
  }
};
</script>

<style lang="scss" scoped>
</style>