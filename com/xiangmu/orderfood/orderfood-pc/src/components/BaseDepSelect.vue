<template>
  <el-select
    v-model="config"
    filterable
    remote
    placeholder="请输入"
    :remote-method="remoteMethod"
    :loading="userloading"
    size="small"
    style="width:300px;"
    @change="changeSelect"
  >
    <el-option
      v-for="item in depList"
      :key="item.ID"
      :label="item.NAME"
      :value="JSON.stringify({id:item.ID,name:item.NAME})"
    >
      <!-- + '--' + item.ID -->
      <span>{{item.NAME }}</span>
    </el-option>
  </el-select>
</template>

<script>
import { fetchDepList } from "@/api/admin/settle.js";
export default {
  data() {
    return {
      userloading: false,
      depList: []
    };
  },
  props: {
    vmodel: String,
    roleId: {
      type: String,
      default: null // 排除掉某个角色的用户
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
    // 搜索用户列表  只查一级单位，加上这个条件
    remoteMethod(query) {
      if (query) {
        this.userloading = true;
        let param = {
          page: 1,
          limit: 1000,
          filter: JSON.stringify({
            PIDISNULL: true,
            NAME: query
          })
        };
        fetchDepList(param)
          .then(res => {
            this.userloading = false;
            this.depList = res.items || [];
          })
          .catch(err => {
            this.userloading = false;
            this.depList = [];
          });
      } else {
        this.depList = [];
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