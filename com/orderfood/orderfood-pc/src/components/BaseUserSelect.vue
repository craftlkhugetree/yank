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
      :key="item.ID"
      :label="item.NAME"
      :value="JSON.stringify({id:item.ID,name:item.NAME})"
    >
      <span>{{item.NAME + '--' + item.ID}}</span>
    </el-option>
  </el-select>
</template>

<script>
import { fetchUserList } from "@/api/admin/roles.js";
export default {
  data() {
    return {
      userloading: false,
      userList: []
    };
  },
  props: {
    vmodel: String,
    roleId: {   
        type: String,   
        default: null    // 排除掉某个角色的用户
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
          page: 1,
          limit: 1000,
          filter: JSON.stringify({
            KEYWORD: query,
            NOTINROLEID: this.roleId
          })
        };
        fetchUserList(param)
          .then(res => {
            this.userloading = false;
            this.userList = res.items || [];
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
        this.$emit("doFunc",val);
    }
  }
};
</script>

<style>
</style>