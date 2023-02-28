
<template>
  <div class="search">
    <div class="types" :class="{ selected: all }" @click="selectAll">全部</div>
    <div
      class="types"
      :class="{ selected: item.selected }"
      v-for="(item, index) in types"
      :key="item.type"
      @click="selectType(index)"
    >{{ item.name }}</div>
    <el-input
      prefix-icon="el-icon-search"
      size="small"
      class="historySearch"
      clearable
      v-model="input"
      @keypress.native.enter="search"
      placeholder="请输入关键字搜索"
      @clear="search"
    ></el-input>
  </div>
</template>

<script>
export default {
  data() {
    return {
      types: [],
      input: "",
      all: true
    };
  },
  methods: {
    selectType(index) {
      let item = _.cloneDeep(this.types);
      _.forEach(item, type => {
        type.selected = false;
      });
      item[index].selected = true;
      this.all = false;
      this.types = item;
      // this.$set(this.types, index, item);
      this.search();
    },
    selectAll() {
      this.types = _.cloneDeep(this.$store.state.serviceTypes);
      _.forEach(this.types, (type, index) => {
        type.selected = false;
      });
      this.all = true;
      this.search();
    },
    getData() {
      let selecteds = [];
      _.forEach(this.types, type => {
        type.selected && selecteds.push(type.type);
      });
      let data = {
        types: selecteds.join(","),
        title: this.input || null
      };
      if (this.all) {
        data.types = null;
      }
      return data;
    },
    search() {
      this.$emit("search");
    }
  },
  created() {
    this.types = _.cloneDeep(this.$store.state.serviceTypes);
    _.forEach(this.types, (type, index) => {
      type.selected = false;
    });
  }
};
</script>
<style lang='scss' scoped>
.types {
  display: inline-block;
  margin-right: 10px;
  height: 32px;
  padding: 0 16px;
  text-align: center;
  font-size: 14px;
  color: #666666;
  line-height: 32px;
  background: #f6f6f6;
  border-radius: 3px;
  cursor: pointer;
}
.types.selected {
  background-color: rgba(231, 238, 254, 1);
  color: #3a78fc;
  background-image: url(../../../static/images/selected.png);
  background-repeat: no-repeat;
  background-position: right bottom;
}
.historySearch /deep/ input {
  background-color: #f6f6f6;
  border: none;
}
.historySearch {
  width: 200px;
  float: right;
}
</style>