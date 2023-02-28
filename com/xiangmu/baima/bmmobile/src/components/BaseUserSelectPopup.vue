<template>
  <van-popup v-model="config" position="right" :style="{ height: '100%' }">
    <div class="user-select">
      <van-search v-model="queryUser" placeholder="请输入姓名或工号" input-align="left" @input="searchUser"></van-search>
      <div class="user-list">
        <van-cell
          v-for="item in userList"
          :key="item.id"
          @click="selectItem(item)"
        >{{item.name}}-{{item.id}}</van-cell>
      </div>
    </div>
  </van-popup>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      queryUser: "",
      userList: []
    };
  },
  props: {
    showPicker: Boolean
  },
  computed: {
    // 搭配父组件.sync实现子组件修改父组件的值
    config: {
      get() {
        return this.showPicker
      },
      set(val) {
        this.$emit('update:showPicker', val)
      }
    }
  },
  methods: {
    // 搜索用户列表
    searchUser() {
      let query = this.queryUser;
      if (query !== "") {
        this.loading = true;
        this.common
          .getUserList(query)
          .then(res => {
            this.loading = false;
            this.userList = res;
          })
          .catch(err => {
            this.loading = false;
            this.userList = [];
          });
      } else {
        this.userList = [];
      }
    },
    // 选中用户
    selectItem(item) {
        this.$emit("selectItem",item)
    }
  }
};
</script>

<style>
</style>