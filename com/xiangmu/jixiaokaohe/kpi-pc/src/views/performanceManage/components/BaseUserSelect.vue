<template>
  <el-select
    v-model="config"
    filterable
    remote
    placeholder="请输入姓名或工号"
    :remote-method="remoteMethod"
    :loading="userloading"
    size="small"
    style="width:300px;"
    @change="changeSelect"
  >
    <el-option
      v-for="item in userList"
      :key="item.id"
      :label="item.name"
      :value="JSON.stringify(item)"
    >
      <span>{{item.name + '--' + item.id}}</span>
    </el-option>
  </el-select>
</template>

<script>
import { fetchAllUserList, fetchNoGroupUserList } from "@/api/admin/users.js";
export default {
  data() {
    return {
      userloading: false,
      userList: []
    };
  },
  props: {
    vmodel: String,
    noGroup: {
      type: Boolean,
      default: false // 是否只要没有考核分组的用户
    }
  },
  computed: {
    // 搭配父组件.sync实现子组件修改父组件的值
    config: {
      get() {
        return this.vmodel;
      },
      set(val) {
        this.$emit("update:vmodel", val);
      }
    }
  },
  methods: {
    // 搜索用户列表
    remoteMethod(query) {
      if (query) {
        this.userloading = true;
        let param = {
          keyword: query
        };
        let func = this.noGroup ? fetchNoGroupUserList : fetchAllUserList;
        func(param)
          .then(res => {
            this.userloading = false;
            this.userList = res.data || [];
          })
          .catch(err => {
            this.userloading = false;
            this.userList = [];
          });
      } else {
        this.userList = [];
      }
    },

    // 改变值
    changeSelect(val) {
      this.$emit("doFunc", val);
    }
  }
};
</script>

<style>
</style>