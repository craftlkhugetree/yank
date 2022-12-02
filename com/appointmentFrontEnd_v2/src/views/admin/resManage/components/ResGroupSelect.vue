<template>
  <div>
    <el-select
      v-model="resgroupid"
      size="small"
      placeholder="请选择"
      filterable
      clearable
      popper-class="noarrow"
      ref="resGroupSelect"
    >
      <el-option v-for="item in resGroupList" :key="item.id" :label="item.name" :value="item.id">
        <span style="float: left; color: rgba(0,0,0,0.65)">{{ item.name }}</span>
        <i v-if="resgroupid === item.id" style="float:right;margin-top:8px;" class="el-icon-check"></i>
      </el-option>
    </el-select>
    <i class="iconfont icon-add-circle" @click="$refs.resGroupDialog.dialogVisible = true"></i>
    <!---------------------------- 新增资源集弹窗 ---------------------------->
    <res-group-dialog class="fixed-dialog" ref="resGroupDialog" @doFunc="getResGroupList">
      <i class="el-icon-arrow-left" @click="goBackList"></i>
    </res-group-dialog>
  </div>
</template>

<script>
import { fetchResGroupList } from "@/api/admin/res";
import ResGroupDialog from "../resGroupDialog";
export default {
  components: {
    ResGroupDialog
  },
  props: {
    resGroupId: String
  },
  data() {
    return {
      resGroupList: []
    };
  },
  computed: {
    orgId() {
      return this.$store.state.userInfo.ORGID;
    },
    // 搭配父组件.sync实现子组件修改父组件的值
    resgroupid: {
      get() {
        return this.resGroupId;
      },
      set(val) {
        this.$emit("update:resGroupId", val);
      }
    }
  },
  watch: {
    orgId() {
      this.getResGroupList();
    }
  },
  methods: {
    // 获取资源集
    getResGroupList() {
      let data = {
        orgid: this.orgId
      };
      fetchResGroupList(data)
        .then(res => {
          this.resGroupList = res.data || [];
        })
        .catch(err => {});
    },

    // 返回下拉列表
    goBackList() {
      this.$refs.resGroupDialog.dialogVisible = false;
      this.$refs.resGroupSelect.focus();
    }
  },
  created() {
    if (this.orgId) {
      this.getResGroupList();
    }
  }
};
</script>

<style lang="scss" scoped>
.el-form {
  .el-select,
  .el-input {
    width: 300px;
  }
  .el-checkbox {
    display: block;
    height: 30px;
  }
  .el-form-item {
    margin-bottom: 14px;
  }
  i.iconfont {
    margin-left: 5px;
    color: #3f86f7;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
  }
  i.iconfont.icon-add-circle {
    position: relative;
    width: 40px;
    height: 26px;
    line-height: 26px;
    margin-left: -45px;
    vertical-align: middle;
    display: inline-block;
    text-align: center;
    background: #ffffff;
  }
}

.fixed-dialog {
  position: absolute;
  width: 400px;
  height: 400px;
  left: -50px;
  top: 42px;
  .el-icon-arrow-left {
    position: absolute;
    top: 15px;
    left: 15px;
    cursor: pointer;
  }
}
</style>